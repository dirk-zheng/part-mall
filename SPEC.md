# DriveLine International — 产品规范

## 1. 概念与愿景

DriveLine International 是一家扎根广州的汽车配套产品分销商。平台以专业的品牌形象展示为核心，集商品浏览、在线购物、智能客服和后台管理于一体，为全球买家提供汽车零部件的采购、品控与分销服务。

### 品牌定位
- **名称**: DriveLine International
- **标语**: Quality Auto Parts, from Guangzhou to the World
- **定位**: 汽车配套产品分销商（Auto Parts Sourcing & Distribution）
- **核心价值**: 精选供应商网络、汽车级品控、快速全球分销、行业专业经验

## 2. 设计语言

### 美学方向
浅色科技风 + 现代极简：明亮的背景、纯净的白色卡片、科技蓝的强调色、柔和的阴影效果。融合现代极简美学与科技感，营造清新舒适的数字化商务体验。

### 配色方案

| 颜色 | 色值 | 用途 |
|------|------|------|
| 主色 Primary | `#0066ff` | 按钮、链接、强调元素 |
| 次色 Secondary | `#6366f1` | 渐变、次要强调 |
| 强调色 Accent | `#00d4aa` | 成功状态、CTA 高亮 |
| 背景色 Background | `#f8fafc` | 页面底色 |
| 表面色 Surface | `#ffffff` | 卡片、模态框背景 |
| 文字主色 | `#1e293b` | 标题、正文 |
| 文字次色 | `#64748b` | 描述、辅助信息 |
| 边框色 | `#e2e8f0` | 分割线、卡片边框 |

### 字体
- 标题: `Space Grotesk`, `Inter`, sans-serif
- 正文: `Inter`, `system-ui`, sans-serif
- 代码/价格: `JetBrains Mono`, monospace

### 空间系统
- 基础间距: 4px
- 组件间距: 16px / 24px / 32px / 48px
- 卡片圆角: 12px（小）/ 16px（标准）/ 24px（大）
- 按钮圆角: 8px（标准）/ 9999px（全圆角）

### 动效规范
- 页面入场: 元素从下方淡入上移，stagger 100ms
- 悬停反馈: `translateY(-4px)` + `box-shadow` 增强，`transition: 300ms ease`
- 按钮交互: `scale(0.97)` 按压反馈，`transition: 150ms`
- 模态框弹窗: 缩放 + 淡入，`transition: 200ms ease-out`
- 页面切换: 淡入淡出 300ms

### 图标系统
- 图标库: Lucide React
- 尺寸规范: 16px（内联）/ 20px（标准）/ 24px（大图标）/ 48px（特征图标）

## 3. 页面与路由

### 路由结构

| 路径 | 页面组件 | 访问权限 | 描述 |
|------|----------|----------|------|
| `/` | HomePage | 所有人 | 品牌首页 |
| `/products` | Products | 所有人 | 商品列表与筛选 |
| `/about` | About | 所有人 | 关于我们 |
| `/login` | Login | 未登录用户 | 登录 / 注册 |
| `/cart` | Cart | 已登录用户 | 购物车 |
| `/admin` | Admin | 管理员 | 商品管理 |

### 整体布局

```
┌─────────────────────────────────────────────────────────┐
│  Header (固定顶部，白色玻璃拟态背景)                      │
│  [Logo「DriveLine」] [导航链接] [购物车图标+徽章]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  主内容区域                                              │
│  max-w-7xl mx-auto px-4                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Footer (深色背景，网格布局)                              │
│  [品牌信息] [快速链接] [联系我们] [社交媒体]              │
│  [版权信息]                                              │
└─────────────────────────────────────────────────────────┘
│  FloatingSupport (悬浮客服，fixed 右下角)                 │
```

## 4. 页面详细规范

### 4.1 首页 (HomePage)

**组件层级**：
```
HomePage
├── Hero Section
│   ├── 渐变深色背景（primary->secondary）
│   ├── 主标题 + 副标题
│   ├── 统计数字区（50+ 国家 / 10K+ 客户 / 5M+ 产品 / 99.7% 准时）
│   └── CTA 按钮
├── Services Section
│   ├── 标题 "Our Services"
│   ├── 3 个服务卡片
│   │   ├── Auto Parts Sourcing（零部件采购）
│   │   ├── Quality Inspection（质量检测）
│   │   └── Global Distribution（全球分销）
│   └── 每张卡片：图标 + 标题 + 描述
├── Why Choose Us
│   ├── 标题 + 副标题
│   ├── 4 个特色卡片
│   │   ├── Extensive Supplier Network（广袤供应商网络）
│   │   ├── Rigorous Quality Inspection（严格品控）
│   │   ├── Fast Global Distribution（快速分销）
│   │   └── Industry Expertise（行业专长）
│   └── 悬停上浮 + 阴影加深动画
├── Featured Products
│   ├── 标题 "Featured Auto Parts"
│   ├── 前 8 个商品的 ProductCard 网格
│   └── "View All Parts" 链接
├── Milestones Timeline
│   ├── 标题 "Our Journey"
│   ├── 6 个里程碑节点（2014–2024）
│   │   ├── 2014: Founded in Guangzhou（天河岗顶起步）
│   │   ├── 2016: First Major Contract（首个大单）
│   │   ├── 2018: QC Center Established（质检中心成立）
│   │   ├── 2020: Supplier Network Expansion（供应商网络扩张）
│   │   ├── 2022: Digital Procurement Platform（数字化采购平台）
│   │   └── 2024: 200+ Suppliers, 50+ Countries
│   └── 交替左右布局
└── CTA Section
    ├── 大标题
    ├── 描述文字
    └── "Browse Parts Catalog" / "Learn More About Us" 按钮
```

