import User from '../models/User.js';

export const syncUser = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return next();
  }

  try {
    const clerkId = req.auth.userId;
    const email = req.auth.email || `${clerkId}@clerk.placeholder`;
    const fullName = req.auth.fullName || 'User';
    const role = req.auth.orgRole === 'admin' ? 'admin' : 'user';

    // Atomic upsert: avoids the E11000 duplicate-key race condition that
    // occurs when multiple concurrent authenticated requests (common right
    // after signup) each run findOne() -> create() and all try to insert.
    // findOneAndUpdate with upsert guarantees a single document per clerkId.
    const wasNew = !(await User.exists({ clerkId }));
    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          email,
          fullName,
          role,
          ...(req.auth.orgId ? { orgId: req.auth.orgId } : {}),
        },
        $setOnInsert: { clerkId, isActive: true },
        $currentDate: { lastLogin: true },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (wasNew) {
      console.log(`✅ New user synced: ${clerkId}`);
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error('User sync error:', error);
    next();
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.dbUser) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  if (req.dbUser.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};
