import express from 'express';
import multer from 'multer';
import path from 'path';
import { getUserProfile, updateUserProfile, uploadResume, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { resumeUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/resume', protect, resumeUpload.single('resume'), uploadResume);
router.delete('/', protect, deleteUser);

export default router;
