import express from 'express';
import { getDashboardStats, getRecentActivity, getDocumentsOverview } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/documents-overview', getDocumentsOverview);

export default router;