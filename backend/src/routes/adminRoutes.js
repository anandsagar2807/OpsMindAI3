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

const router = express.Router();

// All routes require admin access
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
