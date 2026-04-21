import supabase from '../config/supabaseClient.js';

export const getEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      // Note: Assuming we filter out past events or add 'status' to table later if needed
      .order('date', { ascending: true });

    if (error) throw error;
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching events', error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !event) return res.status(404).json({ message: 'Event not found' });

    // Calculate booked seats dynamically from bookings table
    // (Completed OR Pending < 15 mins)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { data: bookings } = await supabase
      .from('bookings')
      .select('seats, payment_status, created_at')
      .eq('event_id', req.params.id)
      .or(`payment_status.eq.Completed,and(payment_status.eq.Pending,created_at.gte.${fifteenMinsAgo})`);

    const booked = new Set();
    bookings?.forEach(b => {
      b.seats.forEach(s => booked.add(s));
    });

    event.booked_seats = Array.from(booked);
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const eventPayload = {
      ...req.body,
      organiser_id: req.user.id
    };

    const { data: createdEvent, error } = await supabase
      .from('events')
      .insert([eventPayload])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// We didn't explicitly add 'status' column in the sql before, but we can update any field here
export const updateEventStatus = async (req, res) => {
  try {
    // Check if exists
    const { data: event } = await supabase.from('events').select('id').eq('id', req.params.id).single();
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // We update the whole body for dynamic updates (e.g. status)
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event status' });
  }
};
