import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "farm-db.json");

loadEnv(path.join(__dirname, ".env"));

const config = {
  port: Number(process.env.PORT || 3000),
  appBaseUrl: process.env.APP_BASE_URL || "http://127.0.0.1:3000",
  sessionSecret: process.env.SESSION_SECRET || "local-dev-session-secret",
  feishuAppId: process.env.FEISHU_APP_ID || "",
  feishuAppSecret: process.env.FEISHU_APP_SECRET || "",
  feishuRedirectUri:
    process.env.FEISHU_REDIRECT_URI ||
    `${process.env.APP_BASE_URL || "http://127.0.0.1:3000"}/api/auth/feishu/callback`,
  feishuScopes:
    process.env.FEISHU_SCOPES ||
    "offline_access auth:user.id:read calendar:calendar:readonly task:task:read task:tasklist:read task:comment:read docx:document:readonly docs:document.comment:read wiki:wiki:readonly drive:drive:readonly bitable:app bitable:app:readonly base:table:read base:field:read base:field:create base:record:read base:record:retrieve base:record:create base:record:update contact:contact.base:readonly contact:user.base:readonly contact:user.department:readonly contact:department.base:readonly im:chat:read im:chat.members:read im:message:readonly approval:approval.list:readonly approval:approval:readonly okr:okr:readonly okr:okr.content:readonly okr:okr.progress:readonly",
  feishuAuthBase: process.env.FEISHU_AUTH_BASE || "https://accounts.feishu.cn",
  feishuApiBase: process.env.FEISHU_API_BASE || "https://open.feishu.cn",
  feishuWebBase: process.env.FEISHU_WEB_BASE || "https://bytedance.larkoffice.com",
  todoFactoryUrl: process.env.FEISHU_TODO_FACTORY_URL || ""
};

const sessions = new Map();
let cachedDb;
const ailyWebUrl = "https://aily.feishu.cn/";
const ailyFeishuUrl = `feishu://applink.feishu.cn/client/web_url/open?url=${encodeURIComponent(
  ailyWebUrl
)}&mode=window`;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, config.appBaseUrl);

    if (url.pathname.startsWith("/api/")) {
      await routeApi(req, res, url);
      return;
    }

    await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, {
      error: "internal_error",
      message: error.message || "Unexpected server error"
    });
  }
}).listen(config.port, "127.0.0.1", () => {
  console.log(`Feishu Team Farm running at http://127.0.0.1:${config.port}/`);
});

