import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  return (
    <Link to={`/event/${event.id}`} className="event-card-link">
      <div className="event-card">
        <div className="card-image-wrapper">
          <img src={event.image} alt={event.title} className="card-image" />
          <div className="card-category-badge">{event.category}</div>
        </div>
        <div className="card-content">
          <h3 className="card-title">{event.title}</h3>
          <p className="card-venue">{event.venue}</p>
          <div className="card-footer">
            <span className="card-date">{event.date}</span>
            <span className="card-price">₹{event.price} onwards</span>
          </div>
        </div>
        <div className="card-hover-overlay">
          <button className="book-now-btn">Book Now</button>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
