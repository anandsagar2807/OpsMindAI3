import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  getUploadStatus
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/upload', uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.get('/:id/status', getUploadStatus);
router.delete('/:id', deleteDocument);

export default router;
