const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router({ mergeParams: true });

// @desc      Get reviews for a course
// @route     GET /api/courses/:courseId/reviews
// @access    Public
router.get('/', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'firstName lastName profilePicture'
      }
    });

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.courseId}`, 404));
    }

    res.status(200).json({
      success: true,
      count: course.reviews.length,
      data: course.reviews
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Invalid course id`, 404));
    }
    next(error);
  }
});

// @desc      Add review for a course
// @route     POST /api/courses/:courseId/reviews
// @access    Private
router.post(
  '/',
  protect,
  [
    body('rating', 'Rating is required').not().isEmpty(),
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment is required').not().isEmpty()
  ],
  async (req, res, next) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: errors.array()
        });
      }

      const course = await Course.findById(req.params.courseId);

      if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.courseId}`, 404));
      }

      // Check if user is enrolled in the course
      const isEnrolled = course.studentsEnrolled.some(student =>
        student.userId.toString() === req.user.id
      );

      if (!isEnrolled) {
        return next(new ErrorResponse('You must be enrolled in the course to leave a review', 400));
      }

      // Check if user has already reviewed the course
      const hasReviewed = course.reviews.some(review =>
        review.userId.toString() === req.user.id
      );

      if (hasReviewed) {
        return next(new ErrorResponse('You have already reviewed this course', 400));
      }

      // Add review to course
      const review = {
        userId: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment
      };

      course.reviews.push(review);

      // Calculate new average rating
      const ratings = course.reviews.map(r => r.rating);
      course.rating.average = (ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length).toFixed(1);
      course.rating.count = course.reviews.length;

      await course.save();

      res.status(201).json({
        success: true,
        data: review
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return next(new ErrorResponse(`Invalid course id`, 404));
      }
      next(error);
    }
  }
);

module.exports = router;