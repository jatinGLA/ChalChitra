// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
// This file contains middleware functions for protecting routes
// and verifying user authentication via JWT tokens

import jwt from 'jsonwebtoken';

// ============================================
// PROTECT MIDDLEWARE
// ============================================
// Verifies JWT token from request headers
// Extracts user information and attaches to request object
// Required for all protected routes
//
// Usage: router.get('/protected-route', protect, controllerFunction)

export const protect = (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token format)
    const token = req.headers.authorization?.split(' ')[1];
    
    // If no token provided, deny access
    if (!token) return res.status(401).json({ message: 'Not authorized, no token provided' });
    
    // Verify and decode JWT token using JWT_SECRET from environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user information to request object for use in controllers
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ============================================
// REQUIRE ROLE MIDDLEWARE
// ============================================
// Restricts access to users with specific roles
// Used for role-based access control (RBAC)
//
// Usage: router.delete('/admin-action', protect, requireRole('admin'), controllerFunction)

export const requireRole = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has one of the required roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: Insufficient privileges' });
    }
    next();
  };
};
