const app = document.querySelector("#app");

const cropPalette = {
  turnip: { leaf: "#2f8b56", fruit: "#e8d7f0", label: "萝卜" },
  carrot: { leaf: "#3b9b51", fruit: "#db7d35", label: "胡萝卜" },
  sprout: { leaf: "#5ba84c", fruit: "#8fcf63", label: "嫩芽" },
  wheat: { leaf: "#c49a3e", fruit: "#e2c76c", label: "小麦" }
};

const itemCatalog = {
  plan: {
    label: "计划田",
    mark: "计",
    summary: "日历、任务、OKR、审批会变成作物生长的节奏",
    items: [
      {
        id: "scheduleSign",
        label: "日程木牌",
        type: "plan",
        module: "日程",
        status: "已接入",
        sprite: "wood-sign",
        hint: "今日日程决定农场天气和忙闲节奏"
      },
      {
        id: "focusDew",
        label: "专注露珠",
        type: "plan",
        module: "专注",
        status: "已接入",
        sprite: "sprinkler",
        hint: "空档与专注块会变成灌溉露水"
      },
      {
        id: "meetingCanopy",
        label: "会议雨棚",
        type: "plan",
        module: "会议",
        status: "已接入",
        sprite: "gold-clock",
        hint: "会议密度越高，农场越容易下会议雨"
      },
      {
        id: "taskSeed",
        label: "任务种子",
        type: "plan",
        module: "任务",
        status: "已授权",
        sprite: "parsnip",
        hint: "任务创建、更新、完成对应发芽、抽枝、结果"
      },
      {
        id: "okrMilestone",
        label: "OKR 里程碑钟",
        type: "plan",
        module: "OKR",
        status: "已授权",
        sprite: "gold-clock",
        hint: "目标和进展会变成季节性成长目标"
      },
      {
        id: "approvalStamp",
        label: "审批印章台",
        type: "plan",
        module: "审批",
        status: "已授权",
        sprite: "chest",
        hint: "审批流转让农场出现决策印记"
      }
    ]
  },
  creation: {
    label: "创作工坊",
    mark: "创",
    summary: "云文档、知识库、评论、纪要沉淀为团队资产",
    items: [
      {
        id: "docCottage",
        label: "云文档小屋",
        type: "creation",
        module: "云文档",
        status: "已授权",
        sprite: "house",
        hint: "文档创建、更新、协作沉淀成小屋灯火"
      },
      {
        id: "knowledgeGreenhouse",
        label: "知识温室",
        type: "creation",
        module: "知识库",
        status: "已授权",
        sprite: "greenhouse-fixed",
        hint: "知识节点越完整，温室越稳定"
      },
      {
        id: "commentBell",
        label: "评论风铃",
        type: "creation",
        module: "评论",
        status: "已授权",
        sprite: "wood-sign",
        hint: "评论、补充、被采纳变成轻量互动"
      },
      {
        id: "minutesBook",
        label: "纪要花册",
        type: "creation",
        module: "会议纪要",
        status: "可扩展",
        sprite: "farm-computer",
        hint: "会议纪要和复盘会开出记录花"
      },
      {
        id: "inspirationVine",
        label: "灵感藤蔓",
        type: "creation",
        module: "文档动态",
        status: "已授权",
        sprite: "wheat",
        hint: "持续编辑让创作区长出藤蔓"
      }
    ]
  },
  structure: {
    label: "结构设施",
    mark: "构",
    summary: "多维表格、字段、记录、流程变成农场基础设施",
    items: [
      {
        id: "bitableWarehouse",
        label: "多维表格仓库",
        type: "structure",
        module: "多维表格",
        status: "系统建筑",
        sprite: "shed",
        hint: "表、字段、记录承载团队农场数据库",
        placeable: false
      },
      {
        id: "kanbanRidge",
        label: "看板田垄",
        type: "structure",
        module: "多维表格",
        status: "已授权",
        sprite: "hoedirt",
        hint: "视图和状态流转变成一排排田垄"
      },
      {
        id: "fieldChest",
        label: "字段宝箱",
        type: "structure",
        module: "多维表格",
        status: "已授权",
        sprite: "chest",
        hint: "字段配置像宝箱一样决定产出规则"
      },
      {
        id: "processCanal",
        label: "流程水渠",
        type: "structure",
        module: "流程",
        status: "可扩展",
        sprite: "well",
        hint: "跨模块流转为不同区域输送水源"
      },
      {
        id: "recordBarn",
        label: "记录谷仓",
        type: "structure",
        module: "记录",
        status: "已授权",
        sprite: "barn",
        hint: "结构化记录越完整，谷仓越充实"
      },
      {
        id: "todoFactory",
        label: "未完成待办厂",
        type: "structure",
        module: "多维表格",
        status: "系统建筑",
        sprite: "shed",
        hint: "每天清算后，未完成内容会沉淀到这里",
        placeable: false
      }
    ]
  },
  plaza: {
    label: "团队广场",
    mark: "队",
    summary: "群聊、会议、互助、成果展示变成团队互动",
    items: [
      {
        id: "roundTable",
        label: "圆桌会议",
        type: "plaza",
        module: "会议",
        status: "日历联动",
        sprite: "barn",
        hint: "会议与协作讨论会聚到团队广场"
      },
      {
        id: "chatFirefly",
        label: "群聊萤火虫",
        type: "plaza",
        module: "群聊",
        status: "已授权",
        sprite: "sprinkler",
        hint: "群聊回复、表情、@ 变成夜晚光点"
      },
      {
        id: "helpBridge",
        label: "协作小桥",
        type: "plaza",
        module: "互助",
        status: "已授权",
        sprite: "well",
        hint: "帮助同事、补充资料会修好桥面"
      },
      {
        id: "showcaseLine",
        label: "成果晾晒绳",
        type: "plaza",
        module: "成果",
        status: "系统区域",
        sprite: "wheat",
        hint: "完成物、里程碑和复盘会被挂出来",
        placeable: false
      },
      {
        id: "aiPartnerCabin",
        label: "智能伙伴小屋",
        type: "plaza",
        module: "智能伙伴",
        status: "可扩展",
        sprite: "farm-computer",
        hint: "后续让 AI NPC 主动解释农场变化"
      }
    ]
  }
};

const plannerAssetRoot = "/assets/stardewplanner";
const plannerAssets = {
  map: loadPixelImage(`${plannerAssetRoot}/layouts/farm_fourcorners.jpg`),
  sprites: {
    barn: loadPixelImage(`${plannerAssetRoot}/tiles/barn.png`),
    chest: loadPixelImage(`${plannerAssetRoot}/tiles/chest.png`),
    "farm-computer": loadPixelImage(`${plannerAssetRoot}/tiles/farm-computer.png`),
    "gold-clock": loadPixelImage(`${plannerAssetRoot}/tiles/gold-clock.png`),
    "greenhouse-fixed": loadPixelImage(`${plannerAssetRoot}/tiles/greenhouse-fixed.png`),
    hoedirt: loadPixelImage(`${plannerAssetRoot}/tiles/hoedirt.png`),
    house: loadPixelImage(`${plannerAssetRoot}/tiles/house.png`),
    parsnip: loadPixelImage(`${plannerAssetRoot}/tiles/parsnip.png`),
    shed: loadPixelImage(`${plannerAssetRoot}/tiles/shed.png`),
    sprinkler: loadPixelImage(`${plannerAssetRoot}/tiles/sprinkler.png`),
    well: loadPixelImage(`${plannerAssetRoot}/tiles/well.png`),
    wheat: loadPixelImage(`${plannerAssetRoot}/tiles/wheat.png`),
    "wood-sign": loadPixelImage(`${plannerAssetRoot}/tiles/wood-sign.png`)
  }
};

const plannerSpriteSizes = {
  barn: [112, 64],
  chest: [16, 16],
  "farm-computer": [16, 16],
  "gold-clock": [48, 32],
  "greenhouse-fixed": [112, 160],
  hoedirt: [16, 16],
  house: [144, 144],
  parsnip: [16, 16],
  shed: [112, 64],
  sprinkler: [16, 16],
  well: [48, 48],
  wheat: [16, 16],
  "wood-sign": [16, 16]
};

const plannerPlacedScales = {
  barn: 0.42,
  shed: 0.42,
  house: 0.34,
  "greenhouse-fixed": 0.3,
  well: 0.54,
  "gold-clock": 0.52,
  chest: 1.05,
  "farm-computer": 1.05,
  hoedirt: 1,
  parsnip: 1.05,
  sprinkler: 1.05,
  wheat: 1.05,
  "wood-sign": 1.05
};

const aiPartnerLinks = {
  feishuFallback: feishuAppLink("/client/web_url/open", {
    url: "https://aily.feishu.cn/",
    mode: "window"
  }),
  web: "https://aily.feishu.cn/"
};

const aiNpcWaypoints = [
  { id: "centerYard", x: 610, y: 622, links: ["northPath", "eastCross", "southPath", "westCross"] },
  { id: "northPath", x: 632, y: 466, links: ["centerYard", "northGate", "topLeftGate", "topRightGate"] },
  { id: "northGate", x: 640, y: 164, links: ["northPath", "topLeftGate", "topRightGate"] },
  { id: "topLeftGate", x: 342, y: 252, links: ["northGate", "northPath", "planNorth", "planCenter"] },
  { id: "planNorth", x: 190, y: 236, links: ["topLeftGate", "planCenter"] },
  { id: "planCenter", x: 214, y: 344, links: ["planNorth", "planSouth", "topLeftGate"] },
  { id: "planSouth", x: 250, y: 442, links: ["planCenter", "westCross"] },
  { id: "westCross", x: 344, y: 654, links: ["centerYard", "planSouth", "plazaNorth", "plazaEast"] },
  { id: "plazaNorth", x: 328, y: 724, links: ["westCross", "plazaWest", "plazaEast", "plazaSouth"] },
  { id: "plazaWest", x: 142, y: 792, links: ["plazaNorth", "plazaSouth"] },
  { id: "plazaEast", x: 512, y: 768, links: ["plazaNorth", "westCross", "southPath"] },
  { id: "plazaSouth", x: 318, y: 884, links: ["plazaWest", "plazaEast", "southPath"] },
  { id: "topRightGate", x: 780, y: 272, links: ["northGate", "northPath", "creationCenter"] },
  { id: "creationCenter", x: 964, y: 354, links: ["topRightGate", "creationSouth"] },
  { id: "creationSouth", x: 940, y: 474, links: ["creationCenter", "eastCross"] },
  { id: "eastCross", x: 746, y: 646, links: ["centerYard", "creationSouth", "structureNorth", "structureWest"] },
  { id: "structureNorth", x: 850, y: 618, links: ["eastCross", "structureCenter", "structureEast"] },
  { id: "structureWest", x: 770, y: 792, links: ["eastCross", "structureCenter", "structureSouth"] },
  { id: "structureCenter", x: 940, y: 768, links: ["structureNorth", "structureWest", "structureEast", "structureSouth"] },
  { id: "structureEast", x: 1082, y: 760, links: ["structureNorth", "structureCenter", "structureSouth"] },
  { id: "structureSouth", x: 934, y: 916, links: ["structureWest", "structureCenter", "structureEast", "southPath"] },
  { id: "southPath", x: 640, y: 888, links: ["centerYard", "plazaEast", "plazaSouth", "structureSouth"] }
];
const aiNpcWaypointById = Object.fromEntries(aiNpcWaypoints.map((point) => [point.id, point]));

let state = {
  config: null,
  me: null,
  farm: null,
  busyAction: "",
  toast: "",
  animationFrame: 0,
  npc: {
    x: 610,
    y: 622,
    waypointId: "centerYard",
    previousWaypointId: "",
    targetWaypointId: "northPath",
    targetX: 632,
    targetY: 466,
    direction: 1,
    walking: false,
    stepPhase: 0,
    phrase: "",
    nextPhraseAt: 0,
    nextMoveAt: 900,
    lastTime: 0
  },
  editor: {
    activeTab: "",
    search: "",
    placement: null,
    cursor: null,
    quickMenu: null,
    selectedNpc: false,
    selectedModule: null,
    selectedObjectId: null,
    recordDate: localDateInput(new Date()),
    recent: ["scheduleSign", "taskSeed", "docCottage", "bitableWarehouse"],
    placedItems: []
  }
};

boot();

async function boot() {
  const authMessage = authMessageFromUrl();
  const [config, me] = await Promise.all([api("/api/config"), api("/api/me")]);
  state.config = config;
  state.me = me;

  if (me.authenticated) {
    state.farm = await api("/api/farm/state");
  }

  render();
  if (authMessage) showToast(authMessage);
}

function render() {
  cancelAnimationFrame(state.animationFrame);

  if (!state.me?.authenticated) {
    renderLogin();
    startCanvasLoop(document.querySelector("#farmCanvas"), demoFarm());
    return;
  }

  if (!state.farm?.team) {
    renderTeamGate();
    startCanvasLoop(document.querySelector("#farmCanvas"), demoFarm());
    bindTeamForms();
    return;
  }

  renderFarm();
  startCanvasLoop(document.querySelector("#farmCanvas"), state.farm);
  bindFarmActions();
}

function renderLogin() {
  const configured = state.config?.feishuConfigured;
  app.innerHTML = `
    <section class="login-grid">
      <div class="preview-stage">
        <canvas id="farmCanvas" width="1280" height="1280" aria-label="像素农场预览"></canvas>
      </div>
      <aside class="login-panel">
        <div>
          <h1>飞书团队农场</h1>
          <p>用真实飞书账号进入团队农场。日历、任务、文档、多维表格、群聊、审批和 OKR 会被转换成低像素农场里的作物、建筑、天气与团队事件。</p>
          <div class="status-list">
            <div class="status-item">
              <span>飞书应用</span>
              <strong>${configured ? "已配置" : "待配置"}</strong>
            </div>
            <div class="status-item">
              <span>回调地址</span>
              <strong>${state.config?.redirectUri || "未设置"}</strong>
            </div>
            <div class="status-item">
              <span>权限范围</span>
              <strong>${(state.config?.scopes || []).join(" ")}</strong>
            </div>
          </div>
          ${
            configured
              ? ""
              : `<div class="setup-note">先把 <strong>.env</strong> 里的 FEISHU_APP_ID 和 FEISHU_APP_SECRET 填好，并在飞书开发者后台配置同一个回调地址。</div>`
          }
        </div>
        <button id="loginButton" ${configured ? "" : "disabled"}>使用飞书登录</button>
      </aside>
    </section>
  `;

  document.querySelector("#loginButton")?.addEventListener("click", () => {
    window.location.href = "/api/auth/feishu/start";
  });
}

function renderTeamGate() {
  const user = state.me.user;
  app.innerHTML = `
    ${topbar(user, "还没有团队农场")}
    <section class="team-panel">
      <h2>创建或加入团队</h2>
      <p>先手动创建或加入一个团队农场，后续可以继续映射部门、项目组和好友关系。</p>
      <form id="createTeamForm">
        <input name="name" maxlength="28" placeholder="团队农场名称，例如：增长组农场" required />
        <button type="submit">创建团队农场</button>
      </form>
      <div class="splitter"></div>
      <form id="joinTeamForm" class="join-row">
        <input name="code" maxlength="8" placeholder="输入团队邀请码" required />
        <button type="submit" class="secondary">加入</button>
      </form>
    </section>
    <section class="preview-stage" style="margin-top: 18px;">
      <canvas id="farmCanvas" width="1280" height="1280" aria-label="像素农场预览"></canvas>
    </section>
  `;
}

