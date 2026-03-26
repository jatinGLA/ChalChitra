import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());

// App Routers
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ChalChitra API is running' });
});

// Socket.io for Real-time Seat Booking
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Real-time events
  socket.on('lock_seat', (data) => {
    socket.broadcast.emit('seat_locked', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chalchitra';

// Start Server & Connect to DB
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully');
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
