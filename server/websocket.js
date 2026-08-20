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
const QUOTES_FILE = path.join(__dirname, 'data', 'quotes.json');
const ARTICLES_FILE = path.join(__dirname, 'data', 'articles.json');
const FAQS_FILE = path.join(__dirname, 'data', 'faqs.json');

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

function readQuotes() {
  if (!fs.existsSync(QUOTES_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf-8'));
}

function writeQuotes(quotes) {
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2), 'utf-8');
}

function readList(file) {
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return Array.isArray(data) ? data : [];
}

function writeList(file, list) {
  fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf-8');
}

// ─── In-Memory Mixed-load Builder ────────────────
const mixedLoadStore = {};

function getUserMixedLoad(userId) {
  if (!mixedLoadStore[userId]) mixedLoadStore[userId] = [];
  return mixedLoadStore[userId];
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

function buildMixedLoadItems(userId) {
  const mixedLoad = getUserMixedLoad(userId);
  const products = readProducts();
  const items = mixedLoad
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
    keywords: ['fitment', 'pcd', 'offset', 'center bore', 'vehicle', 'fit', 'size'],
    response: 'Local-market Fitment Support 🛞\n\nTell us your market and popular vehicle models. We keep frequently used fitment selections for:\n• Japanese sedans in Southeast Asia\n• SUVs in the Middle East\n• Hilux pickup applications\n\nWe verify wheel size, PCD, offset, center bore and load requirements before the order, reducing repeated parameter confirmation.'
  },
  {
    keywords: ['moq', 'minimum order', 'sample', 'quantity', 'private label', 'mixed load', 'mixed-container', 'trial order', 'full container'],
    response: 'Flexible Order Planning 📦\n\nYou do not need to begin with heavy inventory. We support mixed-container trial orders so you can test styles and fitments in your market first. Proven items can then move into stable full-container repeat orders.'
  },
  {
    keywords: ['document', 'report', 'customs', 'clearance', 'fatigue test', 'impact test', 'material test'],
    response: 'Test Reports & Clearance Documents 📄\n\nWe can provide supporting material reports and fatigue-impact test reports for wheel orders. Our team coordinates the required order documents with packing and loading to support customs clearance.'
  },
  {
    keywords: ['price', 'cost', 'how much', 'cheap', 'discount', 'promotion', 'pricing', 'quote'],
    response: 'Practical Wheel Quotation 💰\n\nPricing depends on wheel construction, size, finish, fitment mix, packaging and order volume. Send us your target market, vehicle list and preferred styles. We will prepare a clear quotation and suggest a practical mixed-load or full-container plan.'
  },
  {
    keywords: ['shipping', 'delivery', 'logistics', 'transport', 'how long', 'freight', 'tracking'],
    response: 'Order & Export Support 🚢\n\n• Mixed-container trials for a lower-inventory start\n• Stable full-container delivery for repeat business\n• Convenient export through nearby Huangpu Port\n• Material and fatigue-impact test reports supplied for clearance support\n\nOur team follows packing, loading and documents through shipment.'
  },
  {
    keywords: ['return', 'refund', 'warranty', 'quality', 'damage', 'defect', 'exchange', 'inspect', 'inspection', 'qc', 'crack', 'porosity', 'balance', 'coating'],
    response: 'On-site Pre-shipment QC 🛡️\n\nWe go to the finished-goods warehouse and draw cartons at random — we do not accept factory pre-selected samples. Our checklist focuses on:\n• Cracks around spoke roots and porosity\n• Dimensions and fitment parameters\n• Dynamic balance\n• Coating appearance and adhesion\n\nEvery wheel set is checked through our quality process before shipment.'
  },
  {
    keywords: ['payment', 'pay', 'method', 'wire', 'bank', 'credit', 'terms', 'TT', 'LC'],
    response: 'Order Terms 💳\n\nPayment terms are confirmed clearly in the quotation and proforma invoice for each order. Our team keeps the order, QC, loading and document requirements aligned so there are no surprises before shipment.'
  }
];

