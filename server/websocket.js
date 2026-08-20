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
//读取商品数据列表
function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
}

//将商品数据列表写入本地文件
function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

//读取用户数据列表
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')).users;
}

//将用户数据列表写入本地文件
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2), 'utf-8');
}

//读取询价数据列表
function readQuotes() {
  if (!fs.existsSync(QUOTES_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf-8'));
}

//将询价数据列表写入本地文件
function writeQuotes(quotes) {
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2), 'utf-8');
}

//从指定文件读取数组类型的内容数据
function readList(file) {
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return Array.isArray(data) ? data : [];
}

//将内容数组写入指定本地文件
function writeList(file, list) {
  fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf-8');
}

// ─── In-Memory Mixed-load Builder ────────────────
const mixedLoadStore = {};

//获取指定用户的混装清单并在不存在时初始化
function getUserMixedLoad(userId) {
  if (!mixedLoadStore[userId]) mixedLoadStore[userId] = [];
  return mixedLoadStore[userId];
}

// ─── In-Memory IM Store ──────────────────────────
const imRooms = {};      // roomId → { roomId, members[], memberNames{}, lastMessage, updatedAt }
const imMessages = {};   // roomId → [ { id, roomId, senderId, senderName, content, timestamp } ]
const clientMap = new Map(); // userId → Set<WebSocket>

//获取或创建两个用户之间的即时通信房间
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

//登记指定用户的WebSocket客户端连接
function addClient(userId, ws) {
  if (!clientMap.has(userId)) clientMap.set(userId, new Set());
  clientMap.get(userId).add(ws);
}

//移除指定用户的WebSocket客户端连接
function removeClient(userId, ws) {
  const set = clientMap.get(userId);
  if (set) {
    set.delete(ws);
    if (set.size === 0) clientMap.delete(userId);
  }
}

//向指定用户的全部在线连接推送消息
function sendToUser(userId, data) {
  const set = clientMap.get(userId);
  if (set) {
    const payload = JSON.stringify(data);
    //向用户的每个有效WebSocket连接发送数据
    set.forEach(ws => {
      if (ws.readyState === 1) ws.send(payload);
    });
  }
}

