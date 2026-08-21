# Driveline Wheels 项目规格说明

> 最后核对：2026-08-21
> 本文只记录当前代码已经实现的行为，同时明确尚未接通或仅为兼容保留的功能。

## 1. 项目定位

Driveline Wheels 是扎根广州永宁轮毂产业带的轮毂贸易和订单服务团队，主要面向海外经销商、进口商、批发商和改装门店。

网站不是零售结账商城，也不把 Driveline Wheels 描述成自有工厂。当前业务重点是：

1. **前置现场 QC**：从成品仓随机抽箱，按订单检查表核验辐条根部裂纹、气孔、尺寸、动平衡、涂层附着力、标识、配件和包装等项目。
2. **当地车型适配**：围绕东南亚日系轿车、中东 SUV 和 Toyota Hilux 等高频车型确认尺寸、PCD、ET、中心孔、载荷及刹车间隙。
3. **灵活订单模式**：支持符合条件的拼柜/混装试单，也支持稳定整柜交付，并协调黄埔港等华南港口出货。
4. **文件配套**：根据产品、市场和订单约定协调材质、疲劳、冲击测试报告及清关文件。

核心英文定位：

> A Guangzhou-based wheel sourcing, quality control and export service partner.

## 2. 当前技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18、React Router 6、Vite 5、Tailwind CSS、Lucide React |
| 后端 | Node.js、Express 4、WebSocket (`ws`) |
| 认证 | bcryptjs、JWT（7天有效期） |
| 邮件 | Nodemailer + SMTP，默认使用 QQ SMTP |
| 数据 | JSON 文件；混装清单和旧购物车/旧 IM 使用内存对象 |
| SEO | React 服务端渲染预渲染、Canonical、Open Graph、JSON-LD、Sitemap、Robots |

仓库采用前后端同仓结构：

```text
part-mall/
├─ client/                 React/Vite 前端
│  ├─ public/              轮毂、团队、QC 等静态图片
│  ├─ scripts/prerender.mjs
│  └─ src/
│     ├─ api/              WebSocket API 客户端
│     ├─ components/       Header、Footer、询价弹窗、客服、后台工具栏
│     ├─ context/          Auth、Store、QuoteModal
│     ├─ data/             SEO 服务页、文章及基础内容
│     └─ pages/            页面组件
├─ server/
│  ├─ data/                JSON 业务数据
│  ├─ middleware/          JWT 与权限中间件
│  ├─ routes/              兼容 REST API、公开询单
│  ├─ services/            邮件、持久化客服会话
│  ├─ websocket.js         当前前端主要业务协议
│  ├─ seed.js              首次 Admin 初始化
│  └─ index.js             Express/HTTP/WebSocket 入口
├─ README.md
├─ SEO.md
└─ SPEC.md
```

## 3. 用户角色与权限

当前规范角色值：

```typescript
type UserRole = 'admin' | 'seller' | 'user';
```

旧数据中的 `salesperson` 会在服务端读取时兼容转换为 `seller`，前端也暂时保留兼容判断。

| 能力 | 普通用户 `user` | 销售员 `seller` | 管理员 `admin` |
|------|-----------------|-----------------|----------------|
| 浏览公开页面和产品 | 是 | 是 | 是 |
| 使用混装清单并提交登录后 RFQ | 是 | 是 | 是 |
| 与机器人聊天、申请人工 | 是 | 不使用客户聊天窗 | 不使用客户聊天窗 |
| 进入客服会话收件箱 | 否 | 是 | 是 |
| 认领并回复客服会话 | 否 | 是，仅本人认领/被分配会话 | 是 |
| 查看全部开放客服会话 | 否 | 否 | 是 |
| 转移客服会话 | 否 | 否 | 是 |
| 商品、用户、文章、FAQ 后台 | 否 | 否 | 是 |
| 设置普通用户/Seller角色 | 否 | 否 | 是 |

角色路由守卫：

