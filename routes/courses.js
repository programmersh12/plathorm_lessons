const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  getMyCourses,
  getCoursesByInstructor,
  updateCourseProgress,
  getCourseAnalytics
} = require('../controllers/courseController');

const router = express.Router({ mergeParams: true });

// Include other resource routers
const lessonRouter = require('./lessons');
const reviewRouter = require('./reviews');

// Re-route into other resource routers
router.use('/:courseId/lessons', lessonRouter);
router.use('/:courseId/reviews', reviewRouter);

// All routes that don't require a specific course ID
router.route('/')
  .get(getCourses)
  .post(
    protect,
    authorize('teacher', 'admin'),
    [
      body('title', 'Title is required').notEmpty(),
      body('description', 'Description is required').notEmpty(),
      body('category', 'Category is required').notEmpty(),
      body('level', 'Level is required').isIn(['beginner', 'intermediate', 'advanced'])
    ],
    (req, res, next) => {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: errors.array()
        });
      }
      next();
    },
    addCourse
  );

// Routes that operate on a specific course
router.route('/:id')
  .get(getCourse)
  .put(
    protect,
    [
      body('title').optional().notEmpty(),
      body('description').optional().notEmpty(),
      body('category').optional().notEmpty(),
      body('level').optional().isIn(['beginner', 'intermediate', 'advanced'])
    ],
    (req, res, next) => {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: errors.array()
        });
      }
      next();
    },
    updateCourse
  )
  .delete(protect, deleteCourse);

// Enrollment routes
router.route('/:id/enroll')
  .post(protect, enrollInCourse);

router.route('/:id/unenroll')
  .delete(protect, unenrollFromCourse);

// My courses route
router.route('/my-courses')
  .get(protect, getMyCourses);

// Instructor courses route
router.route('/instructor/:instructorId')
  .get(getCoursesByInstructor);

// Progress route
router.route('/:id/progress')
  .put(protect, updateCourseProgress);

// Analytics route
router.route('/:id/analytics')
  .get(protect, getCourseAnalytics);

module.exports = router;