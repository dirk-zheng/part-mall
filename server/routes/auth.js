const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { generateToken, authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data).users;
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2), 'utf-8');
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: 'Username and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ code: 401, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: 'Invalid username or password' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    res.json({
      code: 200,
      message: 'Login successful',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: 'Username and password are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ code: 400, message: 'Password must be at least 4 characters' });
    }

    const users = readUsers();
    
    if (users.some(u => u.username === username)) {
      return res.status(409).json({ code: 409, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      role: 'user',
      name: name || username
    };

    users.push(newUser);
    writeUsers(users);

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      code: 201,
      message: 'Registration successful',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    data: req.user
  });
});

module.exports = router;
