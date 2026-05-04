import express from 'express';
import { chat, chatStream, search } from '../controllers/chatController.js';
import { protectWithClerk } from '../middleware/clerkAuth.js';

const router = express.Router();

router.post('/search', protectWithClerk, search);
router.post('/query', protectWithClerk, chat);
router.post('/stream', protectWithClerk, chatStream);

export default router;
