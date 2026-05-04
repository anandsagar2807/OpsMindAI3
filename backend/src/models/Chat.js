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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

chatSchema.index({ userId: 1, createdAt: -1 });

chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.messages.length > 0 && this.title === 'New Chat') {
    const firstMessage = this.messages.find(m => m.role === 'user');
    if (firstMessage) {
      this.title = firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
    }
  }
  next();
});

export default mongoose.model('Chat', chatSchema);
