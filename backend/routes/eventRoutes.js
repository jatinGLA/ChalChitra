import express from 'express';
import { getEvents, getEventById, createEvent, updateEventStatus } from '../controllers/eventController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, requireRole('ORGANISER', 'ADMIN'), createEvent);
router.put('/:id/status', protect, requireRole('ADMIN'), updateEventStatus);

export default router;
