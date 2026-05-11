const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@supermart.com';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+1234567890';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

async function setupAdmin() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Connection string:', MONGO_URI ? MONGO_URI.substring(0, 50) + '...' : 'NOT SET');
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    const users = db.collection('users');
    const customers = db.collection('customers');
    
    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin && existingAdmin.role === 'admin') {
      console.log('✓ Admin user already exists!');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log('\nTo reset admin, run: node delete-admin.js');
    } else if (existingAdmin) {
      // Update existing user to admin
      await users.updateOne(
        { email: ADMIN_EMAIL },
        { $set: { role: 'admin' } }
      );
      console.log('✓ Updated existing user to admin role');
      console.log(`Email: ${ADMIN_EMAIL}`);
    } else {
      // Create new admin user
      let customerId = 'ADM0001';
      
      // Check if customer already exists
      const existingCustomer = await customers.findOne({ email: ADMIN_EMAIL });
      if (!existingCustomer) {
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
      } else {
        customerId = existingCustomer.customerId || 'ADM0001';
        console.log('✓ Using existing customer record');
      }
      
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      const userResult = await users.insertOne({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        passwordHash: passwordHash,
        role: 'admin',
        customerId: customerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('✓ Created admin user\n');
      console.log('========== ADMIN CREDENTIALS ==========');
      console.log(`Email:    ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log('=======================================');
    }
    
    console.log('\n✓ Admin setup complete!');
    console.log('📍 Login URL: http://localhost:5173/login');
    console.log('📍 Admin Dashboard: http://localhost:5173/admin\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('\n⚠️ Common issues:');
    console.error('1. IP not whitelisted in MongoDB Atlas');
    console.error('2. MONGO_URI not set in .env file');
    console.error('3. MongoDB Atlas cluster is paused');
    console.error('\nMake sure your IP is whitelisted in MongoDB Atlas Security > Network Access');
    process.exit(1);
  }
}

setupAdmin();
