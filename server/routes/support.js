const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// AI Keyword matching configuration
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

// Default fallback replies
const defaultReplies = [
  'Thank you for reaching out to DriveLine! Your inquiry has been received. A trade specialist will follow up shortly.\n\n💡 In the meantime, you can ask about:\n• Product pricing & MOQ\n• Shipping & delivery times\n• Return policy & warranty\n• Payment methods',
  'Hello! I\'m DriveLine\'s virtual assistant. 🤖\n\nI can help with:\n• 📦 Product sourcing & pricing\n• 🚢 Shipping & logistics\n• 🔄 Returns & quality assurance\n• 💳 Payment terms & methods\n\nWhat would you like to know?',
  'Welcome to DriveLine International! 😊\n\nWe specialize in global product sourcing and supply chain solutions across consumer electronics, accessories, wearables, and audio equipment. All products meet international quality standards with full warranty support.\n\nHow can I assist you today?'
];

// Get AI response based on keywords
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
router.get('/faq', (req, res) => {
  res.json({
    code: 200,
    data: [
      { id: 1, question: 'Product pricing and discounts', category: 'Pricing' },
      { id: 2, question: 'Shipping and delivery times', category: 'Shipping' },
      { id: 3, question: 'Return and refund policy', category: 'After-Sales' },
      { id: 4, question: 'Accepted payment methods', category: 'Payment' },
      { id: 5, question: 'How to track my order', category: 'Orders' },
      { id: 6, question: 'Product warranty coverage', category: 'After-Sales' }
    ]
  });
});

module.exports = router;
