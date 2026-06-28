import mongoose from 'mongoose';

/**
 * Tracks semantic search queries performed by users against their SOPs.
 * Powers the "Questions asked" dashboard widget and search analytics.
 */
const searchHistorySchema = new mongoose.Schema({
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
    query: {
        type: String,
        required: true
    },
    // Number of chunks retrieved for this query
    resultsCount: {
        type: Number,
        default: 0
    },
    // Average similarity score of retrieved chunks (0-1)
    avgConfidence: {
        type: Number,
        default: 0
    },
    // Document ids that were referenced in the results
    documentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    // Retrieval latency in milliseconds
    retrievalTimeMs: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

searchHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('SearchHistory', searchHistorySchema);
