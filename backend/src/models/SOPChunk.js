import mongoose from 'mongoose';

const sopChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true
  },
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
  text: {
    type: String,
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  pageNumber: {
    type: Number,
    required: true
  },
  sectionTitle: {
    type: String,
    default: null
  },
  startPosition: {
    type: Number,
    default: 0
  },
  endPosition: {
    type: Number,
    default: 0
  },
  chunkSize: {
    type: Number,
    default: 0
  },
  embedding: {
    type: [Number],
    default: null
  },
  embeddingModel: {
    type: String,
    default: null
  },
  metadata: {
    documentName: String,
    originalFileName: String,
    uploadedAt: Date,
    totalPages: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

sopChunkSchema.index({ userId: 1, documentId: 1 });
sopChunkSchema.index({ documentId: 1, chunkIndex: 1 });
sopChunkSchema.index({ documentId: 1, pageNumber: 1 });

export default mongoose.model('SOPChunk', sopChunkSchema);