### 4.2 商品列表页 (Products)

**交互流程**：
1. 页面加载 → 从后端 API 拉取商品列表（带分页）
2. 用户可进行：关键词搜索、分类筛选、价格排序
3. 搜索结果/筛选结果为空 → 显示空状态提示

**功能模块**：

| 模块 | 描述 |
|------|------|
| 搜索框 | 实时过滤，按 name + description 模糊匹配（后端过滤） |
| 分类筛选 | 按钮组：All / Phones / Computers / Accessories / Wearables / Audio |
| 价格排序 | 下拉选择：默认 / Price: Low to High / Price: High to Low |
| 商品网格 | ProductCard 组件，响应式 1–4 列 |
| 底部统计 | 商品总数 + 当前展示数 + 分类数 |

**分类对应关系**：
| 分类标识 | 显示名称 | 图标 |
|----------|----------|------|
| phone | Phones | Smartphone |
| computer | Computers | Monitor |
| accessory | Accessories | Usb |
| wearable | Wearables | Watch |
| audio | Audio | Headphones |

**空状态**：显示空盒子图标 + "Nothing found" 标题 + "Try adjusting search or filter" 提示。

### 4.3 购物车页 (Cart)

**进入条件**: 已登录用户（由 RequireAuth 守卫）

**状态**：
- **有商品**：商品列表 + 订单汇总 + 操作按钮
- **空购物车**：空状态插图 + "Your cart is empty" + "Continue Shopping" 链接
- **结账中**：加载动画 + 禁止操作
- **结账成功**：成功弹窗 → 自动清空购物车

**CartItem 结构**：
```
┌──────────────────────────────────────────────────┐
│ [图片 80x80]  名称            单价               │
│               描述文字                           │
│               [-] [数量] [+]  [小计]    [删除✕]   │
└──────────────────────────────────────────────────┘
```

**订单汇总栏**：
```
┌──────────────────────────────┐
│  Order Summary               │
│  Subtotal           $xxx.xx  │
│  Shipping           $xx.xx   │
│  ──────────────────────────  │
│  Total              $xxx.xx  │
│  [Checkout]                   │
│  [Clear Cart]                 │
└──────────────────────────────┘
```

**运费规则**：满 $500 免运费，否则 $20。

### 4.4 登录/注册页 (Login)

**布局**: 左右两栏
- **左侧**：品牌展示区
  - Logo + 标题 "DriveLine"
  - 副标题 "Auto Parts Distribution"
  - 3 个特性列表（Vetted Supplier Network / 200+ Quality Suppliers / Based in Guangzhou, China）
- **右侧**：表单卡片
  - 渐变头部（primary → secondary）
  - 用户名 + 密码输入框（带显隐切换）
  - 注册模式额外显示 Name 字段
  - 登录/注册模式切换链接
  - 错误提示区

**表单验证**：
- 用户名: 必填
- 密码: 必填，注册时至少 4 字符
- Name: 注册时必填
- 提交时显示 loading 状态，按钮禁用

**演示账号提示**：页面底部展示两组演示账号。

### 4.5 商品管理页 (Admin)

**进入条件**: 管理员用户（由 RequireAdmin 守卫）

