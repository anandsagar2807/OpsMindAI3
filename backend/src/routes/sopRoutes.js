import express from 'express';
import {
    getSuggestedQuestions,
    getAISummary,
    getSOPInsights,
    getActionItems,
    getSOPTimeline,
    getRelatedSOPs,
    getSearchAnalytics
} from '../controllers/sopController.js';

const router = express.Router();

// Analytics endpoint (no document id)
router.get('/search-analytics', getSearchAnalytics);

// Document-scoped smart-feature endpoints
router.get('/:id/suggested-questions', getSuggestedQuestions);
router.get('/:id/summary', getAISummary);
router.get('/:id/insights', getSOPInsights);
router.get('/:id/action-items', getActionItems);
router.get('/:id/timeline', getSOPTimeline);
router.get('/:id/related', getRelatedSOPs);

export default router;