- `RequireAuth`：要求已登录。
- `RequireAdmin`：只允许 `admin`。
- `RequireStaff`：允许 `seller`、兼容角色 `salesperson` 和 `admin`。

## 4. 前端路由

### 4.1 公开页面

| 路径 | 页面 | 当前用途 |
|------|------|----------|
| `/` | `HomePage` | 品牌定位、四项服务、产品和询价入口 |
| `/products` | `Products` | 轮毂、轮胎、套装及配件列表，支持搜索、分类和价格排序 |
| `/products/:slug` | `ProductDetail` | 产品参数摘要、QC/文件说明、询价入口 |
| `/about` | `About` | 团队、永宁产业带定位、工作方式和 Leadership Team |
| `/news-blog/` | `NewsBlog` | 前端静态采购及技术文章列表 |
| `/news-blog/:slug` | `ArticleDetail` | 前端静态文章详情 |
| `/services/:slug` | `ServicePage` | QC、拼柜订单、出口文件服务页 |
| `/faq` | `FAQ` | 静态 FAQ，底部包含精简版 About Us |
| `/contact` | `Contact` | 无需登录的公开询单页面；站内链接通常被拦截为弹窗 |
| `/login` | `Login` | 登录和注册 |
| `/404`、未匹配路由 | `NotFound` | 友好404页面 |

当前服务页 slug：

- `quality-control`
- `mixed-container-orders`
- `export-documents`

### 4.2 登录后页面

| 路径 | 权限 | 用途 |
|------|------|------|
| `/quote` | 已登录 | Mixed Load 清单和登录后 RFQ 表单 |
| `/cart` | 兼容路由 | 自动跳转到 `/quote` |
| `/support/inbox` | Seller/Admin | 客服队列、认领、回复、转移和解决会话 |

### 4.3 Admin 页面

| 路径 | 用途 |
|------|------|
| `/admin` | 商品新增、编辑、删除 |
| `/admin/users` | 用户信息查询 |
| `/admin/roles` | 将 `user` 调整为 `seller`，或将 Seller 恢复为普通用户 |
| `/admin/articles` | 创建、查看和删除文章记录 |
| `/admin/faqs` | 创建、查看和删除 FAQ 记录 |

Admin 左侧固定竖排工具栏由 `AdminToolRail` 提供。Admin 账号在角色管理页面受保护，不能通过该页面修改角色。

## 5. 主要业务流程

### 5.1 产品浏览

1. `StoreContext` 启动时通过 WebSocket 请求 `products.list`。
2. 产品来源为 `server/data/products.json`。
3. 支持按名称/描述搜索、分类筛选、价格升降序和分页。
4. 产品卡不展示零售结账按钮，主要 CTA 为产品详情和询价。
5. 产品分类值：
   - `forged-wheel`
   - `cast-wheel`
   - `tire`
   - `wheel-set`
   - `accessory`

### 5.2 公开询单和询价弹窗

站内所有指向 `/contact` 的普通左键链接会由 `QuoteLinkInterceptor` 拦截并打开 `QuoteModal`。用户直接访问 `/contact` 时仍显示完整询单页面。

公开询单流程：

1. 用户填写姓名、公司、国家/市场、业务邮箱等信息。
2. 前端调用 `POST /api/quotes/public`。
3. 服务端校验必填字段、邮箱、数量和柜型，使用隐藏 `website` 字段拦截简单机器人。
4. 同一 IP + 邮箱一分钟内只能提交一次。
5. 数据写入 `server/data/quotes.json`，生成 `WEB-YYYYMMDD-XXXXXX` 编号。
6. 服务端异步向管理员通知邮箱发送新询单邮件。
7. 提交成功后，未登录用户可选择用询单邮箱创建账号；邮箱自动作为用户名，询单记录会关联新用户 ID。

当前公开询单字段：

- 姓名、公司、国家/市场、业务邮箱
- WhatsApp
- 目标车型
- 轮毂规格或产品
- 预计数量
- 柜型：`mixed-lcl` / `20gp` / `40hq` / `undecided`
- 目的港
- 颜色、包装、报告及其他要求

