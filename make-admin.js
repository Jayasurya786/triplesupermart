const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://triplen_user:MySecurePass123@cluster0.we94gyj.mongodb.net/triplen-supermart?retryWrites=true&w=majority';

async function makeAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    // Update the admin user's role
    const result = await users.updateOne(
      { email: 'admin@supermart.com' },
      { $set: { role: 'admin' } }
    );
    
    console.log('Updated:', result.modifiedCount, 'user(s)');
    
    // Verify the update
    const admin = await users.findOne({ email: 'admin@supermart.com' });
    console.log('Admin user:', {
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
