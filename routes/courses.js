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

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Students only)
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is already enrolled
    const isAlreadyEnrolled = course.studentsEnrolled.some(student =>
      student.userId.toString() === req.user.id
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Only students can enroll in courses
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can enroll in courses'
      });
    }

    // Add student to course
    course.studentsEnrolled.push({
      userId: req.user.id
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in the course',
      data: {
        courseId: course._id,
        title: course.title
      }
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while enrolling in course'
    });
  }
});

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/unenroll
// @access  Private
router.delete('/:id/unenroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Find and remove student from course
    const studentIndex = course.studentsEnrolled.findIndex(student =>
      student.userId.toString() === req.user.id
    );

    if (studentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Allow the user to unenroll (student) or allow instructor/admin to remove students
    if (
      req.user.id !== course.studentsEnrolled[studentIndex].userId.toString() &&
      course.instructorId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to unenroll from this course'
      });
    }

    course.studentsEnrolled.splice(studentIndex, 1);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from the course'
    });
  } catch (error) {
    console.error('Unenroll from course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while unenrolling from course'
    });
  }
});

// @desc    Get user's enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private
router.get('/my-courses', protect, async (req, res) => {
  try {
    // Find courses where the user is enrolled
    const courses = await Course.find({
      'studentsEnrolled.userId': req.user.id
    }).populate('instructorId', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled courses'
    });
  }
});

// @desc    Get courses by instructor
// @route   GET /api/courses/instructor/:instructorId
// @access  Public
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const courses = await Course.find({
      instructorId: req.params.instructorId,
      isPublished: true
    }).populate('instructorId', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching instructor courses'
    });
  }
});

// @desc    Update student progress in a course
// @route   PUT /api/courses/:id/progress
// @access  Private (Student only)
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { progress } = req.body;

    // Validate progress
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100'
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled in the course
    const studentIndex = course.studentsEnrolled.findIndex(student =>
      student.userId.toString() === req.user.id
    );

    if (studentIndex === -1) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Only students can update their own progress
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can update their progress'
      });
    }

    // Store old progress to detect completion
    const oldProgress = course.studentsEnrolled[studentIndex].progress;

    // Update progress
    course.studentsEnrolled[studentIndex].progress = progress;

    // Mark as completed if progress is 100%
    if (progress === 100 && !course.studentsEnrolled[studentIndex].completedAt) {
      course.studentsEnrolled[studentIndex].status = 'completed';
      course.studentsEnrolled[studentIndex].completedAt = Date.now();
      
      // Try to generate certificate automatically when course is completed
      try {
        const Certificate = require('../models/Certificate');
        const certificateService = require('../services/certificateService');
        
        // Check if certificate already exists for this user and course
        const existingCertificate = await Certificate.findOne({
          userId: req.user.id,
          courseId: req.params.id
        });
        
        if (!existingCertificate) {
          // Generate certificate with grade based on progress or other metrics
          let grade;
          if (progress >= 95) grade = 'A+';
          else if (progress >= 90) grade = 'A';
          else if (progress >= 85) grade = 'A-';
          else if (progress >= 80) grade = 'B+';
          else if (progress >= 75) grade = 'B';
          else if (progress >= 70) grade = 'B-';
          else if (progress >= 65) grade = 'C+';
          else if (progress >= 60) grade = 'C';
          else grade = 'F';
          
          // Get user info for certificate
          const User = require('../models/User');
          const user = await User.findById(req.user.id).select('firstName lastName email');
          
          // Generate certificate
          await certificateService.generateCertificateWithGrade(
            req.user.id,
            req.params.id,
            grade,
            progress,
            {
              totalDuration: course.duration || 0,
              totalLessons: course.curriculum.reduce((total, section) => total + section.lessons.length, 0),
              completedLessons: Math.round((progress / 100) * course.curriculum.reduce((total, section) => total + section.lessons.length, 0)),
              completionPercentage: progress
            }
          );
        }
      } catch (certError) {
        // If certificate generation fails, log the error but don't fail the progress update
        console.error('Error generating certificate:', certError);
      }
    } else if (progress < 100) {
      course.studentsEnrolled[studentIndex].status = 'enrolled';
      course.studentsEnrolled[studentIndex].completedAt = null;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        courseId: course._id,
        progress: course.studentsEnrolled[studentIndex].progress,
        status: course.studentsEnrolled[studentIndex].status
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress'
    });
  }
});

module.exports = router;