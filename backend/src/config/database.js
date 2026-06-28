import mongoose from 'mongoose';
import dns from 'dns';

// Override Node.js DNS servers to use Google DNS, bypassing local DNS
// (127.0.0.1) that blocks SRV record lookups (ECONNREFUSED on _mongodb SRV).
// This is required for mongodb+srv:// connection strings which rely on SRV.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI;
const PLACEHOLDER_PATTERNS = [
  'username:password',
  'your-mongodb-uri-here',
  'your_mongodb_connection_string_here',
  'your_mongodb_uri_here',
];

const isPlaceholderURI = (uri) => {
  if (!uri) return true;
  if (PLACEHOLDER_PATTERNS.some(pattern => uri.includes(pattern))) return true;
  // A valid MongoDB connection string must use the mongodb:// or mongodb+srv://
  // scheme. Anything else (e.g. a leftover placeholder) is treated as invalid
  // so we skip the connection instead of throwing "Invalid scheme" errors.
  return !/^mongodb(\+srv)?:\/\//.test(uri.trim());
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
    // Surface the error code/name so auth failures (code 8000) are
    // distinguishable from network/timeout issues at a glance.
    if (error.code || error.name) {
      console.error(`   ↳ ${error.name}${error.code ? ` (code ${error.code})` : ''}`);
    }
    if (error.code === 8000) {
      console.error('   ↳ Authentication failed. Check the username/password in MONGODB_URI');
      console.error('     and ensure the database user exists in MongoDB Atlas with the correct password.');
    }
    console.warn('⚠️  Server will continue running without database. Set a valid MONGODB_URI in .env to enable database features.');
  }
};

export default connectDB;
