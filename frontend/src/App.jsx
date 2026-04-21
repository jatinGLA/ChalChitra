// ============================================
// MAIN APPLICATION COMPONENT
// ============================================
// Root component that handles routing and layout
// Displays navigation bar, page content, and footer

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Page Components
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import SeatSelection from './pages/SeatSelection'
import OrganiserDashboard from './pages/OrganiserDashboard'
import CreateEvent from './pages/CreateEvent'
import AdminDashboard from './pages/AdminDashboard'
import Auth from './pages/Auth'
import BookingSuccess from './pages/BookingSuccess'
import HostEvent from './pages/HostEvent'
import UserDashboard from './pages/UserDashboard'
import ResaleMarket from './pages/ResaleMarket'

// ============================================
// APP LAYOUT & ROUTING
// ============================================
// Main application wrapper with navigation and footer
// All pages are rendered through React Router Routes

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      {/* ============================================
          ROUTE DEFINITIONS
          ============================================ */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/login" element={<Auth />} />
        
        {/* User Routes */}
        <Route path="/book/:id" element={<SeatSelection />} />
        <Route path="/success" element={<BookingSuccess />} />
        <Route path="/my-tickets" element={<UserDashboard />} />
        <Route path="/resale-market" element={<ResaleMarket />} />
        
        {/* Organiser Routes */}
        <Route path="/organiser" element={<OrganiserDashboard />} />
        <Route path="/organiser/create" element={<CreateEvent />} />
        <Route path="/host" element={<HostEvent />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      
      <Footer />
    </div>
  )
}

export default App