//组合用户混装清单与对应商品详情
function buildMixedLoadItems(userId) {
  const mixedLoad = getUserMixedLoad(userId);
  const products = readProducts();
  const items = mixedLoad
    //将混装商品ID映射为完整商品信息
    .map(item => {
      //根据混装商品ID查找商品数据
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter(Boolean);
  //累计混装清单中的商品总数量
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

//根据用户消息关键词生成客服回复
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
//校验商品新增或更新数据
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

//校验WebSocket用户是否拥有管理员权限
function checkAdmin(ws) {
  if (!ws.user || ws.user.role !== 'admin') {
    throw new Error('Access denied. Admin only.');
  }
}

//校验WebSocket连接是否已经完成身份认证
function checkAuth(ws) {
  if (!ws.user) {
    throw new Error('Not authenticated. Please sign in.');
  }
}

// ─── Handlers ────────────────────────────────────

// Auth
//处理WebSocket用户登录并更新连接身份
async function handleLogin(payload, ws) {
  const { username, password } = payload || {};
  if (!username || !password) throw new Error('Username and password are required');

  const users = readUsers();
  //根据用户名查找登录用户
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

//处理WebSocket用户注册并更新连接身份
async function handleRegister(payload, ws) {
  const { username, password, name } = payload || {};
  if (!username || !password) throw new Error('Username and password are required');
  if (password.length < 4) throw new Error('Password must be at least 4 characters');

  const users = readUsers();
  //检查注册用户名是否已经存在
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

//返回当前WebSocket连接的用户信息
function handleMe(payload, ws) {
  checkAuth(ws);
  return ws.user;
}

// Products
//查询商品列表并执行搜索筛选排序和分页
function handleProductList(payload) {
  let products = readProducts();
  const { search, category, sort, page = 1, pageSize = 20 } = payload || {};

  if (search) {
    const q = search.toLowerCase();
    //根据商品名称和描述筛选搜索结果
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category && category !== 'all') {
    //根据商品分类筛选商品列表
    products = products.filter(p => p.category === category);
  }
  //根据价格按升序排列商品列表
  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  //根据价格按降序排列商品列表
  else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);

  const total = products.length;
  const p = parseInt(page), ps = parseInt(pageSize);
  const start = (p - 1) * ps;
  const paged = products.slice(start, start + ps);

  return { list: paged, total, page: p, pageSize: ps, totalPages: Math.ceil(total / ps) };
}

//统计并返回商品分类数量
function handleProductCategories() {
  const products = readProducts();
  const map = {};
  //遍历商品并累计每个分类数量
  products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
  //将分类统计对象转换为数组格式
  const categories = Object.entries(map).map(([name, count]) => ({ name, count }));
  return { total: products.length, categories };
}

//根据商品ID返回单个商品详情
function handleProductGet(payload) {
  const products = readProducts();
  //根据商品ID查找商品详情
  const product = products.find(p => p.id === payload.id);
  if (!product) throw new Error('Product not found');
  return product;
}

//校验管理员权限并新增商品
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

//校验管理员权限并更新指定商品
function handleProductUpdate(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);

  const errors = validateProduct(payload);
  if (errors.length > 0) throw new Error(errors.join('; '));

  const products = readProducts();
  //查找需要更新的商品索引
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

//校验管理员权限并删除指定商品
function handleProductDelete(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);

  const products = readProducts();
  //查找需要删除的商品索引
  const idx = products.findIndex(p => p.id === payload.id);
  if (idx === -1) throw new Error('Product not found');

  const removed = products.splice(idx, 1)[0];
  writeProducts(products);
  return removed;
}

// Mixed-load builder
//返回当前用户的混装清单详情
function handleMixedLoadGet(payload, ws) {
  checkAuth(ws);
  return buildMixedLoadItems(ws.userId);
}

//向当前用户混装清单添加商品
function handleMixedLoadAdd(payload, ws) {
  checkAuth(ws);
  const { productId, quantity = 1 } = payload || {};
  if (!productId) throw new Error('Product ID is required');

  const products = readProducts();
  //根据商品ID查找准备加入混装清单的商品
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error('Insufficient stock');

  const mixedLoad = getUserMixedLoad(ws.userId);
  //查找混装清单中是否已有相同商品
  const existing = mixedLoad.find(i => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else mixedLoad.push({ productId, quantity });

  return { productId, quantity: existing ? existing.quantity : quantity };
}

//更新混装清单中指定商品的数量
function handleMixedLoadUpdate(payload, ws) {
  checkAuth(ws);
  const { productId, quantity } = payload || {};
  if (!quantity || quantity < 1 || !Number.isInteger(quantity))
    throw new Error('Quantity must be a positive integer');

  const mixedLoad = getUserMixedLoad(ws.userId);
  //查找需要更新数量的混装商品
  const item = mixedLoad.find(i => i.productId === productId);
  if (!item) throw new Error('Item not found in mixed load');

  item.quantity = quantity;
  return { productId, quantity };
}

//从混装清单移除指定商品
function handleMixedLoadRemove(payload, ws) {
  checkAuth(ws);
  const { productId } = payload || {};
  const mixedLoad = getUserMixedLoad(ws.userId);
  //查找需要移除的混装商品索引
  const idx = mixedLoad.findIndex(i => i.productId === productId);
  if (idx === -1) throw new Error('Item not found in mixed load');

  mixedLoad.splice(idx, 1);
  return { removed: productId };
}

//清空当前用户的混装清单
function handleMixedLoadClear(payload, ws) {
  checkAuth(ws);
  mixedLoadStore[ws.userId] = [];
  return { cleared: true };
}

//校验并保存登录用户提交的混装询价
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
    //清理询价中的报告要求列表
    reportRequirements: reportRequirements.map(item => String(item).trim()).filter(Boolean),
    notes: String(notes).trim(),
    //将混装商品转换为询价存档格式
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
//处理客服聊天消息并返回匹配回复
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

//返回WebSocket客服常见问题列表
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
//校验管理员权限并返回脱敏用户列表
function handleAdminUsers(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  //移除用户密码后返回安全用户数据
  return readUsers().map(({ password, ...user }) => user);
}

//将文章标题或输入值转换为URL标识
function createSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/["'“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

//校验管理员权限并返回文章内容记录
function handleAdminArticlesList(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  //按更新时间倒序排列文章记录
  return readList(ARTICLES_FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

//校验文章内容并创建管理员文章记录
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
  //检查文章URL标识是否重复
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

//删除管理员指定的文章记录
function handleAdminArticleDelete(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  const articles = readList(ARTICLES_FILE);
  //查找需要删除的文章索引
  const index = articles.findIndex((article) => article.id === payload?.id);
  if (index === -1) throw new Error('Article record not found');
  const [removed] = articles.splice(index, 1);
  writeList(ARTICLES_FILE, articles);
  return removed;
}

//校验管理员权限并返回FAQ内容记录
function handleAdminFaqsList(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  //按更新时间倒序排列FAQ记录
  return readList(FAQS_FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

//校验FAQ内容并创建管理员FAQ记录
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

//删除管理员指定的FAQ记录
function handleAdminFaqDelete(payload, ws) {
  checkAuth(ws);
  checkAdmin(ws);
  const faqs = readList(FAQS_FILE);
  //查找需要删除的FAQ索引
  const index = faqs.findIndex((faq) => faq.id === payload?.id);
  if (index === -1) throw new Error('FAQ record not found');
  const [removed] = faqs.splice(index, 1);
  writeList(FAQS_FILE, faqs);
  return removed;
}

// ─── IM (Instant Messaging) ───────────────────────

//返回可提供即时沟通的销售管理员列表
function handleGetSales() {
  const users = readUsers();
  //筛选拥有管理员角色的销售账号
  return users
    //逐项判断用户是否拥有管理员角色
    .filter(u => u.role === 'admin')
    //将销售账号转换为前端安全字段
    .map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role }));
}

//返回当前用户参与的即时通信房间列表
function handleGetIMRooms(payload, ws) {
  checkAuth(ws);
  const userId = ws.userId;
  const allUsers = readUsers();

  const rooms = [];
  for (const roomId of Object.keys(imRooms)) {
    const room = imRooms[roomId];
    if (room.members.includes(userId)) {
      //查找即时通信房间中的另一位成员
      const otherId = room.members.find(id => id !== userId);
      //根据成员ID查找用户信息
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
  //按最近更新时间倒序排列通信房间
  rooms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return rooms;
}

//返回指定即时通信房间的最近消息
function handleGetIMMessages(payload, ws) {
  checkAuth(ws);
  const { roomId } = payload || {};
  if (!roomId || !imRooms[roomId]) throw new Error('Conversation not found');
  if (!imRooms[roomId].members.includes(ws.userId)) throw new Error('Access denied');

  return (imMessages[roomId] || []).slice(-100); // Last 100 messages
}

//创建即时通信房间或发送聊天消息
function handleIMSend(payload, ws) {
  checkAuth(ws);
  let { roomId, toUserId, content } = payload || {};
  if (!content || !content.trim()) throw new Error('Message cannot be empty');

  // Create room if toUserId provided and roomId doesn't exist
  if (!roomId && toUserId) {
    const allUsers = readUsers();
    //根据接收者ID查找目标用户
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
  //将新消息推送给房间内除发送者外的成员
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
//创建WebSocket服务并注册认证心跳和消息处理
function createWSServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Heartbeat interval
  //定时检查并清理失去响应的WebSocket连接
  const heartbeat = setInterval(() => {
    //遍历WebSocket客户端并执行心跳检查
    wss.clients.forEach(ws => {
      if (ws.__alive === false) return ws.terminate();
      ws.__alive = false;
      ws.ping();
    });
  }, 30000);

  //在WebSocket服务关闭时清理心跳定时器
  wss.on('close', () => clearInterval(heartbeat));

  //处理新的WebSocket连接并解析身份令牌
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

    //在客户端响应心跳时更新连接存活状态
    ws.on('pong', () => { ws.__alive = true; });

    //在连接关闭时移除用户在线客户端记录
    ws.on('close', () => {
      if (ws.userId) removeClient(ws.userId, ws);
    });

    //解析WebSocket消息并路由到对应业务处理器
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
