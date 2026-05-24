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

export default mongoose.model('Document', documentSchema);
