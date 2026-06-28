import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  uploadedBy: {
    type: String,
    required: true,
    index: true
  },
  orgId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'chunking', 'embedding', 'completed', 'failed'],
    default: 'uploading'
  },
  totalPages: {
    type: Number,
    default: 0
  },
  totalChunks: {
    type: Number,
    default: 0
  },
  totalEmbeddings: {
    type: Number,
    default: 0
  },
  processingProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  processingError: {
    type: String
  },
  textPreview: {
    type: String,
    maxlength: 500
  },
  // ─── SOP metadata (Chat with SOPs feature) ───
  tags: {
    type: [String],
    default: []
  },
  version: {
    type: String,
    default: '1.0'
  },
  category: {
    type: String,
    default: 'General',
    index: true
  },
  department: {
    type: String,
    default: 'General',
    index: true
  },
  author: {
    type: String,
    default: null
  },
  summary: {
    type: String,
    default: null
  },
  insights: {
    // Structured insights object produced by services/insightsService.js.
    // Schema:
    //   { summary, keyTopics, keyPoints, actionItems, importantTerms,
    //     sections, statistics, generatedBy, generatedAt }
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  insightsGeneratedAt: {
    type: Date,
    default: null
  },
  insightsVersion: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

documentSchema.index({ uploadedBy: 1, createdAt: -1 });
documentSchema.index({ status: 1 });
documentSchema.index({ orgId: 1 });
documentSchema.index({ version: 1 });
documentSchema.index({ tags: 1 });

export default mongoose.model('Document', documentSchema);