function renderFarm() {
  const { user, team, members } = state.farm;
  const signal = team.lastCalendarSignal;
  const events = signal?.events || (signal?.sampleEvents || []).map((title) => ({ title }));
  const syncingCalendar = state.busyAction === "calendar";
  const backlogCount = (state.farm.backlogRecords || []).filter((record) => record.status !== "done").length;
  const doneCount = (state.farm.backlogRecords || []).filter((record) => record.status === "done").length;
  const todoFactory = state.farm.todoFactory || {};

  app.innerHTML = `
    ${topbar(user, team.name)}
    <section class="farm-layout">
      <div class="planner-shell">
        ${renderPlannerToolbar()}
        <div class="play-stage">
          <canvas id="farmCanvas" width="1280" height="1280" aria-label="团队像素农场"></canvas>
          ${
            state.editor.placement
              ? `<div class="placement-hint">正在放置：${escapeHtml(findCatalogItem(state.editor.placement)?.label || "对象")}，点击地图确认，Esc 取消</div>`
              : ""
          }
          ${renderModulePopup()}
          ${renderNpcPopup()}
        </div>
        <aside class="side-panel farm-dashboard">
          <section class="dashboard-card dashboard-card-id">
            <h3>农场门牌</h3>
            <div class="copy-code">
              <span>邀请码</span>
              <code>${team.code}</code>
            </div>
          </section>

          <section class="dashboard-card dashboard-card-ledger">
            <h3>农场账本</h3>
            ${renderTodoFactoryCompact(todoFactory)}
          </section>

          <section class="dashboard-card dashboard-card-weather">
            <h3>今日天气牌</h3>
            <div class="metric-grid">
              <div class="metric"><span>天气</span><strong>${weatherLabel(team.weather)}</strong></div>
              <div class="metric"><span>状态</span><strong>${team.mood}</strong></div>
              <div class="metric"><span>收获</span><strong>${team.harvests}</strong></div>
              <div class="metric"><span>成员</span><strong>${team.memberCount}</strong></div>
              <div class="metric"><span>待办厂</span><strong>${backlogCount}</strong></div>
              <div class="metric"><span>晾晒</span><strong>${doneCount}</strong></div>
            </div>
          </section>

          <section class="dashboard-card dashboard-card-actions">
            <h3>工具背包</h3>
            <div class="action-grid">
              <button id="syncCalendar" ${syncingCalendar ? "disabled" : ""}>${
                syncingCalendar ? "同步中" : "同步计划"
              }</button>
              <button id="waterFarm" class="secondary" ${
                state.busyAction ? "disabled" : ""
              }>浇水</button>
              <button id="cheerFarm" class="secondary" ${
                state.busyAction ? "disabled" : ""
              }>鼓劲</button>
              <button id="harvestFarm" class="quiet" ${
                state.busyAction ? "disabled" : ""
              }>收获</button>
              <button id="dailySweep" class="quiet" ${
                state.busyAction ? "disabled" : ""
              }>每日清算</button>
              <button id="tidyLayout" class="quiet" ${
                state.busyAction ? "disabled" : ""
              }>整理布局</button>
            </div>
          </section>

          <section class="dashboard-card dashboard-card-layers">
            <h3>飞书作物层</h3>
            ${renderSignalLayers(signal)}
          </section>

          <section class="dashboard-card dashboard-card-members">
            <h3>农场成员</h3>
            <ul class="member-list">
              ${members.map((member) => `<li>${escapeHtml(member.name)}</li>`).join("")}
            </ul>
          </section>

          <section class="dashboard-card dashboard-card-schedule">
            <h3>今日日程木牌</h3>
            <ul class="event-list">
              ${
                signal
                  ? `<li>日程 ${signal.eventCount} 个，忙碌 ${signal.busyMinutes} 分钟</li>
                     <li>专注块 ${signal.focusBlocks} 个，成长 +${signal.growthBonus}</li>
                     ${signal.syncedAt ? `<li>最后同步 ${escapeHtml(formatSyncTime(signal.syncedAt))}</li>` : ""}`
                  : `<li>还没有同步今天的日历</li>`
              }
              ${
                signal && events.length === 0
                  ? `<li class="calendar-event"><strong>今天没有具体日程</strong><span>农场会按空闲节奏计算阳光。</span></li>`
                  : events.map(renderCalendarEvent).join("")
              }
            </ul>
          </section>
        </aside>
        ${renderPalette()}
        ${renderQuickMenu()}
      </div>
    </section>
  `;
}

