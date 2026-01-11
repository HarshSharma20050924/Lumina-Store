import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, sendOtp, verifyOtp, checkEmail, resetPassword, validateOtp } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/check-email', checkEmail);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/validate-otp', validateOtp); // New Route
router.post('/reset-password', resetPassword);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;