import express from 'express';
import { analyzeSkillsHandler } from '../controllers/skillsAnalysisController.js';

const router = express.Router();

router.post('/analyze', analyzeSkillsHandler);

export default router;