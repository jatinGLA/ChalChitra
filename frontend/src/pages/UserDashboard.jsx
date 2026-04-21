import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { API_BASE_URL } from '../config';
import './UserDashboard.css';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);

  // States for modals
  const [resaleModalTicket, setResaleModalTicket] = useState(null);
  const [resalePrice, setResalePrice] = useState('');
  
  const [transferModalTicket, setTransferModalTicket] = useState(null);
  const [newOwnerId, setNewOwnerId] = useState('');

  const [bidsModalTicket, setBidsModalTicket] = useState(null);
  const [ticketBids, setTicketBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(rawUser);
    setUser(parsedUser);
    fetchMyTickets(parsedUser.id);
  }, []);

  const fetchMyTickets = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/my-tickets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets from server');
      }
      
      const data = await response.json();
      setTickets(data || []);
    } catch (err) {
      setErrorMsg('Failed to load tickets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleListForResale = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/resell/${resaleModalTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resale_price: Number(resalePrice) })
      });
      
      if (!response.ok) {
         const d = await response.json();
         throw new Error(d.message || "Failed to list for resale");
      }

      setResaleModalTicket(null);
      setResalePrice('');
      fetchMyTickets(user.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/transfer/${transferModalTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newOwnerId })
      });
      
      if (!response.ok) {
         const d = await response.json();
         throw new Error(d.message || "Failed to transfer ticket");
      }

      setTransferModalTicket(null);
      setNewOwnerId('');
      fetchMyTickets(user.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const viewBids = async (ticket) => {
    setBidsModalTicket(ticket);
    setBidsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticket.id}/bids`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bids');
      const data = await response.json();
      setTicketBids(data);
    } catch(err) {
      alert(err.message);
    } finally {
      setBidsLoading(false);
    }
  };

  const acceptBid = async (bidId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/bids/${bidId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to accept bid');
      alert("Bid Accepted successfully! Ticket transferred.");
      setBidsModalTicket(null);
      fetchMyTickets(user.id);
    } catch(err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        <div className="dashboard-header">
          <h2>My Vault</h2>
          <p>Manage your booked tickets, list for resale, or transfer to friends.</p>
        </div>

        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="tickets-grid">
            {tickets.length === 0 ? (
              <div className="empty-state">
                <p>You haven't booked any tickets yet.</p>
                <button onClick={() => navigate('/')} className="primary-btn">Explore Events</button>
              </div>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-image" style={{ backgroundImage: `url(${ticket.events.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'})`}}>
                    {ticket.is_resellable && <span className="resale-badge">Listed for ₹{ticket.resale_price}</span>}
                  </div>
                  <div className="ticket-details">
                    <h3>{ticket.events.title}</h3>
                    <p className="ticket-meta">📅 {new Date(ticket.events.date).toLocaleDateString()}</p>
                    <p className="ticket-meta">📍 {ticket.events.venue}</p>
                    <div className="ticket-seat">Seat: <strong>{ticket.seat_number}</strong></div>
                    
                    <div className="ticket-actions">
                      <button className="dl-btn" onClick={() => window.open(`${API_BASE_URL}/api/tickets/download/${ticket.id}`, '_blank')}>
                        Download Pass
                      </button>

                      {ticket.events.allow_resell && !ticket.is_resellable && (
                        <button className="resell-btn" onClick={() => setResaleModalTicket(ticket)}>
                          Resell
                        </button>
                      )}
                      
                      {!ticket.is_resellable && (
                        <button className="transfer-btn" onClick={() => setTransferModalTicket(ticket)}>
                          Transfer
                        </button>
                      )}

                      {ticket.is_resellable && (
                        <button className="review-bids-btn" onClick={() => viewBids(ticket)}>
                          Review Bids
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Resale Modal */}
      {resaleModalTicket && (
        <div className="modal-overlay" onClick={() => setResaleModalTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{marginBottom: '15px'}}>List Ticket for Resale</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px'}}>
              You are listing your seat ({resaleModalTicket.seat_number}) for {resaleModalTicket.events.title}. Note: 1.5% platform fee will be deducted from your payout.
            </p>
            <form onSubmit={handleListForResale}>
              <div className="input-group">
                <label>Asking Price (₹)</label>
                <input type="number" required value={resalePrice} onChange={e => setResalePrice(e.target.value)} className="auth-input" placeholder="e.g. 500" />
              </div>
              <button type="submit" className="submit-btn" style={{marginTop: '20px'}}>List to Marketplace</button>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModalTicket && (
        <div className="modal-overlay" onClick={() => setTransferModalTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{marginBottom: '15px'}}>Direct Transfer</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px'}}>
              Securely transfer this ticket to another ChalChitra user. This action cannot be undone.
            </p>
            <form onSubmit={handleTransfer}>
              <div className="input-group">
                <label>Recepient User ID</label>
                <input type="text" required value={newOwnerId} onChange={e => setNewOwnerId(e.target.value)} className="auth-input" placeholder="Enter recipient's ID..." />
              </div>
              <button type="submit" className="submit-btn" style={{marginTop: '20px'}}>Transfer Ticket</button>
            </form>
          </div>
        </div>
      )}

      {/* Review Bids Modal */}
      {bidsModalTicket && (
        <div className="modal-overlay" onClick={() => setBidsModalTicket(null)}>
          <div className="modal-content bids-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{marginBottom: '15px'}}>Incoming Bids</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px'}}>
              Review bids for Seat {bidsModalTicket.seat_number}. Accepting a bid will immediately transfer the ticket.
            </p>
            
            {bidsLoading ? (
               <p>Loading bids...</p>
            ) : ticketBids.length === 0 ? (
               <p style={{color: '#a1a1aa'}}>No bids received yet.</p>
            ) : (
               <div className="bids-list">
                 {ticketBids.map(bid => (
                   <div key={bid.id} className="bid-row">
                     <div className="bid-info">
                       <strong>₹{bid.bid_amount}</strong>
                       <span>from {bid.users.name}</span>
                     </div>
                     <button onClick={() => acceptBid(bid.id)} className="accept-bid-btn">Accept</button>
                   </div>
                 ))}
               </div>
            )}
            <button className="cancel-btn" onClick={() => setBidsModalTicket(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
