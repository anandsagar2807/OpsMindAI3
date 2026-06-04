import Document from '../models/Document.js';
import SOPChunk from '../models/SOPChunk.js';
import UploadLog from '../models/UploadLog.js';
import upload from '../config/multer.js';
import { extractTextFromPDF, chunkText } from '../services/pdfProcessor.js';
import embeddingService from '../services/embeddingService.js';
import { getDocumentInsights as generateAIInsights } from '../services/openRouterService.js';
import fs from 'fs/promises';
import path from 'path';

export const uploadDocument = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const orgId = req.auth?.orgId || null;

  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Upload error'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    try {
      // Create document record
      const document = await Document.create({
        name: path.basename(req.file.originalname, path.extname(req.file.originalname)),
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: userId,
        orgId,
        status: 'processing',
        processingProgress: 10
      });

      // Create upload log
      const uploadLog = await UploadLog.create({
        userId,
        orgId,
        documentId: document._id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        status: 'uploaded',
        steps: [
          { step: 'upload', status: 'completed', completedAt: new Date() }
        ]
      });

      // Return initial response - processing happens in background
      res.status(201).json({
        success: true,
        data: {
          document: {
            id: document._id,
            name: document.name,
            originalName: document.originalName,
            fileSize: document.fileSize,
            status: document.status,
            processingProgress: document.processingProgress,
            createdAt: document.createdAt
          },
          uploadLogId: uploadLog._id
        }
      });

      // Process document in background
      processDocument(document._id, req.file.path, userId, orgId, uploadLog._id).catch(error => {
        console.error('Background processing error:', error);
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload document: ' + error.message
      });
    }
  });
};

async function processDocument(documentId, filePath, userId, orgId, uploadLogId) {
  const uploadLog = await UploadLog.findById(uploadLogId);

  try {
    // Step 1: Parse PDF
    uploadLog.steps.push({ step: 'parse', status: 'in_progress', startedAt: new Date() });
    await uploadLog.save();

    const parseStart = Date.now();
    const pdfData = await extractTextFromPDF(filePath);
    const parseDuration = Date.now() - parseStart;

    uploadLog.steps[uploadLog.steps.length - 1].status = 'completed';
    uploadLog.steps[uploadLog.steps.length - 1].completedAt = new Date();
    uploadLog.steps[uploadLog.steps.length - 1].durationMs = parseDuration;
    await uploadLog.save();

    // Generate insights
    let insights = null;
    try {
      insights = await generateAIInsights(pdfData.text);
    } catch (insightError) {
      console.error('Failed to generate insights:', insightError);
    }

    // Update document
    await Document.findByIdAndUpdate(documentId, {
      totalPages: pdfData.numPages,
      textPreview: pdfData.textPreview,
      insights,
      status: 'chunking',
      processingProgress: 30
    });

    // Step 2: Chunk text
    uploadLog.steps.push({ step: 'chunk', status: 'in_progress', startedAt: new Date() });
    await uploadLog.save();

    const chunkStart = Date.now();
    const chunks = chunkText(pdfData.text, pdfData.pages, 1000, 100);
    const chunkDuration = Date.now() - chunkStart;

    uploadLog.steps[uploadLog.steps.length - 1].status = 'completed';
    uploadLog.steps[uploadLog.steps.length - 1].completedAt = new Date();
    uploadLog.steps[uploadLog.steps.length - 1].durationMs = chunkDuration;
    uploadLog.steps[uploadLog.steps.length - 1].details = `${chunks.length} chunks generated`;
    await uploadLog.save();

    await Document.findByIdAndUpdate(documentId, {
      totalChunks: chunks.length,
      status: 'embedding',
      processingProgress: 50
    });

    // Step 3: Generate embeddings and store chunks
    uploadLog.steps.push({ step: 'embed', status: 'in_progress', startedAt: new Date() });
    await uploadLog.save();

    const embedStart = Date.now();
    const document = await Document.findById(documentId);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let embedding = null;

      try {
        embedding = await embeddingService.generateEmbedding(chunk.text);
      } catch (embedError) {
        console.error(`Embedding failed for chunk ${i}:`, embedError.message);
        // Continue processing even if some embeddings fail - document will still be usable
        // but with reduced search capabilities for failed chunks
      }

      await SOPChunk.create({
        documentId: documentId,
        userId,
        orgId,
        text: chunk.text,
        chunkIndex: chunk.chunkIndex,
        pageNumber: chunk.pageNumber,
        sectionTitle: chunk.sectionTitle,
        startPosition: chunk.startPosition,
        endPosition: chunk.endPosition,
        chunkSize: chunk.chunkSize,
        embedding,
        embeddingModel: embedding ? 'embedding-001' : null,
        metadata: {
          documentName: document.name,
          originalFileName: document.originalName,
          uploadedAt: document.createdAt,
          totalPages: pdfData.numPages
        }
      });

      // Update progress
      const progress = 50 + Math.floor((i / chunks.length) * 40);
      await Document.findByIdAndUpdate(documentId, {
        processingProgress: progress,
        totalEmbeddings: i + 1
      });

      // Rate limiting
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const embedDuration = Date.now() - embedStart;
    uploadLog.steps[uploadLog.steps.length - 1].status = 'completed';
    uploadLog.steps[uploadLog.steps.length - 1].completedAt = new Date();
    uploadLog.steps[uploadLog.steps.length - 1].durationMs = embedDuration;
    uploadLog.steps[uploadLog.steps.length - 1].details = `${chunks.length} embeddings generated`;
    await uploadLog.save();

    // Step 4: Mark as completed
    await Document.findByIdAndUpdate(documentId, {
      status: 'completed',
      processingProgress: 100
    });

    uploadLog.status = 'completed';
    uploadLog.totalDurationMs = Date.now() - uploadLog.createdAt.getTime();
    await uploadLog.save();

    console.log(`✅ Document processed: ${documentId} (${chunks.length} chunks, ${pdfData.numPages} pages)`);

    // Clean up uploaded file
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // File cleanup is non-critical
    }

  } catch (error) {
    console.error('Document processing error:', error);

    await Document.findByIdAndUpdate(documentId, {
      status: 'failed',
      processingError: error.message
    });

    uploadLog.status = 'failed';
    uploadLog.errorMessage = error.message;
    if (uploadLog.steps.length > 0) {
      const lastStep = uploadLog.steps[uploadLog.steps.length - 1];
      if (lastStep.status === 'in_progress') {
        lastStep.status = 'failed';
        lastStep.error = error.message;
      }
    }
    await uploadLog.save();
  }
}

