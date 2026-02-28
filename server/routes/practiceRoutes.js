import express from 'express';
import {
    getRoles,
    startPractice,
    submitAnswer,
    submitTest,
    getProgress
} from '../controllers/practiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/roles', getRoles);
router.post('/start', protect, startPractice);
router.post('/submit-answer', protect, submitAnswer);
router.post('/submit-test', protect, submitTest);
router.get('/progress', protect, getProgress);

export default router;
