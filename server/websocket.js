const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { JWT_SECRET, generateToken } = require('./middleware/auth');

// ─── Data Paths ──────────────────────────────────
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// ─── File Helpers ────────────────────────────────
function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')).users;
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2), 'utf-8');
}

// ─── In-Memory Cart ──────────────────────────────
const cartStore = {};

function getUserCart(userId) {
  if (!cartStore[userId]) cartStore[userId] = [];
  return cartStore[userId];
}

// ─── In-Memory IM Store ──────────────────────────
const imRooms = {};      // roomId → { roomId, members[], memberNames{}, lastMessage, updatedAt }
const imMessages = {};   // roomId → [ { id, roomId, senderId, senderName, content, timestamp } ]
const clientMap = new Map(); // userId → Set<WebSocket>

function getOrCreateRoom(userA, userB) {
  const ids = [userA.id, userB.id].sort();
  const roomId = `chat_${ids[0]}_${ids[1]}`;
  if (!imRooms[roomId]) {
    imRooms[roomId] = {
      roomId,
      members: ids,
      memberNames: { [userA.id]: userA.name || userA.username, [userB.id]: userB.name || userB.username },
      lastMessage: '',
      updatedAt: new Date().toISOString()
    };
  }
  if (!imMessages[roomId]) {
    imMessages[roomId] = [];
  }
  return imRooms[roomId];
}

function addClient(userId, ws) {
  if (!clientMap.has(userId)) clientMap.set(userId, new Set());
  clientMap.get(userId).add(ws);
}

function removeClient(userId, ws) {
  const set = clientMap.get(userId);
  if (set) {
    set.delete(ws);
    if (set.size === 0) clientMap.delete(userId);
  }
}

function sendToUser(userId, data) {
  const set = clientMap.get(userId);
  if (set) {
    const payload = JSON.stringify(data);
    set.forEach(ws => {
      if (ws.readyState === 1) ws.send(payload);
    });
  }
}

function buildCartItems(userId) {
  const cart = getUserCart(userId);
  const products = readProducts();
  const items = cart
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter(Boolean);
  return { items, totalCount: items.reduce((s, i) => s + i.quantity, 0) };
}

// ─── Support (AI) ────────────────────────────────
const keywordRules = [
  {
    keywords: ['price', 'cost', 'how much', 'cheap', 'discount', 'promotion', 'pricing', 'quote'],
    response: 'DriveLine offers competitive wholesale pricing! 💰\n\n🔥 Current Promotions:\n• Volume discounts for bulk orders\n• New client: 5% off first order\n• Long-term partnership pricing available\n• Factory-direct pricing on select lines\n\nContact our sales team for a personalized quote, or browse our product catalog for reference pricing.'
  },
  {
    keywords: ['shipping', 'delivery', 'logistics', 'transport', 'how long', 'freight', 'tracking'],
    response: 'Global Shipping & Logistics 🚢\n\n📦 Our Shipping Options:\n• Air Freight: 3-7 days worldwide\n• Sea Freight: 15-30 days (most economical)\n• Express Courier (DHL/FedEx/UPS): 2-5 days\n• Rail Freight: 12-18 days (Asia-Europe)\n\n📋 What We Handle:\n• Full customs documentation\n• Cargo insurance\n• Real-time shipment tracking\n• Warehousing & consolidation\n\nWe ship from our Shenzhen, Rotterdam, and Los Angeles hubs for fastest delivery.'
  },
  {
    keywords: ['return', 'refund', 'warranty', 'quality', 'damage', 'defect', 'exchange'],
    response: 'DriveLine Quality Guarantee 🛡️\n\n✓ 30-day inspection period upon receipt\n✓ Full refund or replacement for defective goods\n✓ 1-year warranty on all products\n✓ Third-party quality inspection available\n✓ Pre-shipment sample approval\n\n📝 Return Process:\n1. Document any issues with photos\n2. Contact your account manager within 48 hours\n3. We arrange return shipping\n4. Refund or replacement processed within 7 business days\n\nCustomer satisfaction is our top priority!'
  },
  {
    keywords: ['payment', 'pay', 'method', 'wire', 'bank', 'credit', 'terms', 'TT', 'LC'],
    response: 'Flexible Payment Options 💳\n\nWe Accept:\n• T/T (Bank Wire Transfer)\n• L/C (Letter of Credit)\n• Western Union\n• PayPal\n• Alibaba Trade Assurance\n\n💼 Payment Terms:\n• Standard: 30% deposit, 70% before shipment\n• Established partners: Net 30/60 available\n• Large orders: Negotiable milestone payments\n\n🔒 All transactions are secured and insured. Your financial safety is guaranteed!'
  }
];

