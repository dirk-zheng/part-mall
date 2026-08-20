const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { generateToken, authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

//读取用户数据列表
function readUsers() {
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data).users;
}

//将用户数据列表写入本地文件
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2), 'utf-8');
}

// POST /api/auth/login
//处理用户登录并返回用户信息与JWT令牌
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: 'Username and password are required' });
    }

    const users = readUsers();
    //根据用户名查找登录用户
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
//处理新用户注册并生成登录令牌
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
    
    //检查注册用户名是否已经存在
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
//返回当前已登录用户信息
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    data: req.user
  });
});

module.exports = router;
