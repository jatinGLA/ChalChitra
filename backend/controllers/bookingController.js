import supabase from '../config/supabaseClient.js';
import crypto from 'crypto';

export const createBooking = async (req, res) => {
  try {
    const { eventId, seats, totalAmount } = req.body;
    
    // Fetch Event
    const { data: event, error: fetchEventError } = await supabase
      .from('events')
      .select('id, booked_seats')
      .eq('id', eventId)
      .single();

    if (fetchEventError || !event) return res.status(404).json({ message: 'Event not found' });

    // Mock Razorpay Order ID for now
    const mockPaymentId = 'order_' + crypto.randomBytes(8).toString('hex');

    // Create Booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: req.user.id,
        event_id: eventId,
        seats,
        total_amount: totalAmount,
        payment_id: mockPaymentId
      }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Mark seats as booked (PostgreSQL array append)
    const updatedBookedSeats = [...(event.booked_seats || []), ...seats];
    const { error: eventUpdateError } = await supabase
      .from('events')
      .update({ booked_seats: updatedBookedSeats })
      .eq('id', eventId);

    if (eventUpdateError) throw eventUpdateError;

    // 4. Generate individual Ticket records for each seat
    const ticketsData = seats.map(seat => ({
      owner_id: req.user.id,
      event_id: eventId,
      seat_number: seat,
      booking_id: booking.id,
      is_resellable: false,
      resale_active: false
    }));

    const { error: ticketsError } = await supabase
      .from('tickets')
      .insert(ticketsData);

    if (ticketsError) throw ticketsError;

    res.status(201).json({ bookingId: booking.id, paymentId: mockPaymentId, amount: totalAmount });
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
