// ============================================
// AUTHENTICATION ROUTES
// ============================================
// Defines all authentication-related API endpoints
// Handles user registration, login, and profile retrieval

import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// POST /api/auth/register
// Create a new user account
// Request body: { name, email, password, ... }
router.post('/register', registerUser);

// POST /api/auth/login
// Authenticate user and return JWT token
// Request body: { email, password }
router.post('/login', loginUser);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// GET /api/auth/profile
// Retrieve authenticated user's profile information
// Headers: Authorization: Bearer <JWT_TOKEN>
router.get('/profile', protect, getUserProfile);

export default router;
