const express = require('express');
const { body, validationResult } = require('express-validator');

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// @desc    Get all quizzes for a course
// @route   GET /api/courses/:courseId/quizzes
// @access  Private (Enrolled students, course instructor, or admin)
router.get('/', protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled, instructor, or admin
    const isEnrolled = course.studentsEnrolled.some(student => 
      student.userId.toString() === req.user.id
    );
    const isOwner = course.instructorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isOwner && !isAdmin && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be enrolled in the course or be the instructor/admin.'
      });
    }

    // Get quizzes for the course
    const quizzes = await Quiz.find({ courseId, isActive: true })
      .populate('questions', 'questionText type order points');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quizzes'
    });
  }
});

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private (Enrolled students, course instructor, or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('questions', 'questionText type options order points');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if course exists
    const course = await Course.findById(quiz.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled, instructor, or admin
    const isEnrolled = course.studentsEnrolled.some(student => 
      student.userId.toString() === req.user.id
    );
    const isOwner = course.instructorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isOwner && !isAdmin && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be enrolled in the course or be the instructor/admin.'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz'
    });
  }
});

// @desc    Create new quiz
// @route   POST /api/courses/:courseId/quizzes
// @access  Private (Course instructor or admin only)
router.post('/', protect, authorize('teacher', 'admin'), [
  body('title', 'Title is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('passingScore', 'Passing score must be between 0 and 100').isFloat({ min: 0, max: 100 })
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

    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only add quizzes to your own courses.'
      });
    }

    // Add course ID to the request body
    req.body.courseId = courseId;

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating quiz'
    });
  }
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Course instructor or admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if course exists
    const course = await Course.findById(quiz.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update quizzes in your own courses.'
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: updatedQuiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating quiz'
    });
  }
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Course instructor or admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if course exists
    const course = await Course.findById(quiz.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete quizzes from your own courses.'
      });
    }

    await quiz.remove();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting quiz'
    });
  }
});

module.exports = router;