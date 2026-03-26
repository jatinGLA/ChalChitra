import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const pendingEvents = [
    { id: 101, title: 'Puneeth Rajkumar Tribute', organiser: 'Sandalwood Events', date: '5th Jan 2027', status: 'Pending' },
    { id: 102, title: 'Startup Founders Meet', organiser: 'TechHub', date: '12th Jan 2027', status: 'Pending' }
  ];

  const usersList = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'User', joined: 'Oct 2025' },
    { id: 2, name: 'Sandalwood Events', email: 'contact@sandalwood.in', role: 'Organiser', joined: 'Nov 2025' }
  ];

  return (
    <div className="admin-panel-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">Chal<span>Chitra</span> Admin</div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Event Approvals</button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>User Management</button>
          <button className={activeTab === 'payouts' ? 'active' : ''} onClick={() => setActiveTab('payouts')}>Payouts & Finance</button>
          <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>System Reports</button>
        </nav>
      </aside>

      <main className="admin-main-content">
        <header className="admin-topbar">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h2>
          <div className="admin-profile">Super Admin <span>⚙️</span></div>
        </header>

        <div className="admin-scrollable-area">
          {activeTab === 'overview' && (
            <>
              <div className="admin-stats-overview">
                <div className="overview-card highlight">
                  <p>Gross Platform Revenue</p>
                  <h2>₹45.2L</h2>
                </div>
                <div className="overview-card">
                  <p>Total Users</p>
                  <h2>15,420</h2>
                </div>
                <div className="overview-card">
                  <p>Registered Organisers</p>
                  <h2>89</h2>
                </div>
                <div className="overview-card">
                  <p>Active Bookings</p>
                  <h2>3,254</h2>
                </div>
              </div>
              <div className="admin-recent-activity">
                <h3>Recent System Activity</h3>
                <ul className="activity-list">
                  <li>Ticket purchased by John for "Kalki 2898" - ₹450</li>
                  <li>New Organiser registration: "Comedy Club India"</li>
                  <li>Payout ₹1.2L initiated for "TechHub Events"</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'events' && (
            <div className="admin-table-section">
              <h3>Pending Approvals</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Organiser</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEvents.map(evt => (
                    <tr key={evt.id}>
                      <td><strong>{evt.title}</strong></td>
                      <td>{evt.organiser}</td>
                      <td>{evt.date}</td>
                      <td><span className="badge warning">{evt.status}</span></td>
                      <td className="action-cells">
                        <button className="approve-btn">Approve</button>
                        <button className="reject-btn">Reject</button>
                        <button className="view-btn">Review Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-table-section">
              <h3>System Users</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(user => (
                    <tr key={user.id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td><span className={`badge ${user.role === 'Organiser' ? 'info' : 'default'}`}>{user.role}</span></td>
                      <td>{user.joined}</td>
                      <td className="action-cells">
                        <button className="view-btn">Edit Role</button>
                        <button className="reject-btn">Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === 'payouts' || activeTab === 'reports') && (
            <div className="placeholder-pane">
              <h3>Module Under Construction</h3>
              <p>The {activeTab} module is coming in the next update.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
