import express from 'express';
import {
    getRoles,
    startPractice,
    submitAnswer,
    submitTest,
    uploadVideo,
    getProgress
} from '../controllers/practiceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/roles', getRoles);
router.post('/start', protect, startPractice);
router.post('/submit-answer', protect, submitAnswer);
router.post('/submit-test', protect, submitTest);
router.post('/upload-video', protect, upload.single('video'), uploadVideo);
router.get('/progress', protect, getProgress);

export default router;
