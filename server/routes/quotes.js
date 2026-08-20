const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const quotesFile = path.join(__dirname, '..', 'data', 'quotes.json');
const recentSubmissions = new Map();

//清理并限制公开询价字段的文本长度
function clean(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

//读取已保存的询价数据列表
function readQuotes() {
  if (!fs.existsSync(quotesFile)) return [];
  return JSON.parse(fs.readFileSync(quotesFile, 'utf8'));
}

//接收无需登录的公开询价并持久化保存
router.post('/public', (req, res) => {
  try {
    if (req.body.website) return res.status(200).json({ code: 200, data: { reference: 'RECEIVED' } });

    const name = clean(req.body.name, 100);
    const company = clean(req.body.company, 150);
    const country = clean(req.body.country, 100);
    const email = clean(req.body.email, 200).toLowerCase();
    if (!name || !company || !country || !email) return res.status(400).json({ code: 400, message: 'Name, company, country and email are required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ code: 400, message: 'Enter a valid business email.' });

    const clientKey = `${req.ip}:${email}`;
    const lastSubmission = recentSubmissions.get(clientKey) || 0;
    if (Date.now() - lastSubmission < 60_000) return res.status(429).json({ code: 429, message: 'Please wait before sending another inquiry.' });

    const quantity = req.body.estimatedQuantity ? Number(req.body.estimatedQuantity) : null;
    if (quantity !== null && (!Number.isInteger(quantity) || quantity < 1)) return res.status(400).json({ code: 400, message: 'Estimated quantity must be a positive whole number.' });
    const allowedPlans = ['mixed-lcl', '20gp', '40hq', 'undecided'];
    const loadingPlan = allowedPlans.includes(req.body.loadingPlan) ? req.body.loadingPlan : 'undecided';

    const now = new Date();
    const reference = `WEB-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${uuidv4().slice(0, 6).toUpperCase()}`;
    const quote = {
      id: uuidv4(), reference, status: 'new', source: 'public-website',
      customer: { name, company, country, email, whatsapp: clean(req.body.whatsapp, 100) },
      vehicleModels: clean(req.body.vehicleModels), specifications: clean(req.body.specifications),
      estimatedQuantity: quantity, containerType: loadingPlan,
      destinationPort: clean(req.body.destinationPort, 150), notes: clean(req.body.message, 2000),
      items: [], createdAt: now.toISOString(),
    };
    const quotes = readQuotes();
    quotes.push(quote);
    fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2), 'utf8');
    recentSubmissions.set(clientKey, Date.now());
    res.status(201).json({ code: 201, data: { reference, message: 'Inquiry received.' } });
  } catch (error) {
    console.error('Public quote error:', error);
    res.status(500).json({ code: 500, message: 'Unable to save the inquiry.' });
  }
});

module.exports = router;
