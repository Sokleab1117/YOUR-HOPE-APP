import { Router } from 'express';
import { chatWithAI } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', chatWithAI);

export default router;