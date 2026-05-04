import Chat from '../models/ChatEnhanced.js';

// Rename chat
export const renameChat = async (req, res) => {
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

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    await chat.rename(title.trim());

    res.status(200).json({
      success: true,
      message: 'Chat renamed successfully',
      data: chat
    });

  } catch (error) {
    console.error('Rename chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to rename chat'
    });
  }
};

// Archive chat
export const archiveChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    await chat.archive();

    res.status(200).json({
      success: true,
      message: 'Chat archived successfully'
    });

  } catch (error) {
    console.error('Archive chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to archive chat'
    });
  }
};

// Unarchive chat
export const unarchiveChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    await chat.unarchive();

    res.status(200).json({
      success: true,
      message: 'Chat unarchived successfully'
    });

  } catch (error) {
    console.error('Unarchive chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to unarchive chat'
    });
  }
};

// Pin chat
export const pinChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    await chat.pin();

    res.status(200).json({
      success: true,
      message: 'Chat pinned successfully'
    });

  } catch (error) {
    console.error('Pin chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to pin chat'
    });
  }
};

// Unpin chat
export const unpinChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    await chat.unpin();

    res.status(200).json({
      success: true,
      message: 'Chat unpinned successfully'
    });

  } catch (error) {
    console.error('Unpin chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to unpin chat'
    });
  }
};

// Search chats
export const searchChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, limit = 20, skip = 0, includeArchived = false } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const chats = await Chat.searchChats(userId, q, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      includeArchived: includeArchived === 'true'
    });

    res.status(200).json({
      success: true,
      data: chats,
      count: chats.length
    });

  } catch (error) {
    console.error('Search chats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search chats'
    });
  }
};

// Get user stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Chat.getUserStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user stats'
    });
  }
};

// Add tag to chat
export const addTag = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { tag } = req.body;
    const userId = req.user.id;

    if (!tag || tag.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tag is required'
      });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    await chat.addTag(tag.trim());

    res.status(200).json({
      success: true,
      message: 'Tag added successfully',
      data: chat
    });

  } catch (error) {
    console.error('Add tag error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add tag'
    });
  }
};

// Remove tag from chat
export const removeTag = async (req, res) => {
  try {
    const { chatId, tag } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    await chat.removeTag(tag);

    res.status(200).json({
      success: true,
      message: 'Tag removed successfully',
      data: chat
    });

  } catch (error) {
    console.error('Remove tag error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove tag'
    });
  }
};