### 5.3 Mixed Load + 登录后 RFQ

1. 已登录用户把产品加入服务端内存中的 `mixedLoadStore`。
2. 用户可调整数量、删除或清空清单。
3. `/quote` 收集目标市场、车型、规格、预计数量、柜型、报告要求和备注。
4. 清单至少要有一个产品；预计数量必须为正整数。
5. 提交后生成 `RFQ-YYYYMMDD-XXXXXX` 编号，写入 `quotes.json`。
6. 提交成功后清空该用户的内存清单，并异步发送管理员邮件。

Mixed Load 当前不持久化，后端重启后会丢失尚未提交的清单。

### 5.4 账号与询单关联

- 邮箱用户名统一转为小写。
- 创建账号时可携带 `quoteReference`。
- 服务端使用“询单编号 + 相同邮箱”查找公开询单，并写入 `userId`、`accountLinkedAt`。
- 当前尚未实现用户端“我的询单”查询页面或查询接口，因此账号关联数据暂时只写入记录，用户不能在网站内查看询单状态。

### 5.5 持久化客服与转人工

当前用户界面使用新的持久化客服系统，不再使用旧的单次关键词聊天组件。

客户流程：

1. 登录用户打开右下角客服窗口。
2. 首次打开时创建一条 `bot_active` 会话和机器人欢迎消息。
3. 用户消息写入 `support-conversations.json`。
4. 普通问题由关键词机器人回复，并异步发送机器人聊天邮件通知。
5. 当消息包含人工、销售、正式报价、WhatsApp 等关键词，或用户点击 `Talk to Sales`，会话进入 `waiting_human`。
6. Seller/Admin 收到 WebSocket 实时通知。
7. 工作人员认领后状态为 `human_active`，机器人停止回复。
8. 工作人员可回复并将会话标记为 `resolved`；客户再次发消息后会恢复为新的机器人会话。

客服状态：

```typescript
type SupportStatus =
  | 'bot_active'
  | 'waiting_human'
  | 'human_active'
  | 'resolved'
  | 'closed';
```

Seller 只能查看等待认领、本人认领或被分配的会话；Admin 可以查看全部未关闭会话，并可将会话转移给其他 Seller/Admin。

### 5.6 邮件通知

`server/services/emailNotifications.js` 使用 Nodemailer 和 SMTP 异步发送纯文本邮件。

当前触发点：

- 公开询单保存成功
- 登录后 RFQ 保存成功
- 机器人正常处理并回复用户消息
- 兼容的旧 `support.chat` 请求

默认管理员通知邮箱为 `812353475@qq.com`，可通过环境变量覆盖。邮件失败只记录服务端错误，不影响聊天和询单保存；当前没有重试队列。

## 6. Admin 功能

### 6.1 商品管理

Admin 可以新增、编辑和删除产品。产品字段：

```typescript
interface Product {
  id: string;
  name: string;
  category: 'forged-wheel' | 'cast-wheel' | 'tire' | 'wheel-set' | 'accessory';
  price: number;
  stock: number;
  image: string;
  description: string;
}
```

服务端当前校验：名称2–50字符、有效分类、价格大于0、库存为非负整数、图片和描述必填。

### 6.2 用户和角色管理

Admin 获取的用户数据会移除密码字段。角色修改只接受：

```typescript
'user' | 'seller'
```

角色改变后：

- 写回 `users.json`
- 为目标用户生成包含新角色的 JWT
- 更新目标用户所有在线 WebSocket 连接
- 推送 `auth.role_updated`
- 前端更新 React 状态和 `localStorage`

### 6.3 文章与 FAQ 管理

后台文章支持 `draft`、`review`、`published` 状态，包含标题、slug、摘要、正文、图片和作者信息。FAQ 同样支持状态、问题、回答和分类。

