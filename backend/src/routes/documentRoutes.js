import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  getDocumentVectors
} from '../controllers/documentController.js';
import { protectWithClerk } from '../middleware/clerkAuth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.use(protectWithClerk);

// Allow any authenticated user to manage their documents.
// If you need role-based restrictions, enforce ownership in the controller (recommended).
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.get('/:id/vectors', getDocumentVectors);

export default router;
