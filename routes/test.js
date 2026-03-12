const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @desc    Test route
// @route   GET /api/test
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test route is working!',
    timestamp: new Date().toISOString()
  });
});

// @desc    Test route with authentication
// @route   GET /api/test/protected
// @access  Private
router.get('/protected', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected test route is working!',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// @desc    Get user count
// @route   GET /api/test/stats
// @access  Private (Admin only)
router.get('/stats', protect, async (req, res) => {
  try {
    // Only allow admin access
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const userCount = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;