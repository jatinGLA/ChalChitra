import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    venue: '',
    price: '',
    capacity: '',
    image_url: '',
    description: '',
    allow_resell: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login as an organiser to create an event.");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create event');

      alert("Event Published Successfully! 🚀");
      navigate('/organiser');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-wrapper">
      <div className="create-event-container">
        <div className="form-header">
          <h2>Create New Event</h2>
          <p>Fill in the details to list your event on ChalChitra.</p>
        </div>

        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-row">
            <div className="form-group">
              <label>Event Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="e.g. Arijit Singh Live" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Category</option>
                <option value="Concert">Concert</option>
                <option value="Comedy">Comedy</option>
                <option value="Movie">Movie</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date & Time</label>
              <input 
                type="datetime-local" 
                name="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Venue / Location</label>
              <input 
                type="text" 
                name="venue" 
                value={formData.venue} 
                onChange={handleInputChange} 
                placeholder="e.g. JLN Stadium, Delhi" 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Base Ticket Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                min="0" 
                placeholder="1999" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Total Capacity</label>
              <input 
                type="number" 
                name="capacity" 
                value={formData.capacity} 
                onChange={handleInputChange} 
                min="1" 
                placeholder="500" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image URL</label>
            <input 
              type="url" 
              name="image_url" 
              value={formData.image_url} 
              onChange={handleInputChange} 
              placeholder="https://unsplash.com/..." 
              required 
            />
          </div>

          <div className="form-group">
            <label>Event Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows="5" 
              placeholder="Tell the audience what to expect..." 
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={() => navigate('/organiser')}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
