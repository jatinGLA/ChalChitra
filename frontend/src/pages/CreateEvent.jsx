import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Event Creation Submitted! (Mock)");
    navigate('/organiser');
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
              <input type="text" placeholder="e.g. Arijit Singh Live" required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select required>
                <option value="">Select Category</option>
                <option value="Concert">Concert</option>
                <option value="Comedy">Comedy</option>
                <option value="Movie">Movie</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date & Time</label>
              <input type="datetime-local" required />
            </div>
            <div className="form-group">
              <label>Venue / Location</label>
              <input type="text" placeholder="e.g. JLN Stadium, Delhi" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Base Ticket Price (₹)</label>
              <input type="number" min="0" placeholder="1999" required />
            </div>
            <div className="form-group">
              <label>Total Capacity</label>
              <input type="number" min="1" placeholder="500" required />
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image URL</label>
            <input type="url" placeholder="https://unsplash.com/..." required />
          </div>

          <div className="form-group">
            <label>Event Description</label>
            <textarea rows="5" placeholder="Tell the audience what to expect..." required></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={() => navigate('/organiser')}>Cancel</button>
            <button type="submit" className="primary-btn">Publish Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