const defaultReplies = [
  'Thank you for reaching out to DriveLine! Your inquiry has been received. A trade specialist will follow up shortly.\n\n💡 In the meantime, you can ask about:\n• Product pricing & MOQ\n• Shipping & delivery times\n• Return policy & warranty\n• Payment methods',
  'Hello! I\'m DriveLine\'s virtual assistant. 🤖\n\nI can help with:\n• 📦 Product sourcing & pricing\n• 🚢 Shipping & logistics\n• 🔄 Returns & quality assurance\n• 💳 Payment terms & methods\n\nWhat would you like to know?',
  'Welcome to DriveLine International! 😊\n\nWe specialize in global product sourcing and supply chain solutions across consumer electronics, accessories, wearables, and audio equipment. All products meet international quality standards with full warranty support.\n\nHow can I assist you today?'
];

function getAIResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  for (const rule of keywordRules) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return { reply: rule.response, matchedKeyword: kw };
      }
    }
  }
  const random = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  return { reply: random, matchedKeyword: null };
}

// ─── Validation ──────────────────────────────────
function validateProduct(body) {
  const errors = [];
  if (!body.name || body.name.length < 2 || body.name.length > 50)
    errors.push('Product name must be 2-50 characters');
  if (!body.category || !['phone', 'computer', 'accessory', 'wearable', 'audio'].includes(body.category))
    errors.push('Please select a valid product category');
  if (!body.price || body.price <= 0)
    errors.push('Price must be greater than 0');
  if (body.stock === undefined || body.stock < 0 || !Number.isInteger(Number(body.stock)))
    errors.push('Stock must be a non-negative integer');
  if (!body.image)
    errors.push('Please provide a product image URL');
  if (!body.description)
    errors.push('Please provide a product description');
  return errors;
}

function checkAdmin(ws) {
  if (!ws.user || ws.user.role !== 'admin') {
    throw new Error('Access denied. Admin only.');
  }
}

function checkAuth(ws) {
  if (!ws.user) {
    throw new Error('Not authenticated. Please sign in.');
  }
}

// ─── Handlers ────────────────────────────────────

// Auth
async function handleLogin(payload, ws) {
  const { username, password } = payload || {};
  if (!username || !password) throw new Error('Username and password are required');

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) throw new Error('Invalid username or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid username or password');

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  // Update this connection's auth
  ws.user = { id: user.id, username: user.username, role: user.role, name: user.name };
  ws.userId = user.id;
  addClient(user.id, ws);

  return { user: safeUser, token };
}

async function handleRegister(payload, ws) {
  const { username, password, name } = payload || {};
  if (!username || !password) throw new Error('Username and password are required');
  if (password.length < 4) throw new Error('Password must be at least 4 characters');

  const users = readUsers();
  if (users.some(u => u.username === username)) throw new Error('Username already exists');

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    username,
    password: hashed,
    role: 'user',
    name: name || username
  };
  users.push(newUser);
  writeUsers(users);

  const token = generateToken(newUser);
  const { password: _, ...safeUser } = newUser;

  ws.user = { id: newUser.id, username: newUser.username, role: newUser.role, name: newUser.name };
  ws.userId = newUser.id;
  addClient(newUser.id, ws);

  return { user: safeUser, token };
}

function handleMe(payload, ws) {
  checkAuth(ws);
  return ws.user;
}

// Products
function handleProductList(payload) {
  let products = readProducts();
  const { search, category, sort, page = 1, pageSize = 20 } = payload || {};

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);

  const total = products.length;
  const p = parseInt(page), ps = parseInt(pageSize);
  const start = (p - 1) * ps;
  const paged = products.slice(start, start + ps);

  return { list: paged, total, page: p, pageSize: ps, totalPages: Math.ceil(total / ps) };
}

function handleProductCategories() {
  const products = readProducts();
  const map = {};
  products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
  const categories = Object.entries(map).map(([name, count]) => ({ name, count }));
  return { total: products.length, categories };
}

function handleProductGet(payload) {
  const products = readProducts();
  const product = products.find(p => p.id === payload.id);
  if (!product) throw new Error('Product not found');
  return product;
}

function handleProductCreate(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);

  const errors = validateProduct(payload);
  if (errors.length > 0) throw new Error(errors.join('; '));

  const products = readProducts();
  const newProduct = {
    id: uuidv4(),
    name: payload.name.trim(),
    category: payload.category,
    price: Number(payload.price),
    stock: Number(payload.stock),
    image: payload.image.trim(),
    description: payload.description.trim()
  };
  products.push(newProduct);
  writeProducts(products);
  return newProduct;
}

