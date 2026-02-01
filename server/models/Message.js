/**
 * Message Model
 * 
 * Defines the schema for chat messages between students.
 * Stores conversation data for skill exchanges.
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Conversation participants
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Message content
  content: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  // Related skill (if message is about a specific skill)
  relatedSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    default: null
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  
  // Message timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
