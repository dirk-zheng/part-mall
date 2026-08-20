# Driveline Wheels — 广州永宁轮毂贸易

一家扎根广州永宁轮毂产业带的轮毂贸易团队，面向经销商和改装门店提供当地热销车型选型、成品仓随机抽箱 QC、拼柜试单、整柜交付以及测试报告与清关文件配套。前端基于 React + Vite + Tailwind CSS，主要业务通过 Node.js WebSocket 服务通信，同时保留 Express REST API。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-green)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)
![Express](https://img.shields.io/badge/Express-4.21-grey)

## 功能特性

### 首页 Landing Page
- Hero 大屏展示（渐变深色背景 + 核心数据统计）
- 三大核心服务：当地车型选型、前置现场 QC、灵活订单与文件配套
- 四大核心优势：永宁产业带区位、随机抽箱检查、拼柜试单、黄埔港就近出货
- 六步订单流程：市场需求、参数适配、订单方案、生产跟进、现场 QC、单证与装运
- CTA 行动号召区域

### 商品列表
- 商品卡片网格展示，响应式 1–4 列布局
- 分类筛选：All Products / Forged Wheels / Alloy Wheels / Tires / Wheel Sets / Accessories
- 实时搜索（按名称 + 描述模糊匹配）
- 名称排序（默认 / A–Z / Z–A）
- 后端分页支持，底部统计面板（总数 / 当前展示 / 分类数）
- 卡片悬浮动画效果

### 混装询盘
- 已登录经销商可将多个轮毂方案加入 Mixed Load
- 支持逐款数量调整、单项删除和整单清空
- 询盘字段：目标市场、车型、轮毂规格、预计数量、柜型、报告及清关要求
- 柜型支持拼柜/LCL、20GP、40HQ 和待建议方案
- 提交后生成 RFQ 编号，询盘记录持久化到 JSON 文件
- 明确区分“询盘”与付款/确认订单，避免零售结账误导

### 商品管理（仅管理员）
- 商品 CRUD：表格展示 + 弹窗表单
- 表单字段：名称、分类、价格、库存、图片 URL（含预览）、描述
- 前端验证：名称 2–50 字符、分类必须为预设值、价格 > 0、库存 ≥ 0、图片和描述必填
- 分类统计卡片（各分类商品数量）

### 客服系统
- 悬浮右下角图标入口
- AI 关键词匹配智能回复（车型适配 / 拼柜试单 / 现场 QC / 清关文件）
- 快捷问题按钮
- 消息时间戳 + 打字指示器动画
- FAQ 常见问题列表

### 用户系统
- 账号密码登录 / 注册
- 密码 bcrypt 加密存储
- JWT Token 认证（7 天有效期）
- 角色权限控制：管理员（admin）/ 普通用户（user）
- 路由级权限守卫，未登录自动跳转

### 关于我们
- 扎根广州永宁轮毂产业带的务实贸易定位
- 四位订单执行成员：客户服务 / 车型适配 / 订单单证 / 现场 QC
- 三个关键现场：永宁产业带 / 工厂成品仓 / 黄埔港出货路线
- 核心优势：随机抽箱 QC / 热销车型选型库 / 拼柜到整柜 / 测试报告配套

## 首次管理员初始化

项目不提供公开演示账号。首次部署时，在 `server/.env` 中临时配置 `ADMIN_USERNAME` 和不少于12字符的 `ADMIN_PASSWORD`，然后手动运行 `npm run seed`。已有任何用户数据时，seed会安全跳过，不会覆盖账号。

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.3.1 |
| 构建工具 | Vite | 5.4.9 |
| 样式方案 | Tailwind CSS | 3.4.13 |
| 路由管理 | React Router DOM | 6.26.2 |
| 图标库 | Lucide React | 0.447.0 |
| 字体 | Google Fonts（Inter, Space Grotesk, JetBrains Mono） | - |
| 状态管理 | React Context（AuthContext + StoreContext） | - |
| 后端框架 | Express | 4.21.0 |
| 认证 | jsonwebtoken (JWT) + bcryptjs | 9.0.2 / 2.4.3 |
| 跨域 | cors | 2.8.5 |
| 环境变量 | dotenv | 17.4.2 |
| ID 生成 | uuid | 10.0.0 |
| 数据存储 | JSON 文件（商品 + 用户 + 询盘）+ 内存（混装清单） | - |

## 项目结构

```
part-mall/
├── client/                          # 前端项目 (React + Vite)
│   ├── index.html
│   ├── vite.config.js               # Vite 配置（含 /api 代理）
│   ├── tailwind.config.js           # Tailwind 主题配置
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # React 渲染入口
│       ├── App.jsx                  # 根组件，路由定义
│       ├── index.css                # 全局样式 + Tailwind 指令
│       ├── api/
│       │   └── index.js             # API 封装（自动携带 JWT）
│       ├── context/
│       │   ├── AuthContext.jsx      # 认证状态管理
│       │   └── StoreContext.jsx     # 商城全局状态
│       ├── data/
│       │   └── products.js          # 分类配置 + AI 回复模板
│       ├── components/
│       │   ├── Header.jsx           # 导航头部
│       │   ├── Footer.jsx           # 页脚
│       │   ├── ProductCard.jsx      # 商品卡片
│       │   ├── FloatingSupport.jsx  # 悬浮客服
│       │   └── ProtectedRoute.jsx   # 路由守卫（RequireAuth / RequireAdmin）
│       └── pages/
│           ├── HomePage.jsx         # 首页（Hero + 服务 + 特色 + 里程碑 + CTA）
│           ├── Products.jsx         # 商品列表页
│           ├── About.jsx            # 关于我们页
│           ├── Login.jsx            # 登录 / 注册页
│           ├── QuoteRequest.jsx     # 混装清单 + RFQ 询盘表单
│           └── Admin.jsx            # 商品管理页
│
├── server/                          # 后端项目 (Node.js + Express)
│   ├── index.js                     # 服务入口
│   ├── seed.js                      # 首次管理员初始化（不会覆盖已有用户）
│   ├── .env                         # 环境变量配置（不提交 git）
│   ├── .env.example                 # 环境变量模板
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js                  # JWT 认证中间件 + 角色鉴权
│   ├── routes/
│   │   ├── auth.js                  # 认证路由
│   │   ├── products.js              # 商品路由
│   │   ├── cart.js                  # 购物车路由
│   │   └── support.js               # 客服路由
│   └── data/
│       ├── products.json            # 商品数据（12 条初始数据）
│       ├── users.json               # 用户数据（首次seed前为空）
│       └── quotes.json              # RFQ 询盘记录
│
├── package.json                     # 根启动脚本
├── README.md
├── SPEC.md
└── .gitignore
```

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
cd client && npm install

# 安装后端依赖
cd server && npm install
```

### 2. 配置环境变量

后端支持通过 `.env` 文件配置，参考 `server/.env.example`：

```bash
# server/.env
HOST=0.0.0.0      # 监听 IP，默认 0.0.0.0
PORT=3001         # 监听端口，默认 3001
NODE_ENV=development
JWT_SECRET=       # 生产环境必须设置至少32字符的唯一强随机值
ADMIN_USERNAME=   # 仅首次 npm run seed 使用
ADMIN_PASSWORD=   # 至少12字符，仅首次 npm run seed 使用
ADMIN_NAME=Admin
```

首次初始化管理员：

```bash
cd server
npm run seed
```

初始化成功后建议从 `.env` 删除 `ADMIN_PASSWORD`。再次执行seed只会报告已有用户并退出，不会重置密码或删除注册用户。

### 3. 启动服务

```bash
# 终端 1 — 启动后端（端口 3001，不会自动执行seed）
cd server && npm run dev

# 终端 2 — 启动前端（端口 5173）
cd client && npm run dev
```

访问 `http://localhost:5173` 即可使用。

或使用根目录 concurrently 一键启动：

```bash
npm run dev:all
```

### 4. 构建生产版本

```bash
cd client && npm run build
```

## API 接口文档

### 认证接口 `/api/auth`

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/api/auth/login` | 否 | 用户登录，返回 user + JWT token |
| POST | `/api/auth/register` | 否 | 用户注册，需 username + password（≥4 字符），用户名唯一 |
| GET | `/api/auth/me` | 是 | 获取当前登录用户信息 |

**登录请求示例**：
```json
// POST /api/auth/login
{ "username": "<your-admin-username>", "password": "<your-password>" }

// Response
{
  "code": 200,
  "data": {
    "user": { "id": "...", "username": "<your-admin-username>", "role": "admin", "name": "Admin" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 商品接口 `/api/products`

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| GET | `/api/products` | 否 | 商品列表，支持 `?search=&category=&sort=price-asc\|price-desc&page=&pageSize=` |
| GET | `/api/products/categories` | 否 | 分类统计，返回各分类商品数量 |
| GET | `/api/products/:id` | 否 | 商品详情 |
| POST | `/api/products` | 管理员 | 添加商品 |
| PUT | `/api/products/:id` | 管理员 | 更新商品 |
| DELETE | `/api/products/:id` | 管理员 | 删除商品 |

### 混装询盘 WebSocket 协议

| 消息类型 | 认证 | 说明 |
|----------|------|------|
| `mix.get` | 是 | 获取当前用户混装清单 |
| `mix.add` | 是 | 添加方案 `{productId, quantity?}` |
| `mix.update` | 是 | 更新方案数量 `{productId, quantity}` |
| `mix.remove` | 是 | 移除单个方案 `{productId}` |
| `mix.clear` | 是 | 清空混装清单 |
| `quote.submit` | 是 | 提交市场、车型、规格、数量、柜型和报告要求，返回 RFQ 编号 |

> 混装清单存储在服务端内存中；已提交询盘持久化在 `server/data/quotes.json`。

### 客服接口 `/api/support`

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/api/support/chat` | 是 | 发送消息 `{message}`，基于关键词匹配返回预设回复 |
| GET | `/api/support/faq` | 否 | 获取 6 条常见问题列表 |

### 健康检查

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| GET | `/api/health` | 否 | 返回 `{status, timestamp, uptime}` |

## 数据模型

```typescript
// 商品
interface Product {
  id: string;           // UUID
  name: string;         // 2–50 字符
  category: 'forged-wheel' | 'cast-wheel' | 'tire' | 'wheel-set' | 'accessory';
  price: number;        // > 0
  stock: number;        // ≥ 0，整数
  image: string;        // 图片 URL
  description: string;  // 必填
}

// 用户
interface User {
  id: string;           // UUID
  username: string;     // 唯一；询价后创建的账号使用规范化邮箱
  password: string;     // bcrypt 哈希
  role: 'admin' | 'user';
  name: string;
}
```

## 设计规范

### 配色方案

| 颜色 | 色值 | 用途 |
|------|------|------|
| Primary | `#ea580c` | 主色调、性能橙 |
| Secondary | `#f59e0b` | 次要色、暖金 |
| Accent | `#00d4aa` | 强调色、清新绿 |
| Background | `#f8fafc` | 页面背景 |
| Surface | `#ffffff` | 卡片背景 |
| Text Primary | `#1e293b` | 主要文字 |
| Text Secondary | `#64748b` | 次要文字 |

### 响应式断点

| 断点 | 商品网格列数 |
|------|-------------|
| Desktop (≥1024px) | 4 列 |
| Tablet (768–1023px) | 2–3 列 |
| Mobile (<768px) | 1 列 |

## 访问控制

| 路由 | 页面 | 访问权限 |
|------|------|----------|
| `/` | 首页 | 所有人 |
| `/products` | 商品列表 | 所有人 |
| `/about` | 关于我们 | 所有人 |
| `/login` | 登录注册 | 未登录用户 |
| `/quote` | 混装清单与询盘表单 | 已登录用户 |
| `/cart` | 兼容旧链接，自动跳转 `/quote` | 已登录用户 |
| `/admin` | 商品管理 | 仅管理员 |

## License

MIT License
