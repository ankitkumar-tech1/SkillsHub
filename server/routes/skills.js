/**
 * Skills Routes
 * 
 * Handles CRUD operations for skills.
 * Students can create, read, update, delete, and search skills.
 */

const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

// @route   GET /api/skills/admin/all
// @desc    Get all skills (Admin only)
// @access  Private (Admin)
router.get('/admin/all', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const skills = await Skill.find({})
      .populate('postedBy', 'name email college course year bio')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill post
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, category, type, level, availability } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category'
      });
    }

    // Create skill
    const skill = new Skill({
      postedBy: req.user._id,
      title,
      description,
      category,
      type: type || 'teaching',
      level: level || 'Beginner',
      availability: availability || 'Flexible'
    });

    await skill.save();

    // Add to user's skills array
    if (type === 'teaching') {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { skillsTeaching: skill._id }
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { skillsLearning: skill._id }
      });
    }

    // Populate user info
    await skill.populate('postedBy', 'name email college course');

    res.status(201).json({
      success: true,
      message: 'Skill posted successfully',
      skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/skills
// @desc    Get all skills (with optional search)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, type } = req.query;

    // Build query
    let query = { status: 'active' };

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skills = await Skill.find(query)
      .populate('postedBy', 'name email college course year bio')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/skills/:id
// @desc    Get a single skill by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('postedBy', 'name email college course year bio');

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private (only owner)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user owns this skill
    if (skill.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this skill'
      });
    }

    // Update skill
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email college course');

    res.json({
      success: true,
      message: 'Skill updated successfully',
      skill: updatedSkill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private (only owner)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user owns this skill or is admin
    if (skill.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this skill'
      });
    }

    // Remove from user's skills array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        skillsTeaching: skill._id,
        skillsLearning: skill._id
      }
    });

    await skill.deleteOne();

    res.json({
      success: true,
      message: 'Skill deleted successfully'
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
