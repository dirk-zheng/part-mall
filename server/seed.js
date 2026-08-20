const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const DEMO_USERNAME = 'user';
const DEMO_PASSWORD = 'user123';

//初始化或更新管理员和演示用户数据
async function seedUsers() {
  const storedData = fs.existsSync(USERS_FILE)
    ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
    : { users: [] };
  const existingUsers = Array.isArray(storedData.users) ? storedData.users : [];
  const retainedUsers = existingUsers.filter(
    (user) => user.username !== ADMIN_USERNAME && user.username !== DEMO_USERNAME
  );
  const users = {
    users: [
      {
        id: existingUsers.find((user) => user.username === ADMIN_USERNAME)?.id || '1',
        username: ADMIN_USERNAME,
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        role: 'admin',
        name: 'Admin'
      },
      {
        id: existingUsers.find((user) => user.username === DEMO_USERNAME)?.id || '2',
        username: DEMO_USERNAME,
        password: await bcrypt.hash(DEMO_PASSWORD, 10),
        role: 'user',
        name: 'Demo User'
      },
      ...retainedUsers
    ]
  };

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  console.log('✅ User data initialized');
  console.log(`  ${ADMIN_USERNAME} password: ${ADMIN_PASSWORD}`);
  console.log(`  ${DEMO_USERNAME}  password: ${DEMO_PASSWORD}`);
}

seedUsers().catch(console.error);
