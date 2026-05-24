import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

class ChatService {
  async createConversation(userId, orgId, title = 'New Conversation') {
    const conversation = await Conversation.create({
      userId,
      orgId,
      title,
      lastMessageAt: new Date()
    });
    return conversation;
  }

  async getConversations(userId, options = {}) {
    const { page = 1, limit = 20, search = '', isArchived = false } = options;

    const query = { userId, isArchived };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Conversation.countDocuments(query);

    return {
      conversations,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getConversation(conversationId, userId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    }).lean();

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return {
      ...conversation,
      messages
    };
  }

  async addMessage(conversationId, userId, role, content, citations = [], retrievalMetadata = {}) {
    const message = await Message.create({
      conversationId,
      userId,
      role,
      content,
      citations,
      retrievalMetadata
    });

    // Update conversation metadata
    await Conversation.findByIdAndUpdate(conversationId, {
      $inc: { messageCount: 1 },
      lastMessageAt: new Date(),
      updatedAt: new Date()
    });

    return message;
  }

  async updateConversationTitle(conversationId, userId, title) {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, userId },
      { title, updatedAt: new Date() },
      { new: true }
    );
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation;
  }

  async deleteConversation(conversationId, userId) {
    await Message.deleteMany({ conversationId });
    const result = await Conversation.deleteOne({
      _id: conversationId,
      userId
    });
    if (result.deletedCount === 0) {
      throw new Error('Conversation not found');
    }
    return { success: true };
  }

  async archiveConversation(conversationId, userId) {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, userId },
      { isArchived: true, updatedAt: new Date() },
      { new: true }
    );
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation;
  }
}

export default new ChatService();
