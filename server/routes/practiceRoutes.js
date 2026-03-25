import express from 'express';
import {
    getRoles,
    startPractice,
    submitAnswer,
    submitTest,
    uploadVideo,
    getProgress,
    analyzeUserResume,
    getDailyQuest,
    completeDailyQuest,
    logProctoringViolation,
    terminateInterview
} from '../controllers/practiceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload, { resumeUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/roles', getRoles);
router.post('/start', protect, startPractice);
router.post('/submit-answer', protect, submitAnswer);
router.post('/submit-test', protect, submitTest);
router.post('/upload-video', protect, upload.single('video'), uploadVideo);
router.post('/analyze-resume', protect, resumeUpload.single('resume'), analyzeUserResume);
router.get('/progress', protect, getProgress);
router.get('/daily-quest', protect, getDailyQuest);
router.post('/complete-quest', protect, completeDailyQuest);
router.post('/proctoring-log', protect, logProctoringViolation);
router.post('/terminate', protect, terminateInterview);

export default router;
