import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sources: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    filename: String,
    pageNumber: Number,
    similarity: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [messageSchema],
  isArchived: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });
chatSchema.index({ userId: 1, isArchived: 1, updatedAt: -1 });
chatSchema.index({ userId: 1, tags: 1 });

// Text search index for chat titles
chatSchema.index({ title: 'text', 'messages.content': 'text' });

// Pre-save middleware
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  // Auto-generate title from first user message
  if (this.messages.length > 0 && this.title === 'New Chat') {
    const firstMessage = this.messages.find(m => m.role === 'user');
    if (firstMessage) {
      this.title = firstMessage.content.substring(0, 60) + (firstMessage.content.length > 60 ? '...' : '');
    }
  }

  next();
});

// Instance methods
chatSchema.methods.rename = function(newTitle) {
  this.title = newTitle;
  return this.save();
};

chatSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

chatSchema.methods.unarchive = function() {
  this.isArchived = false;
  return this.save();
};

chatSchema.methods.pin = function() {
  this.isPinned = true;
  return this.save();
};

chatSchema.methods.unpin = function() {
  this.isPinned = false;
  return this.save();
};

chatSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return this;
};

chatSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

// Static methods
chatSchema.statics.searchChats = async function(userId, query, options = {}) {
  const {
    limit = 20,
    skip = 0,
    includeArchived = false
  } = options;

  const filter = {
    userId,
    $text: { $search: query }
  };

  if (!includeArchived) {
    filter.isArchived = false;
  }

  return this.find(filter)
    .sort({ score: { $meta: 'textScore' }, updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('_id title messages createdAt updatedAt isPinned tags');
};

chatSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalChats: { $sum: 1 },
        archivedChats: {
          $sum: { $cond: ['$isArchived', 1, 0] }
        },
        pinnedChats: {
          $sum: { $cond: ['$isPinned', 1, 0] }
        },
        totalMessages: {
          $sum: { $size: '$messages' }
        }
      }
    }
  ]);

  return stats[0] || {
    totalChats: 0,
    archivedChats: 0,
    pinnedChats: 0,
    totalMessages: 0
  };
};

export default mongoose.model('Chat', chatSchema);
