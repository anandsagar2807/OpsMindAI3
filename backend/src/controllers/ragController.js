import ragService from '../services/ragService.js';
import chatService from '../services/chatService.js';

export const askQuestion = async (req, res) => {
    const userId = req.auth?.userId || req.dbUser?.clerkId;
    const { query, conversationId } = req.body;

    if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required' });
    }

    try {
        const result = await ragService.generateResponse(query, userId);

        // Save messages to conversation if conversationId provided
        if (conversationId) {
            await chatService.addMessage(conversationId, userId, 'user', query);
            await chatService.addMessage(
                conversationId, userId, 'assistant', result.answer,
                result.citations, result.retrievalMetadata
            );
        }

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate response: ' + error.message
        });
    }
};

export const streamQuestion = async (req, res) => {
    const userId = req.auth?.userId || req.dbUser?.clerkId;
    const { query, conversationId } = req.body;

    if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required' });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    try {
        // Save user message
        if (conversationId) {
            await chatService.addMessage(conversationId, userId, 'user', query);
        }

        let fullAnswer = '';
        let metadata = null;

        const stream = ragService.streamResponse(query, userId);

        for await (const event of stream) {
            if (event.type === 'metadata') {
                metadata = event.data;
                res.write(`data: ${JSON.stringify({ type: 'metadata', data: event.data })}\n\n`);
            } else if (event.type === 'content') {
                fullAnswer += event.data;
                res.write(`data: ${JSON.stringify({ type: 'content', data: event.data })}\n\n`);
            } else if (event.type === 'generation_complete') {
                res.write(`data: ${JSON.stringify({ type: 'generation_complete', data: event.data })}\n\n`);
            } else if (event.type === 'done') {
                // Save assistant message
                if (conversationId && fullAnswer) {
                    await chatService.addMessage(
                        conversationId, userId, 'assistant', fullAnswer,
                        metadata?.citations || [],
                        { ...metadata, ...event.data }
                    );
                }
                res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
            }
        }

        res.end();
    } catch (error) {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', data: error.message })}\n\n`);
        res.end();
    }
};

export const searchDocuments = async (req, res) => {
    const userId = req.auth?.userId || req.dbUser?.clerkId;
    const { query, topK } = req.query;

    if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required' });
    }

    try {
        const result = await ragService.search(query, userId, { topK: parseInt(topK) || 5 });
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to search documents: ' + error.message
        });
    }
};