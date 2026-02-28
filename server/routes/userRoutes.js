import express from 'express';
import multer from 'multer';
import path from 'path';
import { getUserProfile, updateUserProfile, uploadResume, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// File Filter for PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/resume', protect, upload.single('resume'), uploadResume);
router.delete('/', protect, deleteUser);

export default router;
