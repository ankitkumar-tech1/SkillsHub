const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ✅ FIXED CORS CONFIG (IMPORTANT) */
app.use(
  cors({
    origin: [
      'https://skills-hub-app.vercel.app',
      'https://skills-amg556bzu-ankitkumar2431967-1032s-projects.vercel.app',
      'https://skills-hub-git-main-ankitkumar2431967-1032s-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

// Test route
app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
