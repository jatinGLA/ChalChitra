import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './SeatSelection.css';

const ROWS = 8;
const SEATS_PER_ROW = 12;
const PREMIUM_ROWS = 2; // Last 2 rows are premium

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
      if (!response.ok) throw new Error('Event not found');
      const data = await response.json();
      setEvent(data);
      setBookedSeats(data.booked_seats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert("You can only select up to 6 seats");
      }
    }
  };

  const getSubtotal = () => {
    let total = 0;
    selectedSeats.forEach(seat => {
      const rowChar = seat.charAt(0);
      const isPremium = rowChar === 'G' || rowChar === 'H';
      total += isPremium ? 2999 : 1999;
    });
    return total;
  };
  
  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'CHALCHITRA20') {
      const subtotal = getSubtotal();
      const disc = Math.floor(subtotal * 0.2);
      setDiscount(disc);
      setPromoMessage('20% Discount Applied! 🎉');
    } else {
      setDiscount(0);
      setPromoMessage('Invalid Promo Code');
    }
  };

  const calculateTotal = () => {
    return getSubtotal() - discount;
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      // Prompt user then redirect with return path
      alert("Please login to proceed with booking");
      navigate(`/login?redirect=${encodeURIComponent(`/book/${id}`)}`);
      return;
    }

    setBookingLoading(true);
    try {
      const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: id,
          seats: selectedSeats,
          totalAmount: calculateTotal()
        })
      });

      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok) throw new Error(bookingData.message || 'Booking failed');

      // 2. Create Razorpay order
      const orderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: calculateTotal(),
          bookingId: bookingData.bookingId
        })
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.message || 'Failed to create payment order');

      // 3. Open Razorpay Widget
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // use real or fallback
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ChalChitra Ticketing",
        description: `Booking for ${event.title}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment Server-Side
            const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingData.bookingId
              })
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verifyData.message || 'Payment verification failed');

            // 5. Success
            navigate(`/success`, { 
              state: { 
                seats: selectedSeats, 
                total: calculateTotal(), 
                eventId: id,
                eventTitle: event.title,
                eventDate: event.date,
                eventVenue: event.venue
              } 
            });
          } catch(err) {
             alert(err.message);
          }
        },
        prefill: {
          name: "ChalChitra User",
          email: "user@example.com"
        },
        theme: {
          color: "#d92b2b" // matching red from CSS
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      alert(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const renderSeats = () => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      const rowChar = String.fromCharCode(65 + i);
      const isPremium = i >= ROWS - PREMIUM_ROWS;
      
      const seats = [];
      for (let j = 1; j <= SEATS_PER_ROW; j++) {
        const seatId = `${rowChar}${j}`;
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        let className = `seat ${isPremium ? 'premium' : 'standard'}`;
        if (isBooked) className += ' booked';
        if (isSelected) className += ' selected';
        
        const isAisle = j === 6;

        seats.push(
          <div key={seatId} className="seat-wrapper" style={{ marginRight: isAisle ? '40px' : '0' }}>
            <button 
              className={className}
              onClick={() => toggleSeat(seatId)}
              disabled={isBooked}
              title={`${seatId} - ₹${isPremium ? 2999 : 1999}`}
            >
              {j}
            </button>
          </div>
        );
      }
      
      rows.push(
        <div key={rowChar} className="seat-row">
          <div className="row-label">{rowChar}</div>
          <div className="seats-container">{seats}</div>
        </div>
      );
    }
    return rows;
  };

  if (loading) {
    return <div className="seat-selection-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div className="loading-spinner"></div>
    </div>;
  }

  return (
    <div className="seat-selection-container">
      <div className="seat-header">
        <h2>Select Your Seats</h2>
        <p>{event?.title} - {event?.venue}</p>
      </div>

      <div className="screen-indicator">
        <div className="screen-curve"></div>
        <p>STAGE / SCREEN</p>
      </div>

      <div className="seating-layout">
        {renderSeats()}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat standard sample"></div>
          <span>Standard (₹1999)</span>
        </div>
        <div className="legend-item">
          <div className="seat premium sample"></div>
          <span>Premium (₹2999)</span>
        </div>
        <div className="legend-item">
          <div className="seat booked sample"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat selected sample"></div>
          <span>Selected</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="booking-summary-bar">
          <div className="summary-left">
            <div className="summary-info">
              <h3>{selectedSeats.length} Seat(s) Selected</h3>
              <p>{selectedSeats.join(', ')}</p>
            </div>
            <div className="promo-section">
              <div className="promo-input-group">
                <input 
                  type="text" 
                  placeholder="Promo Code: CHALCHITRA20" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={applyPromo} className="promo-btn">Apply</button>
              </div>
              {promoMessage && <p className={`promo-msg ${discount > 0 ? 'success' : 'error'}`}>{promoMessage}</p>}
            </div>
          </div>
          
          <div className="summary-action">
            <div className="price-breakdown">
              {discount > 0 && <span className="original-price">₹{getSubtotal()}</span>}
              <h3>Total: ₹{calculateTotal()}</h3>
            </div>
            <button 
              className="primary-btn proceed-btn pulse-glow" 
              onClick={handleProceed}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : 'Checkout & Pay'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