function renderModulePopup() {
  const object = findFarmObject(state.editor.selectedObjectId);
  const item = findCatalogItem(state.editor.selectedModule);
  if (!item) return "";
  const detail = moduleDetail(item, state.farm, object);
  const title = object?.title || item.label;
  const subtitle = object
    ? `${object.module || item.module} · 已种植`
    : `${item.module} · ${item.status}`;

  return `
    <section class="module-popup" aria-label="${escapeAttribute(title)}详情">
      <button class="module-popup-close" data-editor-action="closeModule" title="关闭">X</button>
      <div class="module-popup-head">
        <img src="${escapeAttribute(`${plannerAssetRoot}/tiles/${item.sprite}.png`)}" alt="" />
        <div>
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(subtitle)}</span>
        </div>
      </div>
      <p>${escapeHtml(detail.body)}</p>
      ${detail.history ? renderHistoryControl(detail.history) : ""}
      ${detail.database ? renderTodoFactoryDatabase(detail.database) : ""}
      ${
        detail.records?.length
          ? renderModuleRecordList(detail.records)
          : detail.items?.length
          ? `<ul class="module-content-list">${detail.items
              .map(
                (entry) => `
                  <li>
                    <strong>${escapeHtml(entry.title)}</strong>
                    ${entry.meta ? `<span>${escapeHtml(entry.meta)}</span>` : ""}
                  </li>
                `
              )
              .join("")}</ul>`
          : ""
      }
      <div class="module-stats">
        ${detail.stats
          .map(
            (stat) => `
              <div>
                <span>${escapeHtml(stat.label)}</span>
                <strong>${escapeHtml(stat.value)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
      ${detail.binding ? renderBindingForm(detail.binding, object) : ""}
      <div class="module-popup-actions">
        ${detail.actions
          .map(
            (action) => `
              ${
                action.url
                  ? `<button class="module-action-link secondary" data-open-url="${escapeAttribute(action.url)}" type="button">
                      ${escapeHtml(action.label)}
                    </button>`
                  : `<button class="${action.kind === "quiet" ? "quiet" : "secondary"}" data-module-action="${escapeAttribute(action.id)}" ${
                      object ? `data-object-action-id="${escapeAttribute(object.id)}"` : ""
                    }>
                      ${escapeHtml(action.label)}
                    </button>`
              }
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderNpcPopup() {
  if (!state.editor.selectedNpc) return "";
  const signal = state.farm?.team?.lastCalendarSignal;
  const backlogCount = (state.farm?.backlogRecords || []).filter((record) => record.status !== "done").length;
  const doneCount = (state.farm?.backlogRecords || []).filter((record) => record.status === "done").length;
  const phrase = state.npc.phrase || pickAiNpcLine(state.farm);

  return `
    <section class="module-popup npc-popup" aria-label="智能伙伴详情">
      <button class="module-popup-close" data-editor-action="closeModule" title="关闭">X</button>
      <div class="module-popup-head">
        <div class="npc-avatar" aria-hidden="true"></div>
        <div>
          <strong>农场智能伙伴</strong>
          <span>飞书 Aily · 农场向导</span>
        </div>
      </div>
      <p>${escapeHtml(phrase)}</p>
      <div class="module-stats">
        <div><span>今日日程</span><strong>${escapeHtml(signal ? `${signal.eventCount} 个` : "未同步")}</strong></div>
        <div><span>待办厂</span><strong>${escapeHtml(`${backlogCount} 条`)}</strong></div>
        <div><span>专注块</span><strong>${escapeHtml(signal ? `${signal.focusBlocks} 个` : "未同步")}</strong></div>
        <div><span>已晾晒</span><strong>${escapeHtml(`${doneCount} 条`)}</strong></div>
      </div>
      <div class="module-popup-actions">
        <button class="secondary" data-npc-action="openFeishuAily" type="button">打开飞书 Aily</button>
        <button class="secondary" data-npc-action="openWebAily" type="button">打开网页 Aily</button>
        <button class="quiet" data-npc-action="copyPrompt" type="button">复制农场上下文</button>
        <button class="quiet" data-npc-action="refreshLine" type="button">换一句话</button>
      </div>
    </section>
  `;
}

function renderTodoFactoryCompact(factory) {
  const title = factory.title || "团队农场待办底库";
  return `
    <div class="factory-card">
      <div class="factory-card-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(factory.storage || "本地 JSON 模拟多维表格")}</span>
      </div>
      <div class="factory-mini-stats">
        <span><strong>${escapeHtml(factory.rowCount ?? 0)}</strong>记录</span>
        <span><strong>${escapeHtml(factory.backlogCount ?? 0)}</strong>待办</span>
        <span><strong>${escapeHtml(factory.doneCount ?? 0)}</strong>成果</span>
      </div>
      ${renderFactorySyncStatus(factory)}
      <div class="factory-card-actions">
        ${
          factory.url
            ? `<button class="secondary" data-open-url="${escapeAttribute(factory.url)}" type="button">打开底库</button>
               <button class="quiet" data-module-action="syncTodoFactory" type="button">同步底库</button>
               <button class="quiet" data-module-action="openRecordBarn" type="button">今日谷仓</button>`
            : renderTodoFactoryForm(factory, "compact")
        }
      </div>
    </div>
  `;
}

function renderTodoFactoryDatabase(factory) {
  const fields = factory.fields || [];
  const sampleRows = todoFactoryRows().slice(0, 6);
  return `
    <section class="factory-database" aria-label="多维表格底库">
      <div class="factory-database-head">
        <div>
          <strong>${escapeHtml(factory.title || "团队农场待办底库")}</strong>
          <span>${escapeHtml(factory.storage || "本地 JSON 模拟多维表格")}</span>
        </div>
        ${
          factory.url
            ? `<div class="factory-database-actions">
                <button class="mini-action" data-open-url="${escapeAttribute(factory.url)}" type="button">打开飞书表格</button>
                <button class="mini-action quiet" data-module-action="syncTodoFactory" type="button">同步底库</button>
              </div>`
            : ""
        }
      </div>
      ${renderFactorySyncStatus(factory)}
      <div class="factory-schema">
        ${fields.map((field) => `<span>${escapeHtml(field.label)}<em>${escapeHtml(field.type)}</em></span>`).join("")}
      </div>
      <div class="factory-table">
        <div class="factory-table-row factory-table-head">
          <span>标题</span>
          <span>模块</span>
          <span>状态</span>
        </div>
        ${
          sampleRows.length
            ? sampleRows.map((row) => `
              <div class="factory-table-row">
                <span>${escapeHtml(row.title)}</span>
                <span>${escapeHtml(row.module || "飞书")}</span>
                <span>${escapeHtml(statusLabel(row.status))}</span>
              </div>
            `).join("")
            : `<div class="factory-empty">还没有沉淀记录。把事项移入待办厂后，这里会出现第一行。</div>`
        }
      </div>
      ${factory.url ? "" : renderTodoFactoryForm(factory)}
    </section>
  `;
}

function renderFactorySyncStatus(factory) {
  if (!factory?.url) return "";
  const sync = factory.lastSyncResult;
  if (!sync) {
    return `<div class="factory-sync-status">待同步：点击同步底库后会自动建字段并写入农场记录。</div>`;
  }
  if (sync.ok) {
    const time = formatSyncTime(sync.syncedAt || factory.lastSyncedAt);
    const syncedCount = Number(sync.rowCount ?? 0);
    const localCount = Number(factory.rowCount ?? syncedCount);
    if (localCount !== syncedCount) {
      return `<div class="factory-sync-status warn">本地 ${escapeHtml(localCount)} 条，底库上次同步 ${escapeHtml(
        syncedCount
      )} 条${time ? ` · ${escapeHtml(time)}` : ""}。点击同步底库后才会写入飞书。</div>`;
    }
    return `<div class="factory-sync-status ok">已同步 ${escapeHtml(syncedCount)} 条记录${time ? ` · ${escapeHtml(time)}` : ""}</div>`;
  }
  const message = sync.message || "上次同步失败，请重新尝试。";
  const reauth = needsFactoryReauth(sync);
  return `<div class="factory-sync-status warn">
    <span>${escapeHtml(message)}</span>
    ${reauth ? `<a class="factory-reauth-link" href="/api/auth/feishu/start">重新授权飞书</a>` : ""}
  </div>`;
}

function needsFactoryReauth(sync) {
  const message = String(sync?.message || "");
  return (
    sync?.error === "reauthorization_required" ||
    sync?.code === 99991679 ||
    message.includes("request user re-authorization") ||
    message.includes("应用未获取所需的用户授权") ||
    message.includes("重新登录飞书")
  );
}

function renderTodoFactoryForm(factory, variant = "") {
  return `
    <form class="factory-bind-form ${variant ? `factory-bind-form-${escapeAttribute(variant)}` : ""}" data-factory-bind-form>
      <label>绑定真实飞书多维表格链接</label>
      <input
        name="url"
        value="${escapeAttribute(factory.url || "")}"
        placeholder="粘贴飞书多维表格链接，例如 https://...larkoffice.com/base/..."
        autocomplete="off"
      />
      <input
        name="title"
        value="${escapeAttribute(factory.title || "团队农场待办底库")}"
        maxlength="60"
        autocomplete="off"
      />
      <button type="submit">绑定多维表格底库</button>
    </form>
  `;
}

function renderHistoryControl(history) {
  return `
    <form class="history-filter" data-history-date-form>
      <div>
        <strong>${escapeHtml(history.title || "日期查询")}</strong>
        <span>${escapeHtml(history.summary || "默认展示今天，也可以回看历史记录。")}</span>
      </div>
      <input type="date" name="recordDate" value="${escapeAttribute(history.date || localDateInput(new Date()))}" />
      <button class="quiet" type="button" data-history-shift="-1">前一天</button>
      <button class="quiet" type="button" data-history-shift="1">后一天</button>
      <button class="secondary" type="submit">查看</button>
      ${history.openUrl ? `<button class="secondary" type="button" data-open-url="${escapeAttribute(history.openUrl)}">打开底库查询</button>` : ""}
    </form>
  `;
}

function renderModuleRecordList(records) {
  return `
    <ul class="module-content-list module-record-list">
      ${records.map(renderModuleRecord).join("")}
    </ul>
  `;
}

function renderModuleRecord(record) {
  const actions = [
    record.url
      ? `<button class="mini-action" data-open-url="${escapeAttribute(record.url)}" type="button">打开</button>`
      : "",
    record.canPlant
      ? `<button class="mini-action" data-record-action="plant" data-record-id="${escapeAttribute(record.id)}" type="button">种到农场</button>`
      : "",
    record.canBacklog
      ? `<button class="mini-action quiet" data-record-action="backlog" data-record-id="${escapeAttribute(record.id)}" type="button">进待办厂</button>`
      : ""
  ]
    .filter(Boolean)
    .join("");

  return `
    <li>
      <div>
        <strong>${escapeHtml(record.title)}</strong>
        ${record.meta ? `<span>${escapeHtml(record.meta)}</span>` : ""}
      </div>
      <em>${escapeHtml(record.status || "记录")}</em>
      ${actions ? `<div class="record-actions">${actions}</div>` : ""}
    </li>
  `;
}

function renderBindingForm(binding, object) {
  if (!object) return "";
  return `
    <form class="bind-resource-form" id="bindResourceForm" data-object-id="${escapeAttribute(object.id)}">
      <label for="bindResourceUrl">${escapeHtml(binding.label)}</label>
      <input
        id="bindResourceUrl"
        name="url"
        value="${escapeAttribute(binding.url || "")}"
        placeholder="${escapeAttribute(binding.placeholder || "粘贴这个对象对应的真实飞书链接")}"
        autocomplete="off"
      />
      <input
        name="title"
        value="${escapeAttribute(object.title || "")}"
        placeholder="${escapeAttribute(binding.titlePlaceholder || "给这个农场物件起个名字")}"
        maxlength="28"
        autocomplete="off"
      />
      <button type="submit">${escapeHtml(binding.buttonLabel || "绑定真实内容")}</button>
    </form>
  `;
}

function renderPlannerToolbar() {
  const tabs = Object.entries(itemCatalog)
    .map(
      ([key, group]) => `
        <button class="planner-tab ${state.editor.activeTab === key ? "active" : ""}" data-tab="${key}" title="${escapeAttribute(group.summary)}">
          <span class="tool-mark">${escapeHtml(group.mark || group.label.slice(0, 1))}</span>
          ${group.label}
        </button>
      `
    )
    .join("");

  return `
    <nav class="planner-toolbar" aria-label="农场编辑工具">
      <div class="tool-group">${tabs}</div>
      <div class="tool-group icon-tools">
        <button class="icon-tool text-tool" data-editor-action="select" title="取消当前放置，回到选择模式">选择</button>
        <button class="icon-tool text-tool" data-editor-action="erase" title="清除最近放置的农场物件">清除最近</button>
        <button class="icon-tool text-tool" data-editor-action="undo" title="撤销上一步放置">撤销</button>
        <button class="icon-tool text-tool sync-tool" id="toolbarSyncCalendar" title="同步今天的真实飞书日程">同步计划</button>
      </div>
    </nav>
  `;
}

function renderPalette() {
  if (!state.editor.activeTab) return "";
  const group = itemCatalog[state.editor.activeTab];
  if (!group) return "";
  const query = state.editor.search.trim().toLowerCase();
  const items = group.items.filter((item) => {
    const text = `${item.id} ${item.label} ${item.hint}`.toLowerCase();
    return !query || text.includes(query);
  });

  return `
    <section class="item-palette" aria-label="${escapeAttribute(group.label)}面板">
      <div class="palette-title">
        <strong>${escapeHtml(group.label)}</strong>
        <span>${escapeHtml(group.summary)}</span>
      </div>
      <div class="palette-search">
        <span>Q</span>
        <input id="paletteSearch" value="${escapeAttribute(state.editor.search)}" placeholder="搜索${escapeAttribute(group.label)}或飞书模块" />
        <button class="icon-tool close-palette" data-editor-action="closePalette" title="关闭">X</button>
      </div>
      <div class="palette-items">
        ${
          items.length
            ? items.map(renderPaletteItem).join("")
            : `<div class="empty-palette">没有找到相关对象</div>`
        }
      </div>
    </section>
  `;
}

function renderPaletteItem(item) {
  const sprite = item.sprite ? `${plannerAssetRoot}/tiles/${item.sprite}.png` : "";
  const disabled = item.placeable === false;
  return `
    <button class="palette-item ${disabled ? "disabled" : ""}" ${
      disabled ? "disabled" : `data-place-item="${item.id}"`
    } title="${escapeAttribute(disabled ? "这是系统区域，直接点击地图上的默认建筑使用" : item.hint)}">
      ${
        sprite
          ? `<img class="item-sprite-img" src="${escapeAttribute(sprite)}" alt="" />`
          : `<span class="item-sprite ${item.id}"></span>`
      }
      <strong>${escapeHtml(item.label)}</strong>
      <small>${escapeHtml(item.hint)}</small>
      <span class="item-meta">
        <em>${escapeHtml(item.module || "飞书")}</em>
        <em>${escapeHtml(disabled ? "地图默认" : item.status || "可用")}</em>
      </span>
    </button>
  `;
}

function renderSignalLayers(signal) {
  return `
    <div class="signal-layer-list">
      ${Object.values(itemCatalog)
        .map((group) => {
          const modules = [...new Set(group.items.map((item) => item.module).filter(Boolean))].slice(0, 4);
          const readyCount = group.items.filter((item) => ["已接入", "已授权", "日历联动"].includes(item.status)).length;
          const status = group.label === "计划田" && signal ? "今日已同步" : `${readyCount}/${group.items.length} 可用`;
          return `
            <div class="signal-layer">
              <span class="signal-mark">${escapeHtml(group.mark || group.label.slice(0, 1))}</span>
              <div>
                <strong>${escapeHtml(group.label)}</strong>
                <small>${escapeHtml(modules.join(" / "))}</small>
              </div>
              <em>${escapeHtml(status)}</em>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function moduleDetail(item, farm, object) {
  const signal = farm?.team?.lastCalendarSignal;
  const eventCount = signal ? String(signal.eventCount) : "未同步";
  const busyMinutes = signal ? `${signal.busyMinutes} 分钟` : "未同步";
  const focusBlocks = signal ? `${signal.focusBlocks} 个` : "未同步";
  const resource = object?.resource || resourceForItem(item);
  const isBoundResource = Boolean(object && resource?.url && (resource.bound || resource.source === "bound"));
  const binding = object && !isBoundResource
    ? {
        label: "绑定真实飞书入口",
        buttonLabel: "绑定到这个物件"
      }
    : null;
  const objectActions = [
    ...(isBoundResource ? [{ id: "openFeishu", label: resource.actionLabel || "打开绑定内容", url: resource.url }] : []),
    ...(object
      ? [
          { id: "completeObject", label: "完成并晾晒" },
          { id: "archiveObject", label: "移入待办厂", kind: "quiet" },
          { id: "removeObject", label: "从农场移除", kind: "quiet" }
        ]
      : []),
    { id: "explain", label: "查看玩法", kind: "quiet" }
  ];
  const moduleActions = [
    { id: "dailySweep", label: "每日清算" },
    { id: "openFactory", label: "打开待办厂", kind: "quiet" },
    { id: "explain", label: "查看玩法", kind: "quiet" }
  ];
  const realEvents =
    signal?.events?.slice(0, 5).map((event) => ({
      title: event.title || "未命名日程",
      meta: [event.timeText, event.location].filter(Boolean).join(" · ")
    })) || [];
  const moduleRecords = moduleRecordsFor(item.id);
  const todoFactory = farm?.todoFactory || {};
  const database = ["todoFactory", "bitableWarehouse"].includes(item.id) ? todoFactory : null;
  const backlogCount = (farm?.backlogRecords || []).filter((record) => record.status !== "done").length;
  const doneCount = (farm?.backlogRecords || []).filter((record) => record.status === "done").length;
  const recordDate = state.editor.recordDate || localDateInput(new Date());
  const recordDateLabel = recordDate === localDateInput(new Date()) ? "今日" : recordDate;
  const historyRows = todoFactoryRowsForDate(recordDate);
  const historyRecords = historyRows.slice(0, 8).map(rowToHistoryRecord);

  if (object) {
    return plantedObjectDetail(item, farm, object, {
      resource,
      isBoundResource,
      realEvents,
      moduleRecords,
      todoFactory,
      eventCount,
      busyMinutes,
      focusBlocks,
      backlogCount,
      doneCount
    });
  }

  const details = {
    scheduleSign: {
      body: "把今天的日程数量、时间和地点转成农场天气。日程越密，田地越容易进入会议雨状态。",
      records: moduleRecords,
      stats: [
        { label: "日程", value: eventCount },
        { label: "忙碌", value: busyMinutes }
      ],
      actions: [{ id: "syncCalendar", label: "同步今日日程" }, ...moduleActions]
    },
    focusDew: {
      body: "根据工作日里的空档和连续专注块生成露水，露水会提高作物成长值。",
      records: moduleRecords,
      stats: [
        { label: "专注块", value: focusBlocks },
        { label: "成长加成", value: signal ? `+${signal.growthBonus}` : "未同步" }
      ],
      actions: [{ id: "syncCalendar", label: "刷新专注露水" }, ...moduleActions]
    },
    meetingCanopy: {
      body: "会议多的时候雨棚会亮起，表示团队今天沟通负载较高。",
      records: moduleRecords,
      stats: [
        { label: "会议天气", value: farm?.team?.weather ? weatherLabel(farm.team.weather) : "未知" },
        { label: "忙碌", value: busyMinutes }
      ],
      actions: [{ id: "syncCalendar", label: "同步会议节奏" }, ...moduleActions]
    },
    taskSeed: {
      body: "任务种子现在是任务模块入口。列表里的事项可以种到农场；没有完成或过夜的任务会被清算进未完成待办厂。",
      records: moduleRecords,
      stats: [
        { label: "待办厂", value: `${backlogCount} 条` },
        { label: "农场实例", value: `${plantedCountFor(item.id)} 个` }
      ],
      actions: moduleActions
    },
    okrMilestone: {
      body: "OKR 作为季节目标，决定团队农场这一轮主要长什么、收获什么。",
      records: moduleRecords,
      stats: [
        { label: "权限", value: "已授权" },
        { label: "用途", value: "目标季节" }
      ],
      actions: moduleActions
    },
    approvalStamp: {
      body: "审批流代表决策推进。审批通过后会给农场留下印章，帮助团队看到关键卡点。",
      records: moduleRecords,
      stats: [
        { label: "权限", value: "已授权" },
        { label: "用途", value: "决策印记" }
      ],
      actions: moduleActions
    },
    docCottage: {
      body: "云文档小屋是创作模块入口。你可以从这里把一份文档事项种到农场，完成后沉淀到成果晾晒绳。",
      records: moduleRecords,
      stats: [
        { label: "农场实例", value: `${plantedCountFor(item.id)} 个` },
        { label: "沉淀成果", value: `${doneCount} 条` }
      ],
      actions: moduleActions
    },
    knowledgeGreenhouse: {
      body: "知识库像温室，承载稳定可复用的团队知识。节点越完整，温室越旺。",
      records: moduleRecords,
      stats: [
        { label: "权限", value: "已授权" },
        { label: "类型", value: "知识资产" }
      ],
      actions: moduleActions
    },
    commentBell: {
      body: "评论风铃承接云文档里的评论、补充和被采纳反馈。每条评论都可以变成一枚待处理的小铃铛。",
      records: moduleRecords,
      stats: [
        { label: "农场实例", value: `${plantedCountFor(item.id)} 个` },
        { label: "待办厂", value: `${backlogCount} 条` }
      ],
      actions: moduleActions
    },
    minutesBook: {
      body: "纪要花册用来收纳会议后的纪要、复盘和行动项。会议结束不代表事情结束，花册负责把它留下来。",
      records: moduleRecords,
      stats: [
        { label: "模块", value: "会议纪要" },
        { label: "沉淀成果", value: `${doneCount} 条` }
      ],
      actions: moduleActions
    },
    inspirationVine: {
      body: "灵感藤蔓记录持续编辑、补充想法和文档动态。创作过程不是一次性的，它会沿着藤蔓继续生长。",
      records: moduleRecords,
      stats: [
        { label: "模块", value: "文档动态" },
        { label: "农场实例", value: `${plantedCountFor(item.id)} 个` }
      ],
      actions: moduleActions
    },
    bitableWarehouse: {
      body: "多维表格仓库现在承载游戏数据库视图：农场实例、未完成待办、完成成果都会汇总到这里。",
      database,
      records: moduleRecords,
      stats: [
        { label: "待办记录", value: `${backlogCount} 条` },
        { label: "底库状态", value: todoFactory.bound ? "已绑定" : "待绑定" }
      ],
      actions: [
        ...(todoFactory.url ? [{ id: "openTodoFactory", label: "打开多维表格底库", url: todoFactory.url }] : []),
        ...(todoFactory.url ? [{ id: "syncTodoFactory", label: "同步底库", kind: "quiet" }] : []),
        ...moduleActions
      ]
    },
    kanbanRidge: {
      body: "看板田垄负责把事项按状态排开。它适合承载任务流转、文档进度和跨模块处理队列。",
      records: moduleRecords,
      stats: [
        { label: "模块", value: "多维表格视图" },
        { label: "待办厂", value: `${backlogCount} 条` }
      ],
      actions: moduleActions
    },
    fieldChest: {
      body: "字段宝箱决定待办厂里的记录怎么被描述：标题、模块、状态、优先级、链接都会从这里长出来。",
      records: moduleRecords,
      stats: [
        { label: "字段", value: `${todoFactory.fields?.length || 0} 个` },
        { label: "底库", value: todoFactory.bound ? "已绑定" : "待绑定" }
      ],
      actions: moduleActions
    },
    processCanal: {
      body: "流程水渠把日程、任务、文档和成果连接起来。哪里堵住了，未完成事项就会顺着水渠流进待办厂。",
      records: moduleRecords,
      stats: [
        { label: "模块", value: "跨模块流程" },
        { label: "每日清算", value: "已启用" }
      ],
      actions: moduleActions
    },
    recordBarn: {
      body: "记录谷仓默认只收纳所选日期的结构化结果，不把昨天和今天混在同一个谷仓里。要回看某天做了什么，可以切换日期，也可以打开底库按记录日期查询。",
      history: {
        title: "谷仓日期",
        summary: `${recordDateLabel}记录 ${historyRows.length} 条`,
        date: recordDate,
        openUrl: todoFactory.url || ""
      },
      records: historyRecords,
      stats: [
        { label: "所选日期", value: recordDateLabel },
        { label: "当日记录", value: `${historyRows.length} 条` },
        { label: "底库", value: todoFactory.bound ? "可查询" : "待绑定" },
        { label: "全部记录", value: `${todoFactory.rowCount || 0} 条` }
      ],
      actions: [
        ...(todoFactory.url ? [{ id: "openTodoFactory", label: "打开底库", url: todoFactory.url }] : []),
        ...(todoFactory.url ? [{ id: "syncTodoFactory", label: "同步底库", kind: "quiet" }] : []),
        { id: "openFactory", label: "查看待办厂", kind: "quiet" },
        { id: "explain", label: "查看玩法", kind: "quiet" }
      ]
    },
    chatFirefly: {
      body: "群聊萤火虫代表团队即时互动。回复、表情、@ 和求助会变成广场上的光点。",
      records: moduleRecords,
      stats: [
        { label: "权限", value: "已授权" },
        { label: "类型", value: "沟通能量" }
      ],
      actions: moduleActions
    },
    roundTable: {
      body: "圆桌会议把真实日程里的会议放到团队广场。同步日历后，今天的会议会同时出现在日程木牌、会议雨棚和圆桌会议中。",
      records: moduleRecords,
      stats: [
        { label: "会议", value: eventCount },
        { label: "忙碌", value: busyMinutes }
      ],
      actions: [{ id: "syncCalendar", label: "同步会议日程" }, ...moduleActions]
    },
    helpBridge: {
      body: "协作小桥承接需要别人帮忙、补充资料或跨团队响应的事项。把它种到广场上，完成后会成为一次可见的互助。",
      records: moduleRecords,
      stats: [
        { label: "模块", value: "互助" },
        { label: "农场实例", value: `${plantedCountFor(item.id)} 个` }
      ],
      actions: moduleActions
    },
    showcaseLine: {
      body: "成果晾晒绳展示已经完成的农场事项。任务、文档、会议纪要等完成后会从农场移到这里，变成可回看的团队成果。",
      records: moduleRecords,
      stats: [
        { label: "成果记录", value: `${doneCount} 条` },
        { label: "收获", value: `${farm?.team?.harvests || 0}` }
      ],
      actions: [{ id: "openFactory", label: "查看待办厂" }, { id: "explain", label: "查看玩法", kind: "quiet" }]
    },
    aiPartnerCabin: {
      body: "智能伙伴小屋会作为农场 NPC，解释今天为什么下雨、哪些任务在发芽。",
      records: moduleRecords,
      stats: [
        { label: "接入", value: "可扩展" },
        { label: "类型", value: "AI 叙事" }
      ],
      actions: moduleActions
    },
    todoFactory: {
      body: "这里是未完成待办厂。它按多维表格的字段结构保存过夜、清算或主动移入的事项，农场面积不够时就让内容先在这里排队。",
      database,
      records: moduleRecords,
      stats: [
        { label: "待办记录", value: `${backlogCount} 条` },
        { label: "底库状态", value: todoFactory.bound ? "已绑定" : "待绑定" }
      ],
      actions: [
        ...(todoFactory.url ? [{ id: "openTodoFactory", label: "打开多维表格底库", url: todoFactory.url }] : []),
        ...(todoFactory.url ? [{ id: "syncTodoFactory", label: "同步底库", kind: "quiet" }] : []),
        { id: "dailySweep", label: "每日清算" },
        { id: "explain", label: "查看玩法", kind: "quiet" }
      ]
    }
  };

  return (
    details[item.id] || {
      body: item.hint,
      records: moduleRecords,
      stats: [
        { label: "模块", value: item.module || "飞书" },
        { label: "状态", value: item.status || "可用" }
      ],
      actions: moduleActions
    }
  );
}

function plantedObjectDetail(item, farm, object, context) {
  const config = plantedObjectConfig(item, farm, object, context);
  const resource = context.resource || resourceForItem(item);
  const isBoundResource = context.isBoundResource;
  const binding = config.binding && !isBoundResource ? config.binding : null;
  const actions = [];

  if (isBoundResource && config.openWhenBound !== false && resource.url) {
    actions.push({
      id: "openFeishu",
      label: config.openLabel || resource.actionLabel || "打开绑定内容",
      url: resource.url
    });
  }

  actions.push(...(config.actions || []));

  if (config.allowComplete !== false) {
    actions.push({ id: "completeObject", label: config.completeLabel || "完成并晾晒" });
  }

  if (config.allowArchive !== false) {
    actions.push({
      id: "archiveObject",
      label: config.archiveLabel || "移入待办厂",
      kind: "quiet"
    });
  }

  actions.push({ id: "removeObject", label: "从农场移除", kind: "quiet" });
  actions.push({ id: "explain", label: "查看玩法", kind: "quiet" });

  return {
    body: config.body,
    items: config.items || [],
    records: config.records || [],
    database: config.database ? context.todoFactory : null,
    stats: config.stats,
    binding,
    actions
  };
}

function plantedObjectConfig(item, farm, object, context) {
  const boundText = context.isBoundResource ? "已绑定" : "不需要绑定";
  const linkState = context.isBoundResource ? "已绑定" : "待绑定";
  const fieldsCount = context.todoFactory?.fields?.length || 0;
  const rowCount = context.todoFactory?.rowCount || 0;
  const activeCount = context.todoFactory?.activeCount || 0;
  const factoryBound = context.todoFactory?.bound ? "已绑定" : "待绑定";
  const baseStats = [
    { label: "对象", value: object.title || item.label },
    { label: "模块", value: item.module || "飞书" }
  ];
  const linkedStats = [
    ...baseStats,
    { label: "绑定状态", value: linkState }
  ];
  const linkBinding = (label, placeholder, buttonLabel = "绑定真实入口") => ({
    label,
    placeholder,
    buttonLabel,
    titlePlaceholder: `给${item.label}起个清楚的名字`
  });
  const openFactoryActions = [
    ...(context.todoFactory?.url
      ? [{ id: "openTodoFactory", label: "打开底库", url: context.todoFactory.url }]
      : []),
    ...(context.todoFactory?.url ? [{ id: "syncTodoFactory", label: "同步底库", kind: "quiet" }] : []),
    { id: "openFactory", label: "查看待办厂", kind: "quiet" }
  ];

  const configs = {
    scheduleSign: {
      body: `${object.title} 是今天的计划入口，不是普通链接卡片。它负责读取日历信号，决定农场天气和计划田状态。`,
      items: context.realEvents,
      stats: [
        { label: "今日日程", value: context.eventCount },
        { label: "忙碌", value: context.busyMinutes },
        { label: "绑定状态", value: boundText }
      ],
      binding: false,
      actions: [{ id: "syncCalendar", label: "同步真实日程" }],
      completeLabel: "计划已处理",
      archiveLabel: "今日先不处理"
    },
    focusDew: {
      body: `${object.title} 代表一段专注空档。它的价值来自日历里的空闲时间，不需要额外绑定表格链接。`,
      stats: [
        { label: "专注块", value: context.focusBlocks },
        { label: "成长", value: farm?.team?.lastCalendarSignal ? `+${farm.team.lastCalendarSignal.growthBonus}` : "未同步" },
        { label: "绑定状态", value: "不需要绑定" }
      ],
      binding: false,
      actions: [{ id: "syncCalendar", label: "刷新专注露珠" }],
      completeLabel: "专注已完成",
      archiveLabel: "稍后专注"
    },
    meetingCanopy: {
      body: `${object.title} 是一次会议负载或会议跟进。它可以绑定具体会议、纪要或会议文档，而不是泛泛绑定任意内容。`,
      items: context.realEvents,
      stats: [
        { label: "会议天气", value: weatherLabel(farm?.team?.weather || "sunny") },
        { label: "忙碌", value: context.busyMinutes },
        { label: "绑定状态", value: linkState }
      ],
      binding: linkBinding("绑定会议/纪要入口", "粘贴飞书日程、会议、妙记或纪要链接", "绑定会议入口"),
      actions: [{ id: "syncCalendar", label: "同步会议节奏" }],
      completeLabel: "会议已跟进",
      archiveLabel: "会议待跟进"
    },
    taskSeed: {
      body: `${object.title} 是一个任务种子。它应该绑定飞书任务或任务清单中的具体事项，完成后才会进入成果晾晒绳。`,
      stats: linkedStats,
      binding: linkBinding("绑定飞书任务链接", "粘贴飞书任务、任务清单或任务详情链接", "绑定任务"),
      completeLabel: "任务完成并晾晒",
      archiveLabel: "转入待办厂"
    },
    okrMilestone: {
      body: `${object.title} 是目标进展检查点。它应该对应一个 OKR 目标、进展或里程碑，而不是普通资料链接。`,
      stats: linkedStats,
      binding: linkBinding("绑定 OKR 目标/进展", "粘贴飞书 OKR、目标详情或进展记录链接", "绑定 OKR"),
      completeLabel: "进展已达成",
      archiveLabel: "纳入目标待办"
    },
    approvalStamp: {
      body: `${object.title} 是决策印章。它应该对应一个审批单、审批流程或待决策事项。`,
      stats: linkedStats,
      binding: linkBinding("绑定审批单链接", "粘贴飞书审批单、审批定义或决策记录链接", "绑定审批"),
      completeLabel: "审批已通过",
      archiveLabel: "等待审批"
    },
    docCottage: {
      body: `${object.title} 是一份正在产出的云文档。绑定具体文档后，它才是可进入、可完成、可晾晒的团队资产。`,
      stats: linkedStats,
      binding: linkBinding("绑定云文档链接", "粘贴飞书云文档、知识文档或文档目录链接", "绑定云文档"),
      completeLabel: "文档完成并晾晒",
      archiveLabel: "文档待完善"
    },
    knowledgeGreenhouse: {
      body: `${object.title} 是知识库维护任务。它应该绑定知识库节点、Wiki 或沉淀页面。`,
      stats: linkedStats,
      binding: linkBinding("绑定知识库节点", "粘贴飞书 Wiki、知识库节点或沉淀文档链接", "绑定知识库"),
      completeLabel: "知识已沉淀",
      archiveLabel: "知识待整理"
    },
    commentBell: {
      body: `${object.title} 是待回应评论。它应该指向评论所在文档或协作上下文，完成意味着评论已回复或已采纳。`,
      stats: linkedStats,
      binding: linkBinding("绑定评论所在位置", "粘贴带评论的云文档、评论通知或协作页面链接", "绑定评论上下文"),
      completeLabel: "评论已回复",
      archiveLabel: "评论待回应"
    },
    minutesBook: {
      body: `${object.title} 是会议后的纪要整理。它应该绑定妙记、纪要文档或复盘文档。`,
      stats: linkedStats,
      binding: linkBinding("绑定会议纪要/妙记", "粘贴飞书妙记、会议纪要或复盘文档链接", "绑定纪要"),
      completeLabel: "纪要已归档",
      archiveLabel: "纪要待整理"
    },
    inspirationVine: {
      body: `${object.title} 是创作中的灵感线索。它适合绑定草稿文档、白板、需求池或灵感记录。`,
      stats: linkedStats,
      binding: linkBinding("绑定灵感来源", "粘贴草稿文档、白板、需求池或灵感记录链接", "绑定灵感"),
      completeLabel: "灵感已沉淀",
      archiveLabel: "灵感待处理"
    },
    bitableWarehouse: {
      body: `${object.title} 是系统仓库，用来观察游戏底库，不应该作为普通物料绑定链接。真正的表格入口在未完成待办厂中统一绑定。`,
      database: true,
      stats: [
        { label: "总记录", value: `${rowCount} 条` },
        { label: "底库", value: factoryBound },
        { label: "绑定状态", value: "由待办厂管理" }
      ],
      binding: false,
      openWhenBound: false,
      actions: openFactoryActions,
      allowComplete: false,
      allowArchive: false
    },
    kanbanRidge: {
      body: `${object.title} 是一个状态视图。它应该绑定某个多维表格视图或看板视图，用来跟踪事项流转。`,
      stats: linkedStats,
      binding: linkBinding("绑定看板视图", "粘贴多维表格视图、看板视图或任务看板链接", "绑定看板"),
      completeLabel: "状态已流转",
      archiveLabel: "看板待更新"
    },
    fieldChest: {
      body: `${object.title} 不是一个要随便绑定表格链接的物件。它代表“字段设计/字段检查”这件事，直接读取待办底库字段结构来判断规则是否清楚。`,
      items: (context.todoFactory?.fields || []).map((field) => ({
        title: field.label,
        meta: `${field.type} · 字段键 ${field.key}`
      })),
      stats: [
        { label: "字段数", value: `${fieldsCount} 个` },
        { label: "底库", value: factoryBound },
        { label: "绑定状态", value: "读取底库字段" }
      ],
      binding: false,
      openWhenBound: false,
      actions: openFactoryActions,
      completeLabel: "字段配置已确认",
      archiveLabel: "字段待确认"
    },
    processCanal: {
      body: `${object.title} 是流程疏通任务。它应该绑定流程说明、审批流程或跨模块协作文档。`,
      stats: linkedStats,
      binding: linkBinding("绑定流程说明", "粘贴流程文档、审批流程、自动化说明或协作规范链接", "绑定流程"),
      completeLabel: "流程已疏通",
      archiveLabel: "流程待处理"
    },
    recordBarn: {
      body: `${object.title} 代表“把一条记录补完整”。它优先看待办底库和农场记录数量，不再要求你给谷仓随便绑定一个表格链接。`,
      items: todoFactoryRows().slice(0, 6).map((row) => ({
        title: row.title || "未命名记录",
        meta: `${row.module || "飞书"} · ${statusLabel(row.status)}`
      })),
      stats: [
        { label: "总记录", value: `${rowCount} 条` },
        { label: "农场中", value: `${activeCount} 个` },
        { label: "绑定状态", value: "读取底库记录" }
      ],
      binding: false,
      openWhenBound: false,
      actions: openFactoryActions,
      completeLabel: "记录已补全",
      archiveLabel: "记录待补全"
    },
    todoFactory: {
      body: `${object.title} 是系统待办厂。它负责沉淀未完成事项，真实多维表格底库应该在这里统一绑定，不应该再作为普通作物处理。`,
      database: true,
      stats: [
        { label: "待办", value: `${context.backlogCount} 条` },
        { label: "底库", value: factoryBound },
        { label: "绑定状态", value: "系统底库" }
      ],
      binding: false,
      openWhenBound: false,
      actions: [
        ...openFactoryActions,
        { id: "dailySweep", label: "每日清算" }
      ],
      allowComplete: false,
      allowArchive: false
    },
    roundTable: {
      body: `${object.title} 是一次团队会议或讨论。它应该绑定会议日程、会议群或会议纪要。`,
      items: context.realEvents,
      stats: [
        { label: "会议", value: context.eventCount },
        { label: "绑定状态", value: linkState },
        { label: "忙碌", value: context.busyMinutes }
      ],
      binding: linkBinding("绑定圆桌会议入口", "粘贴飞书会议、日程、会议群或纪要链接", "绑定会议"),
      actions: [{ id: "syncCalendar", label: "同步会议日程" }],
      completeLabel: "会议结论已同步",
      archiveLabel: "会议待跟进"
    },
    chatFirefly: {
      body: `${object.title} 是一次群聊跟进。它应该绑定具体群聊、消息上下文或协作讨论。`,
      stats: linkedStats,
      binding: linkBinding("绑定群聊/消息入口", "粘贴飞书群聊、消息链接或协作讨论链接", "绑定群聊"),
      completeLabel: "群聊已回应",
      archiveLabel: "群聊待跟进"
    },
    helpBridge: {
      body: `${object.title} 是一次协作求助。它应该绑定求助来源：任务、群聊、文档或同事请求。`,
      stats: linkedStats,
      binding: linkBinding("绑定协作求助来源", "粘贴任务、群聊、云文档或互助事项链接", "绑定协作来源"),
      completeLabel: "协作已完成",
      archiveLabel: "协作待响应"
    },
    showcaseLine: {
      body: `${object.title} 是系统成果展示位。成果应该通过“完成并晾晒”自动来到这里，不需要把晾晒绳本身绑定成一个普通链接。`,
      records: context.moduleRecords.filter((record) => !record.objectId),
      stats: [
        { label: "成果", value: `${context.doneCount} 条` },
        { label: "收获", value: `${farm?.team?.harvests || 0}` },
        { label: "绑定状态", value: "系统展示" }
      ],
      binding: false,
      openWhenBound: false,
      actions: openFactoryActions,
      allowComplete: false,
      allowArchive: false
    },
    aiPartnerCabin: {
      body: `${object.title} 是智能伙伴入口。它负责解释农场状态、生成建议和打开 Aily，不需要绑定一条普通链接。`,
      stats: [
        { label: "今日日程", value: context.eventCount },
        { label: "待办厂", value: `${context.backlogCount} 条` },
        { label: "绑定状态", value: "连接 Aily" }
      ],
      binding: false,
      openWhenBound: false,
      actions: [
        { id: "openAily", label: "打开飞书 Aily" },
        { id: "copyAiPrompt", label: "复制农场上下文", kind: "quiet" }
      ],
      allowComplete: false,
      allowArchive: false
    }
  };

  return (
    configs[item.id] || {
      body: `${object.title} 已经种在团队农场里。这个对象会按所属飞书模块进入待办、完成或晾晒流程。`,
      stats: linkedStats,
      binding: linkBinding("绑定真实飞书入口", "粘贴这个对象对应的真实飞书链接", "绑定真实入口")
    }
  );
}

function resourceForItem(item) {
  const resources = {
    scheduleSign: { kind: "日程", actionLabel: "打开绑定日程" },
    focusDew: { kind: "专注", actionLabel: "打开绑定日程" },
    meetingCanopy: { kind: "会议", actionLabel: "打开绑定会议" },
    taskSeed: { kind: "任务", actionLabel: "打开绑定任务" },
    okrMilestone: { kind: "OKR", actionLabel: "打开绑定 OKR" },
    approvalStamp: { kind: "审批", actionLabel: "打开绑定审批" },
    docCottage: { kind: "云文档", actionLabel: "打开绑定云文档" },
    knowledgeGreenhouse: { kind: "知识库", actionLabel: "打开绑定知识库" },
    commentBell: { kind: "评论", actionLabel: "打开绑定评论" },
    minutesBook: { kind: "会议纪要", actionLabel: "打开绑定纪要" },
    inspirationVine: { kind: "文档动态", actionLabel: "打开绑定文档动态" },
    bitableWarehouse: { kind: "多维表格", actionLabel: "打开绑定多维表格" },
    kanbanRidge: { kind: "看板视图", actionLabel: "打开绑定看板" },
    fieldChest: { kind: "字段配置", actionLabel: "打开绑定字段表" },
    processCanal: { kind: "流程", actionLabel: "打开绑定流程" },
    recordBarn: { kind: "记录", actionLabel: "打开绑定记录" },
    todoFactory: { kind: "未完成待办厂", actionLabel: "打开绑定多维表格" },
    roundTable: { kind: "圆桌会议", actionLabel: "打开绑定会议" },
    chatFirefly: { kind: "群聊", actionLabel: "打开绑定群聊" },
    helpBridge: { kind: "协作互助", actionLabel: "打开绑定协作事项" },
    showcaseLine: { kind: "成果", actionLabel: "打开绑定成果" },
    aiPartnerCabin: { kind: "智能伙伴", actionLabel: "打开绑定伙伴" }
  };
  return resources[item.id] || {
    kind: item.module || "飞书对象",
    actionLabel: "打开绑定内容"
  };
}

function moduleRecordsFor(itemId) {
  return state.farm?.moduleRecords?.[itemId] || [];
}

function findModuleRecord(recordId) {
  const lists = Object.values(state.farm?.moduleRecords || {});
  return lists.flat().find((record) => record.id === recordId);
}

function todoFactoryRows() {
  const backlogRows = state.farm?.backlogRecords || [];
  const objectRows = (state.farm?.farmObjects || []).map((object) => ({
    ...object,
    status: "active",
    meta: "仍在农场展示"
  }));
  return [...objectRows, ...backlogRows];
}

function todoFactoryRowsForDate(dateText) {
  return todoFactoryRows()
    .filter((row) => recordDateForRow(row) === dateText)
    .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
}

function recordDateForRow(row) {
  if (row.recordDate) return row.recordDate;
  const stamp = row.updatedAt || row.boundAt || row.createdAt || row.dueDate || "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(stamp)) return stamp;
  const date = new Date(stamp);
  if (Number.isNaN(date.getTime())) return localDateInput(new Date());
  return localDateInput(date);
}

function rowToHistoryRecord(row) {
  return {
    id: `history:${row.id || row.objectId || row.sourceId || row.title}`,
    title: row.title || row.label || "未命名记录",
    meta: [row.module || "飞书", row.meta || "", row.url ? "已绑定入口" : ""].filter(Boolean).join(" · "),
    status: statusLabel(row.status),
    url: row.url || row.resource?.url || "",
    canPlant: false,
    canBacklog: false
  };
}

function statusLabel(status) {
  return {
    active: "农场中",
    backlog: "待办厂",
    done: "已晾晒"
  }[status] || status || "记录";
}

function plantedCountFor(itemId) {
  return (state.farm?.farmObjects || []).filter((object) => object.itemId === itemId).length;
}

function feishuAppLink(pathname, params = {}) {
  const url = new URL(`https://applink.feishu.cn${pathname}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

function renderQuickMenu() {
  if (!state.editor.quickMenu) return "";
  const recentItems = state.editor.recent
    .map(findCatalogItem)
    .filter(Boolean)
    .slice(0, 4);
  return `
    <section class="quick-menu" style="left:${state.editor.quickMenu.x}px; top:${state.editor.quickMenu.y}px;">
      <button class="quick-menu-close" data-editor-action="closeQuick">X</button>
      <div class="quick-title">快捷操作</div>
      <button class="quick-action" id="quickSyncCalendar">同步计划信号</button>
      <button class="quick-action" data-editor-action="quickWater">浇水</button>
      <div class="quick-title muted-title">最近对象</div>
      ${recentItems.map((item) => `<button class="quick-action" data-place-item="${item.id}">${escapeHtml(item.label)}</button>`).join("")}
    </section>
  `;
}

function renderCalendarEvent(event) {
  const title = event.title || "未命名日程";
  const timeText = event.timeText || "";
  const location = event.location || "";
  const description = event.description || "";

  return `
    <li class="calendar-event">
      <strong>${escapeHtml(title)}</strong>
      ${timeText ? `<span>${escapeHtml(timeText)}</span>` : ""}
      ${location ? `<em>${escapeHtml(location)}</em>` : ""}
      ${description ? `<p>${escapeHtml(description)}</p>` : ""}
    </li>
  `;
}

function topbar(user, subtitle) {
  const initial = escapeHtml((user.name || "飞").slice(0, 1));
  const avatar = user.avatarUrl
    ? `<img src="${escapeAttribute(user.avatarUrl)}" alt="" />`
    : `<span>${initial}</span>`;

  return `
    <header class="topbar">
      <div class="identity">
        <div class="avatar">${avatar}</div>
        <div>
          <h2>${escapeHtml(user.name)}</h2>
          <span>${escapeHtml(subtitle)}</span>
        </div>
      </div>
      <button id="logoutButton" class="quiet">退出登录</button>
    </header>
  `;
}

function bindTeamForms() {
  document.querySelector("#logoutButton")?.addEventListener("click", logout);

  document.querySelector("#createTeamForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await mutate("/api/teams", {
      action: "create",
      name: form.get("name")
    });
    showToast("团队农场已经创建");
  });

  document.querySelector("#joinTeamForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await mutate("/api/teams", {
      action: "join",
      code: form.get("code")
    });
    showToast("已经加入团队农场");
  });
}

function bindFarmActions() {
  document.querySelector("#logoutButton")?.addEventListener("click", logout);
  const syncCalendar = async () => {
    const result = await runAction("calendar", () => mutate("/api/calendar/sync", {}));
    const signal = result?.signal || state.farm?.team?.lastCalendarSignal;
    const eventCount = signal?.eventCount ?? 0;
    const focusBlocks = signal?.focusBlocks ?? 0;
    showToast(`同步完成：今天读取到 ${eventCount} 个日程，${focusBlocks} 个专注块`);
  };
  const dailySweep = async () => {
    const result = await runAction("sweep", () => mutate("/api/farm/objects", { action: "dailySweep" }));
    showToast(result?.swept ? `已把 ${result.swept} 个过夜事项移入待办厂` : "今天没有需要清算的过夜事项");
  };
  const syncTodoFactory = async () => {
    const result = await runAction("syncFactory", () => mutate("/api/farm/objects", { action: "syncTodoFactory" }));
    const sync = result?.todoFactorySync || state.farm?.todoFactory?.lastSyncResult;
    if (sync?.ok) {
      showToast(`底库同步完成：${sync.rowCount ?? 0} 条记录，新增 ${sync.createdRecords ?? 0} 条，更新 ${sync.updatedRecords ?? 0} 条`);
    } else {
      showToast(sync?.message || "底库同步失败，请检查多维表格权限");
    }
  };

  document.querySelector("#syncCalendar")?.addEventListener("click", syncCalendar);
  document.querySelector("#toolbarSyncCalendar")?.addEventListener("click", syncCalendar);
  document.querySelector("#quickSyncCalendar")?.addEventListener("click", syncCalendar);
  document.querySelector("#dailySweep")?.addEventListener("click", dailySweep);
  document.querySelector("#tidyLayout")?.addEventListener("click", async () => {
    await runAction("tidy", () => mutate("/api/farm/objects", { action: "tidyLayout" }));
    showToast("农场对象已经按区域整理");
  });

  document.querySelector("#waterFarm")?.addEventListener("click", async () => {
    await runAction("water", () => mutate("/api/farm/interaction", { type: "water" }));
    showToast("浇水完成，作物更精神了");
  });

  document.querySelector("#cheerFarm")?.addEventListener("click", async () => {
    await runAction("cheer", () => mutate("/api/farm/interaction", { type: "cheer" }));
    showToast("团队能量提高了一点");
  });

  document.querySelector("#harvestFarm")?.addEventListener("click", async () => {
    await runAction("harvest", () => mutate("/api/farm/interaction", { type: "harvest" }));
    showToast("成熟作物已收获");
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      state.editor.activeTab = state.editor.activeTab === tab ? "" : tab;
      state.editor.search = "";
      state.editor.quickMenu = null;
      render();
      document.querySelector("#paletteSearch")?.focus();
    });
  });

  document.querySelector("#paletteSearch")?.addEventListener("input", (event) => {
    state.editor.search = event.currentTarget.value;
    render();
    const search = document.querySelector("#paletteSearch");
    search?.focus();
    search?.setSelectionRange(search.value.length, search.value.length);
  });

  document.querySelectorAll("[data-place-item]").forEach((button) => {
    button.addEventListener("click", () => {
      pickPlacement(button.dataset.placeItem);
    });
  });

  document.querySelectorAll("[data-editor-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.editorAction;
      if (action === "closePalette") {
        state.editor.activeTab = "";
        state.editor.search = "";
        render();
      }
      if (action === "closeQuick") {
        state.editor.quickMenu = null;
        render();
      }
      if (action === "closeModule") {
        state.editor.selectedModule = null;
        state.editor.selectedObjectId = null;
        state.editor.selectedNpc = false;
        render();
      }
      if (action === "select") {
        state.editor.placement = null;
        state.editor.selectedNpc = false;
        showToast("已切回选择模式");
        render();
      }
      if (action === "erase" || action === "undo") {
        if (state.farm?.team) {
          await mutate("/api/farm/objects", { action: "removeLast" });
        } else {
          state.editor.placedItems.pop();
        }
        showToast(action === "erase" ? "已清除最近放置的对象" : "已撤销上一步放置");
        render();
      }
      if (action === "quickWater") {
        await runAction("water", () => mutate("/api/farm/interaction", { type: "water" }));
        showToast("从快捷菜单浇水完成");
      }
    });
  });

  document.querySelectorAll("[data-module-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.moduleAction;
      if (action === "syncCalendar") {
        await syncCalendar();
        return;
      }
      if (action === "dailySweep") {
        await dailySweep();
        return;
      }
      if (action === "syncTodoFactory") {
        await syncTodoFactory();
        return;
      }
      if (action === "openFactory") {
        state.editor.selectedModule = "todoFactory";
        state.editor.selectedObjectId = null;
        state.editor.selectedNpc = false;
        render();
        return;
      }
      if (action === "openRecordBarn") {
        state.editor.selectedModule = "recordBarn";
        state.editor.selectedObjectId = null;
        state.editor.selectedNpc = false;
        state.editor.recordDate = localDateInput(new Date());
        render();
        return;
      }
      if (action === "openAily") {
        try {
          const result = await api("/api/aily/open", {
            method: "POST",
            body: JSON.stringify({ target: "client" })
          });
          showToast(result.message || "已尝试打开飞书 Aily");
        } catch {
          window.location.assign(aiPartnerLinks.feishuFallback);
        }
        return;
      }
      if (action === "copyAiPrompt") {
        try {
          await navigator.clipboard.writeText(buildAiNpcPrompt(state.farm));
          showToast("已复制农场上下文，可以粘贴给飞书 Aily");
        } catch {
          showToast("浏览器暂时不允许复制，可以点开 Aily 后手动描述农场状态");
        }
        return;
      }
      if (action === "archiveObject" || action === "completeObject") {
        const objectId = button.dataset.objectActionId || state.editor.selectedObjectId;
        if (!objectId) return;
        await mutate("/api/farm/objects", { action, objectId });
        state.editor.selectedObjectId = null;
        state.editor.selectedNpc = false;
        state.editor.selectedModule = action === "completeObject" ? "showcaseLine" : "todoFactory";
        showToast(action === "completeObject" ? "已完成，挂到成果晾晒绳" : "已移入未完成待办厂");
        render();
        return;
      }
      if (action === "removeObject") {
        const objectId = button.dataset.objectActionId || state.editor.selectedObjectId;
        if (!objectId) return;
        const removedObject = takeFarmObjectLocally(objectId);
        if (!removedObject) {
          showToast("没有找到这个农场物件");
          return;
        }
        state.editor.selectedObjectId = null;
        state.editor.selectedModule = null;
        state.editor.selectedNpc = false;
        showToast("已从农场移除这个物件");
        render();

        try {
          const result = await api("/api/farm/objects", { method: "POST", body: JSON.stringify({ action, objectId }) });
          if (result.farm) state.farm = result.farm;
          render();
        } catch (error) {
          restoreFarmObjectLocally(removedObject);
          state.editor.selectedModule = removedObject.itemId || null;
          state.editor.selectedObjectId = removedObject.id || objectId;
          showToast(`移除失败：${error.message || "请稍后重试"}`);
          render();
        }
        return;
      }
      if (action === "explain") {
        const item = findCatalogItem(state.editor.selectedModule);
        showToast(item ? `${item.label}：${item.hint}` : "这是飞书行为映射到农场的互动模块");
        return;
      }
      const item = findCatalogItem(state.editor.selectedModule);
      showToast(`${item?.label || "这个模块"} 的真实数据同步会在下一步接入`);
    });
  });

  document.querySelectorAll("[data-record-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const record = findModuleRecord(button.dataset.recordId);
      if (!record) {
        showToast("没有找到这条模块记录");
        return;
      }
      if (button.dataset.recordAction === "backlog" && record.objectId) {
        await mutate("/api/farm/objects", { action: "archiveObject", objectId: record.objectId });
        showToast("已移入未完成待办厂");
        return;
      }
      const action = button.dataset.recordAction === "plant" ? "plantRecord" : "createBacklogRecord";
      await mutate("/api/farm/objects", {
        action,
        ...record,
        recordId: record.id
      });
      showToast(action === "plantRecord" ? "已种到农场" : "已放入未完成待办厂");
    });
  });

  document.querySelectorAll("[data-factory-bind-form]").forEach((factoryForm) => {
    factoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const url = String(form.get("url") || "").trim();
      const title = String(form.get("title") || "").trim();

      if (!url) {
        showToast("先粘贴一条真实飞书多维表格链接");
        return;
      }

      const result = await mutate("/api/farm/objects", {
        action: "bindTodoFactory",
        url,
        title
      });
      showToast(result?.todoFactory?.bound ? "底库已绑定；点击同步底库后才会写入飞书" : "多维表格底库已绑定");
    });
  });

  document.querySelectorAll("[data-history-date-form]").forEach((historyForm) => {
    historyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const date = String(form.get("recordDate") || "").trim();
      if (date) {
        state.editor.recordDate = date;
        showToast(`已切换到 ${date} 的谷仓记录`);
        render();
      }
    });
  });

  document.querySelectorAll("[data-history-shift]").forEach((button) => {
    button.addEventListener("click", () => {
      const shift = Number(button.dataset.historyShift || 0);
      const currentDate = new Date(`${state.editor.recordDate || localDateInput(new Date())}T12:00:00`);
      currentDate.setDate(currentDate.getDate() + shift);
      state.editor.recordDate = localDateInput(currentDate);
      showToast(`已切换到 ${state.editor.recordDate} 的谷仓记录`);
      render();
    });
  });

  document.querySelector("#bindResourceForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const objectId = form.dataset.objectId || state.editor.selectedObjectId;
    const url = String(formData.get("url") || "").trim();
    const title = String(formData.get("title") || "").trim();

    if (!objectId) {
      showToast("先选中一个已经种下的物件");
      return;
    }
    if (!url) {
      showToast("先粘贴一个真实飞书链接");
      return;
    }

    await mutate("/api/farm/objects", {
      action: "bindResource",
      objectId,
      url,
      title
    });
    showToast("已绑定真实飞书入口");
  });

  document.querySelectorAll("[data-open-url]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.assign(button.dataset.openUrl);
    });
  });

  document.querySelectorAll("[data-open-url-new]").forEach((button) => {
    button.addEventListener("click", () => {
      window.open(button.dataset.openUrl, "_blank", "noopener,noreferrer");
    });
  });

  document.querySelectorAll("[data-npc-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.npcAction;
      if (action === "openFeishuAily") {
        try {
          const result = await api("/api/aily/open", {
            method: "POST",
            body: JSON.stringify({ target: "client" })
          });
          showToast(result.message || "已尝试打开飞书 Aily");
        } catch {
          window.location.assign(aiPartnerLinks.feishuFallback);
        }
        return;
      }

      if (action === "openWebAily") {
        window.location.assign(aiPartnerLinks.web);
        return;
      }

      if (action === "refreshLine") {
        state.npc.phrase = pickAiNpcLine(state.farm, state.npc.phrase);
        state.npc.nextPhraseAt = performance.now() + randomBetween(60_000, 120_000);
        render();
        return;
      }

      if (action === "copyPrompt") {
        try {
          await navigator.clipboard.writeText(buildAiNpcPrompt(state.farm));
          showToast("已复制农场上下文，可以粘贴给飞书 Aily");
        } catch {
          showToast("浏览器暂时不允许复制，可以点开 Aily 后手动描述农场状态");
        }
      }
    });
  });

  const canvas = document.querySelector("#farmCanvas");
  canvas?.addEventListener("mousemove", (event) => {
    const point = canvasPoint(canvas, event);
    state.editor.cursor = point;
    canvas.style.cursor =
      !state.editor.placement && (findNpcAtPoint(point) || findModuleAtPoint(point))
        ? "pointer"
        : "default";
  });
  canvas?.addEventListener("mouseleave", () => {
    state.editor.cursor = null;
    canvas.style.cursor = "default";
  });
  canvas?.addEventListener("click", async (event) => {
    state.editor.quickMenu = null;
    const point = canvasPoint(canvas, event);
    if (!state.editor.placement) {
      const npc = findNpcAtPoint(point);
      if (npc) {
        state.editor.selectedNpc = true;
        state.editor.selectedModule = null;
        state.editor.selectedObjectId = null;
        showToast("农场智能伙伴正在观察今天的飞书信号");
        render();
        return;
      }

      const module = findModuleAtPoint(point);
      state.editor.selectedModule = module?.id || null;
      state.editor.selectedObjectId = module?.objectId || null;
      state.editor.selectedNpc = false;
      if (module) {
        const object = findFarmObject(module.objectId);
        showToast(`打开 ${object?.title || findCatalogItem(module.id)?.label || "模块"} 详情`);
      }
      render();
      return;
    }
    await placeCurrentItem(point);
  });
  canvas?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    state.editor.quickMenu = {
      x: Math.min(event.clientX, window.innerWidth - 210),
      y: Math.min(event.clientY, window.innerHeight - 220)
    };
    state.editor.activeTab = "";
    state.editor.selectedModule = null;
    state.editor.selectedObjectId = null;
    state.editor.selectedNpc = false;
    render();
  });

  window.onkeydown = async (event) => {
    const isTyping = ["INPUT", "TEXTAREA"].includes(event.target?.tagName);
    if (event.key === "Escape") {
      state.editor.placement = null;
      state.editor.quickMenu = null;
      state.editor.activeTab = "";
      state.editor.selectedModule = null;
      state.editor.selectedObjectId = null;
      state.editor.selectedNpc = false;
      render();
    }
    if (isTyping) return;
    if (event.key.toLowerCase() === "e") {
      if (state.farm?.team) {
        await mutate("/api/farm/objects", { action: "removeLast" });
      } else {
        state.editor.placedItems.pop();
      }
      showToast("已清除最近放置的对象");
      render();
    }
    if (event.key.toLowerCase() === "u") {
      if (state.farm?.team) {
        await mutate("/api/farm/objects", { action: "removeLast" });
      } else {
        state.editor.placedItems.pop();
      }
      showToast("已撤销上一步放置");
      render();
    }
    if (event.key.toLowerCase() === "s") {
      state.editor.placement = null;
      showToast("已切回选择模式");
      render();
    }
  };
}

