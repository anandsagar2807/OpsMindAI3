import Document from '../models/Document.js';
import Vector from '../models/Vector.js';
import { extractTextFromPDF, chunkText, estimatePageNumber } from '../services/pdfProcessor.js';
import embeddingService from '../services/embeddingService.js';
import fs from 'fs/promises';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const document = await Document.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user._id,
      status: 'processing'
    });

    processDocumentAsync(document._id, req.file.path);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully and processing started',
      data: {
        documentId: document._id,
        name: document.name,
        status: document.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const processDocumentAsync = async (documentId, filePath) => {
  try {
    const document = await Document.findById(documentId);

    const { text, numPages } = await extractTextFromPDF(filePath);

    const chunks = chunkText(text, 1000, 100);

    document.totalPages = numPages;
    document.totalChunks = chunks.length;
    await document.save();

    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embedding = await embeddingService.generateEmbedding(chunk.text);

      const pageNumber = estimatePageNumber(chunk.startPosition, text);

      vectors.push({
        documentId: document._id,
        text: chunk.text,
        embedding: embedding,
        pageNumber: pageNumber,
        chunkIndex: chunk.chunkIndex,
        metadata: {
          documentName: document.name,
          uploadedAt: document.createdAt,
          chunkSize: chunk.chunkSize,
          startPosition: chunk.startPosition,
          endPosition: chunk.endPosition
        }
      });

      if (vectors.length >= 10 || i === chunks.length - 1) {
        await Vector.insertMany(vectors);
        vectors.length = 0;
      }
    }

    document.status = 'completed';
    document.updatedAt = new Date();
    await document.save();

    console.log(`✅ Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`❌ Error processing document ${documentId}:`, error);

    await Document.findByIdAndUpdate(documentId, {
      status: 'failed',
      processingError: error.message,
      updatedAt: new Date()
    });
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { uploadedBy: req.user._id };
    if (status) query.status = status;

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-filePath');

    const count = await Document.countDocuments(query);

    res.status(200).json({
      success: true,
      data: documents,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    }).select('-filePath');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const vectorCount = await Vector.countDocuments({ documentId: document._id });

    res.status(200).json({
      success: true,
      data: {
        ...document.toObject(),
        vectorCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await Vector.deleteMany({ documentId: document._id });

    try {
      await fs.unlink(document.filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentVectors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const vectors = await Vector.find({ documentId: document._id })
      .select('-embedding')
      .sort({ chunkIndex: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Vector.countDocuments({ documentId: document._id });

    res.status(200).json({
      success: true,
      data: vectors,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
