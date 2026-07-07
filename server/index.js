require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Route modules
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const supportRoutes = require('./routes/support');

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

// ─── Global Error Handler ────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ code: 500, message: 'Internal server error' });
});

// ─── Start Server ────────────────────────────────
const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
app.listen(PORT, HOST, () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     DriveLine International                ║');
  console.log('║     Auto Parts Sourcing & Distribution   ║');
  console.log(`║   Address:  http://${HOST}:${PORT}                    ║`);
  console.log(`║   Local:    http://${displayHost}:${PORT}                    ║`);
  console.log(`║   Mode:     ${ENV}                  ║`);
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log('API Endpoints:');
  console.log(`  POST   /api/auth/login          - User login`);
  console.log(`  POST   /api/auth/register       - User registration`);
  console.log(`  GET    /api/auth/me             - Current user info`);
  console.log(`  GET    /api/products            - Product list`);
  console.log(`  GET    /api/products/categories - Category stats`);
  console.log(`  GET    /api/products/:id        - Product details`);
  console.log(`  POST   /api/products            - Add product (admin)`);
  console.log(`  PUT    /api/products/:id        - Update product (admin)`);
  console.log(`  DELETE /api/products/:id        - Delete product (admin)`);
  console.log(`  GET    /api/cart                - Cart list`);
  console.log(`  POST   /api/cart                - Add to cart`);
  console.log(`  PUT    /api/cart/:productId     - Update quantity`);
  console.log(`  DELETE /api/cart/:productId     - Remove from cart`);
  console.log(`  DELETE /api/cart                - Clear cart`);
  console.log(`  POST   /api/support/chat        - AI support chat`);
  console.log(`  GET    /api/support/faq         - FAQ list`);
  console.log(`  GET    /api/health              - Health check`);
});
