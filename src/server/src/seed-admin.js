// seed-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@hostelmarket.com' });
  if (!exists) {
    await User.create({
      name: 'Admin',
      email: 'admin@hostelmarket.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('Admin created');
  } else {
    console.log('Admin already exists');
  }
  process.exit();
})();