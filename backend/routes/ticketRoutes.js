import express from 'express';
import { downloadTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get the ticket
router.get('/:id', protect, downloadTicket);

export default router;
