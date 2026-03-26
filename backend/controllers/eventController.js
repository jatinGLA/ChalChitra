import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'Active' });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organiser: req.user.id
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    event.status = status;
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event status' });
  }
};