export const getDocuments = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;

  try {
    const documents = await Document.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents: ' + error.message
    });
  }
};

export const getDocument = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { id } = req.params;

  try {
    const document = await Document.findOne({ _id: id, uploadedBy: userId }).lean();
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const chunks = await SOPChunk.find({ documentId: id })
      .select('-embedding')
      .sort({ chunkIndex: 1 })
      .lean();

    res.json({
      success: true,
      data: { document, chunks }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document: ' + error.message
    });
  }
};

export const deleteDocument = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { id } = req.params;

  try {
    const document = await Document.findOne({ _id: id, uploadedBy: userId });
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await SOPChunk.deleteMany({ documentId: id });
    await Document.deleteOne({ _id: id });
    await UploadLog.deleteMany({ documentId: id });

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete document: ' + error.message
    });
  }
};

export const getUploadStatus = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { id } = req.params;

  try {
    const document = await Document.findOne({ _id: id, uploadedBy: userId }).lean();
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const uploadLog = await UploadLog.findOne({ documentId: id }).lean();

    res.json({
      success: true,
      data: {
        document,
        uploadLog
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upload status: ' + error.message
    });
  }
};

export const getDocumentInsights = async (req, res) => {
  const userId = req.auth?.userId || req.dbUser?.clerkId;
  const { id } = req.params;

  try {
    const document = await Document.findOne({ _id: id, uploadedBy: userId }).lean();
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.status !== 'completed') {
      return res.json({
        success: true,
        data: {
          documentId: document._id,
          status: document.status,
          processingProgress: document.processingProgress,
          insights: null,
          message: 'Document is still processing. Insights will be available once processing completes.'
        }
      });
    }

    // If insights already exist, return them
    if (document.insights) {
      return res.json({
        success: true,
        data: {
          documentId: document._id,
          status: document.status,
          insights: document.insights,
          totalPages: document.totalPages,
          totalChunks: document.totalChunks,
          name: document.name,
          originalName: document.originalName
        }
      });
    }

    // If no insights yet (edge case: insights generation failed during processing),
    // try regenerating them now from the text preview or chunks
    const chunks = await SOPChunk.find({ documentId: id })
      .select('text')
      .sort({ chunkIndex: 1 })
      .limit(10)
      .lean();

    const textToAnalyze = chunks.map(c => c.text).join('\n\n').substring(0, 4000);

    if (!textToAnalyze) {
      return res.json({
        success: true,
        data: {
          documentId: document._id,
          status: document.status,
          insights: null,
          message: 'No text content available for analysis.'
        }
      });
    }

    let insights = null;
    try {
      insights = await generateAIInsights(textToAnalyze);
      if (insights) {
        await Document.findByIdAndUpdate(document._id, { insights });
      }
    } catch (insightError) {
      console.error('Failed to generate insights on demand:', insightError);
    }

    res.json({
      success: true,
      data: {
        documentId: document._id,
        status: document.status,
        insights,
        totalPages: document.totalPages,
        totalChunks: document.totalChunks,
        name: document.name,
        originalName: document.originalName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document insights: ' + error.message
    });
  }
};
 
 
