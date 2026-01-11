import express from 'express';
import { 
    getSiteContent, 
    updateHeroSlide, 
    deleteHeroSlide,
    updateSection, 
    updateSocialLink,
    deleteSocialLink,
    updateStaticPage
} from '../controllers/contentController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getSiteContent);

// Hero Slides
router.put('/hero/:id', protect, admin, updateHeroSlide);
router.delete('/hero/:id', protect, admin, deleteHeroSlide);

// Site Sections
router.put('/section', protect, admin, updateSection);

// Social Links
router.put('/social/:id', protect, admin, updateSocialLink);
router.delete('/social/:id', protect, admin, deleteSocialLink);

// Static Pages
router.put('/page', protect, admin, updateStaticPage);

export default router;