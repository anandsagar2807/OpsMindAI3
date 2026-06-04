import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    orgId: {
        type: String,
        default: null,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'New Conversation'
    },
    summary: {
        type: String,
        default: null
    },
    messageCount: {
        type: Number,
        default: 0
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, isArchived: 1 });

export default mongoose.model('Conversation', conversationSchema);