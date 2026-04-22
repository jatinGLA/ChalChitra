# ChalChitra - Smart Event Ticketing & Resale Marketplace

ChalChitra is a high-performance, full-stack event ticketing platform designed to solve the "scalping" problem through a built-in, secure ticket resale marketplace with a competitive bidding engine.

## 🚀 Tech Stack: Why These Tools?

### Frontend: React.js (Vite)
- **Why**: React was chosen for its component-based architecture, which allows us to reuse UI elements like "Event Cards" and "Seat Grids" across different pages.
- **Benefit**: Vite is used as the build tool because it provides near-instant hot module replacement (HMR), making the development process 10x faster than traditional CRA.

### Backend: Node.js & Express.js
- **Why**: Node.js allows us to use JavaScript on the server side, creating a unified language across the stack. Express.js is a minimalist framework that gives us full control over API routing and middleware.
- **Benefit**: It is non-blocking and event-driven, which is essential for handling multiple concurrent bookings and WebSocket connections.

### Real-Time: Socket.io
- **Why**: Standard HTTP requests (GET/POST) are "one-way." Socket.io enables **bi-directional** communication.
- **Feature (Seat Locking)**: We use Socket.io for **Live Seat Selection**. When a user clicks a seat to book it, the server emits a `seat_locked` event to all other users currently viewing that event. This prevents two people from trying to pay for the same seat at the same time.

### Database: Supabase (PostgreSQL)
- **Why**: Supabase provides the power of PostgreSQL (relational data) with the convenience of a "Backend-as-a-Service." 
- **Benefit**: It handles our User Authentication, Row-Level Security (RLS), and complex queries (like linking tickets to events and owners) with extreme efficiency.

### Payments: Razorpay
- **Why**: Razorpay is India's leading payment gateway, offering a seamless checkout experience with support for UPI, Cards, and Netbanking.
- **Benefit**: Its robust Webhook system ensures that tickets are only generated after the payment is successfully verified.

### Documentation & Assets: PDFKit & QRCode
- **Why**: To provide a professional user experience, we use `PDFKit` to generate valid E-Tickets on-the-fly. 
- **Benefit**: Each ticket includes a unique `QRCode` generated from the booking ID, allowing event organizers to scan and verify entries at the venue.

## 🌟 Key Features

### 1. Advanced Booking System
- **Real-Time Seat Locking**: Powered by Socket.io to ensure no double-bookings.
- **E-Ticket Generation**: Instant PDF downloads with unique QR codes for verification.

### 2. Ticket Resale Marketplace (Unique Selling Point)
- **Bidding Engine**: Solves the "sold-out" problem by letting users bid on tickets from others who can't attend.
- **Smart Fee Calculator**: Automatically calculates a 3% platform fee (split between the host and the platform) to ensure transparency.
- **Instant Ownership Transfer**: Securely transfers ticket ownership within the database after a bid is accepted.

### 3. Role-Based Dashboards
- **User Dashboard (My Vault)**: Manage tickets, list them for resale, or download PDFs.
- **Organiser Dashboard**: Host new events, manage ticket inventory, and track sales.

## 🛠️ Infrastructure
- **Frontend Hosting**: **Vercel** (Global Edge Network for fast loading).
- **Backend Hosting**: **Render** (Auto-scaling cloud instances).
- **Database**: **Supabase Cloud** (Managed PostgreSQL).

---
**Developed with ❤️ for the next generation of event experiences.**
