/**
 * Skills Marketplace - Backend Server
 * 
 * This is the main server file that starts our Express application.
 * It sets up middleware, connects to MongoDB, and defines API routes.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
// CORS allows our React frontend to communicate with this backend
app.use(cors());
// Parse JSON data from requests
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// We'll store the connection string in a .env file for security
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MongoDB is running (local) or connection string is correct (Atlas)');
    console.error('   2. MONGO_URI in .env file is correct');
    console.error('   3. Network/firewall settings allow connection');
    process.exit(1); // Exit if MongoDB connection fails
  });

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Skills Marketplace API!',
    status: 'Server is running successfully'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

// Server Port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Access it at: http://localhost:${PORT}`);
});
