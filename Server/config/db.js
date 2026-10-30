const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lankatrip';

  try {
    // Attempt standard connection first with a brief timeout
    console.log(`[Database] Attempting connection to ${uri}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection failed: ${err.message}`);
    console.log('[Database] Initializing embedded MongoDB Memory Server for local zero-config operation...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Embedded MongoDB Memory Server connected successfully: ${memUri}`);

      // Auto-seed if running in embedded mode
      const seeder = require('../seed/seeder');
      await seeder.seedDataIfNeeded();

      return conn;
    } catch (memErr) {
      console.error(`[Database] Embedded database startup error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
