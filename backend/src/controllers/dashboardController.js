import Conversation from '../models/Conversation.js';
import Document from '../models/Document.js';
import Message from '../models/Message.js';
import UploadLog from '../models/UploadLog.js';
import User from '../models/User.js';

/**
 * Get dashboard overview stats for the authenticated user
 */
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.userId || 'dev-user-001';

        // Conversation stats
        const totalConversations = await Conversation.countDocuments({ userId, isArchived: false });
        const activeConversations = await Conversation.countDocuments({
            userId,
            isArchived: false,
            lastMessageAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        // Document stats
        const totalDocuments = await Document.countDocuments({ uploadedBy: userId });
        const completedDocuments = await Document.countDocuments({ uploadedBy: userId, status: 'completed' });
        const processingDocuments = await Document.countDocuments({
            uploadedBy: userId,
            status: { $in: ['uploading', 'processing', 'chunking', 'embedding'] }
        });
        const failedDocuments = await Document.countDocuments({ uploadedBy: userId, status: 'failed' });

        // Message stats
        const totalMessages = await Message.countDocuments({ userId });
        const userMessages = await Message.countDocuments({ userId, role: 'user' });
        const assistantMessages = await Message.countDocuments({ userId, role: 'assistant' });

        // Recent activity counts (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentConversations = await Conversation.countDocuments({
            userId,
            createdAt: { $gte: thirtyDaysAgo }
        });
        const recentMessages = await Message.countDocuments({
            userId,
            createdAt: { $gte: thirtyDaysAgo }
        });
        const recentDocuments = await Document.countDocuments({
            uploadedBy: userId,
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Total chunks and embeddings
        const docAggregation = await Document.aggregate([
            { $match: { uploadedBy: userId } },
            {
                $group: {
                    _id: null,
                    totalChunks: { $sum: '$totalChunks' },
                    totalEmbeddings: { $sum: '$totalEmbeddings' },
                    totalPages: { $sum: '$totalPages' },
                    totalSize: { $sum: '$fileSize' }
                }
            }
        ]);
        const docStats = docAggregation[0] || { totalChunks: 0, totalEmbeddings: 0, totalPages: 0, totalSize: 0 };

        res.json({
            success: true,
            data: {
                conversations: {
                    total: totalConversations,
                    active: activeConversations,
                    recent: recentConversations
                },
                documents: {
                    total: totalDocuments,
                    completed: completedDocuments,
                    processing: processingDocuments,
                    failed: failedDocuments,
                    recent: recentDocuments,
                    totalChunks: docStats.totalChunks,
                    totalEmbeddings: docStats.totalEmbeddings,
                    totalPages: docStats.totalPages,
                    totalSize: docStats.totalSize
                },
                messages: {
                    total: totalMessages,
                    user: userMessages,
                    assistant: assistantMessages,
                    recent: recentMessages
                }
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

/**
 * Get recent activity for the dashboard
 */
export const getRecentActivity = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.userId || 'dev-user-001';
        const limit = parseInt(req.query.limit) || 10;

        // Recent conversations with last message info
        const recentConversations = await Conversation.find({ userId, isArchived: false })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean();

        // Recent documents
        const recentDocuments = await Document.find({ uploadedBy: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Recent upload logs
        const recentUploads = await UploadLog.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Build activity timeline
        const activities = [];

        recentConversations.forEach(conv => {
            activities.push({
                type: 'conversation',
                id: conv._id,
                title: conv.title,
                messageCount: conv.messageCount,
                timestamp: conv.updatedAt || conv.createdAt,
                status: 'active'
            });
        });

        recentDocuments.forEach(doc => {
            activities.push({
                type: 'document',
                id: doc._id,
                title: doc.originalName,
                status: doc.status,
                size: doc.fileSize,
                chunks: doc.totalChunks,
                timestamp: doc.createdAt
            });
        });

        // Sort by timestamp descending
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({
            success: true,
            data: {
                conversations: recentConversations,
                documents: recentDocuments,
                uploads: recentUploads,
                timeline: activities.slice(0, limit)
            }
        });
    } catch (error) {
        console.error('Recent activity error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch recent activity' });
    }
};

/**
 * Get documents overview with status breakdown
 */
export const getDocumentsOverview = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.userId || 'dev-user-001';

        const statusBreakdown = await Document.aggregate([
            { $match: { uploadedBy: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalSize: { $sum: '$fileSize' },
                    totalChunks: { $sum: '$totalChunks' },
                    totalPages: { $sum: '$totalPages' }
                }
            }
        ]);

        const documents = await Document.find({ uploadedBy: userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('originalName status fileSize totalChunks totalPages createdAt')
            .lean();

        // Format status breakdown
        const statusMap = {};
        statusBreakdown.forEach(item => {
            statusMap[item._id] = {
                count: item.count,
                totalSize: item.totalSize,
                totalChunks: item.totalChunks,
                totalPages: item.totalPages
            };
        });

        res.json({
            success: true,
            data: {
                statusBreakdown: statusMap,
                documents
            }
        });
    } catch (error) {
        console.error('Documents overview error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch documents overview' });
    }
};