当前限制：公开 `NewsBlog`、`ArticleDetail` 和 `FAQ` 页面仍读取前端静态内容，没有读取后台 JSON 数据。因此后台文章/FAQ 保存成功后不会自动出现在公开网站或 Sitemap。

## 7. WebSocket 协议

前端主要 API 使用同源 `/ws` 持久连接。

请求：

```json
{ "type": "products.list", "requestId": "uuid", "payload": {} }
```

响应：

```json
{ "type": "products.list", "requestId": "uuid", "success": true, "data": {} }
```

错误响应：

```json
{ "type": "products.list", "requestId": "uuid", "success": false, "error": "message" }
```

### 消息类型

| 分组 | 消息类型 |
|------|----------|
| Auth | `auth.login`、`auth.register`、`auth.me`、服务端推送 `auth.role_updated` |
| Products | `products.list`、`products.categories`、`products.get`、`products.create`、`products.update`、`products.delete` |
| Mixed Load | `mix.get`、`mix.add`、`mix.update`、`mix.remove`、`mix.clear` |
| Quote | `quote.submit` |
| Support | `support.chat`、`support.faq`、`support.conversation.get`、`support.message.send`、`support.handoff.request`、`support.queue.list`、`support.conversation.claim`、`support.conversation.transfer`、`support.conversation.resolve`、`support.staff.list` |
| Admin | `admin.users`、`admin.users.update-role`、`admin.articles.list/create/delete`、`admin.faqs.list/create/delete` |
| 旧 IM 兼容 | `im.sales`、`im.rooms`、`im.messages`、`im.send` |

认证 JWT 当前通过 `/ws?token=...` 查询参数传入。服务端验证 JWT 后会重新从 `users.json` 读取当前用户角色，避免完全依赖 Token 内的旧角色。

服务端每30秒执行一次 WebSocket ping/pong 心跳。

## 8. REST API

REST 路由主要用于公开询单和向后兼容；当前前端商品、认证、混装清单及客服主要走 WebSocket。

| 路径 | 说明 |
|------|------|
| `POST /api/quotes/public` | 当前公开询单入口 |
| `/api/auth/*` | 登录、注册、当前用户兼容接口 |
| `/api/products/*` | 产品查询和 Admin CRUD 兼容接口 |
| `/api/cart/*` | 旧内存购物车接口，当前前端不使用 |
| `/api/support/chat` | 旧单次机器人聊天接口 |
| `/api/support/faq` | 旧 FAQ 接口 |
| `GET /api/health` | 服务健康状态、时间和 uptime |

开发环境中，Vite 将 `/api` 代理到 `http://localhost:3001`，将 `/ws` 代理到 `ws://localhost:3001`。

## 9. 数据模型与存储

### 9.1 用户

```typescript
interface User {
  id: string;
  username: string;     // 唯一；邮箱作为用户名时统一小写
  password: string;     // bcrypt 哈希，只保存在服务端
  role: 'admin' | 'seller' | 'user';
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### 9.2 询单

```typescript
interface Quote {
  id: string;
  reference: string;
  status: 'new' | string;
  source?: 'public-website';
  customer: {
    id?: string;
    username?: string;
    name: string;
    company?: string;
    country?: string;
    email?: string;
    whatsapp?: string;
  };
  market?: string;
  vehicleModels: string;
  specifications: string;
  estimatedQuantity: number | null;
  containerType: 'mixed-lcl' | '20gp' | '40hq' | 'undecided';
  destinationPort?: string;
  reportRequirements?: string[];
  notes: string;
  items: Array<{
    productId: string;
    name: string;
    description?: string;
    quantity: number;
  }>;
  userId?: string;
  accountLinkedAt?: string;
  createdAt: string;
}
```

### 9.3 客服会话

```typescript
interface SupportConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerUsername: string;
  status: SupportStatus;
  assignedTo: string | null;
  assignedName: string | null;
  claimedBy: string | null;
  priority: 'normal' | 'high';
  botEnabled: boolean;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

