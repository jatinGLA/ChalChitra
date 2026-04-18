import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/book/:id" element={<SeatSelection />} />
        <Route path="/organiser" element={<OrganiserDashboard />} />
        <Route path="/organiser/create" element={<CreateEvent />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/success" element={<BookingSuccess />} />
        <Route path="/host" element={<HostEvent />} />
        <Route path="/my-tickets" element={<UserDashboard />} />
        <Route path="/resale-market" element={<ResaleMarket />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
