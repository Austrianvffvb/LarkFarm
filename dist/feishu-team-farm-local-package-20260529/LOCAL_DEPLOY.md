# 飞书团队农场本地部署说明

这是一份给 vibe coding 工具或其他本地开发环境使用的部署说明。项目默认只在本地运行，不需要公网域名即可体验基础功能。

## 1. 环境要求

- Node.js 20 或以上
- 一个飞书企业自建应用
- 本地浏览器

## 2. 解压项目

将压缩包解压到任意本地目录，例如：

```bash
feishu-team-farm/
```

进入目录：

```bash
cd feishu-team-farm
```

## 3. 配置环境变量

复制示例配置：

```bash
cp .env.example .env
```

打开 `.env`，填写自己的飞书应用信息：

```text
FEISHU_APP_ID=你的飞书应用 App ID
FEISHU_APP_SECRET=你的飞书应用 App Secret
FEISHU_REDIRECT_URI=http://127.0.0.1:3000/api/auth/feishu/callback
```

注意：

- 不要把 `.env` 发给别人。
- 不要把 App Secret 写进前端代码。
- `SESSION_SECRET` 可以改成任意较长随机字符串。

## 4. 飞书后台配置

在飞书开发者后台的应用安全设置中添加重定向 URL：

```text
http://127.0.0.1:3000/api/auth/feishu/callback
```

建议开通以下权限：

```text
offline_access
auth:user.id:read
calendar:calendar:readonly
task:task:read
task:tasklist:read
task:comment:read
docx:document:readonly
docs:document.comment:read
wiki:wiki:readonly
drive:drive:readonly
bitable:app
bitable:app:readonly
base:table:read
base:field:read
base:field:create
base:record:read
base:record:retrieve
base:record:create
base:record:update
contact:contact.base:readonly
contact:user.base:readonly
contact:user.department:readonly
contact:department.base:readonly
im:chat:read
im:chat.members:read
im:message:readonly
approval:approval.list:readonly
approval:approval:readonly
okr:okr:readonly
okr:okr.content:readonly
okr:okr.progress:readonly
```

如果只想体验登录和日历同步，至少需要：

```text
offline_access
auth:user.id:read
calendar:calendar:readonly
```

如果要同步多维表格底库，需要确保：

- 应用已开通多维表格相关写权限。
- 当前登录用户对目标多维表格有编辑权限。
- 用户重新授权过最新 scope。

## 5. 启动项目

项目没有第三方 npm 依赖，直接运行：

```bash
npm run dev
```

打开浏览器：

```text
http://127.0.0.1:3000/
```

## 6. 首次使用流程

1. 点击“使用飞书登录”。
2. 扫码或确认授权。
3. 创建一个团队农场。
4. 点击“同步计划”，读取今天的真实飞书日历。
5. 在农场里点击不同区域，查看对应玩法。
6. 选择作物或建筑，把飞书模块种到地图上。
7. 如需多维表格底库，点击待办厂/结构设施并绑定自己的多维表格链接。
8. 点击“同步底库”，把农场记录写入多维表格。

## 7. 重要文件说明

```text
server.js                 本地 Node 服务和飞书 API 逻辑
public/index.html          页面入口
public/app.js              游戏状态、地图绘制、交互逻辑
public/styles.css          游戏 UI 和响应式布局
public/assets/             像素农场素材
docs/                      项目说明和策划文档
.env.example               环境变量模板
```

项目第一次运行时会自动创建：

```text
data/farm-db.json
```

这个文件保存本地登录态、团队、农场对象和同步记录。它不应该被分享给别人。

## 8. 常见问题

### 登录后提示重定向 URL 错误

检查飞书开发者后台是否配置了：

```text
http://127.0.0.1:3000/api/auth/feishu/callback
```

并确认 `.env` 中的 `FEISHU_REDIRECT_URI` 完全一致。

### 多维表格同步失败

通常是以下原因之一：

- 应用没有开通 `bitable:app` 或 `base:field:create` 等写权限。
- 当前登录用户没有目标多维表格编辑权限。
- 修改权限后没有重新走飞书授权。

### Aily 客户端打不开

项目会尝试唤起飞书客户端或打开网页 Aily。不同系统和浏览器对协议跳转支持不同，如果客户端没有响应，可以使用网页 Aily 或复制农场上下文后手动粘贴。

## 9. 素材和发布提醒

当前压缩包用于本地演示、黑客松和 vibe coding 继续开发。项目中包含像素农场参考素材，适合本地原型验证。

如果未来要公开发布或商业化上线，请替换为原创像素素材，并补齐正式的版权、隐私、权限和安全说明。
