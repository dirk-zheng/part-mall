// 初始商品数据
export const initialProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    category: 'phone',
    price: 9999,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
    description: 'A17 Pro 芯片，钛金属设计，全新 Action 按钮'
  },
  {
    id: '2',
    name: 'MacBook Pro 16" M3 Max',
    category: 'computer',
    price: 27999,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    description: 'M3 Max 芯片，48GB 统一内存，1TB SSD'
  },
  {
    id: '3',
    name: 'AirPods Pro 2',
    category: 'audio',
    price: 1899,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop',
    description: '主动降噪，自适应音频，个性化空间音频'
  },
  {
    id: '4',
    name: 'Apple Watch Ultra 2',
    category: 'wearable',
    price: 6499,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
    description: '49mm 钛金属表壳，双频 GPS，100 米防水'
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phone',
    price: 9699,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
    description: '骁龙 8 Gen 3，200MP 摄像头，Galaxy AI'
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    category: 'audio',
    price: 2699,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop',
    description: '行业领先降噪，30 小时续航，LDAC 高解析'
  },
  {
    id: '7',
    name: 'Dell XPS 15',
    category: 'computer',
    price: 14999,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
    description: 'Intel i9-13900H，32GB DDR5，RTX 4060'
  },
  {
    id: '8',
    name: '华为 Mate 60 Pro',
    category: 'phone',
    price: 6999,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1598321273864-5197b4a9bb57?w=400&h=300&fit=crop',
    description: '麒麟 9000S，卫星通话，XMAGE 影像'
  },
  {
    id: '9',
    name: '机械键盘 K380',
    category: 'accessory',
    price: 299,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    description: '多设备切换，舒适敲击，轻薄便携'
  },
  {
    id: '10',
    name: '罗技 MX Master 3S',
    category: 'accessory',
    price: 799,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    description: '电磁滚轮，8K DPI 传感器，静音点击'
  },
  {
    id: '11',
    name: '小米手环 8 Pro',
    category: 'wearable',
    price: 399,
    stock: 300,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
    description: '1.74 英寸 AMOLED，健康监测全升级'
  },
  {
    id: '12',
    name: 'Nintendo Switch OLED',
    category: 'accessory',
    price: 2599,
    stock: 70,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop',
    description: '7 英寸 OLED 屏幕，增强型底座，LAN 口'
  }
];

// 分类配置
export const categories = [
  { id: 'all', name: 'All', icon: 'Grid3X3' },
  { id: 'phone', name: 'Phones', icon: 'Smartphone' },
  { id: 'computer', name: 'Computers', icon: 'Laptop' },
  { id: 'accessory', name: 'Accessories', icon: 'Cable' },
  { id: 'wearable', name: 'Wearables', icon: 'Watch' },
  { id: 'audio', name: 'Audio', icon: 'Headphones' }
];

// AI 客服回复模板
export const aiResponses = {
  greeting: 'Hello! Welcome to DriveLine International. I am your dedicated support assistant. How can I help you today?',
  keywords: {
    price: {
      patterns: ['price', 'cost', 'how much', 'cheap', 'discount', 'promotion', 'pricing'],
      response: 'We offer competitive wholesale pricing and volume discounts. Different products have different promotions — please check product details or contact our sales team for the latest quotes. Long-term partnership pricing is also available!'
    },
    shipping: {
      patterns: ['shipping', 'delivery', 'logistics', 'transport', 'how long', 'freight', 'tracking'],
      response: 'We offer worldwide shipping via air freight (3-7 days), sea freight (15-30 days), and express courier (2-5 days). All shipments include full tracking and insurance. Customs clearance is handled by our experienced logistics team.'
    },
    return: {
      patterns: ['return', 'refund', 'warranty', 'quality', 'damage', 'defect', 'exchange'],
      response: 'We offer a 30-day return policy for defective products and a 1-year warranty on all items. If you receive damaged goods, please document with photos and contact us within 48 hours for a full refund or replacement.'
    },
    payment: {
      patterns: ['payment', 'pay', 'method', 'wire', 'bank', 'credit', 'terms', 'TT'],
      response: 'We accept T/T (bank wire transfer), L/C (letter of credit), Western Union, PayPal, and Alibaba Trade Assurance. Payment terms: 30% deposit to start production, 70% balance before shipment. Competitive payment terms available for established partners.'
    },
    default: {
      patterns: [],
      response: 'Thank you for reaching out! Your inquiry has been received. For detailed product information, pricing, or partnership opportunities, please feel free to ask. You can also browse our product catalog for inspiration.'
    }
  }
};
