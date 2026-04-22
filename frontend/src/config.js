// Frontend Configuration
// Centralized management for API URLs and other environment-specific variables

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Log a warning if the base URL is pointing to localhost in a production build
if (import.meta.env.PROD && API_BASE_URL.includes('localhost')) {
  console.warn('WARNING: Frontend is running in production mode but API_BASE_URL is pointing to localhost. API calls will likely fail.');
}


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
