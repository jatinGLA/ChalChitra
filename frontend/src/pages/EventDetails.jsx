import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingHover, setRatingHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
      if (!response.ok) throw new Error('Event not found');
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReview = () => {
    if (userRating === 0 || reviewText.trim() === '') return;
    setReviewSuccess(true);
    setUserRating(0);
    setReviewText('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  if (loading) {
     return <div className="event-details-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
       <div className="loading-spinner"></div>
     </div>;
  }

  if (!event) {
    return <div className="event-details-container" style={{textAlign: 'center', padding: '100px'}}>
      <h2>Event Not Found</h2>
      <Link to="/" className="primary-btn" style={{marginTop: '20px'}}>Back to Home</Link>
    </div>;
  }

  // Formatting helpers
  const displayImage = event.image_url || 'https://images.unsplash.com/photo-1540039155732-d6888424a7ba?auto=format&fit=crop&q=80&w=1200';
  const displayDate = event.date && !isNaN(Date.parse(event.date)) 
    ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : event.date;
  const displayTime = event.date && !isNaN(Date.parse(event.date))
    ? new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '7:00 PM';
    
  // Default mocks for fields not yet in DB
  const overallRating = event.overallRating || 4.5;
  const reviews = event.reviews || [
    { id: 1, user: 'User ' + Math.floor(Math.random()*100), score: 5, text: 'The atmosphere was incredible!', date: 'Recent' }
  ];

  return (
    <div className="event-details-container">
      <div className="event-backdrop" style={{ backgroundImage: `url(${displayImage})` }}>
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="event-details-content">
        <div className="event-info-main">
          <div className="event-poster">
            <img src={displayImage} alt={event.title} />
          </div>
          <div className="event-action-box">
             <h3>₹{event.price} <span className="starting-from">onwards</span></h3>
             <Link to={`/book/${event.id}`} className="primary-btn book-tickets-btn">Book Tickets</Link>
          </div>
        </div>
        
        <div className="event-info">
          <div className="event-header-row">
            <span className="event-category-tag">{event.category}</span>
            <div className="overall-rating-badge">★ {overallRating}/5</div>
          </div>
          <h1 className="event-title">{event.title}</h1>
          
          <div className="event-meta">
            <div className="meta-item">
              <span className="icon">📅</span>
              <div>
                <h4>Date & Time</h4>
                <p>{displayDate} | {displayTime}</p>
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
              <textarea 
                placeholder="Share your experience..." 
                rows="3" 
                className="review-textarea"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
              <button className="primary-btn submit-review-btn" onClick={handlePostReview}>Post Review</button>
              {reviewSuccess && <p style={{color: '#10b981', marginTop: '10px', fontSize: '14px'}}>Review posted successfully!</p>}
            </div>

            <div className="reviews-list">
              {reviews.map(review => (
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
