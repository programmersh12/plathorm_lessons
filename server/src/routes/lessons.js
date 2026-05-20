const express = require('express');
const { body, validationResult } = require('express-validator');

const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// @desc    Получить все уроки для курса
// @route   GET /api/courses/:courseId/lessons
// @access  Public
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

    // Get lessons for the course
    const lessons = await Lesson.find({ courseId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course or lesson not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lessons'
    });
  }
});

// @desc    Получить один урок
// @route   GET /api/courses/:courseId/lessons/:id
// @access  Public
// @access  Private (Enrolled students, course instructor, or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const { courseId, id: lessonId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is enrolled, instructor, or admin
    const isEnrolled = course.studentsEnrolled.some(student => 
      student.userId.toString() === req.user.id
    );
    const isOwner = course.instructorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Allow access to preview lessons even if not enrolled
    if (lesson.isPreview) {
      return res.status(200).json({
        success: true,
        data: lesson
      });
    }

    if (!isEnrolled && !isOwner && !isAdmin && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be enrolled in the course or be the instructor/admin.'
      });
    }

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course or lesson not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lesson'
    });
  }
});

// @desc    Создать новый урок
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Instructor/Admin)
// @access  Private (Course instructor or admin only)
router.post('/', protect, authorize('teacher', 'admin'), [
  body('title', 'Title is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('order', 'Order is required').isNumeric(),
  body('type', 'Valid lesson type is required').isIn(['video', 'text', 'quiz', 'assignment']),
  body('content', 'Content is required').notEmpty()
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
        message: 'Access denied. You can only add lessons to your own courses.'
      });
    }

    // Add course ID to the request body
    req.body.courseId = courseId;

    const lesson = await Lesson.create(req.body);

    // Add lesson to course curriculum
    course.curriculum = course.curriculum || [];
    let section = course.curriculum.find(s => s.sectionTitle === 'Section 1');
    if (!section) {
      section = {
        sectionTitle: 'Section 1',
        lessons: []
      };
      course.curriculum.push(section);
    }
    section.lessons.push(lesson._id);
    
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating lesson'
    });
  }
});

// @desc    Обновить урок
// @route   PUT /api/courses/:courseId/lessons/:id
// @access  Private (Instructor/Admin)
// @access  Private (Course instructor or admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { courseId, id: lessonId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update lessons in your own courses.'
      });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course or lesson not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating lesson'
    });
  }
});

// @desc    Удалить урок
// @route   DELETE /api/courses/:courseId/lessons/:id
// @access  Private (Instructor/Admin)
// @access  Private (Course instructor or admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const { courseId, id: lessonId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete lessons from your own courses.'
      });
    }

    await lesson.remove();

    // Remove lesson from course curriculum
    course.curriculum.forEach(section => {
      section.lessons = section.lessons.filter(lessonId => 
        lessonId.toString() !== lessonId
      );
    });
    
    // Remove empty sections
    course.curriculum = course.curriculum.filter(section => section.lessons.length > 0);
    
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course or lesson not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting lesson'
    });
  }
});

module.exports = router;