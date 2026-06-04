import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

    res.json({
        success: true,
        message: 'OpsMind AI Backend is running',
        timestamp: new Date().toISOString(),
        database: {
            state: states[dbState] || 'unknown',
            readyState: dbState,
            host: mongoose.connection.host || null,
            name: mongoose.connection.name || null
        }
    });
});

router.get('/stats', async (_req, res) => {
    try {
        const User = mongoose.model('User');
        const Document = mongoose.model('Document');
        const SOPChunk = mongoose.model('SOPChunk');

        const userCount = await User.countDocuments();
        const documentCount = await Document.countDocuments();
        const chunkCount = await SOPChunk.countDocuments();

        res.json({
            success: true,
            data: {
                users: userCount,
                documents: documentCount,
                chunks: chunkCount
            }
        });
    } catch (error) {
        res.json({
            success: true,
            data: {
                users: 0,
                documents: 0,
                chunks: 0
            }
        });
    }
});

export default router;