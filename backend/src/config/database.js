import mongoose from 'mongoose';
import dns from 'dns';

// Override Node.js DNS servers to use Google DNS, bypassing local DNS
// (127.0.0.1) that blocks SRV record lookups (ECONNREFUSED on _mongodb SRV).
// This is required for mongodb+srv:// connection strings which rely on SRV.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI;
const PLACEHOLDER_PATTERNS = ['username:password', 'your-mongodb-uri-here'];

const isPlaceholderURI = (uri) => {
  if (!uri) return true;
  return PLACEHOLDER_PATTERNS.some(pattern => uri.includes(pattern));
};

const connectDB = async () => {
  if (isPlaceholderURI(MONGODB_URI)) {
    console.warn('⚠️  [database] MONGODB_URI is a placeholder or missing. Skipping database connection.');
    console.warn('⚠️  Server will continue running without database. Set a valid MONGODB_URI in .env to enable database features.');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Fail fast on operations when connection is lost instead of buffering
      // for 2 minutes (default). This prevents upload requests from hanging
      // indefinitely when MongoDB is unreachable.
      bufferCommands: false,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.warn('⚠️  Server will continue running without database. Set a valid MONGODB_URI in .env to enable database features.');
  }
};

export default connectDB;
