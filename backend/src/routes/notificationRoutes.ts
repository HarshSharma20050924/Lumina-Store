
import express from 'express';
import { getUserAnalytics, sendNotification, getMyNotifications, pollNotifications, getSmartCampaigns } from '../controllers/notificationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/analytics', protect, admin, getUserAnalytics);
router.get('/smart-campaigns', protect, admin, getSmartCampaigns);
router.post('/send', protect, admin, sendNotification);
router.get('/my', protect, getMyNotifications);
router.get('/poll', protect, pollNotifications);

export default router;
