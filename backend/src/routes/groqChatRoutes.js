import express from 'express';
import { ask, askStream, getChatHistory, getChat, deleteChat } from '../controllers/groqChatController.js';

const router = express.Router();

router.post('/ask', ask);
router.post('/ask/stream', askStream);
router.get('/history', getChatHistory);
router.get('/:chatId', getChat);
router.delete('/:chatId', deleteChat);

export default router;
