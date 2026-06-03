# Feishu Team Farm

一个外部网页形态的低像素 2D 团队农场 MVP：

- 飞书 OAuth 登录
- 用户手动创建/加入团队
- 团队共享农场
- 飞书日历同步为农场天气与成长信号
- 本地 JSON 存储作为开发期游戏数据库，后续可迁移到多维表格

## 运行

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 在 `.env` 里填入飞书自建应用的 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET`。

3. 在飞书开发者后台配置重定向 URL：

```text
http://127.0.0.1:3000/api/auth/feishu/callback
```

4. 启动：

```bash
npm run dev
```

5. 打开：

```text
http://127.0.0.1:3000/
```

## 飞书权限

第一版需要：

- `calendar:calendar:readonly`：读取日历与日程
- `auth:user.id:read`：读取登录用户身份
- `offline_access`：后续刷新用户授权，避免频繁重新登录

## 设计说明

当前版本先用本地 `data/farm-db.json` 存储游戏数据，便于快速验证玩法。多维表格接入时，可以把这些集合迁移为：

- `users`
- `teams`
- `team_members`
- `plots`
- `calendar_signals`
- `interactions`
