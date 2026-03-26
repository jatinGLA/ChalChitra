import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const { state } = useLocation();
  const seats = state?.seats || ['A1'];
  const total = state?.total || 1999;
  
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p>Your payment of <strong>₹{total}</strong> was successful.</p>
        
        <div className="ticket-details">
          <div className="ticket-row">
            <span>Event:</span>
            <strong>Arijit Singh Live</strong>
          </div>
          <div className="ticket-row">
            <span>Seats Booked:</span>
            <strong>{seats.join(', ')}</strong>
          </div>
          <div className="ticket-row">
            <span>Date & Time:</span>
            <strong>25th Nov 2026 | 6:30 PM</strong>
          </div>
          <div className="qr-placeholder">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ChalChitraMOCK" alt="Ticket QR" />
            <p>Scan to enter venue</p>
          </div>
        </div>

        <div className="success-actions">
          <button className="secondary-btn">Download E-Ticket</button>
          <Link to="/" className="primary-btn">Return Home</Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
