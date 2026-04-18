import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user management routes are ADMIN only
router.get('/', protect, requireRole('ADMIN'), getUsers);
router.put('/:id/role', protect, requireRole('ADMIN'), updateUserRole);

export default router;