function handleProductUpdate(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);

  const errors = validateProduct(payload);
  if (errors.length > 0) throw new Error(errors.join('; '));

  const products = readProducts();
  const idx = products.findIndex(p => p.id === payload.id);
  if (idx === -1) throw new Error('Product not found');

  products[idx] = {
    ...products[idx],
    name: payload.name.trim(),
    category: payload.category,
    price: Number(payload.price),
    stock: Number(payload.stock),
    image: payload.image.trim(),
    description: payload.description.trim()
  };
  writeProducts(products);
  return products[idx];
}

function handleProductDelete(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);

  const products = readProducts();
  const idx = products.findIndex(p => p.id === payload.id);
  if (idx === -1) throw new Error('Product not found');

  const removed = products.splice(idx, 1)[0];
  writeProducts(products);
  return removed;
}

// Cart
function handleCartGet(payload, ws) {
  checkAuth(ws);
  return buildCartItems(ws.userId);
}

function handleCartAdd(payload, ws) {
  checkAuth(ws);
  const { productId, quantity = 1 } = payload || {};
  if (!productId) throw new Error('Product ID is required');

  const products = readProducts();
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error('Insufficient stock');

  const cart = getUserCart(ws.userId);
  const existing = cart.find(i => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });

  return { productId, quantity: existing ? existing.quantity : quantity };
}

function handleCartUpdate(payload, ws) {
  checkAuth(ws);
  const { productId, quantity } = payload || {};
  if (!quantity || quantity < 1 || !Number.isInteger(quantity))
    throw new Error('Quantity must be a positive integer');

  const cart = getUserCart(ws.userId);
  const item = cart.find(i => i.productId === productId);
  if (!item) throw new Error('Item not found in cart');

  item.quantity = quantity;
  return { productId, quantity };
}

function handleCartRemove(payload, ws) {
  checkAuth(ws);
  const { productId } = payload || {};
  const cart = getUserCart(ws.userId);
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx === -1) throw new Error('Item not found in cart');

  cart.splice(idx, 1);
  return { removed: productId };
}

function handleCartClear(payload, ws) {
  checkAuth(ws);
  cartStore[ws.userId] = [];
  return { cleared: true };
}

// Support
function handleSupportChat(payload, ws) {
  checkAuth(ws);
  const { message } = payload || {};
  if (!message || !message.trim()) throw new Error('Message cannot be empty');

  const result = getAIResponse(message.trim());
  return {
    userMessage: message.trim(),
    aiReply: result.reply,
    matchedKeyword: result.matchedKeyword,
    timestamp: new Date().toISOString()
  };
}

function handleSupportFAQ() {
  return [
    { id: 1, question: 'Product pricing and discounts', category: 'Pricing' },
    { id: 2, question: 'Shipping and delivery times', category: 'Shipping' },
    { id: 3, question: 'Return and refund policy', category: 'After-Sales' },
    { id: 4, question: 'Accepted payment methods', category: 'Payment' },
    { id: 5, question: 'How to track my order', category: 'Orders' },
    { id: 6, question: 'Product warranty coverage', category: 'After-Sales' }
  ];
}

// ─── IM (Instant Messaging) ───────────────────────

function handleGetSales() {
  const users = readUsers();
  return users
    .filter(u => u.role === 'admin')
    .map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role }));
}

function handleGetIMRooms(payload, ws) {
  checkAuth(ws);
  const userId = ws.userId;
  const allUsers = readUsers();

  const rooms = [];
  for (const roomId of Object.keys(imRooms)) {
    const room = imRooms[roomId];
    if (room.members.includes(userId)) {
      const otherId = room.members.find(id => id !== userId);
      const otherUser = allUsers.find(u => u.id === otherId);
      rooms.push({
        roomId: room.roomId,
        otherUser: otherUser
          ? { id: otherUser.id, name: otherUser.name, username: otherUser.username, role: otherUser.role }
          : room.memberNames[otherId] || { id: otherId, name: 'Unknown' },
        lastMessage: room.lastMessage,
        updatedAt: room.updatedAt
      });
    }
  }

  // Sort by most recent
  rooms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return rooms;
}

function handleGetIMMessages(payload, ws) {
  checkAuth(ws);
  const { roomId } = payload || {};
  if (!roomId || !imRooms[roomId]) throw new Error('Conversation not found');
  if (!imRooms[roomId].members.includes(ws.userId)) throw new Error('Access denied');

  return (imMessages[roomId] || []).slice(-100); // Last 100 messages
}

