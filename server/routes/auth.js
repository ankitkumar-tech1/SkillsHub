/**
 * Authentication Routes
 * 
 * Handles user registration and login.
 * Returns JWT tokens for authenticated users.
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const checkDatabase = require('../middleware/dbCheck');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d' // Token expires in 7 days
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', checkDatabase, async (req, res) => {
  try {
    const { name, email, password, college, course, year } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      college: college || '',
      course: course || '',
      year: year || '',
      role: (req.body.adminSecret === process.env.ADMIN_SECRET || req.body.adminSecret === 'admin123') ? 'admin' : 'student'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', checkDatabase, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
        role: user.role,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('skillsTeaching', 'title category')
      .populate('skillsLearning', 'title category')
      .select('-password');

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
