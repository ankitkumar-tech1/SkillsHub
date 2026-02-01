/**
 * Database Connection Check Middleware
 * 
 * Ensures MongoDB is connected before processing requests.
 */

const mongoose = require('mongoose');

const checkDatabase = (req, res, next) => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Please check your MongoDB connection.',
      error: 'Database connection unavailable'
    });
  }
  next();
};

module.exports = checkDatabase;
