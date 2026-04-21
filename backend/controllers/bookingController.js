import supabase from '../config/supabaseClient.js';
import crypto from 'crypto';

export const createBooking = async (req, res) => {
  try {
    const { eventId, seats, totalAmount } = req.body;
    
    // 1. Fetch Event
    const { data: event, error: fetchEventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single();

    if (fetchEventError || !event) return res.status(404).json({ message: 'Event not found' });

    // 2. Check for existing active bookings (Completed OR Pending < 15 mins)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { data: activeBookings, error: activeError } = await supabase
      .from('bookings')
      .select('seats, payment_status, created_at')
      .eq('event_id', eventId)
      .or(`payment_status.eq.Completed,and(payment_status.eq.Pending,created_at.gte.${fifteenMinsAgo})`);

    if (activeError) throw activeError;

    const currentlyBookedSet = new Set();
    activeBookings?.forEach(b => {
      b.seats.forEach(s => currentlyBookedSet.add(s));
    });

    const isAnySeatTaken = seats.some(s => currentlyBookedSet.has(s));
    if (isAnySeatTaken) {
      return res.status(400).json({ message: 'One or more of selected seats were just taken. Please refresh and try again.' });
    }

    // 3. Create Booking with 'Pending' status
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: req.user.id,
        event_id: eventId,
        seats,
        total_amount: totalAmount,
        payment_status: 'Pending'
      }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    res.status(201).json({ bookingId: booking.id, amount: totalAmount });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, events(title, venue, date, image_url)')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};
