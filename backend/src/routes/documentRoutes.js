import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  getDocumentVectors
} from '../controllers/documentController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.get('/:id/vectors', getDocumentVectors);

export default router;
