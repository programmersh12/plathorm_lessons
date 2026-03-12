const express = require('express');
const { body, validationResult } = require('express-validator');

const Course = require('../models/Course');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isPublished: true }; // Only return published courses
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = new RegExp(req.query.category, 'i');
    }
    
    // Filter by level if provided
    if (req.query.level) {
      query.level = req.query.level;
    }
    
    // Filter by instructor if provided
    if (req.query.instructor) {
      query.instructorId = req.query.instructor;
    }
    
    // Search in title and description
    if (req.query.search) {
      query.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructorId', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses'
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'firstName lastName profilePicture')
      .populate({
        path: 'curriculum.lessons',
        model: 'Lesson',
        select: 'title order type duration isPreview'
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // If course is not published, only the instructor or admin can access it
    if (!course.isPublished) {
      if (req.user) {
        if (req.user.id !== course.instructorId._id.toString() && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Access denied. Course is not published.'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Course is not published.'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course'
    });
  }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Teacher or Admin only)
router.post('/', protect, authorize('teacher', 'admin'), [
  body('title', 'Title is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('category', 'Category is required').notEmpty(),
  body('level', 'Level is required').isIn(['beginner', 'intermediate', 'advanced'])
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    // Add instructor ID to the request body
    req.body.instructorId = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating course'
    });
  }
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Course owner or Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Only allow instructor or admin to update the course
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own courses.'
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('instructorId', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating course'
    });
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Course owner or Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Only allow instructor or admin to delete the course
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own courses.'
      });
    }

    await course.remove();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting course'
    });
  }
});

module.exports = router;