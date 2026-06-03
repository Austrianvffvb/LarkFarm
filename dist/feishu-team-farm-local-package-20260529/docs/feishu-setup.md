# 飞书接入清单

## 1. 创建企业自建应用

在飞书开发者后台创建企业自建应用，记录：

- App ID
- App Secret

App Secret 只放在本地 `.env`，不要写进前端代码。

## 2. 开通权限

本地原型的授权分两层：

用户登录 OAuth 会请求这些读权限，用来把飞书行为同步成农场信号：

- `auth:user.id:read`
- `calendar:calendar:readonly`
- `offline_access`
- `task:task:read`
- `task:tasklist:read`
- `task:comment:read`
- `docx:document:readonly`
- `docs:document.comment:read`
- `wiki:wiki:readonly`
- `drive:drive:readonly`
- `bitable:app:readonly`
- `contact:contact.base:readonly`
- `contact:user.base:readonly`
- `contact:user.department:readonly`
- `contact:department.base:readonly`
- `im:chat:read`
- `im:chat.members:read`
- `im:message:readonly`
- `approval:approval.list:readonly`
- `approval:approval:readonly`
- `okr:okr:readonly`
- `okr:okr.content:readonly`
- `okr:okr.progress:readonly`

会议、机器人发消息、接收群聊 @、事件订阅等先不放进 `FEISHU_SCOPES`。其中机器人/事件类属于应用身份权限；会议类如果未在用户身份权限中生效，会阻塞网页登录授权：

- `vc:meeting:readonly`
- `vc:reserve:readonly`
- `im:message:send_as_bot`
- `im:message.group_at_msg:readonly`
- `im:message.p2p_msg:readonly`

## 3. 配置回调地址

本地开发填：

```text
http://127.0.0.1:3000/api/auth/feishu/callback
```

如果部署到公网，把域名后的路径保持一致：

```text
https://your-domain.example/api/auth/feishu/callback
```

## 4. 配置本地环境

复制 `.env.example` 为 `.env`，填写：

```text
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
FEISHU_REDIRECT_URI=http://127.0.0.1:3000/api/auth/feishu/callback
```

然后重启服务。

## 5. 联调路径

1. 打开 `http://127.0.0.1:3000/`
2. 点击「使用飞书登录」
3. 授权后回到农场
4. 创建或加入团队
5. 点击「同步日历」

日历同步会把今天的日程数量、忙碌分钟数、专注块数转换成团队农场天气和作物成长值。
