import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [ratingHover, setRatingHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  
  // Mock data
  const event = {
    id,
    title: 'Arijit Singh Live',
    category: 'Concert',
    venue: 'JLN Stadium, Delhi',
    date: '25th Nov 2026',
    time: '6:30 PM',
    price: 1999,
    description: 'Join the musical sensation Arijit Singh for a night of soulful melodies. Minimum 5 stars guaranteed experience.',
    image: 'https://images.unsplash.com/photo-1540039155732-d6888424a7ba?auto=format&fit=crop&q=80&w=1200',
    overallRating: 4.8,
    reviews: [
      { id: 1, user: 'Priya Sharma', score: 5, text: 'Absolutely magical experience!', date: 'Oct 12, 2026' },
      { id: 2, user: 'Rahul Verma', score: 4, text: 'Great crowd and music, but the entry was a bit chaotic.', date: 'Oct 15, 2026' }
    ]
  };

  return (
    <div className="event-details-container">
      <div className="event-backdrop" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="event-details-content">
        <div className="event-info-main">
          <div className="event-poster">
            <img src={event.image} alt={event.title} />
          </div>
          <div className="event-action-box">
             <h3>₹{event.price} <span className="starting-from">onwards</span></h3>
             <Link to={`/book/${event.id}`} className="primary-btn book-tickets-btn">Book Tickets</Link>
          </div>
        </div>
        
        <div className="event-info">
          <div className="event-header-row">
            <span className="event-category-tag">{event.category}</span>
            <div className="overall-rating-badge">★ {event.overallRating}/5</div>
          </div>
          <h1 className="event-title">{event.title}</h1>
          
          <div className="event-meta">
            <div className="meta-item">
              <span className="icon">📅</span>
              <div>
                <h4>Date & Time</h4>
                <p>{event.date} | {event.time}</p>
              </div>
            </div>
            <div className="meta-item">
              <span className="icon">📍</span>
              <div>
                <h4>Venue</h4>
                <p>{event.venue}</p>
              </div>
            </div>
          </div>
          
          <div className="event-description">
            <h3>About the Event</h3>
            <p>{event.description}</p>
          </div>

          <div className="event-reviews-section">
            <h3>Ratings &amp; Reviews</h3>
            
            <div className="write-review-card">
              <h4>Leave a Review</h4>
              <div className="star-rating-input">
                {[1,2,3,4,5].map(star => (
                   <span 
                     key={star} 
                     className={`star ${(ratingHover || userRating) >= star ? 'active' : ''}`}
                     onMouseEnter={() => setRatingHover(star)}
                     onMouseLeave={() => setRatingHover(0)}
                     onClick={() => setUserRating(star)}
                   >★</span>
                ))}
              </div>
              <textarea placeholder="Share your experience..." rows="3" className="review-textarea"></textarea>
              <button className="primary-btn submit-review-btn">Post Review</button>
            </div>

            <div className="reviews-list">
              {event.reviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-avatar">{review.user.charAt(0)}</div>
                    <div className="reviewer-info">
                      <h5>{review.user}</h5>
                      <span>{review.date}</span>
                    </div>
                    <div className="review-score">
                      {'★'.repeat(review.score)}{'☆'.repeat(5-review.score)}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
