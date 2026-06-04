import express from 'express';
import {
    createConversation,
    getConversations,
    getConversation,
    updateConversationTitle,
    deleteConversation
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/', createConversation);
router.get('/', getConversations);
router.get('/:id', getConversation);
router.patch('/:id', updateConversationTitle);
router.delete('/:id', deleteConversation);

export default router;
