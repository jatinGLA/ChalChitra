// ============================================
// EVENT ROUTES
// ============================================
// Defines all event management API endpoints
// Handles event CRUD operations and event status updates

import express from 'express';
import { getEvents, getEventById, createEvent, updateEventStatus } from '../controllers/eventController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// GET /api/events
// Retrieve all events with filters (status, date range, location, etc.)
// Returns paginated list of events
router.get('/', getEvents);

// GET /api/events/:id
// Retrieve detailed information for a specific event
// Includes seats, pricing, description, etc.
router.get('/:id', getEventById);

// ============================================
// PROTECTED ROUTES (Authentication + Authorization required)
// ============================================

// POST /api/events
// Create a new event
// Required Role: ORGANISER or ADMIN
// Request body: { title, description, date, location, seats, pricing, ... }
router.post('/', protect, requireRole('ORGANISER', 'ADMIN'), createEvent);

// PUT /api/events/:id/status
// Update event status (ACTIVE, CANCELLED, POSTPONED, COMPLETED)
// Required Role: ADMIN only
// Request body: { status, reason }
router.put('/:id/status', protect, requireRole('ADMIN'), updateEventStatus);

export default router;