function pickPlacement(itemId) {
  const item = findCatalogItem(itemId);
  if (!item) return;
  if (item.placeable === false) {
    state.editor.selectedModule = item.id;
    state.editor.selectedObjectId = null;
    state.editor.selectedNpc = false;
    state.editor.activeTab = "";
    showToast(`${item.label} 是系统区域，直接在地图上点击它使用`);
    render();
    return;
  }
  state.editor.placement = item.id;
  state.editor.activeTab = "";
  state.editor.quickMenu = null;
  state.editor.selectedModule = null;
  state.editor.selectedObjectId = null;
  state.editor.selectedNpc = false;
  state.editor.recent = [item.id, ...state.editor.recent.filter((id) => id !== item.id)].slice(0, 6);
  showToast(`已拿起 ${item.label}，点击地图放置`);
  render();
}

async function placeCurrentItem(point) {
  const item = findCatalogItem(state.editor.placement);
  if (!item || !point) return;
  const x = snapToGrid(Math.max(16, Math.min(point.width - 64, point.x)));
  const y = snapToGrid(Math.max(96, Math.min(point.height - 64, point.y)));
  const title = farmObjectTitle(item);
  if (state.farm?.team) {
    const pendingId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const pendingObject = {
      id: pendingId,
      itemId: item.id,
      label: item.label,
      module: item.module,
      type: item.type,
      sprite: item.sprite,
      title,
      x,
      y,
      resource: resourceForItem(item),
      createdAt: new Date().toISOString(),
      pending: true
    };
    const previousPlacement = state.editor.placement;
    state.farm.farmObjects = [...(state.farm.farmObjects || []), pendingObject];
    state.editor.recent = [item.id, ...state.editor.recent.filter((id) => id !== item.id)].slice(0, 6);
    state.editor.placement = null;
    state.editor.selectedModule = item.id;
    state.editor.selectedNpc = false;
    state.editor.selectedObjectId = pendingId;
    showToast(`${title} 已放进团队农场，正在保存`);
    render();

    try {
      const result = await api("/api/farm/objects", {
        method: "POST",
        body: JSON.stringify({
          action: "place",
          itemId: item.id,
          label: item.label,
          module: item.module,
          type: item.type,
          sprite: item.sprite,
          title,
          x,
          y
        })
      });
      const livePendingObjects = (state.farm?.farmObjects || []).filter(
        (object) => object.pending && object.id !== pendingId
      );
      if (result.farm) {
        const savedIds = new Set((result.farm.farmObjects || []).map((object) => object.id));
        result.farm.farmObjects = [
          ...(result.farm.farmObjects || []),
          ...livePendingObjects.filter((object) => !savedIds.has(object.id))
        ];
        state.farm = result.farm;
      } else {
        state.farm = await api("/api/farm/state");
      }
      const savedObject =
        result.object ||
        [...(state.farm?.farmObjects || [])]
          .reverse()
          .find((object) => object.title === title && object.itemId === item.id);
      state.editor.selectedModule = item.id;
      state.editor.selectedObjectId = savedObject?.id || null;
      render();
    } catch (error) {
      if (state.farm?.farmObjects) {
        state.farm.farmObjects = state.farm.farmObjects.filter((object) => object.id !== pendingId);
      }
      state.editor.placement = previousPlacement;
      state.editor.selectedObjectId = null;
      showToast(`保存失败：${error.message || "请稍后重试"}`);
      render();
    }
    return;
  } else {
    state.editor.placedItems.push({
      id: item.id,
      itemId: item.id,
      label: item.label,
      module: item.module,
      title,
      x,
      y,
      resource: resourceForItem(item)
    });
  }
  state.editor.recent = [item.id, ...state.editor.recent.filter((id) => id !== item.id)].slice(0, 6);
  state.editor.placement = null;
  state.editor.selectedModule = item.id;
  state.editor.selectedNpc = false;
  const farmObject = [...(state.farm?.farmObjects || [])].reverse().find((object) => object.title === title);
  state.editor.selectedObjectId = farmObject?.id || null;
  showToast(`${title} 已放进团队农场`);
  render();
}