interface SupportMessage {
  id: string;
  conversationId: string;
  senderType: 'customer' | 'bot' | 'seller' | 'admin' | 'system';
  senderId: string;
  senderName: string;
  content: string;
  internalNote: boolean;
  createdAt: string;
  readAt: string | null;
}
```

### 9.4 存储位置

| 数据 | 当前位置 | 持久化 |
|------|----------|--------|
| 用户 | `server/data/users.json` | 是 |
| 产品 | `server/data/products.json` | 是 |
| 询单/RFQ | `server/data/quotes.json` | 是 |
| 后台文章 | `server/data/articles.json` | 是，但未接公开页面 |
| 后台 FAQ | `server/data/faqs.json` | 是，但未接公开页面 |
| 客服会话和消息 | `server/data/support-conversations.json` | 是 |
| Mixed Load | `mixedLoadStore` 内存对象 | 否 |
| 旧购物车 | `cartStore` 内存对象 | 否，当前前端不使用 |
| 旧 IM 房间和消息 | `websocket.js` 内存对象 | 否，当前前端不使用 |

## 10. 前端状态和核心组件

### Context

| Context | 状态/职责 |
|---------|-----------|
| `AuthContext` | `user`、`loading`、登录、注册、登出、Admin/Seller判断、在线角色更新 |
| `StoreContext` | 产品、Mixed Load、商品管理、RFQ提交；保留未使用的 `chatHistory` 字段 |
| `QuoteModalContext` | 打开/关闭询价弹窗，保存初始产品名称 |

### 关键组件

- `Header`：公开导航、Mixed Load、Admin、客服收件箱、用户菜单及移动端导航。
- `Footer`：品牌简介、产品/服务/FAQ/About/询价链接和联系信息。
- `ProductCard`：产品图片、分类、描述、详情及询价 CTA，不提供直接购买。
- `QuoteModal`：复用 `Contact` 页的 `QuoteForm`。
- `FloatingSupport`：普通用户机器人/人工客服窗口。
- `SupportWidget`：普通用户显示聊天按钮；Seller/Admin 显示客服收件箱入口和未读提示。
- `AdminToolRail`：Admin 左侧竖排后台工具按钮。
- `SEOManager`：客户端路由变化时更新 Title、Description、Canonical、Open Graph 和 JSON-LD。

## 11. SEO 和生产构建

执行：

```bash
npm run build
```

流程：

1. Vite 生成前端生产资源。
2. `scripts/prerender.mjs` 使用服务端渲染生成公开页和私有页 HTML。
3. 产品详情路径由 `server/data/products.json` 动态生成。
4. 服务页、文章页路径来自 `client/src/data/seoContent.js`。
5. 公开路径写入 `dist/sitemap.xml`。
6. 私有页面包含 `noindex, nofollow`。
7. `/404` 生成独立 HTML；生产 Express 对不存在路径返回真实 HTTP 404。

当前 SEO 输出包含：

- 独立 Title 和 Meta Description
- Canonical
- Open Graph / Twitter Card
- Organization、WebPage、Product、Article JSON-LD
- Sitemap 和 Robots
- 产品、服务、文章静态预渲染

生产环境只有在 `NODE_ENV=production` 且 `client/dist` 存在时，Express 才会直接提供前端静态页面。

## 12. 环境变量

| 变量 | 默认值 | 用途 |
|------|--------|------|
| `HOST` | `0.0.0.0` | 服务监听地址 |
| `PORT` | `3001` | HTTP/WebSocket 端口 |
| `NODE_ENV` | `development` | `production` 时启用生产静态站点并强制强 JWT |
| `JWT_SECRET` | 无 | 生产环境必须为至少32字符的非弱密钥 |
| `ADMIN_USERNAME` | 无 | 首次运行 seed 的 Admin 用户名 |
| `ADMIN_PASSWORD` | 无 | 首次运行 seed 的 Admin 密码，至少12字符 |
| `ADMIN_NAME` | `Admin` | 首次 Admin 显示名 |
| `ADMIN_NOTIFICATION_EMAIL` | `812353475@qq.com` | 聊天/询单通知收件地址 |
| `SMTP_HOST` | `smtp.qq.com` | SMTP 主机 |
| `SMTP_PORT` | `465` | SMTP 端口 |
| `SMTP_SECURE` | `true` | 是否使用 TLS 安全连接 |
| `SMTP_USER` | 通知邮箱 | SMTP 发件账号 |
| `SMTP_PASS` | 无 | SMTP 授权码，不是邮箱登录密码 |
| `SUPPORT_CONVERSATIONS_FILE` | 默认 data 文件 | 可覆盖客服数据文件位置 |
| `VITE_SITE_URL` / `SITE_URL` | `https://www.driveline-global.com` | SEO绝对地址和预渲染站点地址 |

