import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './ResaleMarket.css';

const ResaleMarket = () => {
  const [marketTickets, setMarketTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Bidding Modal States
  const [bidModalTicket, setBidModalTicket] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/marketplace`);
      if (!response.ok) throw new Error('Failed to fetch marketplace');
      const data = await response.json();
      setMarketTickets(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitBid = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/tickets/${bidModalTicket.id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bid_amount: Number(bidAmount) })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to place bid');

      setSuccessMsg('Bid successfully placed! The seller will be notified.');
      setTimeout(() => {
        setBidModalTicket(null);
        setSuccessMsg('');
      }, 3000);

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setBidLoading(false);
    }
  };

  return (
    <div className="marketplace-page">
      <div className="marketplace-container">
        
        <div className="marketplace-header">
          <h2>Marketplace</h2>
          <p>Bid on tickets listed by other users for upcoming events.</p>
        </div>

        {errorMsg && !bidModalTicket && <div className="error-msg">{errorMsg}</div>}

        {loading ? (
          <div className="loading-spinner"></div>
        ) : marketTickets.length === 0 ? (
          <div className="empty-state">
            <p>No tickets are currently listed on the resale market.</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {marketTickets.map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-image" style={{ backgroundImage: `url(${ticket.events.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'})`}}>
                  <span className="resale-badge">Asking: ₹{ticket.resale_price}</span>
                </div>
                <div className="ticket-details">
                  <h3>{ticket.events.title}</h3>
                  <p className="ticket-meta">📅 {new Date(ticket.events.date).toLocaleDateString()}</p>
                  <p className="ticket-meta">📍 {ticket.events.venue}</p>
                  <div className="ticket-seat">Seat: <strong>{ticket.seat_number}</strong></div>
                  
                  <div className="ticket-actions">
                    <button className="bid-btn" onClick={() => { setBidModalTicket(ticket); setBidAmount(''); setErrorMsg(''); }}>
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid placement Modal */}
      {bidModalTicket && (
        <div className="modal-overlay" onClick={() => setBidModalTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{marginBottom: '10px'}}>Submit a Bid</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px'}}>
              You are bidding on Seat {bidModalTicket.seat_number} for {bidModalTicket.events.title}. The seller is asking for ₹{bidModalTicket.resale_price}.
            </p>
            
            {successMsg && <div className="success-msg">{successMsg}</div>}
            {errorMsg && <div className="error-msg">{errorMsg}</div>}

            {!successMsg && (
              <form onSubmit={submitBid}>
                <div className="input-group">
                  <label>Your Bid Amount (₹)</label>
                  <input type="number" required value={bidAmount} onChange={e => setBidAmount(e.target.value)} className="auth-input" placeholder="Enter amount" />
                </div>
                <button type="submit" className="submit-btn" disabled={bidLoading} style={{marginTop: '20px'}}>
                  {bidLoading ? 'Submitting...' : 'Confirm Bid'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResaleMarket;
