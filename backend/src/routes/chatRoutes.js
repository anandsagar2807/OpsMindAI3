import express from 'express';
import {
    createConversation,
    getConversations,
    getConversation,
    updateConversationTitle,
    deleteConversation
} from '../controllers/chatController.js';

// Constrain :id to valid 24-char hex ObjectIds. This prevents non-id paths
// like `/api/chat/conversations` from being captured as a conversation id
// (which would 500 with a Cast-to-ObjectId error from Mongoose).
const ID = ':id([0-9a-fA-F]{24})';

const router = express.Router();

router.post('/', createConversation);
router.get('/', getConversations);
router.get(`/${ID}`, getConversation);
router.patch(`/${ID}`, updateConversationTitle);
router.delete(`/${ID}`, deleteConversation);

export default router;
