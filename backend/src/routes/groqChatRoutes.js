import express from 'express';
import { ask, askStream, getChatHistory, getChat, deleteChat, updateChat } from '../controllers/groqChatController.js';
import { protectWithClerk } from '../middleware/clerkAuth.js';

const router = express.Router();

router.use(protectWithClerk);

router.post('/ask', ask);
router.post('/ask/stream', askStream);
router.get('/history', getChatHistory);
router.get('/:chatId', getChat);
router.delete('/:chatId', deleteChat);
router.patch('/:chatId', updateChat);

export default router;