**布局**：
```
┌──────────────────────────────────────────────┐
│  商品管理                                     │
│  [分类统计卡片 x5]                             │
│  [+ Add Product]                              │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ Image │ Name │ Category │ Price │ Stock │ Actions │
│  │ ──────│──────│──────────│───────│───────│─────────│
│  │  ...  │ ...  │   ...    │  ...  │  ...  │ Edit Del│
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

**弹窗表单 (Add/Edit Product)**：

| 字段 | 类型 | 验证规则 |
|------|------|----------|
| Name | text | 2–50 字符 |
| Category | select | 必须从 phone/computer/accessory/wearable/audio 中选择 |
| Price | number | > 0，前端限制两位小数 |
| Stock | number | ≥ 0，整数 |
| Image URL | url | 必填，输入时实时显示图片预览 |
| Description | textarea | 必填 |

**操作**：
- Add: 弹窗标题 "Add New Product"，空表单，提交按钮
- Edit: 弹窗标题 "Edit Product"，预填数据，提交按钮
- Delete: 确认弹窗 "Are you sure?"，带商品名称提示

**分类统计卡片**：5 张卡片，每张显示分类名称（中文） + 商品数量 + 对应颜色图标。

### 4.6 关于我们页 (About)

**组件层级**：
```
About
├── Hero（浅渐变背景 + 标题 + 描述）
├── Our Story
│   ├── 左侧：3 段公司发展史
│   ├── 右侧：统计数据（10+ Years / 200+ Suppliers / IATF 16949 / 48H Dispatch）
│   └── 采购中心照片
├── Operations Centers
│   ├── 3 个运营中心卡片
│   │   ├── Guangzhou Sourcing Center（黄埔采购中心）
│   │   ├── Panyu Inspection Center（番禺质检中心）
│   │   └── Nansha Logistics Hub（南沙物流枢纽）
│   └── 悬停上浮动画
├── Core Advantages
│   ├── Vetted Supplier Network（精选供应商网络）
│   ├── Automotive-Grade Quality（汽车级品控）
│   └── Reliable Distribution（可靠交付）
├── Leadership Team
│   ├── 4 个团队成员卡片
│   │   ├── David Chen – Founder & Managing Director
│   │   ├── Sara Li – Operations Director
│   │   ├── James Zhang – Sourcing Director
│   │   └── Emma Lin – Quality Manager
│   └── 头像 + 姓名 + 职位 + 简介
└── Contact CTA
    ├── 邮箱: info@driveline-global.com
    ├── 电话: +86-20-8888-6688
    └── 地址：广州市黄埔区广州科学城
```

## 5. 组件清单

### Header
- Logo「DriveLine」+ 文字
- 导航链接：Home / Products / About / Admin（仅管理员可见）
- 购物车图标（显示数量徽章，conditional 装饰）
- 用户区域：未登录显示 Sign In，已登录显示用户名 + 下拉菜单（Admin/Logout）
- 固定顶部，白色玻璃拟态背景 `backdrop-blur`

### ProductCard
- 商品图片（aspect-ratio 16:9，hover 时 105% 放大）
- 分类标签（彩色胶囊，对应分类颜色）
- 商品名称（单行截断 + tooltip）
- 价格（主色 ¥ 符号 + JetBrains Mono 数字字体）
- "Add to Cart" 按钮
- 悬停状态：`translateY(-4px)`，阴影加深，图片放大

### Footer
- 4 列网格布局
- 列 1: 品牌 Logo + 简介 + 汽车分销商定位
- 列 2: Quick Links（Home / Products / About Us / Cart）
- 列 3: Contact Info（电话 +86-20-8888-6688 / 邮箱 / GitHub）
- 底部版权条（Guangzhou, China）

### FloatingSupport
- fixed 定位右下角（bottom-6 right-6）
- 点击展开聊天窗口（320px 宽，480px 高）
- 聊天窗口结构：
  - 头部（蓝色背景 + 客服名称 + 关闭按钮）
  - 消息区（flex-1 overflow-y-auto）
  - 快捷问题按钮组（圆角标签，点击快速填充消息）
  - 输入区（输入框 + 发送按钮，回车发送）
- AI 打字指示器（三个跳动圆点动画）
- 消息气泡：用户（右对齐，蓝色背景，白色文字）/ AI（左对齐，白色背景，灰色文字）
- 自动滚动到底部

### ProtectedRoute
- `RequireAuth`: 检查 `user` 是否存在，否则 Navigate to `/login`
- `RequireAdmin`: 检查 `user` 是否存在且 `role === 'admin'`，否则 Navigate to `/`

## 6. 技术架构

### 前端状态管理

| Context | 文件 | 管理状态 | 提供方法 |
|---------|------|----------|----------|
| AuthContext | `context/AuthContext.jsx` | `user`, `loading` | `login()`, `register()`, `logout()`, `isAdmin()` |
| StoreContext | `context/StoreContext.jsx` | `products[]`, `cart[]`, `chatHistory[]`, `loading` | `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `checkout()` 等 |

**数据流**：
1. App 挂载 → `StoreContext` 调用 API 加载商品列表
2. 用户登录 → `AuthContext` 更新 user → `StoreContext` 加载该用户购物车
3. 商品增删改 → 调用后端 API → 成功后重新拉取数据
4. 客服聊天 → 消息由 `StoreContext` 的 `chatHistory` 管理，非持久化

### 后端架构

