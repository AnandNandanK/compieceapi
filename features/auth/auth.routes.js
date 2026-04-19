import express from 'express';
import { getProfile, login, register, updateProfile } from './auth.controller.js'; 
import { protect } from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/upload.middleware.js';

const router = express.Router();

// Register route
router.post('/register', register);
// Login route
router.post('/login', login);
//profile route
router.get('/profile',protect, getProfile);
//update profile route
router.put('/profile',protect, updateProfile);
//image upload route

router.post("/upload-profile-image", upload.single("profileImage"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

export default router;
