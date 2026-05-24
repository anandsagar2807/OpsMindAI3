import mongoose from 'mongoose';

const uploadLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    orgId: {
        type: String,
        default: null
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['uploaded', 'parsed', 'chunked', 'embedded', 'completed', 'failed'],
        default: 'uploaded'
    },
    steps: [{
        step: String,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'failed']
        },
        startedAt: Date,
        completedAt: Date,
        durationMs: Number,
        details: String,
        error: String
    }],
    totalDurationMs: {
        type: Number,
        default: null
    },
    errorMessage: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

uploadLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('UploadLog', uploadLogSchema);