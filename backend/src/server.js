import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import { clerkAuthMiddleware } from './middleware/clerkAuth.js';
import { syncUser } from './middleware/rbac.js';
import { errorHandler } from './middleware/errorHandler.js';
import documentRoutes from './routes/documentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

connectDB();

// CORS must come BEFORE helmet so that CORS headers are set correctly
// on preflight (OPTIONS) responses.  Helmet's crossOriginResourcePolicy
// middleware would otherwise block cross-origin requests.
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  maxAge: 86400, // 24 hours — cache preflight
}));

// Helmet for security headers, but disable policies that conflict with CORS
app.use(helmet({
  crossOriginResourcePolicy: false,   // would block cross-origin uploads
  crossOriginEmbedderPolicy: false,    // would block cross-origin framing
  contentSecurityPolicy: false,        // too restrictive for API server
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500,
  message: { success: false, message: 'Too many requests from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for upload endpoints — they're long-running and expensive
    // Also skip health checks and OPTIONS (preflight) requests
    return req.path?.includes('/upload') || req.path?.includes('/health') || req.method === 'OPTIONS';
  },
});
// Rate-limit general API routes (uploads are skipped via skip function)
app.use('/api/', limiter);

// Increase JSON body limit for general API, but multipart uploads
// are handled by multer separately (50MB limit in multer config)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/public', publicRoutes);

app.use('/api/documents', clerkAuthMiddleware, syncUser, documentRoutes);
app.use('/api/chat', clerkAuthMiddleware, syncUser, chatRoutes);
app.use('/api/rag', clerkAuthMiddleware, syncUser, ragRoutes);
app.use('/api/dashboard', clerkAuthMiddleware, syncUser, dashboardRoutes);

function getDbStatus() {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}

app.get('/health', (_req, res) => {
  const db = getDbStatus();
  res.status(db.readyState === 1 ? 200 : 503).json({
    success: true,
    message: 'OpsMind AI Backend is running',
    timestamp: new Date().toISOString(),
    database: db,
  });
});

app.get('/api/health', (_req, res) => {
  const db = getDbStatus();
  res.status(db.readyState === 1 ? 200 : 503).json({
    success: true,
    message: 'OpsMind AI Backend is running',
    timestamp: new Date().toISOString(),
    database: db,
  });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 OpsMind AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process or change PORT in .env.`);
    console.error(`   Tip: Run "netstat -ano | findstr :${PORT}" to find the process, then "taskkill /PID <pid> /F" to stop it.`);
  } else {
    console.error('❌ Server error:', error.message);
  }
  process.exit(1);
});

export default app;
