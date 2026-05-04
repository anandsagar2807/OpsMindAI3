import { generateChatResponse, generateStreamingResponse } from '../services/chatService.js';
import vectorSearchService from '../services/vectorSearchService.js';

export const search = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const searchResult = await vectorSearchService.search(query, userId, {
      topK: 5,
      minSimilarity: 0.3,
      includeContext: true
    });

    res.status(200).json({
      success: searchResult.success,
      message: searchResult.message,
      data: {
        results: searchResult.results,
        context: searchResult.context,
        metadata: searchResult.metadata
      }
    });

  } catch (error) {
    console.error('Search controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process search request'
    });
  }
};

export const chat = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const result = await generateChatResponse(query, userId);

    res.status(200).json({
      success: true,
      data: {
        response: result.response,
        sources: result.sources
      }
    });

  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat request'
    });
  }
};

export const chatStream = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const onChunk = (content) => {
      res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
    };

    const result = await generateStreamingResponse(query, userId, onChunk);

    res.write(`data: ${JSON.stringify({ type: 'sources', sources: result.sources })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat stream controller error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
};
