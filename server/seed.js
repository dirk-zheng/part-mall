require('dotenv').config();

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ADMIN_USERNAME = String(process.env.ADMIN_USERNAME || '').trim();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '');
const ADMIN_NAME = String(process.env.ADMIN_NAME || 'Admin').trim() || 'Admin';

// 仅用于首次部署：已有任何用户数据时绝不覆盖或重置账号。
async function seedUsers() {
  const storedData = fs.existsSync(USERS_FILE)
    ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
    : { users: [] };
  const existingUsers = Array.isArray(storedData.users) ? storedData.users : [];

  if (existingUsers.length > 0) {
    console.log(`Seed skipped: ${existingUsers.length} existing user(s) found.`);
    return;
  }

  if (!/^[A-Za-z0-9_.@-]{3,100}$/.test(ADMIN_USERNAME)) {
    throw new Error('ADMIN_USERNAME is required and must contain 3-100 valid characters.');
  }
  if (ADMIN_PASSWORD.length < 12) {
    throw new Error('ADMIN_PASSWORD is required and must be at least 12 characters.');
  }

  const users = { users: [{
    id: uuidv4(),
    username: ADMIN_USERNAME,
    password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: 'admin',
    name: ADMIN_NAME,
    createdAt: new Date().toISOString(),
  }] };

  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  console.log(`Initial admin created: ${ADMIN_USERNAME}`);
}

seedUsers().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
});
