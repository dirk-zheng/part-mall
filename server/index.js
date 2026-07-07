require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const createWSServer = require('./websocket');

// Route modules (kept for backward compatibility / health check)
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
const server = http.createServer(app);

// Attach WebSocket server
createWSServer(server);

server.listen(PORT, HOST, () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     DriveLine International                ║');
  console.log('║     Auto Parts Sourcing & Distribution   ║');
  console.log(`║   HTTP:   http://${displayHost}:${PORT}                    ║`);
  console.log(`║   WS:     ws://${displayHost}:${PORT}/ws                    ║`);
  console.log(`║   Mode:   ${ENV}                  ║`);
  console.log('╚══════════════════════════════════════════╝');
});
