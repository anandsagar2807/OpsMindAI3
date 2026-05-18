import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protectWithClerk } from '../middleware/clerkAuth.js';

const router = express.Router();

router.use(protectWithClerk);

router.get('/stats', getDashboardStats);

export default router;