import express from 'express';
import {
  renameChat,
  archiveChat,
  unarchiveChat,
  pinChat,
  unpinChat,
  searchChats,
  getUserStats,
  addTag,
  removeTag
} from '../controllers/chatManagementController.js';

const router = express.Router();

// Chat management
router.patch('/:chatId/rename', renameChat);
router.patch('/:chatId/archive', archiveChat);
router.patch('/:chatId/unarchive', unarchiveChat);
router.patch('/:chatId/pin', pinChat);
router.patch('/:chatId/unpin', unpinChat);

// Search
router.get('/search', searchChats);

// Stats
router.get('/stats', getUserStats);

// Tags
router.post('/:chatId/tags', addTag);
router.delete('/:chatId/tags/:tag', removeTag);

export default router;
