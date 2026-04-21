// ============================================
// BOOKING ROUTES
// ============================================
// Defines all booking management API endpoints
// Handles creation and retrieval of ticket bookings

import express from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// POST /api/bookings
// Create a new booking for selected seats
// Request body: { eventId, seats[], totalPrice, ... }
// Returns: booking confirmation with booking ID and payment details

// GET /api/bookings
// Retrieve all bookings for the authenticated user
// Returns: array of user's bookings with status and details

router.route('/').post(protect, createBooking).get(protect, getUserBookings);

export default router;
