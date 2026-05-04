import User from '../models/User.js';
import Chat from '../models/ChatEnhanced.js';
import Document from '../models/Document.js';
import Vector from '../models/Vector.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users'
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user'
    });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'employee'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin or employee'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    user.permissions = User.getDefaultPermissions(role);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user role'
    });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle user status'
    });
  }
};

// Get system analytics
export const getSystemAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      totalChats,
      totalDocuments,
      totalVectors
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'admin', isActive: true }),
      Chat.countDocuments(),
      Document.countDocuments(),
      Vector.countDocuments()
    ]);

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ lastLogin: -1 })
      .limit(10)
      .select('fullName email lastLogin role');

    const recentChats = await Chat.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('userId title updatedAt');

    const recentDocuments = await Document.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('filename uploadedBy status createdAt');

    // Calculate storage usage
    const storageStats = await Document.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$size' },
          avgSize: { $avg: '$size' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers,
          employees: totalUsers - adminUsers
        },
        content: {
          chats: totalChats,
          documents: totalDocuments,
          vectors: totalVectors
        },
        storage: storageStats[0] || { totalSize: 0, avgSize: 0 },
        recentActivity: {
          users: recentUsers,
          chats: recentChats,
          documents: recentDocuments
        }
      }
    });

  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics'
    });
  }
};

// Get user activity
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const [chats, documents, vectors] = await Promise.all([
      Chat.find({ userId: user.clerkId }).countDocuments(),
      Document.find({ uploadedBy: user.clerkId }).countDocuments(),
      Vector.find({ userId: user.clerkId }).countDocuments()
    ]);

    const recentChats = await Chat.find({ userId: user.clerkId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt');

    const recentDocuments = await Document.find({ uploadedBy: user.clerkId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('filename status createdAt');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        },
        stats: {
          chats,
          documents,
          vectors
        },
        recentActivity: {
          chats: recentChats,
          documents: recentDocuments
        }
      }
    });

  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user activity'
    });
  }
};

// Delete user (soft delete - deactivate)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - just deactivate
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
};
