// server/seed-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const ADMIN = {
  name: 'Admin',
  email: 'admin@hostelmarket.com',
  password: 'Admin123!',
  role: 'admin',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${existing.email}`);
      console.log(`   Role: ${existing.role}`);
      process.exit(0);
    }

    const admin = await User.create(ADMIN);
    console.log('✅ Admin created');
    console.log('   Email:    ', ADMIN.email);
    console.log('   Password: ', ADMIN.password);
    console.log('   ID:       ', admin._id.toString());
    console.log('\n⚠️  Change the password after first login.\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();