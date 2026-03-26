import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2>Chal<span>Chitra</span></h2>
          <p>Your premium destination for booking events, movies, and living experiences across India.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@chalchitra.in</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ChalChitra. All Rights Reserved.</p>
        <p>Built with ❤️ for Event Enthusiasts</p>
      </div>
    </footer>
  );
};

export default Footer;
