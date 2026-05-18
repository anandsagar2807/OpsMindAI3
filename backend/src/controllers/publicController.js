import Document from '../models/Document.js';
import User from '../models/User.js';
import ChatEnhanced from '../models/ChatEnhanced.js';

export const getPublicStats = async (req, res, next) => {
    try {
        const totalDocuments = await Document.countDocuments({ status: 'completed' });
        const totalUsers = await User.countDocuments();
        const totalChats = await ChatEnhanced.countDocuments();

        // Count total queries across all chats
        const queryAgg = await ChatEnhanced.aggregate([
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: false } },
            { $match: { 'messages.role': 'user' } },
            { $count: 'totalQueries' }
        ]);
        const totalQueries = queryAgg.length > 0 ? queryAgg[0].totalQueries : 0;

        res.status(200).json({
            success: true,
            data: {
                totalDocuments,
                totalUsers,
                totalChats,
                totalQueries,
                uptime: '99.9%',
                avgResponseTime: '< 3s'
            }
        });
    } catch (error) {
        next(error);
    }
};