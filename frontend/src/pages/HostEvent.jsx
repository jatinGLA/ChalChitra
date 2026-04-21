import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import './HostEvent.css';

const HostEvent = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Live Music',
    venue: '',
    date: '',
    price: '',
    capacity: '',
    image_url: '',
    description: 'A premium event hosted via ChalChitra Host Portal.'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to host an event.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to publish event');

      alert('Full Event Hosted and Published Successfully!');
      window.location.href = '/organiser';
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="host-event-container">
      <div className="host-sidebar">
        <h2>Host on ChalChitra</h2>
        <ul className="host-steps">
          <li className={step === 1 ? 'active' : ''}>1. Basic Details</li>
          <li className={step === 2 ? 'active' : ''}>2. Venue & Scheduling</li>
          <li className={step === 3 ? 'active' : ''}>3. Ticketing Tiers</li>
          <li className={step === 4 ? 'active' : ''}>4. Media & Artwork</li>
        </ul>
      </div>
      
      <div className="host-content">
        <div className="host-form-card">
          {step === 1 && (
             <div className="animated-step">
                <h3>Event Fundamentals</h3>
                <p>Start by providing the core details of your show or event.</p>
                
                <div className="host-input-group">
                  <label>Event Name</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    placeholder="Mega Concert 2027" 
                  />
                </div>
                
                <div className="host-input-group">
                  <label>Event Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                  >
                    <option value="Concert">Live Music</option>
                    <option value="Comedy">Standup Comedy</option>
                    <option value="Theatre">Theatre</option>
                    <option value="Workshop">Professional Workshop</option>
                  </select>
                </div>
                
                <button className="primary-btn nxt-btn" onClick={() => setStep(2)}>Continue to Venue</button>
             </div>
          )}

          {step === 2 && (
             <div className="animated-step">
                <h3>Where and When</h3>
                <p>Specify the exact geographic location and schedule.</p>
                
                <div className="host-input-group">
                  <label>Venue Name</label>
                  <input 
                    type="text" 
                    name="venue" 
                    value={formData.venue} 
                    onChange={handleInputChange} 
                    placeholder="Indira Gandhi Indoor Stadium" 
                  />
                </div>
                
                <div className="host-input-group">
                  <label>Date and Time</label>
                  <input 
                    type="datetime-local" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="host-btn-row">
                  <button className="secondary-btn" onClick={() => setStep(1)}>Back</button>
                  <button className="primary-btn" onClick={() => setStep(3)}>Continue to Tickets</button>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="animated-step">
                <h3>Ticketing Matrix</h3>
                <p>Configure pricing and seating capacities.</p>
                
                <div className="tier-box">
                  <h4>Standard Tier</h4>
                  <div className="split-inputs">
                    <input 
                      type="number" 
                      name="capacity" 
                      value={formData.capacity} 
                      onChange={handleInputChange} 
                      placeholder="Capacity (e.g. 5000)" 
                    />
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      placeholder="Price (₹)" 
                    />
                  </div>
                </div>

                <div className="tier-box highlight-tier">
                  <h4>Premium/VIP Tier</h4>
                  <div className="split-inputs">
                    <input type="number" placeholder="Capacity (e.g. 500)" />
                    <input type="number" placeholder="Price (₹)" />
                  </div>
                </div>
                
                <div className="host-btn-row">
                  <button className="secondary-btn" onClick={() => setStep(2)}>Back</button>
                  <button className="primary-btn" onClick={() => setStep(4)}>Continue to Media</button>
                </div>
             </div>
          )}

          {step === 4 && (
             <div className="animated-step">
                <h3>Artwork & Artwork</h3>
                <p>Upload a high-quality poster to attract your audience.</p>
                
                <div className="host-input-group">
                   <label>Event Poster URL</label>
                   <input 
                     type="url" 
                     name="image_url" 
                     value={formData.image_url} 
                     onChange={handleInputChange} 
                     placeholder="https://images.unsplash.com/..." 
                   />
                </div>
                
                <div className="host-btn-row">
                  <button className="secondary-btn" onClick={() => setStep(3)}>Back</button>
                  <button 
                    className="primary-btn publish-btn" 
                    onClick={handlePublish} 
                    disabled={loading}
                  >
                    {loading ? 'Publishing...' : '🚀 Publish Event'}
                  </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostEvent;
