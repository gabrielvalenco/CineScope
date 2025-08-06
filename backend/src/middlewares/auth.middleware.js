const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Adds user object to request if token is valid
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is required' });
    }

    // Extract token from header (Bearer token format)
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find user by id from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user object to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

module.exports = authMiddleware;
