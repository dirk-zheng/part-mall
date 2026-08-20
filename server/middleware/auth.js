const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'digital-mall-secret-key-2024';

// Generate JWT Token
//生成用户身份认证JWT令牌
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication middleware
//校验请求中的JWT令牌并写入当前用户信息
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ code: 401, message: 'Not authenticated. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ code: 403, message: 'Token expired. Please sign in again.' });
  }
}

// Admin authorization middleware
//校验当前用户是否拥有管理员权限
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ code: 403, message: 'Access denied. Admin only.' });
  }
  next();
}

module.exports = { JWT_SECRET, generateToken, authenticateToken, requireAdmin };
