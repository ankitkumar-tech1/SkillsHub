/**
 * Skill Model
 * 
 * Defines the schema for skills that students can post.
 * Each skill represents something a student can teach or wants to learn.
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  // Who posted this skill
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Skill Details
  title: {
    type: String,
    required: [true, 'Please provide a skill title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    enum: ['Programming', 'Design', 'Languages', 'Music', 'Sports', 'Academics', 'Other'],
    default: 'Other'
  },
  
  // Skill Type: 'teaching' or 'learning'
  type: {
    type: String,
    required: true,
    enum: ['teaching', 'learning'],
    default: 'teaching'
  },
  
  // Skill Level
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  
  // Availability
  availability: {
    type: String,
    trim: true,
    default: 'Flexible'
  },
  
  // Status: active or inactive
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Creation date
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster searches
skillSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Skill', skillSchema);