首次初始化 Admin：

```bash
cd server
npm run seed
```

Seed 只在用户库为空时创建一个 Admin；发现任何已有用户时会安全跳过，不会重置密码、删除用户或创建演示账号。服务正常启动不会自动执行 seed。

## 13. 当前已知限制

以下是当前代码真实存在的限制，不属于已完成功能：

1. 用户库为空时没有可登录的 Admin，必须先配置环境变量并手动 seed。
2. 用户创建账号后尚不能查看“我的询单”或询单状态。
3. Admin 创建的文章和 FAQ 尚未接入公开页面、SEO 和 Sitemap。
4. Mixed Load、旧购物车和旧 IM 数据在服务重启后丢失。
5. JSON 文件方案不适合多实例部署或高并发写入，正式业务应迁移数据库。
6. 前端注册表单要求至少8位密码，但 WebSocket/REST 服务端当前只强制至少4位，规则尚未统一。
7. 登录、注册和 WebSocket 消息尚未实现完整的频率限制及统一 Schema 校验。
8. 账号关联询单尚无邮箱验证码；实现询单查询前必须增加邮箱所有权验证。
9. WebSocket Token 当前放在 URL 查询参数中，可能被代理日志记录。
10. WebSocket 客户端的 Token 重连、超时请求队列仍需加强，避免重复连接或超时操作稍后执行。
11. 机器人消息触发转人工时不会调用机器人聊天邮件通知；邮件失败也没有持久化重试队列。
12. REST、WebSocket、旧购物车和旧 IM 存在重复/遗留实现，需要逐步收敛。
13. 当前没有单元测试、集成测试、端到端测试、ESLint 或类型检查脚本。
14. 图片管理仍使用静态文件或 URL，没有后台上传、压缩和媒体库。
15. SEO.md 规划的车型适配页、区域市场页和完整产品分类落地页尚未全部实现。

## 14. 品牌文案基线

扎根广州永宁轮毂产业带，Driveline Wheels 做贸易，努力踏实做好服务，做好每张订单。

1. **前置现场 QC**：从成品仓随机抽箱，按完整检查表检验，重点排查辐条根部裂纹、气孔、尺寸、动平衡、涂层附着力；拒绝工厂预先挑选样品。
2. **适配当地热销车型**：针对东南亚日系轿车、中东 SUV、Hilux 皮卡高频规格常备选型库，减少反复确认参数。
3. **订单模式灵活**：拼柜试单起步，不用一开始大批量压货；整柜稳定交付，黄埔港就近出货。
4. **文件配套**：根据具体产品、目的国要求和订单约定，协调提供材质、疲劳、冲击测试报告及清关文件。

每一套出货的轮毂都经过团队按约定流程进行质量把关。期待和经销商、改装门店长期共赢。

对外内容必须遵守以下边界：

- 不把 Driveline Wheels 描述为自有轮毂工厂或自有生产线。
- 不虚构产能、客户数量、出口国家数量、认证或“零缺陷”承诺。
- 不将合作工厂能力直接表述为 Driveline Wheels 自有能力。
- 测试报告、MOQ、定制、交期和适配结论以具体产品、市场及订单确认结果为准。
