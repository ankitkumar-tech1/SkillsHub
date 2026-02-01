/**
 * Messages Routes
 * 
 * Handles chat/messaging functionality between students.
 */

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authenticate = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { receiver, content, relatedSkill } = req.body;
    
    // Validation
    if (!receiver || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver and message content'
      });
    }
    
    // Create message
    const message = new Message({
      sender: req.user._id,
      receiver,
      content,
      relatedSkill: relatedSkill || null
    });
    
    await message.save();
    
    // Populate sender and receiver info
    await message.populate('sender', 'name email');
    await message.populate('receiver', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get conversation between current user and another user
// @access  Private
router.get('/conversation/:userId', authenticate, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    
    // Get all messages between current user and other user
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('relatedSkill', 'title')
      .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', authenticate, async (req, res) => {
  try {
    // Get distinct users the current user has conversed with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    
    // Populate user info
    const User = require('../models/User');
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const user = await User.findById(conv._id).select('name email college');
        const lastMsg = await Message.findById(conv.lastMessage._id)
          .populate('sender', 'name')
          .populate('receiver', 'name');
        
        return {
          user,
          lastMessage: lastMsg,
          unreadCount: conv.unreadCount
        };
      })
    );
    
    res.json({
      success: true,
      conversations: populatedConversations
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
