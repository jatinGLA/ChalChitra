// ============================================
// ChalChitra Backend Server Configuration
// ============================================
// Main entry point for the Express API server
// Handles HTTP requests, WebSocket connections,
// and routing for all API endpoints

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables from .env file
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io Server Configuration
// Enables real-time bidirectional communication for live seat updates
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Enable CORS - allows frontend to communicate with this API
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// App Routers
// Import all route modules for different features
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';

// ============================================
// API ROUTE REGISTRATION
// ============================================
// Mount all feature routes with their respective URL prefixes

// Authentication routes (login, register, logout)
app.use('/api/auth', authRoutes);

// Event management routes (create, read, update, delete events)
app.use('/api/events', eventRoutes);

// Booking management routes (create bookings, view bookings)
app.use('/api/bookings', bookingRoutes);

// Payment processing routes (create & verify payments)
app.use('/api/payments', paymentRoutes);

// Ticket generation and management routes
app.use('/api/tickets', ticketRoutes);

// User support request routes
app.use('/api/requests', requestRoutes);

// User profile and account management routes
app.use('/api/users', userRoutes);

// Health check endpoint - verify API is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ChalChitra API is running on Supabase' });
});

// ============================================
// SOCKET.IO REAL-TIME CONFIGURATION
// ============================================
// Handles real-time communication for:
// - Live seat booking updates
// - Seat availability changes
// - User notifications

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Real-time event handlers
  // Broadcasts seat lock status to all connected clients
  socket.on('lock_seat', (data) => {
    socket.broadcast.emit('seat_locked', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

// Start Server directly since Supabase client connects via stateless HTTP API
const startServer = () => {
  try {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
