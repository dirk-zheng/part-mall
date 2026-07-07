const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

function readProducts() {
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

// GET /api/products - List products (search, category filter, sort)
router.get('/', (req, res) => {
  try {
    const { search, category, sort, page = 1, pageSize = 20 } = req.query;
    let products = readProducts();

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Sort
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    }

    // Pagination
    const total = products.length;
    const p = parseInt(page);
    const ps = parseInt(pageSize);
    const start = (p - 1) * ps;
    const paged = products.slice(start, start + ps);

    res.json({
      code: 200,
      data: { list: paged, total, page: p, pageSize: ps, totalPages: Math.ceil(total / ps) }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// GET /api/products/categories - Category statistics
router.get('/categories', (req, res) => {
  try {
    const products = readProducts();
    const categoryMap = {};
    products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    const categories = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));
    res.json({ code: 200, data: { total: products.length, categories } });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }

    res.json({ code: 200, data: product });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// POST /api/products - Add product (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, category, price, stock, image, description } = req.body;

    // Validation
    const errors = [];
    if (!name || name.length < 2 || name.length > 50) {
      errors.push('Product name must be 2-50 characters');
    }
    if (!category || !['phone', 'computer', 'accessory', 'wearable', 'audio'].includes(category)) {
      errors.push('Please select a valid product category');
    }
    if (!price || price <= 0) {
      errors.push('Price must be greater than 0');
    }
    if (stock === undefined || stock < 0 || !Number.isInteger(Number(stock))) {
      errors.push('Stock must be a non-negative integer');
    }
    if (!image) {
      errors.push('Please provide a product image URL');
    }
    if (!description) {
      errors.push('Please provide a product description');
    }

    if (errors.length > 0) {
      return res.status(400).json({ code: 400, message: 'Validation failed', errors });
    }

    const products = readProducts();
    const newProduct = {
      id: uuidv4(),
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      image: image.trim(),
      description: description.trim()
    };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json({ code: 201, message: 'Product added successfully', data: newProduct });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }

    const { name, category, price, stock, image, description } = req.body;

    // Validation
    const errors = [];
    if (!name || name.length < 2 || name.length > 50) {
      errors.push('Product name must be 2-50 characters');
    }
    if (!category || !['phone', 'computer', 'accessory', 'wearable', 'audio'].includes(category)) {
      errors.push('Please select a valid product category');
    }
    if (!price || price <= 0) {
      errors.push('Price must be greater than 0');
    }
    if (stock === undefined || stock < 0 || !Number.isInteger(Number(stock))) {
      errors.push('Stock must be a non-negative integer');
    }
    if (!image) {
      errors.push('Please provide a product image URL');
    }
    if (!description) {
      errors.push('Please provide a product description');
    }

    if (errors.length > 0) {
      return res.status(400).json({ code: 400, message: 'Validation failed', errors });
    }

    products[index] = {
      ...products[index],
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      image: image.trim(),
      description: description.trim()
    };

    writeProducts(products);

    res.json({ code: 200, message: 'Product updated successfully', data: products[index] });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ code: 404, message: 'Product not found' });
    }

    const removed = products.splice(index, 1)[0];
    writeProducts(products);

    res.json({ code: 200, message: 'Product deleted successfully', data: removed });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

module.exports = router;