async function routeApi(req, res, url) {
  const session = getSession(req, res);

  if (req.method === "GET" && url.pathname === "/api/config") {
    sendJson(res, 200, {
      feishuConfigured: Boolean(config.feishuAppId && config.feishuAppSecret),
      appIdPreview: config.feishuAppId ? `${config.feishuAppId.slice(0, 8)}...` : "",
      redirectUri: config.feishuRedirectUri,
      scopes: config.feishuScopes.split(/\s+/).filter(Boolean)
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/auth/feishu/start") {
    if (!config.feishuAppId || !config.feishuAppSecret) {
      sendJson(res, 400, {
        error: "feishu_not_configured",
        message: "Missing FEISHU_APP_ID or FEISHU_APP_SECRET in .env"
      });
      return;
    }

    const state = crypto.randomBytes(18).toString("base64url");
    session.oauthState = state;

    const authUrl = new URL("/open-apis/authen/v1/authorize", config.feishuAuthBase);
    authUrl.searchParams.set("client_id", config.feishuAppId);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", config.feishuRedirectUri);
    authUrl.searchParams.set("scope", config.feishuScopes);
    authUrl.searchParams.set("state", state);

    redirect(res, authUrl.toString());
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/aily/open") {
    const body = await readJsonBody(req);
    const target = body.target === "client" ? "client" : "web";
    const targetUrl = target === "client" ? ailyFeishuUrl : ailyWebUrl;
    const opened = await openSystemUrl(targetUrl);

    if (!opened.ok) {
      sendJson(res, 500, {
        ok: false,
        error: "open_failed",
        message: opened.message || "没有成功唤起系统打开 Aily。"
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      target,
      message: target === "client" ? "已尝试唤起飞书客户端中的 Aily。" : "已尝试打开 Aily 网页。"
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/auth/feishu/callback") {
    if (url.searchParams.get("error")) {
      redirect(res, `/?auth=denied`);
      return;
    }

    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!state || state !== session.oauthState || !code) {
      redirect(res, `/?auth=invalid_state`);
      return;
    }

    delete session.oauthState;
    const auth = await completeFeishuLogin(code);
    const db = await readDb();
    const user = upsertUser(db, auth.userInfo, auth.tokens);
    await writeDb(db);

    session.userId = user.id;
    setAuthCookie(res, user.id);
    redirect(res, "/");
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/me") {
    const db = await readDb();
    const user = session.userId ? db.users[session.userId] : null;
    if (!user) {
      sendJson(res, 200, { authenticated: false });
      return;
    }

    sendJson(res, 200, {
      authenticated: true,
      user: publicUser(user),
      activeTeam: user.activeTeamId ? publicTeam(db.teams[user.activeTeamId]) : null
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/logout") {
    session.userId = null;
    clearCookie(res, "farm_auth");
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/farm/state") {
    const { db, user } = await requireUser(res, session);
    if (!user) return;

    const sweep = runDailySweepIfNeeded(db, user);
    const team = user.activeTeamId ? db.teams[user.activeTeamId] : null;
    const layoutChanged = team ? ensureFarmLayoutVersion(db, team) : false;
    if (sweep.checked || layoutChanged) await writeDb(db);
    sendJson(res, 200, buildFarmState(db, user));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/teams") {
    const { db, user } = await requireUser(res, session);
    if (!user) return;

    const body = await readJsonBody(req);
    const action = String(body.action || "");

    if (action === "create") {
      const name = cleanName(body.name, "新的团队农场");
      const team = createTeam(db, user, name);
      await writeDb(db);
      sendJson(res, 200, { team: publicTeam(team), farm: buildFarmState(db, user) });
      return;
    }

    if (action === "join") {
      const code = String(body.code || "").trim().toUpperCase();
      const team = Object.values(db.teams).find((item) => item.code === code);
      if (!team) {
        sendJson(res, 404, { error: "team_not_found", message: "Team code not found" });
        return;
      }

      addMember(db, team, user.id);
      user.activeTeamId = team.id;
      await writeDb(db);
      sendJson(res, 200, { team: publicTeam(team), farm: buildFarmState(db, user) });
      return;
    }

    sendJson(res, 400, { error: "unknown_team_action" });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/farm/interaction") {
    const { db, user } = await requireUser(res, session);
    if (!user) return;

    const body = await readJsonBody(req);
    const type = String(body.type || "water");
    const result = applyFarmInteraction(db, user, type);
    await writeDb(db);
    sendJson(res, 200, result);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/farm/objects") {
    const { db, user } = await requireUser(res, session);
    if (!user) return;

    const body = await readJsonBody(req);
    const result = await applyFarmObjectAction(db, user, body);
    await writeDb(db);
    sendJson(res, 200, result);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/calendar/sync") {
    const { db, user } = await requireUser(res, session);
    if (!user) return;

    const result = await syncCalendarForUser(db, user);
    await writeDb(db);
    sendJson(res, 200, result);
    return;
  }

  sendJson(res, 404, { error: "not_found" });
}

async function serveStatic(req, res, url) {
  let filePath = path.normalize(path.join(publicDir, url.pathname));
  if (!filePath.startsWith(publicDir)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  if (url.pathname === "/") {
    filePath = path.join(publicDir, "index.html");
  }

  if (!existsSync(filePath)) {
    filePath = path.join(publicDir, "index.html");
  }

  const ext = path.extname(filePath);
  const content = await readFile(filePath);
  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  res.end(content);
}

async function requireUser(res, session) {
  const db = await readDb();
  const user = session.userId ? db.users[session.userId] : null;
  if (!user) {
    sendJson(res, 401, { error: "not_authenticated" });
    return { db, user: null };
  }
  return { db, user };
}

async function completeFeishuLogin(code) {
  const appAccessToken = await getAppAccessToken();
  const tokenResponse = await feishuRequest("/open-apis/authen/v1/oidc/access_token", {
    method: "POST",
    token: appAccessToken,
    body: {
      grant_type: "authorization_code",
      code
    }
  });

  const tokens = tokenResponse.data;
  const userInfoResponse = await getFeishuUserInfo(tokens.access_token);

  return {
    tokens: normalizeTokens(tokens),
    userInfo: userInfoResponse
  };
}

async function getFeishuUserInfo(accessToken) {
  try {
    const response = await feishuRequest("/open-apis/authen/v1/user_info", {
      method: "GET",
      token: accessToken
    });
    return response.data;
  } catch (error) {
    const fallback = await fetch("https://passport.feishu.cn/suite/passport/oauth/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const payload = await fallback.json();
    if (!fallback.ok) {
      throw error;
    }
    return payload.data || payload;
  }
}

async function getAppAccessToken() {
  const response = await fetch(`${config.feishuApiBase}/open-apis/auth/v3/app_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      app_id: config.feishuAppId,
      app_secret: config.feishuAppSecret
    })
  });

  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.msg || "Failed to get app_access_token");
  }

  return payload.app_access_token;
}

async function refreshUserToken(user) {
  if (!user.tokens?.refreshToken) return null;

  const appAccessToken = await getAppAccessToken();
  const response = await feishuRequest("/open-apis/authen/v1/oidc/refresh_access_token", {
    method: "POST",
    token: appAccessToken,
    body: {
      grant_type: "refresh_token",
      refresh_token: user.tokens.refreshToken
    }
  });

  user.tokens = normalizeTokens(response.data);
  return user.tokens.accessToken;
}

async function syncCalendarForUser(db, user) {
  let accessToken = user.tokens?.accessToken;
  if (!accessToken) {
    return authExpiredResult();
  }

  if (Number(user.tokens?.expiresAt || 0) <= Date.now() + 60_000) {
    try {
      accessToken = await refreshUserToken(user);
      if (!accessToken) return authExpiredResult();
    } catch (refreshError) {
      if (isTokenError(refreshError)) return authExpiredResult();
      throw refreshError;
    }
  }

  const range = todayRange();
  let eventsResponse;
  try {
    eventsResponse = await fetchCalendarEvents(accessToken, range);
  } catch (error) {
    if (isTokenError(error)) {
      try {
        accessToken = await refreshUserToken(user);
        if (!accessToken) return authExpiredResult();
        eventsResponse = await fetchCalendarEvents(accessToken, range);
      } catch (refreshError) {
        if (isTokenError(refreshError)) return authExpiredResult();
        throw refreshError;
      }
    } else {
      throw error;
    }
  }

  const events = eventsResponse.data?.items || [];
  const signal = summarizeCalendar(events, range);
  const date = range.date;
  const syncedSignal = {
    ...signal,
    syncedAt: new Date().toISOString()
  };
  db.calendarSignals[date] ||= {};
  db.calendarSignals[date][user.id] = syncedSignal;

  if (user.activeTeamId && db.teams[user.activeTeamId]) {
    applyCalendarSignalToTeam(db.teams[user.activeTeamId], syncedSignal);
  }

  return {
    ok: true,
    date,
    signal: syncedSignal,
    farm: buildFarmState(db, user)
  };
}

function authExpiredResult() {
  return {
    ok: false,
    error: "auth_expired",
    reauth: true,
    message: "飞书登录已过期，请重新登录后再同步。"
  };
}

async function getFreshUserAccessToken(user) {
  let accessToken = user.tokens?.accessToken;
  if (!accessToken) return null;

  if (Number(user.tokens?.expiresAt || 0) <= Date.now() + 60_000) {
    accessToken = await refreshUserToken(user);
  }

  return accessToken;
}

async function syncTodoFactoryQuiet(db, user, team) {
  if (!sanitizeFeishuUrl(team.todoFactory?.url || config.todoFactoryUrl)) return null;

  try {
    return await syncTodoFactoryToBitable(db, user, team);
  } catch (error) {
    const now = new Date().toISOString();
    team.todoFactory = {
      ...(team.todoFactory || {}),
      updatedAt: now,
      lastSyncedAt: now,
      lastSyncResult: {
        ok: false,
        message: bitableErrorMessage(error),
        syncedAt: now
      }
    };
    return team.todoFactory.lastSyncResult;
  }
}

async function syncTodoFactoryToBitable(db, user, team) {
  const bound = team.todoFactory || {};
  const configuredUrl = sanitizeFeishuUrl(bound.url || config.todoFactoryUrl);
  if (!configuredUrl) {
    return {
      ok: false,
      error: "todo_factory_unbound",
      message: "请先绑定一个真实的飞书多维表格链接。"
    };
  }

  let accessToken;
  try {
    accessToken = await getFreshUserAccessToken(user);
  } catch (error) {
    if (isTokenError(error)) return authExpiredResult();
    throw error;
  }
  if (!accessToken) return authExpiredResult();

  const parsed = parseBitableUrl(configuredUrl);
  if (!parsed.appToken && parsed.wikiNodeToken) {
    try {
      const node = await getWikiNode(accessToken, parsed.wikiNodeToken);
      if (isBitableObjType(node.obj_type) && node.obj_token) {
        parsed.appToken = node.obj_token;
        parsed.title = node.title || parsed.title || "";
      } else {
        return {
          ok: false,
          error: "wiki_node_not_bitable",
          message: `这个知识库链接挂载的不是多维表格，而是 ${node.obj_type || "未知类型"}。请绑定具体多维表格，或换成多维表格 Wiki 节点。`
        };
      }
    } catch (error) {
      if (isTokenError(error)) return authExpiredResult();
      return {
        ok: false,
        error: "wiki_node_resolve_failed",
        message: bitableErrorMessage(error)
      };
    }
  }

  if (!parsed.appToken) {
    return {
      ok: false,
      error: "invalid_bitable_url",
      message: "没有从链接中识别到多维表格 app_token。现在支持 /base/... 链接，也支持挂载了多维表格的 /wiki/... 链接。"
    };
  }

  try {
    const appToken = parsed.appToken;
    let tableId = parsed.tableId || bound.tableId || "";
    if (!tableId) {
      const tables = await listBitableTables(accessToken, appToken);
      tableId = tables[0]?.table_id || tables[0]?.id || "";
    }
    if (!tableId) {
      return {
        ok: false,
        error: "missing_table_id",
        message: "没有找到可写入的数据表。请打开具体表格页后复制链接，或在多维表格里先创建一张表。"
      };
    }

    let fields = await listBitableFields(accessToken, appToken, tableId);
    const primaryField =
      fields.find((field) => field.is_primary || field.property?.is_primary) || fields[0] || null;
    const primaryFieldName = primaryField?.field_name || "标题";
    const fieldNames = new Set(fields.map((field) => field.field_name).filter(Boolean));
    let createdFields = 0;

    for (const field of todoFactoryBitableFields(primaryFieldName)) {
      if (fieldNames.has(field.field_name)) continue;
      const created = await createBitableField(accessToken, appToken, tableId, field);
      createdFields += 1;
      fieldNames.add(created.field_name || field.field_name);
    }

    if (createdFields > 0) {
      fields = await listBitableFields(accessToken, appToken, tableId);
    }

    const rows = buildTodoFactorySyncRows(db, team);
    const records = await listBitableRecords(accessToken, appToken, tableId);
    const existingBySyncId = new Map();
    records.forEach((record) => {
      const syncId = extractBitableCellText(record.fields?.["唯一标识"]);
      if (syncId) existingBySyncId.set(syncId, record);
    });

    let createdRecords = 0;
    let updatedRecords = 0;
    for (const row of rows) {
      const recordFields = todoFactoryRecordFields(row, primaryFieldName);
      const existing = existingBySyncId.get(row.uniqueId);
      if (existing?.record_id || existing?.id) {
        await updateBitableRecord(accessToken, appToken, tableId, existing.record_id || existing.id, recordFields);
        updatedRecords += 1;
      } else {
        await createBitableRecord(accessToken, appToken, tableId, recordFields);
        createdRecords += 1;
      }
    }

    const now = new Date().toISOString();
    const result = {
      ok: true,
      appToken,
      tableId,
      rowCount: rows.length,
      createdFields,
      createdRecords,
      updatedRecords,
      syncedAt: now,
      message: `已同步 ${rows.length} 条记录，新增 ${createdRecords} 条，更新 ${updatedRecords} 条。`
    };
    team.todoFactory = {
      ...bound,
      title: bound.title || "团队农场待办底库",
      url: configuredUrl,
      fields: todoFactoryFields(),
      appToken,
      tableId,
      primaryFieldName,
      lastSyncedAt: now,
      lastSyncResult: result,
      updatedAt: now
    };
    team.updatedAt = now;
    return result;
  } catch (error) {
    if (isTokenError(error)) return authExpiredResult();
    if (isReauthorizationRequiredError(error)) {
      return {
        ok: false,
        error: "reauthorization_required",
        reauth: true,
        message: "本地权限范围已更新，需要重新登录飞书并授权多维表格写入权限后再同步底库。"
      };
    }
    const now = new Date().toISOString();
    const result = {
      ok: false,
      error: "bitable_sync_failed",
      code: error.payload?.code,
      message: bitableErrorMessage(error),
      syncedAt: now
    };
    team.todoFactory = {
      ...bound,
      url: configuredUrl,
      fields: todoFactoryFields(),
      lastSyncedAt: now,
      lastSyncResult: result,
      updatedAt: now
    };
    return result;
  }
}

function parseBitableUrl(resourceUrl) {
  try {
    const url = new URL(resourceUrl);
    const parts = url.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => decodeURIComponent(part));
    const baseIndex = parts.findIndex((part) => ["base", "bitable"].includes(part));
    const wikiIndex = parts.findIndex((part) => part === "wiki");
    const appToken =
      baseIndex >= 0
        ? parts[baseIndex + 1] || ""
        : parts.find((part) => /^(bas|bascn|bsc|app)[A-Za-z0-9_-]+$/.test(part)) || "";
    const tableId =
      url.searchParams.get("table") ||
      url.searchParams.get("table_id") ||
      url.searchParams.get("tableId") ||
      parts.find((part) => /^tbl[A-Za-z0-9_-]+$/.test(part)) ||
      "";

    return {
      appToken: cleanRecordText(appToken, "", 120),
      tableId: cleanRecordText(tableId, "", 80),
      wikiNodeToken: wikiIndex >= 0 ? cleanRecordText(parts[wikiIndex + 1], "", 120) : ""
    };
  } catch {
    return { appToken: "", tableId: "", wikiNodeToken: "" };
  }
}

async function getWikiNode(accessToken, nodeToken) {
  const query = new URLSearchParams({ token: nodeToken });
  const response = await feishuRequest(`/open-apis/wiki/v2/spaces/get_node?${query}`, {
    method: "GET",
    token: accessToken
  });
  return response.data?.node || {};
}

function isBitableObjType(value) {
  const text = String(value || "").toLowerCase();
  return text === "bitable" || text === "3";
}

async function listBitableTables(accessToken, appToken) {
  const items = [];
  let pageToken = "";
  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (pageToken) query.set("page_token", pageToken);
    const response = await feishuRequest(
      `/open-apis/bitable/v1/apps/${encodeURIComponent(appToken)}/tables?${query}`,
      {
        method: "GET",
        token: accessToken
      }
    );
    items.push(...(response.data?.items || []));
    pageToken = response.data?.has_more ? response.data?.page_token || "" : "";
  } while (pageToken);
  return items;
}

async function listBitableFields(accessToken, appToken, tableId) {
  const items = [];
  let pageToken = "";
  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (pageToken) query.set("page_token", pageToken);
    const response = await feishuRequest(
      `/open-apis/bitable/v1/apps/${encodeURIComponent(appToken)}/tables/${encodeURIComponent(
        tableId
      )}/fields?${query}`,
      {
        method: "GET",
        token: accessToken
      }
    );
    items.push(...(response.data?.items || []));
    pageToken = response.data?.has_more ? response.data?.page_token || "" : "";
  } while (pageToken);
  return items;
}

async function createBitableField(accessToken, appToken, tableId, field) {
  const response = await feishuRequest(
    `/open-apis/bitable/v1/apps/${encodeURIComponent(appToken)}/tables/${encodeURIComponent(tableId)}/fields`,
    {
      method: "POST",
      token: accessToken,
      body: field
    }
  );
  return response.data?.field || response.data || field;
}

async function listBitableRecords(accessToken, appToken, tableId) {
  const items = [];
  let pageToken = "";
  do {
    const query = new URLSearchParams({ page_size: "500" });
    if (pageToken) query.set("page_token", pageToken);
    const response = await feishuRequest(
      `/open-apis/bitable/v1/apps/${encodeURIComponent(appToken)}/tables/${encodeURIComponent(
        tableId
      )}/records?${query}`,
      {
        method: "GET",
        token: accessToken
      }
    );
    items.push(...(response.data?.items || []));
    pageToken = response.data?.has_more ? response.data?.page_token || "" : "";
  } while (pageToken);
  return items;
}

async function createBitableRecord(accessToken, appToken, tableId, fields) {
  const response = await feishuRequest(
    `/open-apis/bitable/v1/apps/${encodeURIComponent(appToken)}/tables/${encodeURIComponent(tableId)}/records`,
    {
      method: "POST",
      token: accessToken,
      body: { fields }
    }
  );
  return response.data?.record || response.data;
}

async function updateBitableRecord(accessToken, appToken, tableId, recordId, fields) {
  const response = await feishuRequest(
    `/open-apis/bitable/v1/apps/${encodeURIComponent(appToken)}/tables/${encodeURIComponent(
      tableId
    )}/records/${encodeURIComponent(recordId)}`,
    {
      method: "PUT",
      token: accessToken,
      body: { fields }
    }
  );
  return response.data?.record || response.data;
}

function todoFactoryBitableFields(primaryFieldName) {
  const fields = [
    { field_name: "标题", type: 1 },
    { field_name: "唯一标识", type: 1 },
    { field_name: "飞书模块", type: 1 },
    { field_name: "状态", type: 1 },
    { field_name: "优先级", type: 1 },
    { field_name: "记录日期", type: 1 },
    { field_name: "截止日期", type: 1 },
    { field_name: "资源链接", type: 1 },
    { field_name: "来源", type: 1 },
    { field_name: "农场区域", type: 1 },
    { field_name: "最后同步", type: 1 },
    { field_name: "备注", type: 1 }
  ];

  return fields.filter((field) => field.field_name !== primaryFieldName);
}

function buildTodoFactorySyncRows(db, team) {
  const updatedAt = team.updatedAt || new Date().toISOString();
  const today = todayRange().date;
  const systemRows = [
    {
      uniqueId: "system:plan",
      title: "计划田",
      module: "日历 / 任务 / OKR / 审批",
      status: "系统区域",
      priority: "系统",
      recordDate: today,
      dueDate: "",
      url: "",
      sourceType: "farmZone",
      type: "plan",
      updatedAt,
      meta: "承载今日计划、会议节奏与未完成事项"
    },
    {
      uniqueId: "system:creation",
      title: "创作工坊",
      module: "云文档 / 知识库 / 评论",
      status: "系统区域",
      priority: "系统",
      recordDate: today,
      dueDate: "",
      url: "",
      sourceType: "farmZone",
      type: "creation",
      updatedAt,
      meta: "沉淀文档、纪要、知识和评论回复"
    },
    {
      uniqueId: "system:structure",
      title: "结构设施",
      module: "多维表格 / 流程 / 记录",
      status: "系统区域",
      priority: "系统",
      recordDate: today,
      dueDate: "",
      url: team.todoFactory?.url || config.todoFactoryUrl || "",
      sourceType: "farmZone",
      type: "structure",
      updatedAt,
      meta: "维护字段、看板、流程与待办底库"
    },
    {
      uniqueId: "system:plaza",
      title: "团队广场",
      module: "群聊 / 会议 / Aily / 成果",
      status: "系统区域",
      priority: "系统",
      recordDate: today,
      dueDate: "",
      url: "",
      sourceType: "farmZone",
      type: "plaza",
      updatedAt,
      meta: "承载团队互动、智能伙伴和成果展示"
    }
  ];

  const calendarRows = (team.lastCalendarSignal?.events || []).slice(0, 20).map((event, index) => ({
    uniqueId: `calendar:${event.start || index}:${event.end || ""}:${index}`,
    title: event.title || "未命名日程",
    module: "日程",
    status: "今日",
    priority: "来自日历",
    recordDate: today,
    dueDate: todayRange().date,
    url: event.url || "",
    sourceType: "calendar",
    type: "plan",
    updatedAt: team.lastCalendarSignal?.syncedAt || updatedAt,
    meta: [event.timeText, event.location].filter(Boolean).join(" · ")
  }));

  const objectRows = (db.farmObjects || [])
    .filter((object) => object.teamId === team.id)
    .map((object) => ({
      uniqueId: `farm:${object.id}`,
      title: object.title || object.label || "农场对象",
      module: object.module || "飞书",
      status: "农场中",
      priority: "普通",
      recordDate: localDateFromValue(object.updatedAt || object.boundAt || object.createdAt, today),
      dueDate: today,
      url: object.resource?.url || "",
      sourceType: object.sourceType || "farmObject",
      type: object.type || inferTypeFromItemId(object.itemId),
      updatedAt: object.updatedAt || object.boundAt || object.createdAt || updatedAt,
      meta: object.meta || object.label || ""
    }));

  const backlogRows = (db.backlogRecords || [])
    .filter((record) => record.teamId === team.id)
    .map((record) => ({
      uniqueId: `record:${record.id}`,
      title: record.title || record.label || "待办记录",
      module: record.module || "飞书",
      status: statusTextForBitable(record.status),
      priority: record.priority || "普通",
      recordDate: localDateFromValue(record.updatedAt || record.createdAt, record.dueDate || today),
      dueDate: record.dueDate || "",
      url: record.url || "",
      sourceType: record.sourceType || "manual",
      type: record.type || inferTypeFromItemId(record.itemId),
      updatedAt: record.updatedAt || record.createdAt || updatedAt,
      meta: record.meta || record.label || ""
    }));

  return [...systemRows, ...calendarRows, ...objectRows, ...backlogRows];
}

function todoFactoryRecordFields(row, primaryFieldName) {
  const title = cleanRecordText(row.title, "未命名记录", 100);
  const fields = {
    [primaryFieldName]: title,
    唯一标识: cleanRecordText(row.uniqueId, "", 160),
    飞书模块: cleanRecordText(row.module, "飞书", 80),
    状态: cleanRecordText(row.status, "记录", 40),
    优先级: cleanRecordText(row.priority, "普通", 40),
    记录日期: cleanRecordText(row.recordDate, "", 40),
    截止日期: cleanRecordText(row.dueDate, "", 40),
    资源链接: cleanRecordText(row.url, "", 500),
    来源: cleanRecordText(row.sourceType, "", 80),
    农场区域: cleanRecordText(zoneLabel(row.type), "农场", 40),
    最后同步: cleanRecordText(row.updatedAt, "", 80),
    备注: cleanRecordText(row.meta, "", 500)
  };

  if (primaryFieldName !== "标题") fields["标题"] = title;
  return fields;
}

function statusTextForBitable(status) {
  return (
    {
      active: "农场中",
      backlog: "待办厂",
      done: "已晾晒"
    }[status] ||
    status ||
    "记录"
  );
}

function zoneLabel(type) {
  return (
    {
      plan: "计划田",
      creation: "创作工坊",
      structure: "结构设施",
      plaza: "团队广场",
      module: "农场"
    }[type] ||
    type ||
    "农场"
  );
}

function localDateFromValue(value, fallback = todayRange().date) {
  const date = new Date(value || "");
  if (!Number.isFinite(date.getTime())) return fallback;
  return localDateString(date);
}

function extractBitableCellText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(extractBitableCellText).join("");
  if (typeof value === "object") {
    return (
      value.text ||
      value.link ||
      value.url ||
      value.name ||
      value.value ||
      value.title ||
      Object.values(value).map(extractBitableCellText).join("")
    );
  }
  return String(value);
}

function bitableErrorMessage(error) {
  const code = error.payload?.code;
  const rawMessage = error.payload?.msg || error.payload?.message || error.message || "未知错误";
  const message = String(rawMessage);
  const lower = message.toLowerCase();
  if (
    code === 99991672 ||
    code === 1254035 ||
    code === 1254301 ||
    lower.includes("permission") ||
    message.includes("权限")
  ) {
    return `同步失败：需要 bitable:app 写权限，并且当前登录用户要能编辑这个多维表格。飞书返回：${message}`;
  }
  if (code === 1254003 || code === 1254040) {
    return "同步失败：多维表格 app_token 不正确，请重新复制 /base/ 链接后绑定。";
  }
  if (code === 1254004 || code === 1254041) {
    return "同步失败：数据表 table_id 不正确，请打开具体数据表页后重新复制链接。";
  }
  if (code === 1254291) {
    return "同步失败：飞书提示同一张表正在写入，请稍等几秒再点同步底库。";
  }
  return `同步失败：${message}`;
}

function isReauthorizationRequiredError(error) {
  const code = error.payload?.code;
  const message = String(error.payload?.msg || error.payload?.message || error.message || "").toLowerCase();
  return (
    code === 99991679 ||
    message.includes("request user re-authorization") ||
    message.includes("应用未获取所需的用户授权")
  );
}

function openSystemUrl(targetUrl) {
  return new Promise((resolve) => {
    let command = "open";
    let args = [targetUrl];

    if (process.platform === "win32") {
      command = "cmd";
      args = ["/c", "start", "", targetUrl];
    } else if (process.platform !== "darwin") {
      command = "xdg-open";
    }

    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore"
    });

    child.once("error", (error) => {
      resolve({ ok: false, message: error.message });
    });
    child.once("spawn", () => {
      child.unref();
      resolve({ ok: true });
    });
  });
}

async function fetchCalendarEvents(accessToken, range) {
  const instanceQuery = new URLSearchParams({
    start_time: String(range.start),
    end_time: String(range.end)
  });

  try {
    const response = await feishuRequest(
      `/open-apis/calendar/v4/calendars/primary/events/instance_view?${instanceQuery}`,
      {
        method: "GET",
        token: accessToken
      }
    );
    return { data: { items: response.data?.items || [] } };
  } catch (error) {
    if (isTokenError(error)) throw error;
  }

  const items = [];
  let pageToken = "";

  do {
    const query = new URLSearchParams({
      start_time: String(range.start),
      end_time: String(range.end),
      page_size: "50"
    });

    if (pageToken) query.set("page_token", pageToken);

    const response = await feishuRequest(`/open-apis/calendar/v4/calendars/primary/events?${query}`, {
      method: "GET",
      token: accessToken
    });

    items.push(...(response.data?.items || []));
    pageToken = response.data?.has_more ? response.data?.page_token || "" : "";
  } while (pageToken);

  return { data: { items } };
}

async function feishuRequest(pathname, options) {
  const response = await fetch(`${config.feishuApiBase}${pathname}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${options.token}`,
      "Content-Type": "application/json; charset=utf-8"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    const error = new Error(payload.msg || payload.message || "Feishu API request failed");
    error.payload = payload;
    throw error;
  }
  return payload;
}

function isTokenError(error) {
  const code = error.payload?.code;
  const message = String(error.payload?.msg || error.payload?.message || error.message || "").toLowerCase();
  return (
    code === 99991663 ||
    code === 99991664 ||
    code === 20013 ||
    code === 20014 ||
    message.includes("token expired") ||
    message.includes("authentication token expired")
  );
}

function summarizeCalendar(events, range) {
  const normalized = events
    .map((event) => normalizeCalendarEvent(event, range))
    .filter(Boolean)
    .filter((event) => event.start < range.end && event.end > range.start);

  const clamped = normalized
    .filter((event) => !event.allDay)
    .filter((event) => Number.isFinite(event.start) && Number.isFinite(event.end))
    .map((event) => ({
      ...event,
      start: Math.max(event.start, range.workStart),
      end: Math.min(event.end, range.workEnd)
    }))
    .filter((event) => event.end > event.start)
    .sort((a, b) => a.start - b.start);

  const busyMinutes = Math.round(
    clamped.reduce((total, event) => total + Math.max(0, event.end - event.start) / 60, 0)
  );

  const focusBlocks = countFocusBlocks(clamped, range.workStart, range.workEnd);
  const eventCount = normalized.length;
  let weather = "sunny";
  let mood = "适合耕作";
  let growthBonus = 16;

  if (eventCount >= 8 || busyMinutes >= 360) {
    weather = "rain";
    mood = "会议雨";
    growthBonus = 6;
  } else if (eventCount >= 5 || busyMinutes >= 240) {
    weather = "cloudy";
    mood = "有点忙";
    growthBonus = 10;
  } else if (focusBlocks >= 2) {
    weather = "sunny";
    mood = "阳光专注";
    growthBonus = 22;
  }

  return {
    eventCount,
    busyMinutes,
    focusBlocks,
    weather,
    mood,
    growthBonus,
    events: normalized.map((event) => ({
      title: event.title,
      timeText: event.timeText,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      location: event.location,
      description: event.description,
      url: event.url
    })),
    sampleEvents: normalized.slice(0, 4).map((event) => event.title)
  };
}

function normalizeCalendarEvent(event, range) {
  const startInfo = event.start_time || {};
  const endInfo = event.end_time || {};
  const start = parseFeishuEventTime(startInfo, range.start);
  const end = parseFeishuEventTime(endInfo, start + 60 * 60);
  const allDay = Boolean(startInfo.date || endInfo.date);

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;

  const title = cleanCalendarText(
    event.summary || event.title || event.subject || event.name || "未命名日程",
    80
  );
  const description = cleanCalendarText(event.description || event.note || "", 160);
  const location = cleanCalendarText(
    event.location?.name ||
      event.location?.address ||
      event.location?.display_name ||
      event.location?.full_address ||
      "",
    80
  );
  const url = sanitizeFeishuUrl(event.app_link || event.vchat?.meeting_url || "");

  return {
    title,
    description,
    location,
    start,
    end,
    allDay,
    timeText: formatEventTime(start, end, allDay),
    url
  };
}

function parseFeishuEventTime(timeInfo, fallback) {
  if (timeInfo.timestamp) return Number(timeInfo.timestamp);
  if (timeInfo.date) return Math.floor(localDateToDate(timeInfo.date).getTime() / 1000);
  return Number(fallback);
}

function localDateToDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function formatEventTime(start, end, allDay) {
  if (allDay) return "全天";

  const startDate = new Date(start * 1000);
  const endDate = new Date(end * 1000);
  const dateText = `${String(startDate.getMonth() + 1).padStart(2, "0")}/${String(
    startDate.getDate()
  ).padStart(2, "0")}`;
  const startText = formatClock(startDate);
  const endText = formatClock(endDate);

  return `${dateText} ${startText}-${endText}`;
}

function formatClock(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
    2,
    "0"
  )}`;
}

function cleanCalendarText(value, limit) {
  const text = String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function countFocusBlocks(events, workStart, workEnd) {
  let cursor = workStart;
  let count = 0;

  for (const event of events) {
    if (event.start - cursor >= 90 * 60) count += 1;
    cursor = Math.max(cursor, event.end);
  }

  if (workEnd - cursor >= 90 * 60) count += 1;
  return count;
}

function applyCalendarSignalToTeam(team, signal) {
  team.weather = signal.weather;
  team.mood = signal.mood;
  team.lastCalendarSignal = signal;
  team.updatedAt = new Date().toISOString();

  const plot = team.plots.find((item) => item.crop);
  if (plot) {
    plot.growth = Math.min(100, plot.growth + signal.growthBonus);
    plot.moisture = Math.min(100, plot.moisture + (signal.weather === "rain" ? 20 : 4));
  }
}

function applyFarmInteraction(db, user, type) {
  const team = user.activeTeamId ? db.teams[user.activeTeamId] : null;
  if (!team) {
    return { ok: false, error: "missing_team", message: "请先创建或加入团队农场。" };
  }

  const plot = team.plots.find((item) => item.crop) || team.plots[0];
  if (!plot.crop) {
    plot.crop = "turnip";
    plot.growth = 8;
    plot.moisture = 72;
  }

  const interaction = {
    id: makeId("act"),
    type,
    teamId: team.id,
    userId: user.id,
    createdAt: new Date().toISOString()
  };

  if (type === "water") {
    plot.moisture = Math.min(100, plot.moisture + 18);
    plot.growth = Math.min(100, plot.growth + 5);
  } else if (type === "cheer") {
    team.energy = Math.min(100, (team.energy || 50) + 8);
    plot.growth = Math.min(100, plot.growth + 3);
  } else if (type === "harvest" && plot.growth >= 100) {
    team.harvests = (team.harvests || 0) + 1;
    plot.crop = pickCrop(team.harvests);
    plot.growth = 12;
    plot.moisture = 64;
  }

  db.interactions.push(interaction);
  team.updatedAt = interaction.createdAt;

  return {
    ok: true,
    interaction,
    farm: buildFarmState(db, user)
  };
}

async function applyFarmObjectAction(db, user, body) {
  const team = user.activeTeamId ? db.teams[user.activeTeamId] : null;
  if (!team) {
    return { ok: false, error: "missing_team", message: "请先创建或加入团队农场。" };
  }

  const action = String(body.action || "place");
  db.farmObjects ||= [];
  db.backlogRecords ||= [];

  if (action === "removeLast") {
    const index = [...db.farmObjects]
      .map((item, itemIndex) => ({ item, itemIndex }))
      .reverse()
      .find(({ item }) => item.teamId === team.id && item.createdBy === user.id)?.itemIndex;

    if (index !== undefined) db.farmObjects.splice(index, 1);
    team.updatedAt = new Date().toISOString();
    await syncTodoFactoryQuiet(db, user, team);
    return { ok: true, farm: buildFarmState(db, user) };
  }

  if (action === "removeObject") {
    const objectId = cleanName(body.objectId, "");
    const index = db.farmObjects.findIndex((item) => item.id === objectId && item.teamId === team.id);
    if (index < 0) {
      return { ok: false, error: "object_not_found", message: "没有找到这个农场对象。" };
    }

    db.farmObjects.splice(index, 1);
    team.updatedAt = new Date().toISOString();
    await syncTodoFactoryQuiet(db, user, team);
    return { ok: true, removed: true, farm: buildFarmState(db, user) };
  }

  if (action === "archiveObject" || action === "completeObject") {
    const objectId = cleanName(body.objectId, "");
    const index = db.farmObjects.findIndex((item) => item.id === objectId && item.teamId === team.id);
    if (index < 0) {
      return { ok: false, error: "object_not_found", message: "没有找到这个农场对象。" };
    }

    const [object] = db.farmObjects.splice(index, 1);
    const status = action === "completeObject" ? "done" : "backlog";
    upsertBacklogRecord(db, backlogRecordFromObject(object, user, status));
    if (status === "done") team.harvests = (team.harvests || 0) + 1;
    team.updatedAt = new Date().toISOString();
    await syncTodoFactoryQuiet(db, user, team);
    return { ok: true, farm: buildFarmState(db, user) };
  }

  if (action === "dailySweep") {
    const result = sweepStaleFarmObjects(db, user, team);
    await syncTodoFactoryQuiet(db, user, team);
    return { ok: true, ...result, farm: buildFarmState(db, user) };
  }

  if (action === "tidyLayout") {
    tidyFarmObjectLayout(db, team);
    team.updatedAt = new Date().toISOString();
    return { ok: true, farm: buildFarmState(db, user) };
  }

  if (action === "bindTodoFactory") {
    const resourceUrl = sanitizeFeishuUrl(body.url);
    if (!resourceUrl) {
      return {
        ok: false,
        error: "invalid_resource_url",
        message: "请粘贴真实的飞书多维表格链接。"
      };
    }

    const now = new Date().toISOString();
    team.todoFactory = {
      title: cleanRecordText(body.title, "团队农场待办底库", 60),
      url: resourceUrl,
      fields: todoFactoryFields(),
      boundBy: user.id,
      boundAt: now,
      updatedAt: now
    };
    team.updatedAt = now;
    const todoFactorySync = await syncTodoFactoryToBitable(db, user, team);
    if (todoFactorySync.reauth) return todoFactorySync;
    return { ok: true, todoFactory: publicTodoFactory(db, team), todoFactorySync, farm: buildFarmState(db, user) };
  }

  if (action === "syncTodoFactory") {
    const todoFactorySync = await syncTodoFactoryToBitable(db, user, team);
    if (todoFactorySync.reauth) return todoFactorySync;
    return { ok: true, todoFactory: publicTodoFactory(db, team), todoFactorySync, farm: buildFarmState(db, user) };
  }

  if (action === "createBacklogRecord") {
    const record = backlogRecordFromBody(body, user, team, "backlog");
    upsertBacklogRecord(db, record);
    team.updatedAt = record.updatedAt;
    await syncTodoFactoryQuiet(db, user, team);
    return { ok: true, record: publicBacklogRecord(record), farm: buildFarmState(db, user) };
  }

  if (action === "plantRecord") {
    const object = farmObjectFromRecordBody(db, user, team, body);
    db.farmObjects.push(object);
    removeBacklogRecord(db, team.id, body.recordId || body.sourceId);
    team.updatedAt = object.createdAt;
    await syncTodoFactoryQuiet(db, user, team);
    return {
      ok: true,
      object: publicFarmObject(object),
      farm: buildFarmState(db, user)
    };
  }

  if (action === "bindResource") {
    const objectId = cleanName(body.objectId, "");
    const object = db.farmObjects.find((item) => item.id === objectId && item.teamId === team.id);
    if (!object) {
      return { ok: false, error: "object_not_found", message: "没有找到这个农场对象。" };
    }

    const resourceUrl = sanitizeFeishuUrl(body.url);
    if (!resourceUrl) {
      return {
        ok: false,
        error: "invalid_resource_url",
        message: "请粘贴真实的飞书、Lark 或飞书客户端链接。"
      };
    }

    const title = cleanName(body.title, object.title);
    object.title = title || object.title;
    object.resource = buildBoundFeishuResource(object.itemId, object.module, object.title, resourceUrl);
    object.boundAt = new Date().toISOString();
    object.updatedAt = object.boundAt;
    team.updatedAt = object.boundAt;
    await syncTodoFactoryQuiet(db, user, team);

    return {
      ok: true,
      object: publicFarmObject(object),
      farm: buildFarmState(db, user)
    };
  }

  if (action !== "place") {
    return { ok: false, error: "unknown_object_action", message: "未知的农场对象操作。" };
  }

  const itemId = cleanName(body.itemId, "farmObject");
  if (isSystemFarmObject(itemId)) {
    return {
      ok: false,
      error: "system_object_not_placeable",
      message: "这是系统区域，直接点击地图上的默认建筑使用。"
    };
  }
  const label = cleanName(body.label, "飞书对象");
  const module = cleanName(body.module, "飞书");
  const title = cleanName(body.title, `${label}-${new Date().toLocaleDateString("zh-CN")}`);
  const object = {
    id: makeId("obj"),
    teamId: team.id,
    createdBy: user.id,
    itemId,
    label,
    module,
    type: cleanName(body.type, "module"),
    sprite: cleanName(body.sprite, ""),
    title,
    x: clampNumber(body.x, 16, 1216, 640),
    y: clampNumber(body.y, 96, 1216, 640),
    resource: buildFeishuResource(itemId, module, title),
    createdAt: new Date().toISOString()
  };

  db.farmObjects.push(object);
  team.updatedAt = object.createdAt;
  await syncTodoFactoryQuiet(db, user, team);

  return {
    ok: true,
    object,
    farm: buildFarmState(db, user)
  };
}

function farmObjectFromRecordBody(db, user, team, body) {
  const itemId = cleanName(body.itemId, "taskSeed");
  const label = cleanName(body.label, "飞书事项");
  const module = cleanName(body.module, "飞书");
  const title = cleanRecordText(body.title, `${label}-${new Date().toLocaleDateString("zh-CN")}`, 60);
  const type = cleanName(body.type, inferTypeFromItemId(itemId));
  const sprite = cleanName(body.sprite, defaultSpriteForItem(itemId));
  const [x, y] = nextAutoPosition(db, team.id, type);
  const url = sanitizeFeishuUrl(body.url);
  const createdAt = new Date().toISOString();

  return {
    id: makeId("obj"),
    teamId: team.id,
    createdBy: user.id,
    itemId,
    label,
    module,
    type,
    sprite,
    title,
    x: clampNumber(body.x, 16, 1216, x),
    y: clampNumber(body.y, 96, 1216, y),
    sourceId: cleanRecordText(body.sourceId || body.recordId, "", 120),
    sourceType: cleanName(body.sourceType, "manual"),
    status: "active",
    resource: url ? buildBoundFeishuResource(itemId, module, title, url) : buildFeishuResource(itemId, module, title),
    createdAt
  };
}

function backlogRecordFromBody(body, user, team, status) {
  const itemId = cleanName(body.itemId, "taskSeed");
  const label = cleanName(body.label, "飞书事项");
  const module = cleanName(body.module, "飞书");
  const title = cleanRecordText(body.title, label, 80);
  const now = new Date().toISOString();
  const sourceId = cleanRecordText(body.sourceId || body.recordId || makeId("manual"), "", 120);
  const url = sanitizeFeishuUrl(body.url);

  return {
    id: makeId("todo"),
    teamId: team.id,
    ownerId: user.id,
    itemId,
    label,
    module,
    type: cleanName(body.type, inferTypeFromItemId(itemId)),
    sprite: cleanName(body.sprite, defaultSpriteForItem(itemId)),
    title,
    meta: cleanRecordText(body.meta, "", 120),
    status,
    priority: cleanName(body.priority, "普通"),
    dueDate: cleanRecordText(body.dueDate, todayRange().date, 20),
    url,
    sourceId,
    sourceType: cleanName(body.sourceType, "manual"),
    createdAt: now,
    updatedAt: now
  };
}

function backlogRecordFromObject(object, user, status) {
  const now = new Date().toISOString();
  return {
    id: makeId(status === "done" ? "done" : "todo"),
    teamId: object.teamId,
    ownerId: user.id,
    itemId: object.itemId,
    label: object.label,
    module: object.module,
    type: object.type,
    sprite: object.sprite,
    title: object.title,
    meta: status === "done" ? "已完成，进入成果晾晒绳" : "从农场清理，沉淀到未完成待办厂",
    status,
    priority: "普通",
    dueDate: todayRange().date,
    url: object.resource?.url || "",
    sourceId: object.sourceId || object.id,
    sourceType: object.sourceType || "farmObject",
    createdAt: object.createdAt || now,
    updatedAt: now
  };
}

function upsertBacklogRecord(db, record) {
  db.backlogRecords ||= [];
  const index = db.backlogRecords.findIndex(
    (item) =>
      item.teamId === record.teamId &&
      item.status === record.status &&
      item.sourceId &&
      item.sourceId === record.sourceId
  );
  if (index >= 0) {
    db.backlogRecords[index] = {
      ...db.backlogRecords[index],
      ...record,
      id: db.backlogRecords[index].id,
      createdAt: db.backlogRecords[index].createdAt || record.createdAt
    };
    return db.backlogRecords[index];
  }
  db.backlogRecords.push(record);
  return record;
}

function removeBacklogRecord(db, teamId, recordId) {
  const id = cleanRecordText(recordId, "", 120);
  if (!id) return;
  db.backlogRecords = (db.backlogRecords || []).filter(
    (item) => !(item.teamId === teamId && (item.id === id || item.sourceId === id))
  );
}

function sweepStaleFarmObjects(db, user, team) {
  const startOfToday = localDateToDate(todayRange().date).getTime();
  const moving = [];
  db.farmObjects = (db.farmObjects || []).filter((object) => {
    if (object.teamId !== team.id) return true;
    const createdAt = new Date(object.createdAt || Date.now()).getTime();
    if (Number.isFinite(createdAt) && createdAt < startOfToday) {
      moving.push(object);
      return false;
    }
    return true;
  });

  moving.forEach((object) => upsertBacklogRecord(db, backlogRecordFromObject(object, user, "backlog")));
  team.updatedAt = new Date().toISOString();
  return { swept: moving.length };
}

function runDailySweepIfNeeded(db, user) {
  const team = user.activeTeamId ? db.teams[user.activeTeamId] : null;
  if (!team) return { checked: false, swept: 0 };

  const today = todayRange().date;
  if (team.lastSweepDate === today) return { checked: false, swept: 0 };

  const result = sweepStaleFarmObjects(db, user, team);
  team.lastSweepDate = today;
  return { checked: true, swept: result.swept };
}

function ensureFarmLayoutVersion(db, team) {
  const version = 3;
  if (team.layoutVersion === version) return false;
  tidyFarmObjectLayout(db, team);
  team.layoutVersion = version;
  team.updatedAt = new Date().toISOString();
  return true;
}

function nextAutoPosition(db, teamId, type) {
  const typed = (db.farmObjects || []).filter((item) => item.teamId === teamId && (item.type || "module") === type);
  return layoutSlotForType(type, typed.length);
}

function tidyFarmObjectLayout(db, team) {
  const counters = {};
  db.farmObjects = (db.farmObjects || []).map((object) => {
    if (object.teamId !== team.id) return object;
    const type = object.type || inferTypeFromItemId(object.itemId);
    const index = counters[type] || 0;
    counters[type] = index + 1;
    const [x, y] = layoutSlotForType(type, index);
    return { ...object, type, x, y, updatedAt: new Date().toISOString() };
  });
}

function layoutSlotForType(type, index) {
  const layouts = {
    plan: { x: 78, y: 382, cols: 7, gapX: 38, gapY: 36 },
    creation: { x: 746, y: 442, cols: 7, gapX: 48, gapY: 42 },
    structure: { x: 746, y: 802, cols: 7, gapX: 48, gapY: 40 },
    plaza: { x: 318, y: 854, cols: 6, gapX: 46, gapY: 38 },
    module: { x: 526, y: 586, cols: 5, gapX: 44, gapY: 40 }
  };
  const layout = layouts[type] || layouts.module;
  return [
    layout.x + (index % layout.cols) * layout.gapX,
    layout.y + Math.floor(index / layout.cols) * layout.gapY
  ];
}

function inferTypeFromItemId(itemId) {
  if (["scheduleSign", "focusDew", "meetingCanopy", "taskSeed", "okrMilestone", "approvalStamp"].includes(itemId)) {
    return "plan";
  }
  if (["docCottage", "knowledgeGreenhouse", "commentBell", "minutesBook", "inspirationVine"].includes(itemId)) {
    return "creation";
  }
  if (["bitableWarehouse", "kanbanRidge", "fieldChest", "processCanal", "recordBarn", "todoFactory"].includes(itemId)) {
    return "structure";
  }
  if (["roundTable", "chatFirefly", "helpBridge", "showcaseLine", "aiPartnerCabin"].includes(itemId)) {
    return "plaza";
  }
  return "module";
}

function defaultSpriteForItem(itemId) {
  return {
    scheduleSign: "wood-sign",
    focusDew: "sprinkler",
    meetingCanopy: "gold-clock",
    taskSeed: "parsnip",
    okrMilestone: "gold-clock",
    approvalStamp: "chest",
    docCottage: "house",
    knowledgeGreenhouse: "greenhouse-fixed",
    commentBell: "wood-sign",
    minutesBook: "farm-computer",
    inspirationVine: "wheat",
    bitableWarehouse: "shed",
    kanbanRidge: "hoedirt",
    fieldChest: "chest",
    processCanal: "well",
    recordBarn: "barn",
    todoFactory: "shed",
    roundTable: "barn",
    chatFirefly: "sprinkler",
    helpBridge: "well",
    showcaseLine: "wheat",
    aiPartnerCabin: "farm-computer"
  }[itemId] || "wood-sign";
}

function isSystemFarmObject(itemId) {
  return ["bitableWarehouse", "todoFactory", "showcaseLine"].includes(itemId);
}

function buildFeishuResource(itemId, module, title) {
  const resources = {
    scheduleSign: {
      kind: "日程",
      actionLabel: "打开绑定日程"
    },
    focusDew: {
      kind: "日历专注",
      actionLabel: "打开绑定日程"
    },
    meetingCanopy: {
      kind: "会议日程",
      actionLabel: "打开绑定会议"
    },
    taskSeed: {
      kind: "任务",
      actionLabel: "打开绑定任务"
    },
    okrMilestone: {
      kind: "OKR",
      actionLabel: "打开绑定 OKR"
    },
    approvalStamp: {
      kind: "审批",
      actionLabel: "打开绑定审批"
    },
    docCottage: {
      kind: "云文档",
      actionLabel: "打开绑定云文档"
    },
    knowledgeGreenhouse: {
      kind: "知识库",
      actionLabel: "打开绑定知识库"
    },
    commentBell: {
      kind: "评论",
      actionLabel: "打开绑定评论"
    },
    minutesBook: {
      kind: "会议纪要",
      actionLabel: "打开绑定纪要"
    },
    inspirationVine: {
      kind: "文档动态",
      actionLabel: "打开绑定文档动态"
    },
    bitableWarehouse: {
      kind: "多维表格",
      actionLabel: "打开绑定多维表格"
    },
    kanbanRidge: {
      kind: "看板视图",
      actionLabel: "打开绑定看板"
    },
    fieldChest: {
      kind: "字段配置",
      actionLabel: "打开绑定字段表"
    },
    processCanal: {
      kind: "流程",
      actionLabel: "打开绑定流程"
    },
    recordBarn: {
      kind: "记录",
      actionLabel: "打开绑定记录"
    },
    todoFactory: {
      kind: "未完成待办厂",
      actionLabel: "打开绑定多维表格"
    },
    roundTable: {
      kind: "圆桌会议",
      actionLabel: "打开绑定会议"
    },
    chatFirefly: {
      kind: "群聊",
      actionLabel: "打开绑定群聊"
    },
    helpBridge: {
      kind: "协作互助",
      actionLabel: "打开绑定协作事项"
    },
    showcaseLine: {
      kind: "成果",
      actionLabel: "打开绑定成果"
    },
    aiPartnerCabin: {
      kind: "智能伙伴",
      actionLabel: "打开绑定伙伴"
    }
  };

  return (
    resources[itemId] || {
      kind: module || "飞书对象",
      actionLabel: "打开绑定内容"
    }
  );
}

function buildBoundFeishuResource(itemId, module, title, url) {
  const baseResource = buildFeishuResource(itemId, module, title);
  return {
    ...baseResource,
    actionLabel: baseResource.actionLabel || "打开绑定内容",
    url,
    bound: true,
    source: "bound"
  };
}

function feishuAppLink(pathname, params = {}) {
  const url = new URL(`https://applink.feishu.cn${pathname}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

function buildFarmState(db, user) {
  const team = user.activeTeamId ? db.teams[user.activeTeamId] : null;
  const members = team ? team.members.map((id) => publicUser(db.users[id])).filter(Boolean) : [];
  const today = todayRange().date;
  const signals = db.calendarSignals[today] || {};

  return {
    user: publicUser(user),
    team: team ? publicTeam(team) : null,
    members,
    farmObjects: team ? publicFarmObjects(db, team.id) : [],
    backlogRecords: team ? publicBacklogRecords(db, team.id) : [],
    todoFactory: team ? publicTodoFactory(db, team) : null,
    moduleRecords: team ? buildModuleRecords(db, user, team) : {},
    calendarSignals: Object.fromEntries(
      Object.entries(signals).map(([userId, signal]) => [userId, signal])
    ),
    recentInteractions: db.interactions
      .filter((item) => !team || item.teamId === team.id)
      .slice(-8)
      .reverse()
  };
}

function publicFarmObjects(db, teamId) {
  return (db.farmObjects || [])
    .filter((item) => item.teamId === teamId)
    .map(publicFarmObject);
}

function publicFarmObject(item) {
  const defaultResource = buildFeishuResource(item.itemId, item.module, item.title);
  const resource = item.resource?.source === "bound" ? item.resource : defaultResource;
  return {
    id: item.id,
    itemId: item.itemId,
    label: item.label,
    module: item.module,
    type: item.type,
    sprite: item.sprite,
    title: item.title,
    x: item.x,
    y: item.y,
    resource,
    boundAt: item.boundAt || "",
    status: item.status || "active",
    sourceId: item.sourceId || "",
    sourceType: item.sourceType || "",
    createdAt: item.createdAt
  };
}

function publicBacklogRecords(db, teamId) {
  return (db.backlogRecords || [])
    .filter((item) => item.teamId === teamId)
    .sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)))
    .map(publicBacklogRecord);
}

function publicBacklogRecord(item) {
  return {
    id: item.id,
    itemId: item.itemId,
    label: item.label,
    module: item.module,
    type: item.type,
    sprite: item.sprite,
    title: item.title,
    meta: item.meta || "",
    status: item.status || "backlog",
    priority: item.priority || "普通",
    dueDate: item.dueDate || "",
    url: item.url || "",
    sourceId: item.sourceId || "",
    sourceType: item.sourceType || "",
    updatedAt: item.updatedAt || item.createdAt
  };
}

function publicTodoFactory(db, team) {
  const backlog = (db.backlogRecords || []).filter((item) => item.teamId === team.id);
  const farmObjects = (db.farmObjects || []).filter((item) => item.teamId === team.id);
  const localRows = buildTodoFactorySyncRows(db, team);
  const bound = team.todoFactory || {};
  const configuredUrl = sanitizeFeishuUrl(bound.url || config.todoFactoryUrl);
  return {
    title: bound.title || "团队农场待办底库",
    url: configuredUrl,
    bound: Boolean(configuredUrl),
    fields: bound.fields?.length ? bound.fields : todoFactoryFields(),
    rowCount: localRows.length,
    backlogCount: backlog.filter((item) => item.status !== "done").length,
    doneCount: backlog.filter((item) => item.status === "done").length,
    activeCount: farmObjects.length,
    storage: configuredUrl ? "已绑定飞书多维表格" : "本地 JSON 模拟多维表格",
    appToken: bound.appToken || "",
    tableId: bound.tableId || "",
    lastSyncedAt: bound.lastSyncedAt || "",
    lastSyncResult: bound.lastSyncResult || null,
    updatedAt: bound.updatedAt || team.updatedAt || ""
  };
}

function todoFactoryFields() {
  return [
    { key: "title", label: "标题", type: "文本" },
    { key: "syncId", label: "唯一标识", type: "文本" },
    { key: "module", label: "飞书模块", type: "单选" },
    { key: "status", label: "状态", type: "单选" },
    { key: "priority", label: "优先级", type: "单选" },
    { key: "recordDate", label: "记录日期", type: "日期" },
    { key: "dueDate", label: "截止日期", type: "日期" },
    { key: "url", label: "资源链接", type: "链接" },
    { key: "sourceType", label: "来源", type: "单选" },
    { key: "zone", label: "农场区域", type: "文本" },
    { key: "updatedAt", label: "最后同步", type: "时间" },
    { key: "note", label: "备注", type: "文本" }
  ];
}

function buildModuleRecords(db, user, team) {
  const records = {};
  const push = (itemId, record) => {
    records[itemId] ||= [];
    records[itemId].push(record);
  };
  const signal = team.lastCalendarSignal;

  (signal?.events || []).slice(0, 12).forEach((event, index) => {
    const record = {
      id: `calendar:scheduleSign:${event.start || index}:${index}`,
      sourceId: `calendar:${event.start || index}:${index}`,
      sourceType: "calendar",
      itemId: "scheduleSign",
      label: "日程木牌",
      module: "日程",
      type: "plan",
      sprite: "wood-sign",
      title: event.title || "未命名日程",
      meta: [event.timeText, event.location].filter(Boolean).join(" · "),
      status: "今日",
      url: event.url || "",
      canPlant: true,
      canBacklog: true
    };
    push("scheduleSign", record);
    push("meetingCanopy", {
      ...record,
      id: `calendar:meetingCanopy:${event.start || index}:${index}`,
      itemId: "meetingCanopy",
      label: "会议雨棚",
      sprite: "gold-clock"
    });
    push("roundTable", {
      ...record,
      id: `calendar:roundTable:${event.start || index}:${index}`,
      itemId: "roundTable",
      label: "圆桌会议",
      type: "plaza",
      sprite: "barn"
    });
  });

  if (signal?.focusBlocks) {
    push("focusDew", {
      id: `focus:${todayRange().date}`,
      sourceId: `focus:${todayRange().date}`,
      sourceType: "calendar",
      itemId: "focusDew",
      label: "专注露珠",
      module: "专注",
      type: "plan",
      sprite: "sprinkler",
      title: `${signal.focusBlocks} 个专注空档`,
      meta: `今日作物成长 +${signal.growthBonus}`,
      status: "今日",
      canPlant: true,
      canBacklog: false
    });
  }

  (db.farmObjects || [])
    .filter((object) => object.teamId === team.id)
    .forEach((object) => {
      const record = {
        id: `object:${object.id}`,
        sourceId: object.sourceId || object.id,
        sourceType: object.sourceType || "farmObject",
        objectId: object.id,
        itemId: object.itemId,
        label: object.label,
        module: object.module,
        type: object.type,
        sprite: object.sprite,
        title: object.title,
        meta: "已在农场，可完成或移入待办厂",
        status: "已种植",
        url: object.resource?.url || "",
        canPlant: false,
        canBacklog: true
      };
      push(object.itemId, record);
      push("bitableWarehouse", { ...record, id: `warehouse:${object.id}`, status: "农场实例" });
    });

  (db.backlogRecords || [])
    .filter((record) => record.teamId === team.id)
    .forEach((record) => {
      const publicRecord = {
        ...publicBacklogRecord(record),
        id: record.id,
        canPlant: record.status !== "done",
        canBacklog: false
      };
      if (record.status === "done") {
        push("showcaseLine", {
          ...publicRecord,
          itemId: "showcaseLine",
          label: "成果晾晒绳",
          status: "已完成",
          meta: record.meta || "已完成，进入成果晾晒绳"
        });
      } else {
        push(record.itemId || "taskSeed", publicRecord);
        push("todoFactory", {
          ...publicRecord,
          id: `factory:${record.id}`,
          status: "待办厂"
        });
      }
      push("bitableWarehouse", {
        ...publicRecord,
        id: `warehouse:${record.id}`,
        status: record.status === "done" ? "成果记录" : "待办记录"
      });
    });

  addModuleTemplates(records, team);
  return records;
}

function addModuleTemplates(records, team) {
  const templates = {
    scheduleSign: {
      label: "日程木牌",
      module: "日程",
      type: "plan",
      sprite: "wood-sign",
      title: "同步今天的真实日程",
      meta: team.lastCalendarSignal ? "今天暂无更多日程，可创建一个计划占位" : "点击同步计划后会读取真实日程",
      canBacklog: false
    },
    focusDew: {
      label: "专注露珠",
      module: "专注",
      type: "plan",
      sprite: "sprinkler",
      title: "记录一段专注时间",
      meta: "可作为今天的专注占位种到计划田",
      canBacklog: true
    },
    meetingCanopy: {
      label: "会议雨棚",
      module: "会议",
      type: "plan",
      sprite: "gold-clock",
      title: "记录一场待跟进会议",
      meta: "会议纪要、行动项可以先进入待办厂",
      canBacklog: true
    },
    taskSeed: {
      label: "任务种子",
      module: "任务",
      type: "plan",
      sprite: "parsnip",
      title: "创建一个待完成任务种子",
      meta: "后续接任务 API 后会替换成真实任务",
      canBacklog: true
    },
    okrMilestone: {
      label: "OKR 里程碑钟",
      module: "OKR",
      type: "plan",
      sprite: "gold-clock",
      title: "记录一个 OKR 进展检查点",
      meta: "把目标进展先变成季节里程碑",
      canBacklog: true
    },
    approvalStamp: {
      label: "审批印章台",
      module: "审批",
      type: "plan",
      sprite: "chest",
      title: "记录一个待处理审批",
      meta: "审批通过后可完成并晾晒",
      canBacklog: true
    },
    docCottage: {
      label: "云文档小屋",
      module: "云文档",
      type: "creation",
      sprite: "house",
      title: "沉淀一份待完成云文档",
      meta: "绑定真实文档链接后可直接打开",
      canBacklog: true
    },
    knowledgeGreenhouse: {
      label: "知识温室",
      module: "知识库",
      type: "creation",
      sprite: "greenhouse-fixed",
      title: "维护一个知识库节点",
      meta: "可先种为知识资产占位",
      canBacklog: true
    },
    commentBell: {
      label: "评论风铃",
      module: "评论",
      type: "creation",
      sprite: "wood-sign",
      title: "处理一条待回复评论",
      meta: "评论、补充、被采纳都可以进入创作工坊",
      canBacklog: true
    },
    minutesBook: {
      label: "纪要花册",
      module: "会议纪要",
      type: "creation",
      sprite: "farm-computer",
      title: "整理一份会议纪要",
      meta: "会议结束后可先沉淀到待办厂",
      canBacklog: true
    },
    inspirationVine: {
      label: "灵感藤蔓",
      module: "文档动态",
      type: "creation",
      sprite: "wheat",
      title: "补充一条创作灵感",
      meta: "持续编辑和想法补充会让藤蔓成长",
      canBacklog: true
    },
    bitableWarehouse: {
      label: "多维表格仓库",
      module: "多维表格",
      type: "structure",
      sprite: "shed",
      title: "查看农场数据库与待办记录",
      meta: "这里汇总农场实例、未完成事项和完成成果",
      canPlant: false,
      canBacklog: false
    },
    kanbanRidge: {
      label: "看板田垄",
      module: "多维表格",
      type: "structure",
      sprite: "hoedirt",
      title: "维护一个看板视图",
      meta: "按状态流转整理今天的事项",
      canBacklog: true
    },
    fieldChest: {
      label: "字段宝箱",
      module: "多维表格",
      type: "structure",
      sprite: "chest",
      title: "确认一个字段配置",
      meta: "字段会决定待办厂记录怎么长出来",
      canBacklog: true
    },
    processCanal: {
      label: "流程水渠",
      module: "流程",
      type: "structure",
      sprite: "well",
      title: "疏通一个跨模块流程",
      meta: "把任务、文档、会议之间的流转串起来",
      canBacklog: true
    },
    recordBarn: {
      label: "记录谷仓",
      module: "记录",
      type: "structure",
      sprite: "barn",
      title: "补全一条结构化记录",
      meta: "记录完整后可以完成并进入成果晾晒绳",
      canBacklog: true
    },
    todoFactory: {
      label: "未完成待办厂",
      module: "多维表格",
      type: "structure",
      sprite: "shed",
      title: "查看未完成待办底库",
      meta: "每日清算后未完成事项会来到这里",
      canPlant: false,
      canBacklog: false
    },
    roundTable: {
      label: "圆桌会议",
      module: "会议",
      type: "plaza",
      sprite: "barn",
      title: "跟进一场团队圆桌",
      meta: "同步日程后会出现真实会议记录",
      canBacklog: true
    },
    chatFirefly: {
      label: "群聊萤火虫",
      module: "群聊",
      type: "plaza",
      sprite: "sprinkler",
      title: "记录一次需要跟进的群聊协作",
      meta: "群聊回复、表情、@ 可先作为协作事项",
      canBacklog: true
    },
    helpBridge: {
      label: "协作小桥",
      module: "互助",
      type: "plaza",
      sprite: "well",
      title: "响应一次协作求助",
      meta: "帮助同事、补充资料后可以完成晾晒",
      canBacklog: true
    },
    showcaseLine: {
      label: "成果晾晒绳",
      module: "成果",
      type: "plaza",
      sprite: "wheat",
      title: "查看已完成成果",
      meta: "完成事项会晒在这里",
      canPlant: false,
      canBacklog: false
    },
    aiPartnerCabin: {
      label: "智能伙伴小屋",
      module: "智能伙伴",
      type: "plaza",
      sprite: "farm-computer",
      title: "让智能伙伴解释农场变化",
      meta: "后续可接智能伙伴生成今日农场叙事",
      canBacklog: true
    }
  };

  Object.entries(templates).forEach(([itemId, template]) => {
    if (records[itemId]?.length) return;
    records[itemId] = [
      {
        id: `template:${itemId}:${todayRange().date}`,
        sourceId: `template:${itemId}:${todayRange().date}`,
        sourceType: "template",
        itemId,
        label: template.label,
        module: template.module,
        type: template.type,
        sprite: template.sprite,
        title: template.title,
        meta: template.meta,
        status: "可创建",
        canPlant: template.canPlant !== false,
        canBacklog: Boolean(template.canBacklog)
      }
    ];
  });
}

function createTeam(db, user, name) {
  const team = {
    id: makeId("team"),
    name,
    code: makeTeamCode(),
    createdBy: user.id,
    members: [],
    weather: "sunny",
    mood: "等待日历信号",
    energy: 50,
    harvests: 0,
    plots: createStarterPlots(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.teams[team.id] = team;
  addMember(db, team, user.id);
  user.activeTeamId = team.id;
  return team;
}

function addMember(db, team, userId) {
  if (!team.members.includes(userId)) {
    team.members.push(userId);
  }
  db.users[userId].activeTeamId = team.id;
}

function createStarterPlots() {
  const crops = ["turnip", "carrot", "sprout", "wheat", "", "", "", "", ""];
  return crops.map((crop, index) => ({
    id: index + 1,
    crop,
    growth: crop ? 18 + index * 11 : 0,
    moisture: crop ? 55 + index * 6 : 0
  }));
}

function upsertUser(db, userInfo, tokens) {
  const id = userInfo.open_id || userInfo.sub || userInfo.union_id;
  if (!id) throw new Error("Feishu user_info did not include open_id");

  const existing = db.users[id] || {};
  const now = new Date().toISOString();

  db.users[id] = {
    id,
    openId: userInfo.open_id || id,
    unionId: userInfo.union_id || "",
    tenantKey: userInfo.tenant_key || existing.tenantKey || "",
    name: userInfo.name || userInfo.en_name || existing.name || "飞书用户",
    avatarUrl: userInfo.avatar_url || userInfo.picture || existing.avatarUrl || "",
    activeTeamId: existing.activeTeamId || "",
    tokens,
    createdAt: existing.createdAt || now,
    updatedAt: now
  };

  return db.users[id];
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    activeTeamId: user.activeTeamId
  };
}

function publicTeam(team) {
  if (!team) return null;
  return {
    id: team.id,
    name: team.name,
    code: team.code,
    weather: team.weather,
    mood: team.mood,
    energy: team.energy,
    harvests: team.harvests,
    plots: team.plots,
    updatedAt: team.updatedAt,
    lastSweepDate: team.lastSweepDate || "",
    memberCount: team.members.length,
    todoFactory: publicTodoFactory(cachedDb || { backlogRecords: [], farmObjects: [] }, team),
    lastCalendarSignal: team.lastCalendarSignal || null
  };
}

async function readDb() {
  if (cachedDb) return cachedDb;

  await mkdir(dataDir, { recursive: true });
  if (!existsSync(dbPath)) {
    cachedDb = {
      users: {},
      teams: {},
      calendarSignals: {},
      interactions: [],
      farmObjects: [],
      backlogRecords: []
    };
    await writeDb(cachedDb);
    return cachedDb;
  }

  cachedDb = JSON.parse(await readFile(dbPath, "utf8"));
  cachedDb.users ||= {};
  cachedDb.teams ||= {};
  cachedDb.calendarSignals ||= {};
  cachedDb.interactions ||= [];
  cachedDb.farmObjects ||= [];
  cachedDb.backlogRecords ||= [];
  return cachedDb;
}

async function writeDb(db = cachedDb) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`);
}

function normalizeTokens(tokens) {
  const now = Date.now();
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type || "Bearer",
    scope: tokens.scope || "",
    expiresAt: now + Number(tokens.expires_in || 7200) * 1000,
    refreshExpiresAt: now + Number(tokens.refresh_expires_in || 2592000) * 1000
  };
}

function getSession(req, res) {
  const cookies = parseCookies(req.headers.cookie || "");
  let sid = cookies.sid;

  if (!sid || !sessions.has(sid)) {
    sid = crypto.randomBytes(24).toString("base64url");
    sessions.set(sid, createSessionFromCookies(cookies));
    setCookie(res, "sid", sid, { httpOnly: true, sameSite: "Lax", path: "/" });
  }

  return sessions.get(sid);
}

function createSessionFromCookies(cookies) {
  const session = {};
  const auth = verifySignedValue(cookies.farm_auth);
  if (auth?.userId && (!auth.expiresAt || auth.expiresAt > Date.now())) {
    session.userId = auth.userId;
  }
  return session;
}

function parseCookies(cookieHeader) {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function setCookie(res, name, value, options) {
  const cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    options.httpOnly ? "HttpOnly" : "",
    options.sameSite ? `SameSite=${options.sameSite}` : "",
    options.path ? `Path=${options.path}` : "",
    options.maxAge ? `Max-Age=${options.maxAge}` : ""
  ]
    .filter(Boolean)
    .join("; ");

  appendSetCookie(res, cookie);
}

function clearCookie(res, name) {
  appendSetCookie(res, `${encodeURIComponent(name)}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

function appendSetCookie(res, cookie) {
  const existing = res.getHeader("Set-Cookie");
  if (!existing) {
    res.setHeader("Set-Cookie", cookie);
  } else if (Array.isArray(existing)) {
    res.setHeader("Set-Cookie", [...existing, cookie]);
  } else {
    res.setHeader("Set-Cookie", [existing, cookie]);
  }
}

function setAuthCookie(res, userId) {
  const maxAge = 7 * 24 * 60 * 60;
  const payload = {
    userId,
    expiresAt: Date.now() + maxAge * 1000
  };
  setCookie(res, "farm_auth", signValue(payload), {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge
  });
}

function signValue(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", config.sessionSecret)
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

function verifySignedValue(value) {
  if (!value || !value.includes(".")) return null;

  const [body, signature] = value.split(".");
  const expected = crypto
    .createHmac("sha256", config.sessionSecret)
    .update(body)
    .digest("base64url");

  if (!safeEqual(signature, expected)) return null;

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function cleanName(value, fallback) {
  const name = String(value || "").trim();
  return name ? name.slice(0, 28) : fallback;
}

function cleanRecordText(value, fallback = "", limit = 80) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  const normalized = text || fallback;
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

function sanitizeFeishuUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.length > 2000) return "";

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return "";
  }

  if (["feishu:", "lark:"].includes(parsed.protocol)) return raw;
  if (parsed.protocol !== "https:") return "";

  const host = parsed.hostname.toLowerCase();
  const allowedDomains = ["feishu.cn", "larkoffice.com", "larksuite.com"];
  const allowed = allowedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
  return allowed ? parsed.toString() : "";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function makeTeamCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

function pickCrop(index) {
  const crops = ["turnip", "carrot", "sprout", "wheat"];
  return crops[index % crops.length];
}

function todayRange() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const workStart = new Date(startDate);
  workStart.setHours(9, 0, 0, 0);

  const workEnd = new Date(startDate);
  workEnd.setHours(18, 0, 0, 0);

  return {
    date: localDateString(startDate),
    start: Math.floor(startDate.getTime() / 1000),
    end: Math.floor(endDate.getTime() / 1000),
    workStart: Math.floor(workStart.getTime() / 1000),
    workEnd: Math.floor(workEnd.getTime() / 1000)
  };
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
