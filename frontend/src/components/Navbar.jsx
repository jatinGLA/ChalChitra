import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LocationModal from './LocationModal';
import './Navbar.css';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState('Delhi-NCR');

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
            <input type="text" placeholder="Search for Movies, Events, Plays..." />
          </div>
          <div className="navbar-menu">
            <Link to="/host" className="location" style={{textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600'}}>Host Event</Link>
            <span className="location location-selector" onClick={() => setIsModalOpen(true)} style={{cursor: 'pointer'}}>{location} ▼</span>
            <Link to="/login" className="login-btn" style={{textDecoration: 'none'}}>Sign In</Link>
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
