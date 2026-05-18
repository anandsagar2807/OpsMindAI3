import Document from '../models/Document.js';
import ChatEnhanced from '../models/ChatEnhanced.js';
import Vector from '../models/Vector.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        // Document.uploadedBy uses MongoDB ObjectId → use req.dbUser._id
        const dbUserId = req.dbUser._id;
        // ChatEnhanced.userId and Vector.userId use Clerk ID string → use req.user.id
        const clerkUserId = req.user.id;

        // Document stats (uses ObjectId)
        const totalDocuments = await Document.countDocuments({ uploadedBy: dbUserId });
        const completedDocuments = await Document.countDocuments({ uploadedBy: dbUserId, status: 'completed' });
        const processingDocuments = await Document.countDocuments({ uploadedBy: dbUserId, status: 'processing' });
        const failedDocuments = await Document.countDocuments({ uploadedBy: dbUserId, status: 'failed' });

        // Storage used (sum of all file sizes)
        const storageAgg = await Document.aggregate([
            { $match: { uploadedBy: dbUserId } },
            { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
        ]);
        const storageUsedBytes = storageAgg.length > 0 ? storageAgg[0].totalSize : 0;
        const storageUsedGB = (storageUsedBytes / (1024 * 1024 * 1024)).toFixed(2);
        const storageUsedMB = (storageUsedBytes / (1024 * 1024)).toFixed(1);

        // Chat stats (uses Clerk ID string)
        const totalChats = await ChatEnhanced.countDocuments({ userId: clerkUserId });
        const chatAgg = await ChatEnhanced.aggregate([
            { $match: { userId: clerkUserId } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: false } },
            { $match: { 'messages.role': 'user' } },
            { $count: 'totalQueries' }
        ]);
        const totalQueries = chatAgg.length > 0 ? chatAgg[0].totalQueries : 0;

        // Recent documents (uses ObjectId)
        const recentDocuments = await Document.find({ uploadedBy: dbUserId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name originalName status fileSize createdAt');

        // Recent chats (uses Clerk ID string)
        const recentChats = await ChatEnhanced.find({ userId: clerkUserId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('title updatedAt messages');

        // Vector/chunk stats (uses Clerk ID string)
        const totalVectors = await Vector.countDocuments({ userId: clerkUserId });

        // Activity feed (combined recent docs + chats)
        const recentDocs = recentDocuments.map(doc => ({
            type: 'upload',
            title: doc.originalName || doc.name,
            description: doc.status === 'completed' ? 'Document processed successfully' : `Document ${doc.status}`,
            time: doc.createdAt,
            status: doc.status,
            icon: 'upload'
        }));

        const recentChatItems = recentChats.map(chat => ({
            type: 'chat',
            title: chat.title,
            description: `${chat.messages?.length || 0} messages`,
            time: chat.updatedAt,
            status: 'active',
            icon: 'chat'
        }));

        // Merge and sort by time
        const activityFeed = [...recentDocs, ...recentChatItems]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 8);

        res.status(200).json({
            success: true,
            data: {
                documents: {
                    total: totalDocuments,
                    completed: completedDocuments,
                    processing: processingDocuments,
                    failed: failedDocuments
                },
                chats: {
                    total: totalChats,
                    totalQueries: totalQueries
                },
                storage: {
                    usedBytes: storageUsedBytes,
                    usedGB: parseFloat(storageUsedGB),
                    usedMB: parseFloat(storageUsedMB),
                    limitGB: 10
                },
                vectors: {
                    total: totalVectors
                },
                recentDocuments: recentDocuments,
                recentChats: recentChats,
                activityFeed: activityFeed
            }
        });
    } catch (error) {
        next(error);
    }
};