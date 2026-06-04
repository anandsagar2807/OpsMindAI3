import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    citations: [{
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document'
        },
        documentName: String,
        pageNumber: Number,
        sectionTitle: String,
        chunkIndex: Number,
        similarityScore: Number,
        snippet: String,
        startPosition: Number,
        endPosition: Number
    }],
    retrievalMetadata: {
        totalChunksRetrieved: Number,
        queryTokens: Number,
        contextTokens: Number,
        responseTokens: Number,
        retrievalTimeMs: Number,
        generationTimeMs: Number,
        embeddingModel: String,
        llmModel: String
    },
    isStreaming: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

messageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema);