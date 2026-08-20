const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

// In-memory cart storage (isolated by userId)
// Structure: { [userId]: [{ productId, quantity }] }
const cartStore = {};

//读取商品数据供购物车关联查询
function readProducts() {
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Get user's cart
//获取指定用户的内存购物车并在不存在时初始化
function getUserCart(userId) {
  if (!cartStore[userId]) {
    cartStore[userId] = [];
  }
  return cartStore[userId];
}

// GET /api/cart - Get cart items
//查询当前用户购物车商品及数量汇总
router.get('/', authenticateToken, (req, res) => {
  try {
    const cart = getUserCart(req.user.id);
    const products = readProducts();

    //将购物车记录映射为包含商品详情的条目
    const cartItems = cart
      //遍历购物车记录并生成商品详情条目
      .map(item => {
        //根据购物车商品ID查找商品详情
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity
        };
      })
      .filter(Boolean);

    res.json({
      code: 200,
      data: {
        items: cartItems,
        //累计购物车中的商品总数量
        totalCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// POST /api/cart - Add product to cart
//向当前用户购物车添加指定商品
router.post('/', authenticateToken, (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ code: 400, message: 'Product ID is required' });
    }

    const products = readProducts();
    //根据商品ID查找准备加入购物车的商品
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ code: 400, message: 'Insufficient stock' });
    }

    const cart = getUserCart(req.user.id);
    //查找购物车中是否已有相同商品
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    res.json({
      code: 200,
      message: 'Added to cart',
      data: { productId, quantity: existingItem ? existingItem.quantity : quantity }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// PUT /api/cart/:productId - Update cart item quantity
//更新购物车中指定商品的数量
router.put('/:productId', authenticateToken, (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({ code: 400, message: 'Quantity must be a positive integer' });
    }

    const cart = getUserCart(req.user.id);
    //查找需要更新数量的购物车商品
    const item = cart.find(item => item.productId === productId);

    if (!item) {
      return res.status(404).json({ code: 404, message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    res.json({
      code: 200,
      message: 'Quantity updated',
      data: { productId, quantity }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// DELETE /api/cart/:productId - Remove product from cart
//删除购物车中的指定商品
router.delete('/:productId', authenticateToken, (req, res) => {
  try {
    const { productId } = req.params;
    const cart = getUserCart(req.user.id);
    //查找需要删除的购物车商品索引
    const index = cart.findIndex(item => item.productId === productId);

    if (index === -1) {
      return res.status(404).json({ code: 404, message: 'Item not found in cart' });
    }

    cart.splice(index, 1);

    res.json({ code: 200, message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// DELETE /api/cart - Clear entire cart
//清空当前用户的全部购物车商品
router.delete('/', authenticateToken, (req, res) => {
  try {
    cartStore[req.user.id] = [];
    res.json({ code: 200, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

module.exports = router;
