import React from 'react';
import './LocationModal.css';

const cities = [
  { name: 'Mumbai', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/mumbai.png' },
  { name: 'Delhi-NCR', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/ncr.png' },
  { name: 'Bengaluru', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/bang.png' },
  { name: 'Hyderabad', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/hyd.png' },
  { name: 'Ahmedabad', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/ahd.png' },
  { name: 'Chandigarh', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/chd.png' },
  { name: 'Chennai', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/chen.png' },
  { name: 'Pune', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/pune.png' },
  { name: 'Kolkata', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/kolk.png' },
  { name: 'Kochi', img: 'https://in.bmscdn.com/m6/images/common-modules/regions/koch.png' }
];

const LocationModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="location-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select your Location</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="search-location">
          <input type="text" placeholder="Search for your city (e.g. Surat, Jaipur)..." />
        </div>
        <div className="popular-cities-grid">
          {cities.map(city => (
            <div key={city.name} className="city-card" onClick={() => { onSelect(city.name); onClose(); }}>
              <img src={city.img} alt={city.name} />
              <p>{city.name}</p>
            </div>
          ))}
        </div>
        <div className="view-all-cities">
          <a href="#">View All 50+ Cities</a>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
