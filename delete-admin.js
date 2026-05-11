const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@supermart.com';

async function deleteAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const users = db.collection('users');
    const customers = db.collection('customers');
    
    // Delete admin user
    const userResult = await users.deleteOne({ email: ADMIN_EMAIL });
    console.log(`Deleted ${userResult.deletedCount} user(s) with email: ${ADMIN_EMAIL}`);
    
    // Delete admin customer record
    const customerResult = await customers.deleteOne({ customerId: 'ADM0001' });
    console.log(`Deleted ${customerResult.deletedCount} customer record(s)`);
    
    console.log('\n✓ Admin deleted. Run "node setup-admin.js" to recreate.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

deleteAdmin();