const defaultReplies = [
  'Thank you for contacting Driveline Wheels. We are a wheel trading team rooted in Guangzhou Yongning. Ask us about local-market fitments, mixed-container trials, on-site QC or export documents.',
  'Hello! We work close to Yongning wheel factories and follow every order carefully. Share your market, popular vehicles and target wheel styles, and our team will help you plan the next step.',
  'Welcome to Driveline Wheels. We support distributors and modification shops with practical product selection, random-carton pre-shipment QC, flexible loading and Huangpu Port export coordination.'
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
  if (!body.category || !['forged-wheel', 'cast-wheel', 'tire', 'wheel-set', 'accessory'].includes(body.category))
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

// Mixed-load builder
function handleMixedLoadGet(payload, ws) {
  checkAuth(ws);
  return buildMixedLoadItems(ws.userId);
}

function handleMixedLoadAdd(payload, ws) {
  checkAuth(ws);
  const { productId, quantity = 1 } = payload || {};
  if (!productId) throw new Error('Product ID is required');

  const products = readProducts();
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error('Insufficient stock');

  const mixedLoad = getUserMixedLoad(ws.userId);
  const existing = mixedLoad.find(i => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else mixedLoad.push({ productId, quantity });

  return { productId, quantity: existing ? existing.quantity : quantity };
}

function handleMixedLoadUpdate(payload, ws) {
  checkAuth(ws);
  const { productId, quantity } = payload || {};
  if (!quantity || quantity < 1 || !Number.isInteger(quantity))
    throw new Error('Quantity must be a positive integer');

  const mixedLoad = getUserMixedLoad(ws.userId);
  const item = mixedLoad.find(i => i.productId === productId);
  if (!item) throw new Error('Item not found in mixed load');

  item.quantity = quantity;
  return { productId, quantity };
}

function handleMixedLoadRemove(payload, ws) {
  checkAuth(ws);
  const { productId } = payload || {};
  const mixedLoad = getUserMixedLoad(ws.userId);
  const idx = mixedLoad.findIndex(i => i.productId === productId);
  if (idx === -1) throw new Error('Item not found in mixed load');

  mixedLoad.splice(idx, 1);
  return { removed: productId };
}

function handleMixedLoadClear(payload, ws) {
  checkAuth(ws);
  mixedLoadStore[ws.userId] = [];
  return { cleared: true };
}

function handleQuoteSubmit(payload, ws) {
  checkAuth(ws);
  const {
    market,
    vehicleModels,
    specifications,
    estimatedQuantity,
    containerType,
    reportRequirements = [],
    notes = ''
  } = payload || {};

  if (!market?.trim()) throw new Error('Target market is required');
  if (!vehicleModels?.trim()) throw new Error('Vehicle models are required');
  if (!specifications?.trim()) throw new Error('Wheel specifications are required');
  const quantity = Number(estimatedQuantity);
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Estimated quantity must be a positive integer');
  const allowedContainers = ['mixed-lcl', '20gp', '40hq', 'undecided'];
  if (!allowedContainers.includes(containerType)) throw new Error('Please select a valid container plan');
  if (!Array.isArray(reportRequirements)) throw new Error('Report requirements must be a list');

  const { items } = buildMixedLoadItems(ws.userId);
  if (items.length === 0) throw new Error('Add at least one wheel program to the mixed load');

  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const reference = `RFQ-${datePart}-${uuidv4().slice(0, 6).toUpperCase()}`;
  const quote = {
    id: uuidv4(),
    reference,
    status: 'new',
    customer: {
      id: ws.userId,
      username: ws.user.username,
      name: ws.user.name || ws.user.username
    },
    market: market.trim(),
    vehicleModels: vehicleModels.trim(),
    specifications: specifications.trim(),
    estimatedQuantity: quantity,
    containerType,
    reportRequirements: reportRequirements.map(item => String(item).trim()).filter(Boolean),
    notes: String(notes).trim(),
    items: items.map(({ product, quantity: itemQuantity }) => ({
      productId: product.id,
      name: product.name,
      description: product.description,
      quantity: itemQuantity
    })),
    createdAt: now.toISOString()
  };

  const quotes = readQuotes();
  quotes.push(quote);
  writeQuotes(quotes);
  mixedLoadStore[ws.userId] = [];

  return {
    reference,
    status: quote.status,
    createdAt: quote.createdAt,
    message: 'Quote request received. Our team will review fitment, loading and report requirements.'
  };
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
    { id: 1, question: 'Which local-market wheel fitments do you keep?', category: 'Fitment' },
    { id: 2, question: 'Can I begin with a mixed-container trial?', category: 'Orders' },
    { id: 3, question: 'How do you select cartons for on-site QC?', category: 'Quality' },
    { id: 4, question: 'What items are included in the QC checklist?', category: 'Quality' },
    { id: 5, question: 'Can you load full containers through Huangpu Port?', category: 'Shipping' },
    { id: 6, question: 'Which test reports support customs clearance?', category: 'Documents' }
  ];
}

// ─── Administrator workspace ────────────────────
function handleAdminUsers(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  return readUsers().map(({ password, ...user }) => user);
}

function createSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/["'“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function handleAdminArticlesList(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  return readList(ARTICLES_FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function handleAdminArticleCreate(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  const title = String(payload?.title || '').trim();
  const summary = String(payload?.summary || '').trim();
  const content = String(payload?.content || '').trim();
  const slug = createSlug(payload?.slug || title);
  if (title.length < 5 || title.length > 160) throw new Error('Article title must be 5-160 characters');
  if (summary.length < 20 || summary.length > 320) throw new Error('Search summary must be 20-320 characters');
  if (content.length < 100) throw new Error('Article content must be at least 100 characters');
  if (!slug) throw new Error('A valid English URL slug is required');
  const allowedStatuses = ['draft', 'review', 'published'];
  const status = allowedStatuses.includes(payload?.status) ? payload.status : 'draft';
  const articles = readList(ARTICLES_FILE);
  if (articles.some((article) => article.slug === slug)) throw new Error('This article URL slug already exists');
  const now = new Date().toISOString();
  const article = {
    id: uuidv4(), title, slug, summary, content,
    image: String(payload?.image || '').trim().slice(0, 500), status,
    authorId: ws.userId, authorName: ws.user.name || ws.user.username,
    createdAt: now, updatedAt: now,
  };
  articles.push(article);
  writeList(ARTICLES_FILE, articles);
  return article;
}

function handleAdminArticleDelete(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  const articles = readList(ARTICLES_FILE);
  const index = articles.findIndex((article) => article.id === payload?.id);
  if (index === -1) throw new Error('Article record not found');
  const [removed] = articles.splice(index, 1);
  writeList(ARTICLES_FILE, articles);
  return removed;
}

function handleAdminFaqsList(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  return readList(FAQS_FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function handleAdminFaqCreate(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  const question = String(payload?.question || '').trim();
  const answer = String(payload?.answer || '').trim();
  const category = String(payload?.category || 'General').trim().slice(0, 60);
  if (question.length < 10 || question.length > 240) throw new Error('FAQ question must be 10-240 characters');
  if (answer.length < 20 || answer.length > 2000) throw new Error('FAQ answer must be 20-2000 characters');
  const allowedStatuses = ['draft', 'review', 'published'];
  const status = allowedStatuses.includes(payload?.status) ? payload.status : 'draft';
  const now = new Date().toISOString();
  const faq = { id: uuidv4(), question, answer, category, status, authorId: ws.userId, createdAt: now, updatedAt: now };
  const faqs = readList(FAQS_FILE);
  faqs.push(faq);
  writeList(FAQS_FILE, faqs);
  return faq;
}

function handleAdminFaqDelete(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  const faqs = readList(FAQS_FILE);
  const index = faqs.findIndex((faq) => faq.id === payload?.id);
  if (index === -1) throw new Error('FAQ record not found');
  const [removed] = faqs.splice(index, 1);
  writeList(FAQS_FILE, faqs);
  return removed;
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
  'mix.get':            { fn: handleMixedLoadGet,    auth: true  },
  'mix.add':            { fn: handleMixedLoadAdd,    auth: true  },
  'mix.update':         { fn: handleMixedLoadUpdate, auth: true  },
  'mix.remove':         { fn: handleMixedLoadRemove, auth: true  },
  'mix.clear':          { fn: handleMixedLoadClear,  auth: true  },
  'quote.submit':       { fn: handleQuoteSubmit,     auth: true  },
  'support.chat':       { fn: handleSupportChat,   auth: true  },
  'support.faq':        { fn: handleSupportFAQ,    auth: false },
  'admin.users':        { fn: handleAdminUsers, auth: true },
  'admin.articles.list':{ fn: handleAdminArticlesList, auth: true },
  'admin.articles.create': { fn: handleAdminArticleCreate, auth: true },
  'admin.articles.delete': { fn: handleAdminArticleDelete, auth: true },
  'admin.faqs.list':    { fn: handleAdminFaqsList, auth: true },
  'admin.faqs.create':  { fn: handleAdminFaqCreate, auth: true },
  'admin.faqs.delete':  { fn: handleAdminFaqDelete, auth: true },
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