function farmObjectTitle(item) {
  const date = new Date();
  const stamp = `${date.getMonth() + 1}.${date.getDate()}`;
  const prefixes = {
    scheduleSign: "今日日程木牌",
    focusDew: "专注露珠",
    meetingCanopy: "会议雨棚",
    taskSeed: "任务种子",
    okrMilestone: "OKR 里程碑",
    approvalStamp: "审批印章",
    docCottage: "云文档小屋",
    knowledgeGreenhouse: "知识温室",
    commentBell: "评论风铃",
    minutesBook: "纪要花册",
    inspirationVine: "灵感藤蔓",
    bitableWarehouse: "多维表格仓库",
    kanbanRidge: "看板田垄",
    fieldChest: "字段宝箱",
    processCanal: "流程水渠",
    recordBarn: "记录谷仓",
    todoFactory: "未完成待办厂",
    roundTable: "圆桌会议",
    chatFirefly: "群聊萤火虫",
    helpBridge: "协作小桥",
    showcaseLine: "成果晾晒绳",
    aiPartnerCabin: "智能伙伴小屋"
  };
  return `${prefixes[item.id] || item.label} ${stamp}`;
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    width: canvas.width,
    height: canvas.height
  };
}

function findModuleAtPoint(point) {
  if (!point || point.width < 1000) return null;
  const planted = drawableFarmObjects()
    .map((object) => {
      const item = findCatalogItem(object.itemId || object.id);
      if (!item) return null;
      const [baseWidth, baseHeight] = plannerSpriteSizes[item.sprite] || [16, 16];
      const scale = plannerScaleForPlacedSprite(item.sprite);
      return {
        id: item.id,
        objectId: object.objectId || object.id,
        x: object.x,
        y: object.y,
        scale,
        width: baseWidth * scale,
        height: baseHeight * scale
      };
    })
    .filter(Boolean)
    .reverse();

  const plantedHit = planted.find((module) => pointInModule(point, module, 14));
  if (plantedHit) return plantedHit;

  const zones = getFarmModuleZones(state.farm?.team || demoFarm().team);
  const modules = zones.flatMap((zone) => zone.modules.map((module) => ({ ...module, zone }))).reverse();

  return modules.find((module) => {
    const item = findCatalogItem(module.id);
    if (!item) return false;
    const [baseWidth, baseHeight] = plannerSpriteSizes[item.sprite] || [16, 16];
    return pointInModule(point, {
      ...module,
      width: baseWidth * module.scale,
      height: baseHeight * module.scale
    });
  });
}

