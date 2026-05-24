import User from '../models/User.js';

export const syncUser = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return next();
  }

  try {
    const clerkId = req.auth.userId;
    let user = await User.findOne({ clerkId });

    if (!user) {
      const email = req.auth.email || `${clerkId}@clerk.placeholder`;
      const fullName = req.auth.fullName || 'User';
      const role = req.auth.orgRole === 'admin' ? 'admin' : 'user';

      user = await User.create({
        clerkId,
        email,
        fullName,
        role,
        orgId: req.auth.orgId || null,
      });
      console.log(`✅ New user synced: ${clerkId}`);
    } else {
      user.lastLogin = new Date();
      if (req.auth.orgId) user.orgId = req.auth.orgId;
      if (req.auth.orgRole) user.role = req.auth.orgRole === 'admin' ? 'admin' : user.role;
      await user.save();
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
