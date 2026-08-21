require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const createWSServer = require('./websocket');
const fs = require('fs');

// Route modules (kept for backward compatibility / health check)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const supportRoutes = require('./routes/support');
const quoteRoutes = require('./routes/quotes');
const faqRoutes = require('./routes/faqs');
const articleRoutes = require('./routes/articles');

const app = express();

// ─── Config ──────────────────────────────────────
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

// ─── Middleware ──────────────────────────────────
//启用跨域请求处理中间件
app.use(cors());
//解析JSON格式的请求体
app.use(express.json());
//解析URL编码格式的请求体
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging ─────────────────────────────
//记录每个HTTP请求的时间方法和地址
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── API Routes ──────────────────────────────────
//挂载用户认证相关接口路由
app.use('/api/auth', authRoutes);         // Authentication
//挂载商品管理相关接口路由
app.use('/api/products', productRoutes);  // Product management
//挂载购物车相关接口路由
app.use('/api/cart', cartRoutes);         // Shopping cart
//挂载客服相关接口路由
app.use('/api/support', supportRoutes);   // Customer support
//挂载公开询价相关接口路由
app.use('/api/quotes', quoteRoutes);      // Public and private quote intake
//挂载公开FAQ内容接口路由
app.use('/api/faqs', faqRoutes);          // Published FAQ content
//挂载公开文章内容接口路由
app.use('/api/articles', articleRoutes);  // Published news-blog content

// ─── Health Check ────────────────────────────────
//返回服务健康状态时间和运行时长
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ─── 404 Handler ─────────────────────────────────
//处理未匹配的API请求并返回404
app.use('/api/*', (req, res) => {
  res.status(404).json({ code: 404, message: 'API endpoint not found' });
});

// ─── Production Website & SEO Routes ────────────
const clientDist = path.join(__dirname, '..', 'client', 'dist');

if (ENV === 'production' && fs.existsSync(clientDist)) {
  //将旧购物车页面永久重定向到询价页面
  app.get('/cart', (req, res) => res.redirect(301, '/quote'));
  //统一生产环境页面URL的尾斜杠规则
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.path === '/news-blog') return res.redirect(301, '/news-blog/');
    if (req.method !== 'GET' || req.path === '/' || req.path === '/news-blog/') return next();
    if (req.path.endsWith('/')) return res.redirect(301, req.path.slice(0, -1));
    next();
  });
  //提供生产环境前端静态资源
  app.use(express.static(clientDist, { index: false, redirect: false }));
  //返回预渲染页面并为不存在页面设置真实404状态
  app.get('*', (req, res) => {
    const relativeRoute = req.path === '/' ? '' : req.path.replace(/^\//, '');
    const routeFile = path.join(clientDist, relativeRoute, 'index.html');
    if (fs.existsSync(routeFile)) return res.sendFile(routeFile);
    return res.status(404).sendFile(path.join(clientDist, '404.html'));
  });
}

// ─── Global Error Handler ────────────────────────
//捕获未处理异常并返回统一服务器错误响应
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ code: 500, message: 'Internal server error' });
});

// ─── Start Server ────────────────────────────────
const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
const server = http.createServer(app);

// Attach WebSocket server
createWSServer(server);

//启动HTTP与WebSocket服务并输出访问地址
server.listen(PORT, HOST, () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     Driveline Wheels                     ║');
  console.log('║     Wheels, Tires & Fitment Solutions    ║');
  console.log(`║   HTTP:   http://${displayHost}:${PORT}                    ║`);
  console.log(`║   WS:     ws://${displayHost}:${PORT}/ws                    ║`);
  console.log(`║   Mode:   ${ENV}                  ║`);
  console.log('╚══════════════════════════════════════════╝');
});
