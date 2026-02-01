/**
 * Authentication Middleware
 * 
 * Protects routes by verifying JWT tokens.
 * Adds user information to request object if token is valid.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Access denied.' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found. Invalid token.' 
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token. Access denied.' 
    });
  }
};

module.exports = authenticate;
