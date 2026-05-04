import mongoose from 'mongoose';

const vectorSchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  pageNumber: {
    type: Number,
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  metadata: {
    documentName: String,
    sectionTitle: String,
    uploadedAt: Date,
    chunkSize: Number,
    startPosition: Number,
    endPosition: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

vectorSchema.index({ userId: 1, documentId: 1 });
vectorSchema.index({ documentId: 1, chunkIndex: 1 });
vectorSchema.index({ documentId: 1, pageNumber: 1 });

export default mongoose.model('Vector', vectorSchema);