function findNpcAtPoint(point) {
  if (!point || point.width < 1000) return null;
  const npc = state.npc;
  return (
    point.x >= npc.x - 96 &&
    point.x <= npc.x + 96 &&
    point.y >= npc.y - 124 &&
    point.y <= npc.y + 24
  )
    ? npc
    : null;
}

function pointInModule(point, module, pad = 12) {
  return (
    point.x >= module.x - pad &&
    point.x <= module.x + module.width + pad &&
    point.y >= module.y - pad &&
    point.y <= module.y + module.height + pad
  );
}

function drawableFarmObjects() {
  return state.farm?.farmObjects?.length ? state.farm.farmObjects : state.editor.placedItems;
}

function findFarmObject(objectId) {
  if (!objectId) return null;
  return drawableFarmObjects().find((object) => object.id === objectId || object.objectId === objectId) || null;
}

function takeFarmObjectLocally(objectId) {
  if (!objectId) return null;
  const farmObjects = state.farm?.farmObjects;
  if (farmObjects?.length) {
    const index = farmObjects.findIndex((object) => object.id === objectId || object.objectId === objectId);
    if (index >= 0) {
      const [object] = farmObjects.splice(index, 1);
      state.farm.farmObjects = [...farmObjects];
      return object;
    }
  }

  const localIndex = state.editor.placedItems.findIndex((object) => object.id === objectId || object.objectId === objectId);
  if (localIndex >= 0) {
    const [object] = state.editor.placedItems.splice(localIndex, 1);
    state.editor.placedItems = [...state.editor.placedItems];
    return object;
  }
  return null;
}

function restoreFarmObjectLocally(object) {
  if (!object) return;
  if (state.farm?.team) {
    state.farm.farmObjects = [...(state.farm.farmObjects || []), object];
  } else {
    state.editor.placedItems = [...state.editor.placedItems, object];
  }
}

function snapToGrid(value) {
  return Math.round(value / 8) * 8;
}

function loadPixelImage(src) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  return image;
}

async function runAction(action, callback) {
  if (state.busyAction) return null;
  state.busyAction = action;
  render();

  try {
    return await callback();
  } finally {
    state.busyAction = "";
    render();
  }
}

async function mutate(path, body) {
  const result = await api(path, {
    method: "POST",
    body: JSON.stringify(body)
  });

  if (result.farm) {
    state.farm = result.farm;
  } else {
    state.farm = await api("/api/farm/state");
  }

  render();
  return result;
}

async function logout() {
  await api("/api/logout", { method: "POST" });
  state.me = { authenticated: false };
  state.farm = null;
  render();
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json();
  if (!response.ok || payload.error) {
    showToast(payload.message || payload.error || "请求失败");
    if (payload.reauth) {
      window.setTimeout(() => {
        window.location.href = "/api/auth/feishu/start";
      }, 900);
    }
    throw new Error(payload.message || payload.error || "Request failed");
  }
  return payload;
}

function startCanvasLoop(canvas, farm) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const frame = (time) => {
    drawFarm(ctx, canvas, farm, time);
    state.animationFrame = requestAnimationFrame(frame);
  };

  state.animationFrame = requestAnimationFrame(frame);
}

function drawFarm(ctx, canvas, farm, time) {
  const width = canvas.width;
  const height = canvas.height;
  const team = farm.team || demoFarm().team;
  const weather = team.weather || "sunny";
  const sway = Math.floor(Math.sin(time / 420) * 2);

  if (width >= 1000) {
    drawPlannerFarm(ctx, canvas, farm, time);
    return;
  }

  drawSky(ctx, width, height, weather, time);
  drawMountains(ctx, width, weather);
  drawGroundTiles(ctx, width, height, weather);
  drawFence(ctx, width);
  drawPath(ctx);
  drawPond(ctx, 524, 274, weather, time);
  drawBarn(ctx, 36, 150);
  drawCalendarTower(ctx, 498, 116, weather);
  drawBitableShed(ctx, 520, 205);
  drawDocumentBoard(ctx, 34, 260);
  drawPlots(ctx, team.plots || [], sway);
  drawPlacedItems(ctx, drawableFarmObjects());
  drawPlacementPreview(ctx);
  drawCharacters(ctx, farm.members || [], time);
  drawWeather(ctx, width, weather, time);
  drawHud(ctx, team);
}

function drawPlannerFarm(ctx, canvas, farm, time) {
  const width = canvas.width;
  const height = canvas.height;
  const team = farm.team || demoFarm().team;
  const weather = team.weather || "sunny";

  ctx.clearRect(0, 0, width, height);
  if (imageReady(plannerAssets.map)) {
    ctx.drawImage(plannerAssets.map, 0, 0, width, height);
  } else {
    ctx.fillStyle = "#2f6f3e";
    ctx.fillRect(0, 0, width, height);
  }

  drawPlannerCropHints(ctx, team.plots || [], time);
  drawPlannerFeishuLayer(ctx, team, time);
  drawPlacedItems(ctx, drawableFarmObjects());
  drawPlacementPreview(ctx);
  drawPlannerMembers(ctx, farm.members || [], time);
  drawAiPartnerNpc(ctx, farm, time);
  drawPlannerWeather(ctx, width, height, weather, time);
  drawPlannerHud(ctx, team);
}

function drawPlannerStaticBuildings(ctx) {
  drawPlannerSprite(ctx, "house", 944, 128);
  drawPlannerSprite(ctx, "greenhouse-fixed", 576, 400);
}

function drawPlannerCropHints(ctx, plots, time) {
  const coords = [
    [96, 224],
    [162, 224],
    [228, 224],
    [96, 288],
    [162, 288],
    [228, 288],
    [106, 762],
    [172, 762],
    [238, 762]
  ];
  const shimmer = Math.floor(Math.sin(time / 360) * 2);

  coords.forEach(([x, y], index) => {
    const plot = plots[index] || {};
    if (!plot.crop) return;

    drawPlannerCropSprout(ctx, x, y + shimmer, plot.crop, plot.growth || 0);
  });
}

function drawPlannerCropSprout(ctx, x, y, crop, growth) {
  const mature = growth >= 80;
  const leaf = crop === "wheat" ? "#a7a34f" : "#358a4f";
  const fruit = crop === "wheat" ? "#d9b84f" : crop === "carrot" ? "#d9793c" : "#e8d7f0";

  ctx.save();
  ctx.fillStyle = "rgba(38, 27, 18, 0.22)";
  ctx.fillRect(x - 7, y + 15, 20, 4);
  ctx.fillStyle = leaf;
  ctx.fillRect(x, y + 5, 4, 14);
  ctx.fillRect(x - 6, y + 9, 6, 4);
  ctx.fillRect(x + 4, y + 7, 7, 4);
  if (mature) {
    ctx.fillStyle = fruit;
    ctx.fillRect(x + 1, y + 2, 6, 6);
  }
  ctx.restore();
}

function drawPlannerFeishuLayer(ctx, team, time) {
  const pulse = 0.5 + Math.sin(time / 420) * 0.16;
  const zones = getFarmModuleZones(team, pulse);

  zones.forEach((zone) => {
    drawPlannerZone(ctx, zone);
    zone.modules.forEach((module) => {
      const item = findCatalogItem(module.id);
      if (!item) return;
      const [baseWidth, baseHeight] = plannerSpriteSizes[item.sprite] || [16, 16];
      const width = baseWidth * module.scale;
      const height = baseHeight * module.scale;
      drawModuleGlow(ctx, module.x, module.y + height - 8, Math.max(width, 32), zone.glow);
      drawPlannerSprite(ctx, item.sprite, module.x, module.y, module.scale);
      if (!state.editor.selectedObjectId && state.editor.selectedModule === module.id) {
        drawSelectionRing(ctx, module.x, module.y, width, height, zone.color);
      }
    });
  });
}

function getFarmModuleZones(team = {}, pulse = 0.56) {
  const signal = team.lastCalendarSignal;
  return [
    {
      key: "plan",
      title: "计划田",
      sub: signal ? `${signal.eventCount} 个日程` : "日程 / 任务 / OKR",
      signX: 74,
      signY: 148,
      color: "#f1c753",
      glow: `rgba(241, 199, 83, ${pulse})`,
      floor: { x: 64, y: 214, w: 286, h: 216, tone: "soil" },
      modules: [
        { id: "scheduleSign", x: 98, y: 240, scale: 2 },
        { id: "focusDew", x: 190, y: 246, scale: 2 },
        { id: "taskSeed", x: 276, y: 248, scale: 1.7 },
        { id: "meetingCanopy", x: 92, y: 336, scale: 0.78 },
        { id: "okrMilestone", x: 190, y: 336, scale: 0.78 },
        { id: "approvalStamp", x: 292, y: 354, scale: 1.7 }
      ]
    },
    {
      key: "creation",
      title: "创作工坊",
      sub: "文档 / 知识 / 评论",
      signX: 748,
      signY: 168,
      color: "#9fd0ea",
      glow: `rgba(96, 167, 215, ${pulse})`,
      floor: { x: 732, y: 224, w: 374, h: 244, tone: "stone" },
      modules: [
        { id: "docCottage", x: 774, y: 262, scale: 0.42 },
        { id: "knowledgeGreenhouse", x: 964, y: 250, scale: 0.36 },
        { id: "commentBell", x: 790, y: 430, scale: 1.7 },
        { id: "minutesBook", x: 902, y: 426, scale: 1.7 },
        { id: "inspirationVine", x: 1012, y: 434, scale: 1.7 }
      ]
    },
    {
      key: "structure",
      title: "结构设施",
      sub: "表格 / 字段 / 记录",
      signX: 746,
      signY: 520,
      color: "#bfe07b",
      glow: `rgba(87, 184, 119, ${pulse})`,
      floor: { x: 728, y: 574, w: 402, h: 300, tone: "wood" },
      modules: [
        { id: "bitableWarehouse", x: 764, y: 624, scale: 0.5 },
        { id: "recordBarn", x: 910, y: 622, scale: 0.48 },
        { id: "todoFactory", x: 1048, y: 624, scale: 0.5 },
        { id: "kanbanRidge", x: 786, y: 764, scale: 1.7 },
        { id: "fieldChest", x: 918, y: 762, scale: 1.7 },
        { id: "processCanal", x: 1046, y: 742, scale: 0.72 }
      ]
    },
    {
      key: "plaza",
      title: "团队广场",
      sub: "群聊 / 会议 / 互助",
      signX: 300,
      signY: 616,
      color: "#f0bb4a",
      glow: `rgba(240, 187, 74, ${pulse})`,
      floor: { x: 300, y: 674, w: 318, h: 268, tone: "plaza" },
      modules: [
        { id: "roundTable", x: 326, y: 704, scale: 0.42 },
        { id: "chatFirefly", x: 446, y: 706, scale: 1.7 },
        { id: "helpBridge", x: 552, y: 716, scale: 0.58 },
        { id: "showcaseLine", x: 358, y: 824, scale: 1.7 },
        { id: "aiPartnerCabin", x: 534, y: 824, scale: 1.7 }
      ]
    }
  ];
}

function drawPlannerZone(ctx, zone) {
  drawFieldSign(ctx, zone.title, zone.sub, zone.signX, zone.signY, zone.color);
}

function drawFieldSign(ctx, title, subtitle, x, y, color) {
  ctx.save();
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 7, y + 46, 8, 34);
  ctx.fillRect(x + 134, y + 46, 8, 34);
  ctx.fillRect(x, y, 150, 54);
  ctx.fillStyle = "#fff1bd";
  ctx.fillRect(x + 5, y + 5, 140, 44);
  ctx.fillStyle = color;
  ctx.fillRect(x + 5, y + 5, 140, 5);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 18px monospace";
  ctx.fillText(title, x + 12, y + 28);
  ctx.font = "bold 11px monospace";
  ctx.fillText(subtitle, x + 12, y + 43);
  ctx.restore();
}

function drawSelectionRing(ctx, x, y, width, height, color) {
  ctx.save();
  ctx.strokeStyle = "#fff1bd";
  ctx.lineWidth = 5;
  ctx.strokeRect(x - 7, y - 7, width + 14, height + 14);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 3, y - 3, width + 6, height + 6);
  ctx.restore();
}

function drawPixelTag(ctx, title, x, y, color) {
  const width = Math.max(42, title.length * 15 + 16);
  ctx.fillStyle = "#3f2b1d";
  ctx.fillRect(x, y, width, 22);
  ctx.fillStyle = color;
  ctx.fillRect(x + 3, y + 3, width - 6, 16);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 12px monospace";
  ctx.fillText(title, x + 8, y + 16);
}

function drawPlannerMembers(ctx, members, time) {
  const bob = Math.floor(Math.sin(time / 260) * 2);
  const count = Math.max(1, Math.min(4, members.length || 1));

  for (let i = 0; i < count; i += 1) {
    const x = 628 + i * 28;
    const y = 638 + bob + (i % 2) * 4;
    ctx.fillStyle = "rgba(28, 20, 13, 0.36)";
    ctx.fillRect(x + 2, y + 26, 18, 4);
    ctx.fillStyle = i % 2 ? "#496fa6" : "#3f7e53";
    ctx.fillRect(x + 5, y + 13, 12, 14);
    ctx.fillStyle = "#f0bf83";
    ctx.fillRect(x + 4, y + 5, 13, 11);
    ctx.fillStyle = "#4f2f1f";
    ctx.fillRect(x + 4, y + 3, 13, 4);
    ctx.fillStyle = "#26302b";
    ctx.fillRect(x + 6, y + 26, 4, 8);
    ctx.fillRect(x + 14, y + 26, 4, 8);
  }
}

function drawAiPartnerNpc(ctx, farm, time) {
  const npc = updateAiPartnerNpc(time, farm);
  const bob = Math.floor(Math.sin(time / 220) * 2);
  const x = Math.round(npc.x);
  const y = Math.round(npc.y + bob);
  const stride = npc.walking ? Math.round(Math.sin(npc.stepPhase) * 4) : 0;
  const liftA = npc.walking && stride > 0 ? 2 : 0;
  const liftB = npc.walking && stride < 0 ? 2 : 0;
  const armSwing = npc.walking ? Math.round(Math.sin(npc.stepPhase) * 3) : 0;

  ctx.save();
  ctx.fillStyle = "rgba(22, 18, 12, 0.34)";
  ctx.fillRect(x - 13, y + 5, 30, 5);

  ctx.fillStyle = "#27302b";
  ctx.fillRect(x - 6 + stride, y - 2 - liftA, 5, 11);
  ctx.fillRect(x + 5 - stride, y - 2 - liftB, 5, 11);
  ctx.fillStyle = "#1d2421";
  ctx.fillRect(x - 7 + stride, y + 7 - liftA, 7, 3);
  ctx.fillRect(x + 4 - stride, y + 7 - liftB, 7, 3);

  ctx.fillStyle = "#1f5f61";
  ctx.fillRect(x - 13 - Math.round(armSwing / 2), y - 21, 5, 15);
  ctx.fillRect(x + 11 + Math.round(armSwing / 2), y - 21, 5, 15);
  ctx.fillStyle = "#2f6f70";
  ctx.fillRect(x - 8, y - 24, 18, 22);
  ctx.fillStyle = "#78d5cf";
  ctx.fillRect(x - 5, y - 20, 12, 5);
  ctx.fillStyle = "#f0bf83";
  ctx.fillRect(x - 7, y - 38, 17, 14);
  ctx.fillStyle = "#26302b";
  ctx.fillRect(x - 7, y - 42, 17, 6);
  ctx.fillRect(x - 3, y - 31, 3, 3);
  ctx.fillRect(x + 5, y - 31, 3, 3);
  ctx.fillStyle = "#ffd978";
  ctx.fillRect(x + (npc.direction >= 0 ? 11 : -13), y - 21, 5, 5);

  if (state.editor.selectedNpc) {
    drawSelectionRing(ctx, x - 12, y - 44, 34, 54, "#78d5cf");
  }

  drawAiNpcSpeech(ctx, npc.phrase, x, y - 58);
  ctx.restore();
}

