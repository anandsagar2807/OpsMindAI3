import chatService from '../services/chatService.js';

export const createConversation = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const orgId = req.auth?.orgId || null;
  const { title } = req.body;

  try {
    const conversation = await chatService.createConversation(userId, orgId, title || 'New Conversation');
    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create conversation: ' + error.message
    });
  }
};

export const getConversations = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { page, limit, search } = req.query;

  try {
    const result = await chatService.getConversations(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || ''
    });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations: ' + error.message
    });
  }
};

export const getConversation = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { id } = req.params;

  try {
    const conversation = await chatService.getConversation(id, userId);
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    const status = error.message === 'Conversation not found' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

export const updateConversationTitle = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  try {
    const conversation = await chatService.updateConversationTitle(id, userId, title);
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    const status = error.message === 'Conversation not found' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteConversation = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { id } = req.params;

  try {
    await chatService.deleteConversation(id, userId);
    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    const status = error.message === 'Conversation not found' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};
