import React from 'react';
import { Link } from 'react-router-dom';
import './OrganiserDashboard.css';

const OrganiserDashboard = () => {
  // Mock Data
  const stats = { revenue: "₹2.4L", ticketsSold: 420, activeEvents: 3 };
  const events = [
    { id: 1, title: 'Arijit Singh Live', date: '25th Nov 2026', status: 'Active', sold: 300, capacity: 500 },
    { id: 2, title: 'Zakir Khan Comedy', date: '10th Dec 2026', status: 'Draft', sold: 0, capacity: 200 }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Organiser Dashboard</h1>
          <p>Welcome back! Here's what's happening with your events.</p>
        </div>
        <Link to="/organiser/create" className="primary-btn pulse-glow">+ Create New Event</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <h2>{stats.revenue}</h2>
        </div>
        <div className="stat-card">
          <h3>Tickets Sold</h3>
          <h2>{stats.ticketsSold}</h2>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <h2>{stats.activeEvents}</h2>
        </div>
      </div>

      <div className="events-management">
        <div className="section-head">
          <h2>Your Events</h2>
        </div>
        <div className="events-table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Occupancy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id}>
                  <td><strong>{evt.title}</strong></td>
                  <td>{evt.date}</td>
                  <td>
                    <span className={`status-badge ${evt.status.toLowerCase()}`}>{evt.status}</span>
                  </td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(evt.sold/evt.capacity)*100}%` }}></div>
                    </div>
                    <span className="occupancy-text">{evt.sold} / {evt.capacity}</span>
                  </td>
                  <td>
                    <button className="icon-btn edit-btn" onClick={() => alert(`Editing event: ${evt.title}`)}>Edit</button>
                    <button className="icon-btn analytics-btn" onClick={() => alert(`Viewing stats for: ${evt.title}`)}>Stats</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
