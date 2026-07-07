# 数码商城 (Digital Mall)

一个清新明亮的数码产品在线商城，基于 React + Vite + Tailwind CSS 构建。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-green)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)

## 功能特性

### 商城列表
- 商品网格展示，支持分类筛选（手机、电脑、配件、智能穿戴、音频）
- 实时搜索商品名称
- 价格排序（升序/降序）
- 统计看板显示商品总数

### 购物车
- 添加/删除商品
- 数量增减调节
- 实时价格计算
- 满500元免运费提示
- 结账模拟

### 商品管理
- 商品增删改查（仅管理员）
- 表单验证（名称、价格、库存）
- 图片预览
- 分类统计

### 客服系统
- 悬浮式智能客服（右下角）
- AI 关键词智能回复
- 快捷问题按钮
- 消息时间戳
- 打字指示器动画

### 用户系统
- 账号密码登录/注册
- 管理员权限控制
- 会话持久化

## 演示账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin |
| 普通用户 | user | user123 |

## 技术栈

- **前端框架**: React 18.3
- **构建工具**: Vite 5.4
- **样式方案**: Tailwind CSS 3.4
- **路由管理**: React Router DOM 6
- **图标库**: Lucide React
- **状态管理**: React Context
- **后端框架**: Node.js + Express 4
- **认证方案**: JWT + bcrypt
- **数据存储**: JSON 文件（可替换为 MySQL/MongoDB）

## 项目结构

```
client/                         # 前端项目 (React + Vite)
├── public/
├── src/
│   ├── api/
│   │   └── index.js            # API 对接层
│   ├── components/
│   │   ├── FloatingSupport.jsx # 悬浮客服组件
│   │   ├── Footer.jsx          # 页脚组件
│   │   ├── Header.jsx          # 导航头部
│   │   ├── ProductCard.jsx     # 商品卡片
│   │   └── ProtectedRoute.jsx  # 路由保护
│   ├── context/
│   │   ├── AuthContext.jsx     # 用户认证状态
│   │   └── StoreContext.jsx    # 商城全局状态
│   ├── data/
│   │   └── products.js         # 商品数据和 AI 回复
│   ├── pages/
│   │   ├── Admin.jsx           # 商品管理页
│   │   ├── Cart.jsx            # 购物车页
│   │   ├── Home.jsx            # 商城首页
│   │   └── Login.jsx           # 登录/注册页
│   ├── App.jsx                 # 应用入口
│   ├── index.css               # 全局样式
│   └── main.jsx                # React 渲染入口
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json

server/                         # 后端项目 (Node.js + Express)
├── data/
│   ├── products.json           # 商品数据
│   └── users.json              # 用户数据
├── middleware/
│   └── auth.js                 # JWT 认证中间件
├── routes/
│   ├── auth.js                 # 认证路由
│   ├── cart.js                 # 购物车路由
│   ├── products.js             # 商品路由
│   └── support.js              # 客服路由
├── index.js                    # 服务入口
├── seed.js                     # 数据初始化脚本
└── package.json
```

## 快速开始

### 安装依赖

```bash
# 安装前端依赖
cd client && npm install

# 安装后端依赖
cd ../server && npm install
```

### 启动前端开发服务器

```bash
cd client
npm run dev
```

访问 `http://localhost:5173`

### 启动后端服务

```bash
cd server
npm run dev
```

后端运行在 `http://localhost:3001`，首次启动会自动初始化用户数据（密码哈希）。

### 同时启动前后端

```bash
# 终端1 - 前端
cd client && npm run dev

# 终端2 - 后端
cd server && npm run dev
```

### API 接口文档

#### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 用户登录 | 否 |
| POST | `/api/auth/register` | 用户注册 | 否 |
| GET | `/api/auth/me` | 获取当前用户 | 是 |

**登录请求示例：**
```json
POST /api/auth/login
{ "username": "admin", "password": "admin" }

Response:
{
  "code": 200,
  "data": {
    "user": { "id": "1", "username": "admin", "role": "admin", "name": "管理员" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 商品接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/products` | 商品列表（支持 ?search=&category=&sort=） | 否 |
| GET | `/api/products/categories` | 分类统计 | 否 |
| GET | `/api/products/:id` | 商品详情 | 否 |
| POST | `/api/products` | 添加商品 | 管理员 |
| PUT | `/api/products/:id` | 更新商品 | 管理员 |
| DELETE | `/api/products/:id` | 删除商品 | 管理员 |

#### 购物车接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/cart` | 获取购物车 | 是 |
| POST | `/api/cart` | 添加商品 `{productId, quantity}` | 是 |
| PUT | `/api/cart/:productId` | 更新数量 `{quantity}` | 是 |
| DELETE | `/api/cart/:productId` | 移除商品 | 是 |
| DELETE | `/api/cart` | 清空购物车 | 是 |

#### 客服接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/support/chat` | 发送消息 `{message}` | 是 |
| GET | `/api/support/faq` | 常见问题列表 | 否 |

### 前端对接方式

前端位于 `client/` 目录，已内置 `src/api/index.js` API 对接层，Vite 代理会将 `/api` 请求转发到 `http://localhost:3001`。

```js
import { authAPI, productAPI, cartAPI, supportAPI } from './api';

// 登录
const { data } = await authAPI.login('admin', 'admin');
localStorage.setItem('mall_user', JSON.stringify({ ...data.user, token: data.token }));

// 获取商品
const { data } = await productAPI.getList({ search: 'iPhone', sort: 'price-asc' });

// 添加购物车
await cartAPI.add('1', 2);

// AI 客服
const { data } = await supportAPI.chat('物流多久能到？');
```

### 数据模型

```typescript
// 商品
interface Product {
  id: string;
  name: string;
  category: 'phone' | 'computer' | 'accessory' | 'wearable' | 'audio';
  price: number;
  stock: number;
  image: string;
  description: string;
}

// 用户
interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  name: string;
}
```

### 构建生产版本

```bash
cd client
npm run build
```

### 预览生产构建

```bash
cd client
npm run preview
```

## 设计规范

### 配色方案

| 颜色 | 色值 | 用途 |
|------|------|------|
| Primary | `#0066ff` | 主色调、科技蓝 |
| Secondary | `#6366f1` | 次要色、电紫 |
| Accent | `#00d4aa` | 强调色、清新绿 |
| Background | `#f8fafc` | 背景色、极浅灰 |
| Surface | `#ffffff` | 卡片背景 |
| Text Primary | `#1e293b` | 主要文字 |
| Text Secondary | `#64748b` | 次要文字 |

### 响应式断点

- Desktop: `≥1024px` - 四列商品网格
- Tablet: `768-1023px` - 三列商品网格
- Mobile: `<768px` - 单列网格

## 访问控制

| 页面 | 访问权限 |
|------|----------|
| 商城首页 | 所有人 |
| 购物车 | 已登录用户 |
| 商品管理 | 管理员 |

## License

MIT License
