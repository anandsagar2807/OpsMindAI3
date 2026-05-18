import groqChatService from '../services/groqChatService.js';

export const ask = async (req, res) => {
  try {
    const { question, chatId } = req.body;
    const userId = req.user.id;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const result = await groqChatService.ask(question, userId, chatId);

    res.status(200).json({
      success: true,
      data: {
        response: result.response,
        sources: result.sources,
        chatId: result.chatId
      }
    });

  } catch (error) {
    console.error('Ask controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process question'
    });
  }
};

export const askStream = async (req, res) => {
  try {
    const { question, chatId } = req.body;
    const userId = req.user.id;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const onChunk = (content) => {
      res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
    };

    const result = await groqChatService.askStream(question, userId, onChunk, chatId);

    res.write(`data: ${JSON.stringify({
      type: 'sources',
      sources: result.sources,
      chatId: result.chatId
    })}\n\n`);

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Ask stream controller error:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: error.message || 'Failed to process question'
    })}\n\n`);
    res.end();
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;

    const chats = await groqChatService.getChatHistory(userId, limit);

    res.status(200).json({
      success: true,
      data: chats
    });

  } catch (error) {
    console.error('Get chat history controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve chat history'
    });
  }
};

export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await groqChatService.getChat(chatId, userId);

    res.status(200).json({
      success: true,
      data: chat
    });

  } catch (error) {
    console.error('Get chat controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve chat'
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    await groqChatService.deleteChat(chatId, userId);

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });

  } catch (error) {
    console.error('Delete chat controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete chat'
    });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const chat = await groqChatService.updateChat(chatId, userId, { title });

    res.status(200).json({
      success: true,
      data: chat
    });

  } catch (error) {
    console.error('Update chat controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update chat'
    });
  }
};
