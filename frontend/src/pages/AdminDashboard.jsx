import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ORGANISER' ? 'USER' : 'ORGANISER';
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!response.ok) throw new Error('Failed to update role');
      alert(`Role updated successfully to ${newRole}!`);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const pendingEvents = [
    { id: 101, title: 'Puneeth Rajkumar Tribute', organiser: 'Sandalwood Events', date: '5th Jan 2027', status: 'Pending' },
    { id: 102, title: 'Startup Founders Meet', organiser: 'TechHub', date: '12th Jan 2027', status: 'Pending' }
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
                        <button className="approve-btn" onClick={() => alert(`Approved ${evt.title}`)}>Approve</button>
                        <button className="reject-btn" onClick={() => alert(`Rejected ${evt.title}`)}>Reject</button>
                        <button className="view-btn" onClick={() => alert(`Reviewing details for ${evt.title}`)}>Review Details</button>
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
              {loadingUsers ? (
                <div className="loading-spinner"></div>
              ) : (
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
                    {users.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.name}</strong></td>
                        <td>{user.email}</td>
                        <td><span className={`badge ${user.role === 'ORGANISER' ? 'info' : (user.role === 'ADMIN' ? 'danger' : 'default')}`}>{user.role}</span></td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="action-cells">
                          {user.role !== 'ADMIN' && (
                            <button 
                              className="view-btn" 
                              onClick={() => handleUpdateRole(user.id, user.role)}
                            >
                              {user.role === 'ORGANISER' ? 'Revert to User' : 'Grant Organiser'}
                            </button>
                          )}
                          <button className="reject-btn" onClick={() => alert(`Suspending user ${user.name}... (Admin action)`)}>Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
