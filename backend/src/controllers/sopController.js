import smartFeaturesService from '../services/smartFeaturesService.js';

const getUserId = (req) => req.auth?.userId || req.dbUser?.clerkId;
const getOrgId = (req) => req.auth?.orgId || null;

/**
 * GET /api/sop/:id/suggested-questions
 * Generate suggested questions for a document.
 */
export const getSuggestedQuestions = async (req, res) => {
    try {
        const userId = getUserId(req);
        const questions = await smartFeaturesService.getSuggestedQuestions(req.params.id, userId);
        res.json({ success: true, data: questions });
    } catch (error) {
        const status = error.message === 'Document not found' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/sop/:id/summary
 * Generate a structured AI summary of a document.
 */
export const getAISummary = async (req, res) => {
    try {
        const userId = getUserId(req);
        const summary = await smartFeaturesService.getAISummary(req.params.id, userId);
        res.json({ success: true, data: summary });
    } catch (error) {
        const status = error.message === 'Document not found' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/sop/:id/insights
 * Detect SOP compliance insights for a document.
 */
export const getSOPInsights = async (req, res) => {
    try {
        const userId = getUserId(req);
        const insights = await smartFeaturesService.getSOPInsights(req.params.id, userId);
        res.json({ success: true, data: insights });
    } catch (error) {
        const status = error.message === 'Document not found' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/sop/:id/action-items
 * Extract actionable tasks from a document.
 */
export const getActionItems = async (req, res) => {
    try {
        const userId = getUserId(req);
        const items = await smartFeaturesService.getActionItems(req.params.id, userId);
        res.json({ success: true, data: items });
    } catch (error) {
        const status = error.message === 'Document not found' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/sop/:id/timeline
 * Build a sequential SOP timeline from a document.
 */
export const getSOPTimeline = async (req, res) => {
    try {
        const userId = getUserId(req);
        const timeline = await smartFeaturesService.getSOPTimeline(req.params.id, userId);
        res.json({ success: true, data: timeline });
    } catch (error) {
        const status = error.message === 'Document not found' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/sop/:id/related
 * Suggest related SOPs for a document.
 */
export const getRelatedSOPs = async (req, res) => {
    try {
        const userId = getUserId(req);
        const related = await smartFeaturesService.getRelatedSOPs(req.params.id, userId);
        res.json({ success: true, data: related });
    } catch (error) {
        const status = error.message === 'Document not found' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/sop/search-analytics
 * Get search analytics for dashboard widgets.
 */
export const getSearchAnalytics = async (req, res) => {
    try {
        const userId = getUserId(req);
        const analytics = await smartFeaturesService.getSearchAnalytics(userId);
        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch search analytics: ' + error.message });
    }
};
