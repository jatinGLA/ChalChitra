// Frontend Configuration
// Centralized management for API URLs and other environment-specific variables

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API Endpoints Helper
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  EVENTS: `${API_BASE_URL}/api/events`,
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  TICKETS: `${API_BASE_URL}/api/tickets`,
  REQUESTS: `${API_BASE_URL}/api/requests`,
  USERS: `${API_BASE_URL}/api/users`,
};
