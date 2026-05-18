import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  getSystemAnalytics,
  getUserActivity,
  deleteUser
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/rbac.js';
import { protectWithClerk } from '../middleware/clerkAuth.js';

const router = express.Router();

// All routes require Clerk auth + admin access
router.use(protectWithClerk);
router.use(requireAdmin);

// User management
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/status', toggleUserStatus);
router.delete('/users/:userId', deleteUser);

// Analytics
router.get('/analytics', getSystemAnalytics);
router.get('/users/:userId/activity', getUserActivity);

export default router;