**目录结构**：
- `index.js`: Express 应用入口，注册中间件、路由、错误处理
- `middleware/auth.js`: JWT 认证（`authenticateToken` + `requireAdmin`）
- `routes/auth.js`: 登录/注册/获取用户信息
- `routes/products.js`: 商品 CRUD + 搜索/筛选/排序/分页
- `routes/cart.js`: 购物车增删改查
- `routes/support.js`: AI 客服（关键词匹配）+ FAQ
- `seed.js`: 初始化脚本（生成密码哈希 + 预设用户和商品数据）

**认证流程**：
1. 注册/登录 → `bcryptjs` 哈希/验证密码 → `jsonwebtoken` 签发 token
2. Token payload: `{id, username, role, name}`，有效期 7 天
3. 前端请求 → `Authorization: Bearer <token>` header → 中间件 `jwt.verify()` → `req.user`

**数据存储**：
- 商品数据: `server/data/products.json`（文件读写）
- 用户数据: `server/data/users.json`（文件读写）
- 购物车: 内存对象 `cartStore`（按 userId 隔离，服务重启丢失）

**配置项**：
| 变量 | 默认值 | 说明 |
|------|--------|------|
| `HOST` | `0.0.0.0` | 服务器监听 IP |
| `PORT` | `3001` | 服务器监听端口 |
| `JWT_SECRET` | `digital-mall-secret-key-2024` | JWT 签名密钥 |
| `NODE_ENV` | `development` | 运行环境 |

### API 代理

前端 Vite 开发服务器通过 `vite.config.js` 配置代理，将 `/api` 路径的请求转发到 `http://localhost:3001`：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    }
  }
}
```

### API 封装层

前端 `src/api/index.js` 提供统一的请求方法：

```js
import { authAPI, productAPI, cartAPI, supportAPI } from './api';

// 认证
await authAPI.login(username, password);
await authAPI.register(username, password, name);
await authAPI.getMe();

// 商品
await productAPI.getList({ search, category, sort, page, pageSize });
await productAPI.getCategories();
await productAPI.getById(id);
await productAPI.create(data);
await productAPI.update(id, data);
await productAPI.delete(id);

// 购物车
await cartAPI.getList();
await cartAPI.add(productId, quantity);
await cartAPI.update(productId, quantity);
await cartAPI.remove(productId);
await cartAPI.clear();

// 客服
await supportAPI.chat(message);
await supportAPI.getFAQ();
```

`request()` 函数自动从 localStorage 读取 token 并添加到 Authorization header，统一处理 401 状态码（自动清除登录态）。

## 7. 数据模型

```typescript
// 商品
interface Product {
  id: string;           // UUID v4
  name: string;         // 2–50 字符
  category: 'phone' | 'computer' | 'accessory' | 'wearable' | 'audio';
  price: number;        // > 0，支持小数
  stock: number;        // 非负整数
  image: string;        // 图片 URL
  description: string;  // 必填
}

// 用户
interface User {
  id: string;           // UUID v4
  username: string;     // 唯一
  password: string;     // bcrypt 哈希（不返回给前端）
  role: 'admin' | 'user';
  name: string;
}

// 购物车项（内存存储）
interface CartItem {
  productId: string;
  quantity: number;     // 正整数
}

// 聊天消息
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
```

### AI 客服关键词匹配规则

| 关键词 | 匹配逻辑 | 回复内容 |
|--------|----------|----------|
| price / cost / expensive / cheap / 价格 | includes 匹配 | 介绍价格区间 + 建议浏览商品或联系客服获取报价 |
| shipping / delivery / 物流 | includes 匹配 | 全球配送（5-15 工作日）+ 满 $500 免运费 |
| return / refund / 退货 / 退款 | includes 匹配 | 30 天退货政策 + 全额退款 |
| payment / 支付 | includes 匹配 | 支持多种支付方式 |
| 默认（无匹配） | — | 3 条预设友善回复中随机选择一条 |

## 8. 响应式策略

| 断点 | 屏幕宽度 | 商品网格 | 导航 |
|------|----------|----------|------|
| Desktop | ≥ 1024px | 4 列 | 完整水平导航 |
| Tablet | 768–1023px | 2–3 列 | 水平导航 |
| Mobile | < 768px | 1 列 | 紧凑导航，搜索框全宽 |

## 9. 已知限制与后续改进方向

1. **购物车持久化**: 当前购物车数据存在内存中，服务重启丢失。后续可迁移到 JSON 文件或数据库。
2. **AI 客服**: 当前基于简单关键词匹配，可接入真正的 AI 大模型。
3. **图片上传**: 当前使用外链 URL 方式，后续可支持本地上传。
4. **支付集成**: 结账功能为模拟实现，后续可接入真实支付网关。
5. **订单管理**: 当前无订单系统，购物车结账后直接清空。
6. **国际化**: 前端部分文案未统一国际化（¥ 与 $ 混用）。