function handleIMSend(payload, ws) {
  checkAuth(ws);
  let { roomId, toUserId, content } = payload || {};
  if (!content || !content.trim()) throw new Error('Message cannot be empty');

  // Create room if toUserId provided and roomId doesn't exist
  if (!roomId && toUserId) {
    const allUsers = readUsers();
    const targetUser = allUsers.find(u => u.id === toUserId);
    if (!targetUser) throw new Error('Recipient not found');

    const senderUser = { id: ws.userId, name: ws.user.name || ws.user.username, username: ws.user.username };
    const room = getOrCreateRoom(senderUser, targetUser);
    roomId = room.roomId;
  }

  if (!roomId || !imRooms[roomId]) throw new Error('Conversation not found');
  if (!imRooms[roomId].members.includes(ws.userId)) throw new Error('Access denied');

  const msg = {
    id: uuidv4(),
    roomId,
    senderId: ws.userId,
    senderName: ws.user.name || ws.user.username,
    content: content.trim(),
    timestamp: new Date().toISOString()
  };

  imMessages[roomId].push(msg);
  imRooms[roomId].lastMessage = content.trim().slice(0, 50);
  imRooms[roomId].updatedAt = msg.timestamp;

  // Forward to all room members EXCEPT sender
  const pushMsg = { type: 'im.message', success: true, data: msg };
  imRooms[roomId].members.forEach(memberId => {
    if (memberId !== ws.userId) {
      sendToUser(memberId, pushMsg);
    }
  });

  return msg;
}

// ─── Handler Map ─────────────────────────────────
const handlers = {
  'auth.login':         { fn: handleLogin,         auth: false },
  'auth.register':      { fn: handleRegister,      auth: false },
  'auth.me':            { fn: handleMe,            auth: true  },
  'products.list':      { fn: handleProductList,   auth: false },
  'products.categories':{ fn: handleProductCategories, auth: false },
  'products.get':       { fn: handleProductGet,    auth: false },
  'products.create':    { fn: handleProductCreate, auth: true  },
  'products.update':    { fn: handleProductUpdate, auth: true  },
  'products.delete':    { fn: handleProductDelete, auth: true  },
  'cart.get':           { fn: handleCartGet,       auth: true  },
  'cart.add':           { fn: handleCartAdd,       auth: true  },
  'cart.update':        { fn: handleCartUpdate,    auth: true  },
  'cart.remove':        { fn: handleCartRemove,    auth: true  },
  'cart.clear':         { fn: handleCartClear,     auth: true  },
  'support.chat':       { fn: handleSupportChat,   auth: true  },
  'support.faq':        { fn: handleSupportFAQ,    auth: false },
  'im.sales':           { fn: handleGetSales,      auth: true  },
  'im.rooms':           { fn: handleGetIMRooms,    auth: true  },
  'im.messages':        { fn: handleGetIMMessages, auth: true  },
  'im.send':            { fn: handleIMSend,        auth: true  },
};

// ─── Create WS Server ────────────────────────────
function createWSServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Heartbeat interval
  const heartbeat = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.__alive === false) return ws.terminate();
      ws.__alive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(heartbeat));

    wss.on('connection', (ws, req) => {
    ws.__alive = true;
    ws.user = null;
    ws.userId = null;

    // Auth via token query param
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        ws.user = decoded;
        ws.userId = decoded.id;
        addClient(decoded.id, ws);
      }
    } catch (e) { /* invalid/expired token, continue unauthenticated */ }

    ws.on('pong', () => { ws.__alive = true; });

    ws.on('close', () => {
      if (ws.userId) removeClient(ws.userId, ws);
    });

    ws.on('message', async (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return ws.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
      }

      const { type, requestId } = msg;
      const handler = handlers[type];

      // Manual auth (allow auth.login/register to set user on ws)
      if (type === 'auth.login' || type === 'auth.register') {
        try {
          const data = await handler.fn(msg.payload, ws);
          ws.send(JSON.stringify({ type, requestId, success: true, data }));
        } catch (err) {
          ws.send(JSON.stringify({ type, requestId, success: false, error: err.message }));
        }
        return;
      }

      if (!handler) {
        return ws.send(JSON.stringify({ type, requestId, success: false, error: `Unknown message type: ${type}` }));
      }

      // Auth check (skip for auth.me since it checks internally)
      if (handler.auth && type !== 'auth.me' && !ws.user) {
        return ws.send(JSON.stringify({ type, requestId, success: false, error: 'Not authenticated' }));
      }

      try {
        const data = await handler.fn(msg.payload, ws);
        ws.send(JSON.stringify({ type, requestId, success: true, data }));
      } catch (err) {
        ws.send(JSON.stringify({ type, requestId, success: false, error: err.message }));
      }
    });

    // Send welcome
    ws.send(JSON.stringify({ type: 'connected', success: true, data: { authenticated: !!ws.user } }));
  });

  console.log('  WebSocket server: ws://localhost:' + (server.address()?.port || '3001') + '/ws');
  return wss;
}

module.exports = createWSServer;
