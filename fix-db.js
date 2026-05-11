const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://triplen_user:MySecurePass123@cluster0.we94gyj.mongodb.net/triplen-supermart?retryWrites=true&w=majority';

async function fixDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.getClient().db('triplen-supermart');
    
    // Drop all indexes on users collection
    try {
      await db.collection('users').dropIndexes();
      console.log('Dropped all indexes on users collection');
    } catch (e) {
      console.log('No indexes to drop on users collection');
    }
    
    // Drop the users collection
    await db.collection('users').drop().catch(() => {
      console.log('Users collection does not exist');
    });
    
    // Drop all indexes on customers collection
    try {
      await db.collection('customers').dropIndexes();
      console.log('Dropped all indexes on customers collection');
    } catch (e) {
      console.log('No indexes to drop on customers collection');
    }
    
    // Drop the customers collection
    await db.collection('customers').drop().catch(() => {
      console.log('Customers collection does not exist');
    });
    
    console.log('Dropped collections and indexes successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixDatabase();
