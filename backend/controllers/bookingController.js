import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import crypto from 'crypto';

export const createBooking = async (req, res) => {
  try {
    const { eventId, seats, totalAmount } = req.body;
    
    // In production, would verify seat availability in DB atomically here
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      seats,
      totalAmount
    });

    // Mock Razorpay Order ID for now
    const mockPaymentId = 'order_' + crypto.randomBytes(8).toString('hex');
    booking.paymentId = mockPaymentId;

    await booking.save();

    // Mark seats as booked
    event.bookedSeats.push(...seats);
    await event.save();

    res.status(201).json({ bookingId: booking._id, paymentId: mockPaymentId, amount: totalAmount });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event', 'title venue date imageUrl');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};
