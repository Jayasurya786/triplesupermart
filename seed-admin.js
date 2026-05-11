const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@supermart.com';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+1234567890';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const users = db.collection('users');
    const customers = db.collection('customers');
    
    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('⚠ Admin user already exists with email:', ADMIN_EMAIL);
      console.log('If you want to recreate, run: node fix-db.js');
      process.exit(0);
    }
    
    // Create customer record first
    const customerResult = await customers.insertOne({
      customerId: 'ADM0001',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      loyaltyTier: 'gold',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✓ Created customer record');
    
    // Hash password
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    // Create admin user
    const userResult = await users.insertOne({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      passwordHash: passwordHash,
      role: 'admin',
      customerId: 'ADM0001',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✓ Created admin user');
    console.log('\n========== ADMIN CREDENTIALS ==========');
    console.log(`Email:    ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('=======================================\n');
    console.log('Login path: /login');
    console.log('Admin Dashboard path: /admin\n');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
