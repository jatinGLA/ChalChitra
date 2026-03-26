import express from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getUserBookings);

export default router;
