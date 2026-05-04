import { clerkMiddleware } from '@clerk/express';

export const clerkAuth = clerkMiddleware();

export const protectWithClerk = (req, res, next) => {
  // Temporary bypass for testing - REMOVE IN PRODUCTION
  if (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY === 'your-clerk-secret-key-here') {
    console.warn('⚠️  WARNING: Using temporary auth bypass. Add CLERK_SECRET_KEY to .env for production!');
    req.user = {
      id: 'temp-user-id',
      clerkId: 'temp-user-id'
    };
    return next();
  }

  // Normal Clerk authentication
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  req.user = {
    id: req.auth.userId,
    clerkId: req.auth.userId
  };

  next();
};
