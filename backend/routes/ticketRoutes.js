import express from 'express';
import { 
  downloadTicket, 
  listTicketForResale, 
  transferTicket,
  placeBid,
  getTicketBids,
  acceptBid,
  getMarketplaceTickets,
  getMyTickets
} from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/Marketplace 
router.get('/marketplace', getMarketplaceTickets);

// Protected actions on tickets
router.get('/my-tickets', protect, getMyTickets);
router.get('/download/:id', protect, downloadTicket); // changed from /:id to /download/:id to avoid conflict

// Resale & Transfer
router.put('/resell/:id', protect, listTicketForResale);
router.put('/transfer/:id', protect, transferTicket);

// Bidding Logic
router.post('/:id/bids', protect, placeBid);
router.get('/:id/bids', protect, getTicketBids);
router.put('/bids/:bidId/accept', protect, acceptBid);

export default router;
