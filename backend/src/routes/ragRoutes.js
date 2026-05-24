import express from 'express';
import {
    askQuestion,
    streamQuestion,
    searchDocuments
} from '../controllers/ragController.js';

const router = express.Router();

router.post('/ask', askQuestion);
router.post('/stream', streamQuestion);
router.get('/search', searchDocuments);

export default router;