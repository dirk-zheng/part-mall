const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

// In-memory cart storage (isolated by userId)
// Structure: { [userId]: [{ productId, quantity }] }
const cartStore = {};

function readProducts() {
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Get user's cart
function getUserCart(userId) {
  if (!cartStore[userId]) {
    cartStore[userId] = [];
  }
  return cartStore[userId];
}

// GET /api/cart - Get cart items
router.get('/', authenticateToken, (req, res) => {
  try {
    const cart = getUserCart(req.user.id);
    const products = readProducts();

    const cartItems = cart
      .map(item => {
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
        totalCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// POST /api/cart - Add product to cart
router.post('/', authenticateToken, (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ code: 400, message: 'Product ID is required' });
    }

    const products = readProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ code: 400, message: 'Insufficient stock' });
    }

    const cart = getUserCart(req.user.id);
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
router.put('/:productId', authenticateToken, (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({ code: 400, message: 'Quantity must be a positive integer' });
    }

    const cart = getUserCart(req.user.id);
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
router.delete('/:productId', authenticateToken, (req, res) => {
  try {
    const { productId } = req.params;
    const cart = getUserCart(req.user.id);
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
router.delete('/', authenticateToken, (req, res) => {
  try {
    cartStore[req.user.id] = [];
    res.json({ code: 200, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

module.exports = router;
