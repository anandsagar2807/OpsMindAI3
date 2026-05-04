import User from '../models/User.js';

// Middleware to check if user has specific permission
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Find user in database
      const user = await User.findByClerkId(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'User account is inactive'
        });
      }

      // Check permission
      if (!user.hasPermission(permission)) {
        return res.status(403).json({
          success: false,
          message: `Permission denied: ${permission} required`
        });
      }

      // Attach user to request
      req.dbUser = user;
      next();

    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check permissions'
      });
    }
  };
};

// Middleware to check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByClerkId(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    req.dbUser = user;
    next();

  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check admin status'
    });
  }
};

// Middleware to sync Clerk user with database
export const syncUser = async (req, res, next) => {
  try {
    const clerkUser = req.user;

    if (!clerkUser) {
      return next();
    }

    // Find or create user in database
    let user = await User.findByClerkId(clerkUser.id);

    if (!user) {
      // Create new user
      const role = clerkUser.publicMetadata?.role || 'employee';
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        fullName: clerkUser.fullName || clerkUser.firstName + ' ' + clerkUser.lastName,
        role: role,
        permissions: User.getDefaultPermissions(role)
      });
    }

    // Update last login
    await user.updateLastLogin();

    req.dbUser = user;
    next();

  } catch (error) {
    console.error('User sync error:', error);
    next(); // Continue even if sync fails
  }
};
