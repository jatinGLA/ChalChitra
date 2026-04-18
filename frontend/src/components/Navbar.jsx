import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocationModal from './LocationModal';
import './Navbar.css';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState('Delhi-NCR');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
              <h1>Chal<span>Chitra</span></h1>
            </Link>
          </div>
          <div className="navbar-search">
            <input 
              type="text" 
              placeholder="Search for Movies, Events, Plays..." 
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  alert(`Searching for: ${e.target.value}... (Global search coming soon!)`);
                }
              }}
            />
          </div>
          <div className="navbar-menu">
            <Link to="/resale-market" className="location" style={{textDecoration: 'none', color: '#fbbf24', fontWeight: '600'}}>💹 Marketplace</Link>
            <Link to="/host" className="location" style={{textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600'}}>Host Event</Link>
            <span className="location location-selector" onClick={() => setIsModalOpen(true)} style={{cursor: 'pointer'}}>{location} ▼</span>
            {user ? (
              <>
                <Link to="/my-tickets" className="location" style={{textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600'}}>🎟️ My Vault</Link>
                <button onClick={handleLogout} className="login-btn" style={{border: '1px solid rgba(255,255,255,0.2)'}}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="login-btn" style={{textDecoration: 'none'}}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>
      <LocationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={setLocation} 
      />
    </>
  );
};

export default Navbar;
