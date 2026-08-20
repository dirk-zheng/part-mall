const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// AI Keyword matching configuration
const keywordRules = [
  {
    keywords: ['fitment', 'pcd', 'offset', 'center bore', 'vehicle', 'fit', 'size'],
    response: 'Local-market Fitment Support 🛞\n\nTell us your market and popular vehicle models. We keep frequently used selections for Southeast Asian Japanese sedans, Middle Eastern SUVs and Hilux pickups, then verify size, PCD, offset, center bore and load requirements.'
  },
  {
    keywords: ['moq', 'minimum order', 'sample', 'quantity', 'private label', 'mixed load', 'mixed-container', 'trial order', 'full container'],
    response: 'Flexible Order Planning 📦\n\nStart with a mixed-container trial instead of holding heavy inventory. After styles and fitments are proven in your market, we can support stable full-container repeat orders.'
  },
  {
    keywords: ['document', 'report', 'customs', 'clearance', 'fatigue test', 'impact test', 'material test'],
    response: 'Test Reports & Clearance Documents 📄\n\nWe can provide supporting material reports and fatigue-impact test reports for wheel orders, coordinated with packing and loading documents to support customs clearance.'
  },
  {
    keywords: ['price', 'cost', 'how much', 'cheap', 'discount', 'promotion', 'pricing', 'quote'],
    response: 'Practical Wheel Quotation 💰\n\nPricing depends on construction, size, finish, fitment mix, packaging and volume. Send us your market, vehicle list and target styles for a clear quotation and practical loading plan.'
  },
  {
    keywords: ['shipping', 'delivery', 'logistics', 'transport', 'how long', 'freight', 'tracking'],
    response: 'Order & Export Support 🚢\n\nWe support mixed-container trials and stable full containers, with convenient loading through nearby Huangpu Port. Material and fatigue-impact test reports can be supplied for clearance support.'
  },
  {
    keywords: ['return', 'refund', 'warranty', 'quality', 'damage', 'defect', 'exchange', 'inspect', 'inspection', 'qc', 'crack', 'porosity', 'balance', 'coating'],
    response: 'On-site Pre-shipment QC 🛡️\n\nWe draw cartons at random from the finished-goods warehouse instead of accepting pre-selected samples. The checklist focuses on spoke-root cracks, porosity, dimensions, dynamic balance and coating adhesion.'
  },
  {
    keywords: ['payment', 'pay', 'method', 'wire', 'bank', 'credit', 'terms', 'TT', 'LC'],
    response: 'Order Terms 💳\n\nPayment terms are confirmed clearly in the quotation and proforma invoice for each order. We keep order, QC, loading and document requirements aligned before shipment.'
  }
];

// Default fallback replies
const defaultReplies = [
  'Thank you for contacting Driveline Wheels. Ask us about local-market fitments, mixed-container trials, on-site QC or export documents.',
  'Hello! We work close to Yongning wheel factories and follow every order carefully. Share your market, popular vehicles and target styles, and we will help plan the next step.',
  'Welcome to Driveline Wheels. We support distributors and modification shops with practical selection, random-carton QC, flexible loading and Huangpu Port export coordination.'
];

// Get AI response based on keywords
//根据用户消息关键词生成客服回复
function getAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  for (const rule of keywordRules) {
    for (const keyword of rule.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return { reply: rule.response, matchedKeyword: keyword };
      }
    }
  }

  // Random default reply
  const randomReply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  return { reply: randomReply, matchedKeyword: null };
}

// POST /api/support/chat - Send message and get AI reply
//接收客服消息并返回关键词匹配结果
router.post('/chat', authenticateToken, (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ code: 400, message: 'Message cannot be empty' });
    }

    const result = getAIResponse(message.trim());

    res.json({
      code: 200,
      data: {
        userMessage: message.trim(),
        aiReply: result.reply,
        matchedKeyword: result.matchedKeyword,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// GET /api/support/faq - Get frequently asked questions
//返回客服模块常见问题列表
router.get('/faq', (req, res) => {
  res.json({
    code: 200,
    data: [
      { id: 1, question: 'Which local-market wheel fitments do you keep?', category: 'Fitment' },
      { id: 2, question: 'Can I begin with a mixed-container trial?', category: 'Orders' },
      { id: 3, question: 'How do you select cartons for on-site QC?', category: 'Quality' },
      { id: 4, question: 'What items are included in the QC checklist?', category: 'Quality' },
      { id: 5, question: 'Can you load full containers through Huangpu Port?', category: 'Shipping' },
      { id: 6, question: 'Which test reports support customs clearance?', category: 'Documents' }
    ]
  });
});

module.exports = router;
