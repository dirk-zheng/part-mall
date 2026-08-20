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

const app = express();

// ─── Config ──────────────────────────────────────
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

// ─── Middleware ──────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging ─────────────────────────────
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── API Routes ──────────────────────────────────
app.use('/api/auth', authRoutes);         // Authentication
app.use('/api/products', productRoutes);  // Product management
app.use('/api/cart', cartRoutes);         // Shopping cart
app.use('/api/support', supportRoutes);   // Customer support
app.use('/api/quotes', quoteRoutes);      // Public and private quote intake

// ─── Health Check ────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ─── 404 Handler ─────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ code: 404, message: 'API endpoint not found' });
});

// ─── Production Website & SEO Routes ────────────
const clientDist = path.join(__dirname, '..', 'client', 'dist');

if (ENV === 'production' && fs.existsSync(clientDist)) {
  app.get('/cart', (req, res) => res.redirect(301, '/quote'));
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.path === '/news-blog') return res.redirect(301, '/news-blog/');
    if (req.method !== 'GET' || req.path === '/' || req.path === '/news-blog/') return next();
    if (req.path.endsWith('/')) return res.redirect(301, req.path.slice(0, -1));
    next();
  });
  app.use(express.static(clientDist, { index: false, redirect: false }));
  app.get('*', (req, res) => {
    const relativeRoute = req.path === '/' ? '' : req.path.replace(/^\//, '');
    const routeFile = path.join(clientDist, relativeRoute, 'index.html');
    if (fs.existsSync(routeFile)) return res.sendFile(routeFile);
    return res.status(404).sendFile(path.join(clientDist, '404.html'));
  });
}

// ─── Global Error Handler ────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ code: 500, message: 'Internal server error' });
});

// ─── Start Server ────────────────────────────────
const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
const server = http.createServer(app);

// Attach WebSocket server
createWSServer(server);

server.listen(PORT, HOST, () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     Driveline Wheels                     ║');
  console.log('║     Wheels, Tires & Fitment Solutions    ║');
  console.log(`║   HTTP:   http://${displayHost}:${PORT}                    ║`);
  console.log(`║   WS:     ws://${displayHost}:${PORT}/ws                    ║`);
  console.log(`║   Mode:   ${ENV}                  ║`);
  console.log('╚══════════════════════════════════════════╝');
});
