const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

async function seedUsers() {
  const passwordHashes = {
    admin: await bcrypt.hash('admin', 10),
    user: await bcrypt.hash('user123', 10)
  };

  const users = {
    users: [
      {
        id: '1',
        username: 'admin',
        password: passwordHashes.admin,
        role: 'admin',
        name: 'Admin'
      },
      {
        id: '2',
        username: 'user',
        password: passwordHashes.user,
        role: 'user',
        name: 'Demo User'
      }
    ]
  };

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  console.log('✅ User data initialized');
  console.log(`  admin password: admin`);
  console.log(`  user  password: user123`);
}

seedUsers().catch(console.error);