function updateAiPartnerNpc(time, farm) {
  const npc = state.npc;
  if (!npc.phrase || time >= npc.nextPhraseAt) {
    npc.phrase = pickAiNpcLine(farm, npc.phrase);
    npc.nextPhraseAt = time + randomBetween(60_000, 120_000);
  }

  const lastTime = npc.lastTime || time;
  const dt = Math.min(0.08, Math.max(0, time - lastTime) / 1000);
  npc.lastTime = time;
  ensureNpcTarget(npc, time);

  const distance = Math.hypot(npc.targetX - npc.x, npc.targetY - npc.y);
  if (distance < 4) {
    npc.x = npc.targetX;
    npc.y = npc.targetY;
    npc.previousWaypointId = npc.waypointId;
    npc.waypointId = npc.targetWaypointId || nearestNpcWaypoint(npc.x, npc.y).id;
    npc.walking = false;
    npc.stepPhase = 0;
    const target = pickNextNpcWaypoint(npc.waypointId, npc.previousWaypointId);
    setNpcTarget(npc, target, time + randomBetween(600, 2200));
    return npc;
  }

  if (time < npc.nextMoveAt) {
    npc.walking = false;
    return npc;
  }

  const dx = npc.targetX - npc.x;
  const dy = npc.targetY - npc.y;
  const nextDistance = Math.hypot(dx, dy);
  if (nextDistance > 0.5) {
    const step = Math.min(nextDistance, 42 * dt);
    npc.x += (dx / nextDistance) * step;
    npc.y += (dy / nextDistance) * step;
    if (Math.abs(dx) > 0.2) npc.direction = dx >= 0 ? 1 : -1;
    npc.walking = true;
    npc.stepPhase += step * 0.45;
  }

  return npc;
}

function ensureNpcTarget(npc, time) {
  const current = aiNpcWaypointById[npc.waypointId] || nearestNpcWaypoint(npc.x, npc.y);
  npc.waypointId = current.id;
  if (!npc.targetWaypointId || !aiNpcWaypointById[npc.targetWaypointId]) {
    setNpcTarget(npc, pickNextNpcWaypoint(current.id, npc.previousWaypointId), time + randomBetween(400, 1600));
  }
}

function setNpcTarget(npc, waypoint, startAt) {
  npc.targetWaypointId = waypoint.id;
  npc.targetX = waypoint.x;
  npc.targetY = waypoint.y;
  npc.nextMoveAt = startAt;
}

function pickNextNpcWaypoint(currentId, previousId = "") {
  const current = aiNpcWaypointById[currentId] || aiNpcWaypointById.centerYard;
  const links = current.links || [];
  const forwardLinks = links.filter((id) => id !== previousId);
  const pool = forwardLinks.length && Math.random() > 0.25 ? forwardLinks : links;
  const nextId = pool[Math.floor(Math.random() * pool.length)] || "centerYard";
  return aiNpcWaypointById[nextId] || aiNpcWaypointById.centerYard;
}

function nearestNpcWaypoint(x, y) {
  return aiNpcWaypoints.reduce((nearest, point) => {
    const distance = Math.hypot(point.x - x, point.y - y);
    return distance < nearest.distance ? { point, distance } : nearest;
  }, { point: aiNpcWaypoints[0], distance: Infinity }).point;
}

function drawAiNpcSpeech(ctx, phrase, x, y) {
  if (!phrase) return;
  const lines = wrapNpcText(phrase, 15).slice(0, 3);
  const width = Math.min(260, Math.max(118, Math.max(...lines.map((line) => line.length)) * 13 + 24));
  const height = 22 + lines.length * 17;
  const left = Math.max(24, Math.min(ctx.canvas.width - width - 24, x - width / 2));
  const top = Math.max(108, y - height);

  ctx.fillStyle = "#3d2a1d";
  ctx.fillRect(left, top, width, height);
  ctx.fillStyle = "#fff2c9";
  ctx.fillRect(left + 4, top + 4, width - 8, height - 8);
  ctx.fillStyle = "#3d2a1d";
  ctx.fillRect(x - 3, top + height - 1, 8, 8);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 12px monospace";
  lines.forEach((line, index) => {
    ctx.fillText(line, left + 12, top + 21 + index * 17);
  });
}

function drawPlannerWeather(ctx, width, height, weather, time) {
  if (weather === "cloudy") {
    ctx.fillStyle = "rgba(219, 229, 214, 0.2)";
    ctx.fillRect(0, 0, width, height);
  }

  if (weather === "rain") {
    ctx.fillStyle = "rgba(47, 95, 127, 0.62)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(174, 219, 234, 0.86)";
    for (let i = 0; i < 140; i += 1) {
      const x = (i * 57 + Math.floor(time / 9)) % width;
      const y = (i * 31 + Math.floor(time / 4)) % height;
      ctx.fillRect(x, y, 2, 12);
    }
  }
}

function drawPlannerHud(ctx, team) {
  const bottomPanelY = ctx.canvas.height - 94;
  drawPixelPanel(ctx, 18, 18, 370, 76);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 28px monospace";
  ctx.fillText(team.name || "团队农场", 42, 58);
  ctx.font = "bold 16px monospace";
  ctx.fillText(`邀请码 ${team.code || "------"}`, 44, 82);

  drawPixelPanel(ctx, 888, 18, 360, 76);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 18px monospace";
  ctx.fillText(`天气 ${weatherLabel(team.weather || "sunny")}`, 914, 48);
  ctx.fillText(`状态 ${team.mood || "等待同步"}`, 914, 74);

  const signal = team.lastCalendarSignal;
  if (signal) {
    drawPixelPanel(ctx, 18, bottomPanelY, 480, 72);
    ctx.fillStyle = "#2b2117";
    ctx.font = "bold 17px monospace";
    ctx.fillText(`今日日程 ${signal.eventCount} 个  忙碌 ${signal.busyMinutes} 分钟`, 42, bottomPanelY + 32);
    ctx.fillText(`专注块 ${signal.focusBlocks} 个  作物成长 +${signal.growthBonus}`, 42, bottomPanelY + 56);
  }
}

function drawPixelPanel(ctx, x, y, width, height) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#fff1bd";
  ctx.fillRect(x + 6, y + 6, width - 12, height - 12);
  ctx.fillStyle = "#c88743";
  ctx.fillRect(x + 6, y + 6, width - 12, 5);
  ctx.fillRect(x + 6, y + height - 11, width - 12, 5);
}

function drawModuleGlow(ctx, x, y, width, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 8, y, width + 16, 8);
  ctx.fillRect(x - 2, y - 6, width + 4, 20);
}

function drawPixelLabel(ctx, title, subtitle, x, y) {
  const width = Math.max(118, title.length * 18);
  drawPixelPanel(ctx, x - 8, y, width, 46);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 15px monospace";
  ctx.fillText(title, x + 8, y + 22);
  ctx.font = "bold 12px monospace";
  ctx.fillText(subtitle, x + 8, y + 38);
}

function drawTinyProgress(ctx, x, y, growth) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x, y, 42, 6);
  ctx.fillStyle = growth >= 100 ? "#e9bd43" : "#4d9b59";
  ctx.fillRect(x + 1, y + 1, Math.min(40, Math.round((growth || 0) * 0.4)), 4);
}

function drawPlannerSprite(ctx, spriteName, x, y, scale = 1) {
  const image = plannerAssets.sprites[spriteName];
  const [width, height] = plannerSpriteSizes[spriteName] || [16, 16];
  const drawWidth = width * scale;
  const drawHeight = height * scale;

  if (imageReady(image)) {
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
  } else {
    ctx.fillStyle = "#4d3322";
    ctx.fillRect(x, y, drawWidth, drawHeight);
  }

  return [drawWidth, drawHeight];
}

function imageReady(image) {
  return Boolean(image?.complete && image.naturalWidth > 0);
}

function drawSky(ctx, width, height, weather) {
  const sky = weather === "rain" ? "#7da6b7" : weather === "cloudy" ? "#b7ced0" : "#8fc7e8";
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = weather === "rain" ? "#7298a8" : "#a7d5ed";
  for (let y = 8; y < 120; y += 20) {
    ctx.fillRect(0, y, width, 2);
  }

  drawSun(ctx, 520, 32, weather);
  drawCloud(ctx, 72, 42, weather);
  drawCloud(ctx, 250, 64, weather);
  if (weather !== "sunny") drawCloud(ctx, 390, 82, weather);
}

function drawSun(ctx, x, y, weather) {
  const core = weather === "rain" ? "#d5c687" : "#ffd15e";
  const glow = weather === "rain" ? "#b9be9a" : "#f6b94f";
  ctx.fillStyle = glow;
  ctx.fillRect(x - 10, y + 6, 44, 12);
  ctx.fillRect(x + 6, y - 10, 12, 44);
  ctx.fillStyle = core;
  ctx.fillRect(x, y, 24, 24);
  ctx.fillRect(x - 4, y + 6, 32, 12);
  ctx.fillRect(x + 6, y - 4, 12, 32);
}

function drawCloud(ctx, x, y, weather) {
  ctx.fillStyle = weather === "rain" ? "#d8d2b5" : "#fff4d0";
  ctx.fillRect(x, y + 12, 72, 14);
  ctx.fillRect(x + 10, y + 4, 24, 24);
  ctx.fillRect(x + 34, y, 22, 28);
  ctx.fillRect(x + 52, y + 8, 28, 18);
  ctx.fillStyle = weather === "rain" ? "#bcb694" : "#e6ddb8";
  ctx.fillRect(x + 8, y + 26, 58, 3);
}

function drawMountains(ctx, width, weather) {
  ctx.fillStyle = weather === "rain" ? "#6d8f70" : "#78a867";
  ctx.fillRect(0, 96, width, 38);
  ctx.fillStyle = weather === "rain" ? "#587d5c" : "#5f944f";
  for (let x = -24; x < width; x += 86) {
    ctx.fillRect(x, 92, 58, 18);
    ctx.fillRect(x + 12, 78, 34, 30);
    ctx.fillRect(x + 24, 70, 14, 12);
  }
  ctx.fillStyle = "#3f6d41";
  ctx.fillRect(0, 130, width, 8);
}

function drawGroundTiles(ctx, width, height, weather) {
  const base = weather === "rain" ? "#6ca15a" : "#79b757";
  ctx.fillStyle = base;
  ctx.fillRect(0, 132, width, height - 132);

  for (let y = 132; y < height; y += 16) {
    for (let x = 0; x < width; x += 16) {
      const even = (x / 16 + y / 16) % 2 === 0;
      ctx.fillStyle = even ? "rgba(255,255,255,0.07)" : "rgba(55,91,41,0.08)";
      ctx.fillRect(x, y, 16, 16);
      if ((x * 3 + y * 5) % 112 === 0) {
        ctx.fillStyle = "#e9d36a";
        ctx.fillRect(x + 7, y + 8, 3, 3);
      }
      if ((x * 7 + y * 2) % 128 === 0) {
        ctx.fillStyle = "#5c933f";
        ctx.fillRect(x + 4, y + 12, 7, 2);
      }
    }
  }
}

function drawFence(ctx, width) {
  ctx.fillStyle = "#6f4325";
  ctx.fillRect(0, 138, width, 5);
  ctx.fillRect(0, 162, width, 4);
  for (let x = 8; x < width; x += 32) {
    ctx.fillStyle = "#8b562e";
    ctx.fillRect(x, 132, 8, 38);
    ctx.fillStyle = "#b1763f";
    ctx.fillRect(x + 2, 134, 4, 10);
  }
}

function drawPath(ctx) {
  ctx.fillStyle = "#c89454";
  ctx.fillRect(118, 238, 84, 18);
  ctx.fillRect(154, 248, 52, 18);
  ctx.fillRect(174, 264, 44, 18);
  ctx.fillRect(182, 282, 38, 46);
  ctx.fillStyle = "#a9743e";
  for (let y = 242; y < 326; y += 12) {
    ctx.fillRect(166 + ((y / 12) % 2) * 10, y, 18, 3);
  }
}

function drawPond(ctx, x, y, weather, time) {
  ctx.fillStyle = "#315c63";
  ctx.fillRect(x + 10, y + 8, 86, 34);
  ctx.fillRect(x, y + 18, 106, 22);
  ctx.fillStyle = weather === "rain" ? "#3f7f9d" : "#4c9bc8";
  ctx.fillRect(x + 14, y + 10, 76, 28);
  ctx.fillRect(x + 4, y + 20, 96, 16);
  ctx.fillStyle = "#8dd0e8";
  const offset = Math.floor(time / 240) % 18;
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(x + 18 + i * 20 + offset / 2, y + 18 + (i % 2) * 8, 12, 2);
  }
  ctx.fillStyle = "#517d38";
  ctx.fillRect(x + 4, y + 12, 16, 6);
  ctx.fillRect(x + 84, y + 36, 18, 5);
}

function drawBarn(ctx, x, y) {
  ctx.fillStyle = "#4a2d1d";
  ctx.fillRect(x + 8, y + 24, 100, 74);
  ctx.fillStyle = "#b64c3f";
  ctx.fillRect(x + 12, y + 28, 92, 66);
  ctx.fillStyle = "#d6654f";
  for (let yy = y + 34; yy < y + 90; yy += 12) {
    ctx.fillRect(x + 18, yy, 80, 3);
  }
  ctx.fillStyle = "#6f2f2c";
  ctx.fillRect(x + 30, y + 60, 28, 34);
  ctx.fillStyle = "#f4d285";
  ctx.fillRect(x + 74, y + 50, 16, 16);
  ctx.fillStyle = "#4a2d1d";
  ctx.fillRect(x + 16, y + 18, 88, 12);
  ctx.fillRect(x + 28, y + 8, 64, 12);
  ctx.fillStyle = "#7b3a32";
  ctx.fillRect(x + 24, y + 12, 72, 10);
  ctx.fillRect(x + 36, y + 2, 48, 12);
  ctx.fillStyle = "#ffd873";
  ctx.fillRect(x + 79, y + 54, 6, 6);
}

function drawCalendarTower(ctx, x, y, weather) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 16, y + 28, 62, 92);
  ctx.fillStyle = "#d6ad66";
  ctx.fillRect(x + 20, y + 32, 54, 84);
  ctx.fillStyle = "#a36a37";
  ctx.fillRect(x + 14, y + 22, 66, 14);
  ctx.fillRect(x + 26, y + 8, 42, 16);
  ctx.fillStyle = weather === "rain" ? "#d9e0d1" : "#fff2be";
  ctx.fillRect(x + 32, y + 46, 30, 30);
  ctx.fillStyle = "#473021";
  ctx.fillRect(x + 36, y + 50, 22, 4);
  ctx.fillRect(x + 36, y + 58, 16, 4);
  ctx.fillRect(x + 36, y + 66, 20, 4);
  ctx.fillStyle = "#7e4f2b";
  ctx.fillRect(x + 38, y + 88, 18, 28);
}

function drawBitableShed(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 4, y + 28, 84, 52);
  ctx.fillStyle = "#c17b3e";
  ctx.fillRect(x + 8, y + 32, 76, 44);
  ctx.fillStyle = "#6c4228";
  ctx.fillRect(x, y + 18, 92, 14);
  ctx.fillStyle = "#e7c26b";
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      ctx.fillRect(x + 18 + col * 13, y + 40 + row * 10, 9, 6);
    }
  }
  ctx.fillStyle = "#4f2f1f";
  ctx.fillRect(x + 38, y + 58, 20, 18);
}

function drawDocumentBoard(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 10, y + 4, 74, 46);
  ctx.fillStyle = "#8a552f";
  ctx.fillRect(x + 14, y + 8, 66, 38);
  ctx.fillStyle = "#fff1b8";
  ctx.fillRect(x + 22, y + 14, 18, 22);
  ctx.fillRect(x + 48, y + 14, 22, 16);
  ctx.fillStyle = "#7b4a2a";
  ctx.fillRect(x + 20, y + 50, 8, 34);
  ctx.fillRect(x + 66, y + 50, 8, 34);
}

function drawPlacedItems(ctx, items) {
  [...items].sort((a, b) => (a.y - b.y) || (a.x - b.x)).forEach((item) => {
    drawPlaceableItem(ctx, item.itemId || item.id, item.x, item.y, false, item);
  });
}

function drawPlacementPreview(ctx) {
  if (!state.editor.placement || !state.editor.cursor) return;
  const maxX = ctx.canvas.width >= 1000 ? ctx.canvas.width - 64 : 596;
  const maxY = ctx.canvas.width >= 1000 ? ctx.canvas.height - 64 : 318;
  const minY = ctx.canvas.width >= 1000 ? 96 : 140;
  const x = snapToGrid(Math.max(20, Math.min(maxX, state.editor.cursor.x)));
  const y = snapToGrid(Math.max(minY, Math.min(maxY, state.editor.cursor.y)));
  drawPlaceableItem(ctx, state.editor.placement, x, y, true);
}

