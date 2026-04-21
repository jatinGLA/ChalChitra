# ChalChitra 🎬🎫
**An Event and Movie Booking Platform**

A full-stack web application that enables users to browse, book, and manage event and movie tickets seamlessly. The platform includes real-time seat booking, secure payment processing, and comprehensive event management features.

## 📋 Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Real-time Features](#real-time-features)

## ✨ Features
- **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Event Management** - Create, browse, and manage events and shows
- **Seat Selection** - Interactive seat selection with real-time availability updates
- **Booking System** - Complete booking workflow with booking status tracking
- **Payment Processing** - Integrated Razorpay payment gateway for secure transactions
- **Ticket Generation** - PDF tickets with QR codes for easy verification
- **Resale Market** - Secondary market for ticket reselling
- **Admin Dashboard** - Comprehensive admin panel for event and booking management
- **Real-time Updates** - Socket.io integration for live seat availability and booking updates
- **User Profiles** - User dashboard to manage bookings and tickets

## 📁 Project Structure
```
ChalChitra/
├── backend/                  # Node.js/Express API server
│   ├── server.js            # Express server setup & Socket.io configuration
│   ├── package.json         # Backend dependencies
│   ├── config/
│   │   └── supabaseClient.js    # Supabase database client configuration
│   ├── controllers/         # Business logic for each feature
│   │   ├── authController.js    # User authentication logic
│   │   ├── bookingController.js # Booking management
│   │   ├── eventController.js   # Event CRUD operations
│   │   ├── paymentController.js # Payment processing
│   │   ├── ticketController.js  # Ticket generation & management
│   │   └── ...
│   ├── routes/              # API endpoint definitions
│   ├── middleware/          # Authentication & other middleware
│   └── utils/               # Helper functions (fee calculations, etc.)
└── frontend/                # React + Vite web application
    ├── package.json         # Frontend dependencies
    ├── vite.config.js       # Vite build configuration
    ├── index.html           # HTML entry point
    └── src/
        ├── main.jsx         # React application entry
        ├── App.jsx          # Main App component
        ├── supabase.js      # Supabase client initialization
        ├── components/      # Reusable React components
        │   ├── EventCard.jsx        # Event card display component
        │   ├── Navbar.jsx           # Navigation bar
        │   └── ...
        └── pages/           # Page components for routing
            ├── Home.jsx             # Landing page
            ├── Auth.jsx             # Login/Register page
            ├── EventDetails.jsx     # Event details page
            ├── SeatSelection.jsx    # Interactive seat selection
            ├── AdminDashboard.jsx   # Admin control panel
            └── ...
```

## 🛠️ Tech Stack

**Backend:**
- Node.js with Express.js - REST API server
- Supabase - PostgreSQL database & authentication
- Socket.io - Real-time communication
- JWT - Secure authentication
- bcrypt - Password hashing
- Razorpay - Payment gateway
- PDFKit - PDF ticket generation
- QRCode - QR code generation for tickets

**Frontend:**
- React 18 - UI library
- Vite - Build tool and dev server
- React Router DOM - Client-side routing
- Socket.io Client - Real-time updates
- Supabase Client - Database queries from frontend

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Supabase account and API keys
- Razorpay account for payment processing

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with required environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

   Or start production server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with Supabase configuration:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

   Build for production:
   ```bash
   npm run build
   ```

## 📡 API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Events:**
- `GET /api/events` - Fetch all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event (admin)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

**Bookings:**
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:userId` - Get user bookings
- `GET /api/bookings` - Get all bookings (admin)

**Payments:**
- `POST /api/payments/create` - Create payment order
- `POST /api/payments/verify` - Verify payment

**Tickets:**
- `GET /api/tickets/:bookingId` - Download ticket PDF
- `GET /api/tickets/verify/:qrCode` - Verify ticket QR code

**Requests:**
- `POST /api/requests` - Submit support request
- `GET /api/requests` - Get all requests (admin)

## 🔄 Real-time Features

The application uses **Socket.io** for real-time updates:

- **Seat Locking** - When users select seats, other clients are notified in real-time
- **Live Availability** - Seat availability updates instantly across all connected clients
- **Booking Updates** - Real-time notifications for booking confirmations

## 📝 License
Proprietary - ChalChitra 2026
