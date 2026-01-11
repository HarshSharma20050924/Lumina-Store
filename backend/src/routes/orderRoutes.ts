
import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  driverArrived,
} from '../controllers/orderController';
import { protect, admin, adminOrAgent } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, adminOrAgent, getOrders); 

router.route('/myorders').get(protect, getMyOrders);

// Driver notifies arrival to generate OTP
router.route('/:id/arrival').post(protect, adminOrAgent, driverArrived);

// Update status (e.g. to delivered with OTP)
router.route('/:id/status').patch(protect, adminOrAgent, updateOrderStatus);

export default router;