function drawPlaceableItem(ctx, id, x, y, preview, object = null) {
  if (ctx.canvas.width >= 1000) {
    drawPlannerPlaceableItem(ctx, id, x, y, preview, object);
    return;
  }

  ctx.save();
  if (preview) ctx.globalAlpha = 0.68;

  const blocked = preview && y < 148;
  ctx.fillStyle = blocked ? "rgba(190, 61, 54, 0.7)" : "rgba(255, 238, 155, 0.72)";
  ctx.fillRect(x - 18, y - 10, 36, 24);
  ctx.strokeStyle = blocked ? "#8f2e28" : "#f6dc70";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 18, y - 10, 36, 24);

  if (id === "calendarTower") drawMiniCalendarTower(ctx, x - 14, y - 44);
  else if (id === "bitableShed") drawMiniBitableShed(ctx, x - 18, y - 32);
  else if (id === "docBoard") drawMiniDocBoard(ctx, x - 16, y - 28);
  else if (id === "aiCabin") drawMiniAiCabin(ctx, x - 18, y - 34);
  else if (id === "shed") drawMiniShed(ctx, x - 18, y - 32);
  else if (id === "well") drawMiniWell(ctx, x - 13, y - 28);
  else if (id === "pathSign") drawMiniSign(ctx, x - 14, y - 26);
  else if (id === "plot") drawMiniPlot(ctx, x - 18, y - 18);
  else if (id === "sproutPatch") drawMiniCropPatch(ctx, x - 18, y - 20, "#62b958");
  else if (id === "wheatPatch") drawMiniCropPatch(ctx, x - 18, y - 20, "#dfbd52");
  else if (id === "flowerBed") drawMiniFlowerBed(ctx, x - 18, y - 20);
  else if (id === "lamp") drawMiniLamp(ctx, x - 8, y - 34);
  else if (id === "bench") drawMiniBench(ctx, x - 18, y - 18);

  ctx.restore();
}

function drawPlannerPlaceableItem(ctx, id, x, y, preview, object = null) {
  const item = findCatalogItem(id);
  const sprite = item?.sprite || id;
  const [baseWidth, baseHeight] = plannerSpriteSizes[sprite] || [16, 16];
  const scale = plannerScaleForPlacedSprite(sprite);
  const width = baseWidth * scale;
  const height = baseHeight * scale;

  ctx.save();
  if (preview) ctx.globalAlpha = 0.66;
  ctx.fillStyle = preview ? "rgba(255, 238, 155, 0.58)" : "rgba(255, 238, 155, 0.28)";
  ctx.fillRect(x - 4, y + height - 8, width + 8, 8);
  ctx.strokeStyle = preview ? "#f6dc70" : "rgba(76, 51, 34, 0.42)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
  drawPlannerSprite(ctx, sprite, x, y, scale);
  const selected = !preview && object && state.editor.selectedObjectId === (object.id || object.objectId);
  if (selected) {
    drawSelectionRing(ctx, x, y, width, height, "#ffd978");
  }
  if (item && selected) {
    drawPixelLabel(ctx, object?.title || item.label, object?.resource?.kind || item.module || "飞书信号", x, y - 44);
  }
  ctx.restore();
}

function plannerScaleForPlacedSprite(sprite) {
  return plannerPlacedScales[sprite] || 1;
}

function drawMiniCalendarTower(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 5, y + 12, 24, 38);
  ctx.fillStyle = "#d6ad66";
  ctx.fillRect(x + 8, y + 15, 18, 32);
  ctx.fillStyle = "#8a552f";
  ctx.fillRect(x + 4, y + 8, 26, 8);
  ctx.fillStyle = "#fff2be";
  ctx.fillRect(x + 11, y + 23, 12, 12);
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 13, y + 27, 8, 2);
  ctx.fillRect(x + 13, y + 32, 6, 2);
}

function drawMiniBitableShed(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 2, y + 14, 36, 26);
  ctx.fillStyle = "#c17b3e";
  ctx.fillRect(x + 5, y + 17, 30, 20);
  ctx.fillStyle = "#6c4228";
  ctx.fillRect(x, y + 8, 40, 9);
  ctx.fillStyle = "#e7c26b";
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      ctx.fillRect(x + 9 + col * 8, y + 21 + row * 7, 5, 4);
    }
  }
}

function drawMiniDocBoard(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 4, y + 4, 32, 24);
  ctx.fillStyle = "#8a552f";
  ctx.fillRect(x + 7, y + 7, 26, 18);
  ctx.fillStyle = "#fff1b8";
  ctx.fillRect(x + 11, y + 10, 8, 11);
  ctx.fillRect(x + 22, y + 10, 8, 8);
  ctx.fillStyle = "#7b4a2a";
  ctx.fillRect(x + 8, y + 28, 4, 16);
  ctx.fillRect(x + 28, y + 28, 4, 16);
}

function drawMiniAiCabin(ctx, x, y) {
  drawMiniShed(ctx, x, y);
  ctx.fillStyle = "#7dd4d0";
  ctx.fillRect(x + 13, y + 18, 12, 10);
  ctx.fillStyle = "#29372f";
  ctx.fillRect(x + 16, y + 21, 2, 2);
  ctx.fillRect(x + 21, y + 21, 2, 2);
}

function drawMiniShed(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 3, y + 15, 34, 25);
  ctx.fillStyle = "#b85a46";
  ctx.fillRect(x + 6, y + 18, 28, 19);
  ctx.fillStyle = "#6f2f2c";
  ctx.fillRect(x + 15, y + 27, 9, 10);
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x, y + 9, 40, 8);
}

function drawMiniWell(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 3, y + 20, 24, 14);
  ctx.fillStyle = "#8c9b8e";
  ctx.fillRect(x + 6, y + 22, 18, 9);
  ctx.fillStyle = "#7b4a2a";
  ctx.fillRect(x + 5, y + 6, 4, 16);
  ctx.fillRect(x + 21, y + 6, 4, 16);
  ctx.fillStyle = "#c95f4f";
  ctx.fillRect(x + 1, y, 28, 8);
}

function drawMiniSign(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 12, y + 18, 5, 22);
  ctx.fillStyle = "#ad7438";
  ctx.fillRect(x, y + 7, 30, 16);
  ctx.fillStyle = "#fff1b8";
  ctx.fillRect(x + 6, y + 13, 18, 3);
}

function drawMiniPlot(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x, y, 36, 24);
  ctx.fillStyle = "#8f5a2e";
  ctx.fillRect(x + 3, y + 3, 30, 18);
  ctx.fillStyle = "#6f4325";
  ctx.fillRect(x + 6, y + 8, 24, 3);
  ctx.fillRect(x + 6, y + 15, 24, 3);
}

function drawMiniCropPatch(ctx, x, y, color) {
  drawMiniPlot(ctx, x, y + 2);
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(x + 7 + i * 6, y + 7, 4, 12);
    ctx.fillRect(x + 5 + i * 6, y + 10, 8, 3);
  }
}

function drawMiniFlowerBed(ctx, x, y) {
  drawMiniPlot(ctx, x, y + 2);
  const colors = ["#df6b71", "#f0d45f", "#7cc6de"];
  for (let i = 0; i < 5; i += 1) {
    ctx.fillStyle = "#2f8b56";
    ctx.fillRect(x + 5 + i * 6, y + 12, 3, 8);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x + 3 + i * 6, y + 8, 7, 6);
  }
}

function drawMiniLamp(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 6, y + 12, 5, 32);
  ctx.fillStyle = "#f2b647";
  ctx.fillRect(x + 1, y + 4, 15, 12);
  ctx.fillStyle = "#fff1b8";
  ctx.fillRect(x + 5, y + 7, 7, 6);
}

function drawMiniBench(ctx, x, y) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x + 4, y + 15, 28, 5);
  ctx.fillRect(x + 6, y + 22, 24, 5);
  ctx.fillRect(x + 8, y + 27, 4, 10);
  ctx.fillRect(x + 26, y + 27, 4, 10);
  ctx.fillStyle = "#ad7438";
  ctx.fillRect(x + 3, y + 13, 30, 4);
  ctx.fillRect(x + 5, y + 20, 26, 4);
}

function drawPlots(ctx, plots, sway) {
  const originX = 198;
  const originY = 145;
  const plotW = 88;
  const plotH = 48;
  const gapX = 14;
  const gapY = 12;

  plots.forEach((plot, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = originX + col * (plotW + gapX);
    const y = originY + row * (plotH + gapY);
    drawPlotFrame(ctx, x, y, plotW, plotH, plot.moisture);

    if (plot.crop) {
      drawCrop(ctx, x + 24, y + 8, plot, sway);
      drawGrowthBar(ctx, x + 12, y + plotH - 9, plot.growth);
    } else {
      ctx.fillStyle = "#6f4325";
      ctx.fillRect(x + 30, y + 18, 28, 8);
      ctx.fillStyle = "#b4783d";
      ctx.fillRect(x + 34, y + 18, 20, 2);
    }
  });
}

function drawPlotFrame(ctx, x, y, width, height, moisture) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#7a4a2b";
  ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
  ctx.fillStyle = moisture > 70 ? "#8b5b35" : "#9d6637";
  ctx.fillRect(x + 8, y + 8, width - 16, height - 16);
  ctx.fillStyle = moisture > 70 ? "#6d452b" : "#7d4e2d";
  for (let row = 0; row < 3; row += 1) {
    ctx.fillRect(x + 12, y + 13 + row * 10, width - 24, 4);
  }
  ctx.fillStyle = "#b97842";
  ctx.fillRect(x + 8, y + 8, width - 16, 3);
}

function drawCrop(ctx, x, y, plot, sway) {
  const palette = cropPalette[plot.crop] || cropPalette.sprout;
  const stage = Math.max(1, Math.ceil((plot.growth || 0) / 25));
  ctx.fillStyle = "#2d5f3b";
  ctx.fillRect(x + 18 + sway, y + 22 - stage * 2, 6, 16 + stage);
  ctx.fillStyle = palette.leaf;
  ctx.fillRect(x + 15 + sway, y + 18 - stage * 3, 12, 22 + stage);
  ctx.fillRect(x + 4 + sway, y + 21 - stage * 2, 20, 6);
  ctx.fillRect(x + 23 + sway, y + 15 - stage * 2, 22, 6);
  ctx.fillStyle = "#6bc26d";
  ctx.fillRect(x + 17 + sway, y + 19 - stage * 3, 5, 12);
  if (stage >= 3) {
    ctx.fillStyle = "#4d3322";
    ctx.fillRect(x + 18 + sway, y + 28 - stage * 6, 18, 18);
    ctx.fillStyle = palette.fruit;
    ctx.fillRect(x + 20 + sway, y + 30 - stage * 6, 14, 14);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(x + 22 + sway, y + 32 - stage * 6, 4, 4);
  }
}

function drawGrowthBar(ctx, x, y, growth) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(x - 1, y - 1, 62, 6);
  ctx.fillStyle = "#f1db97";
  ctx.fillRect(x, y, 60, 4);
  ctx.fillStyle = growth >= 100 ? "#e9bd43" : "#4d9b59";
  ctx.fillRect(x, y, Math.min(60, Math.round((growth || 0) * 0.6)), 4);
}

function drawCharacters(ctx, members, time) {
  const baseX = 138;
  const bob = Math.floor(Math.sin(time / 260) * 2);
  const count = Math.max(1, Math.min(4, members.length || 1));
  for (let i = 0; i < count; i += 1) {
    const x = baseX + i * 22;
    const y = 286 + bob + (i % 2) * 6;
    ctx.fillStyle = "#332319";
    ctx.fillRect(x + 4, y + 31, 16, 4);
    ctx.fillStyle = i % 2 ? "#406e8c" : "#3d5d8b";
    ctx.fillRect(x + 6, y + 14, 12, 16);
    ctx.fillStyle = "#f0bf83";
    ctx.fillRect(x + 4, y + 4, 12, 12);
    ctx.fillStyle = "#513e2d";
    ctx.fillRect(x + 4, y + 2, 12, 4);
    ctx.fillStyle = "#26302b";
    ctx.fillRect(x + 6, y + 30, 4, 8);
    ctx.fillRect(x + 14, y + 30, 4, 8);
    if (i === 0) {
      ctx.fillStyle = "#75a7c9";
      ctx.fillRect(x + 20, y + 18, 18, 4);
      ctx.fillRect(x + 34, y + 22, 4, 10);
    }
  }
}

function drawWeather(ctx, width, weather, time) {
  if (weather === "rain") {
    ctx.fillStyle = "rgba(39, 88, 119, 0.82)";
    for (let i = 0; i < 58; i += 1) {
      const x = (i * 43 + Math.floor(time / 10)) % width;
      const y = (i * 29 + Math.floor(time / 5)) % 350;
      ctx.fillRect(x, y, 2, 10);
    }
  }
  if (weather === "cloudy") {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(0, 0, width, 360);
  }
}

function drawHud(ctx, team) {
  ctx.fillStyle = "#4d3322";
  ctx.fillRect(16, 14, 250, 50);
  ctx.fillStyle = "#fff1bd";
  ctx.fillRect(20, 18, 242, 42);
  ctx.fillStyle = "#c88743";
  ctx.fillRect(20, 18, 242, 4);
  ctx.fillRect(20, 56, 242, 4);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 18px monospace";
  ctx.fillText(`${team.name || "团队农场"}`, 32, 46);

  ctx.fillStyle = "#4d3322";
  ctx.fillRect(436, 14, 186, 50);
  ctx.fillStyle = "#fff1bd";
  ctx.fillRect(440, 18, 178, 42);
  ctx.fillStyle = "#2b2117";
  ctx.font = "bold 15px monospace";
  ctx.fillText(`天气 ${weatherLabel(team.weather || "sunny")}`, 454, 36);
  ctx.fillText(`收获 ${team.harvests || 0}`, 454, 52);
}

function demoFarm() {
  return {
    members: [{ name: "你" }, { name: "队友" }],
    team: {
      name: "团队农场预览",
      weather: "sunny",
      mood: "等待登录",
      harvests: 0,
      plots: [
        { crop: "turnip", growth: 40, moisture: 70 },
        { crop: "carrot", growth: 72, moisture: 68 },
        { crop: "sprout", growth: 24, moisture: 66 },
        { crop: "wheat", growth: 86, moisture: 60 },
        { crop: "", growth: 0, moisture: 0 },
        { crop: "", growth: 0, moisture: 0 },
        { crop: "turnip", growth: 18, moisture: 55 },
        { crop: "", growth: 0, moisture: 0 },
        { crop: "sprout", growth: 52, moisture: 72 }
      ]
    }
  };
}

function pickAiNpcLine(farm, previous = "") {
  const signal = farm?.team?.lastCalendarSignal;
  const backlogCount = (farm?.backlogRecords || []).filter((record) => record.status !== "done").length;
  const doneCount = (farm?.backlogRecords || []).filter((record) => record.status === "done").length;
  const activeCount = farm?.farmObjects?.length || 0;
  const factoryBound = farm?.todoFactory?.bound;
  const lines = [
    signal
      ? `今天我读到 ${signal.eventCount} 个日程，农场天气是${weatherLabel(farm?.team?.weather)}。`
      : "先同步计划吧，我会把今天的日程变成农场天气。",
    backlogCount
      ? `待办厂里有 ${backlogCount} 条未完成，今晚别让它们继续堆肥。`
      : "待办厂现在很轻，适合把新事项种到对应区域。",
    activeCount
      ? `农场里有 ${activeCount} 个飞书物件，点开它们可以绑定真实链接。`
      : "地图还很空，先种一个云文档小屋或任务种子试试。",
    doneCount
      ? `成果晾晒绳已经挂了 ${doneCount} 条，今天可以讲一点收获故事。`
      : "完成一个事项后，把它挂到成果晾晒绳，会更像团队记忆。",
    factoryBound
      ? "多维表格底库已经绑定，我可以按字段帮你整理农场状态。"
      : "未完成待办厂还没绑定真实多维表格，可以先用本地底库跑通玩法。",
    "我是农场里的 Aily 向导，点我可以打开飞书智能伙伴入口。",
    "如果评委问价值，就说：工作信号变成可见农场，团队协作变得有反馈。"
  ].filter((line) => line && line !== previous);

  return lines[Math.floor(Math.random() * lines.length)] || previous || "我正在观察这片团队农场。";
}

function buildAiNpcPrompt(farm) {
  const team = farm?.team || {};
  const signal = team.lastCalendarSignal;
  const backlog = (farm?.backlogRecords || []).filter((record) => record.status !== "done");
  const done = (farm?.backlogRecords || []).filter((record) => record.status === "done");
  const objects = farm?.farmObjects || [];

  return [
    "你是飞书团队农场里的智能伙伴，请根据下面状态给我 3 条今天最该处理的建议，并用轻松的农场口吻表达。",
    `团队：${team.name || "未命名团队"}`,
    `天气：${weatherLabel(team.weather || "sunny")}，状态：${team.mood || "等待同步"}`,
    signal
      ? `今日日程：${signal.eventCount} 个，忙碌 ${signal.busyMinutes} 分钟，专注块 ${signal.focusBlocks} 个`
      : "今日日程：未同步",
    `农场物件：${objects.length} 个`,
    `未完成待办厂：${backlog.length} 条`,
    `成果晾晒绳：${done.length} 条`,
    `多维表格底库：${farm?.todoFactory?.bound ? "已绑定" : "未绑定"}`,
    "请优先指出：今天该同步什么、该清算什么、该完成并晾晒什么。"
  ].join("\n");
}

function wrapNpcText(text, limit) {
  const chars = Array.from(String(text || ""));
  const lines = [];
  for (let index = 0; index < chars.length; index += limit) {
    lines.push(chars.slice(index, index + limit).join(""));
  }
  return lines.length ? lines : [""];
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function weatherLabel(weather) {
  return {
    sunny: "晴朗",
    cloudy: "多云",
    rain: "会议雨"
  }[weather] || "未知";
}

function formatSyncTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function localDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function findCatalogItem(itemId) {
  return Object.values(itemCatalog)
    .flatMap((group) => group.items)
    .find((item) => item.id === itemId);
}

function authMessageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const auth = params.get("auth");
  if (!auth) return "";

  window.history.replaceState({}, document.title, "/");
  if (auth === "denied") return "你取消了飞书授权";
  if (auth === "invalid_state") return "登录状态校验失败，请重新尝试";
  return "";
}

function showToast(message) {
  if (!message) return;
  const existing = document.querySelector(".toast");
  existing?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
