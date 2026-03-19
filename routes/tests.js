const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');

const {
  startTest,
  getTest,
  submitAnswer,
  completeTest,
  getTestResults,
  getTestHistory,
  getMyTests,
  getQuizAttempts,
  deleteTest
} = require('../controllers/testController');

const router = express.Router();

// @desc    Start a new test attempt
// @route   POST /api/tests/start/:quizId
// @access  Private (Students only)
router.post('/start/:quizId', protect, startTest);

// @desc    Get test details (for continuing a test)
// @route   GET /api/tests/:id
// @access  Private
router.get('/:id', protect, getTest);

// @desc    Submit answer for a question
// @route   POST /api/tests/:id/answer
// @access  Private
router.post('/:id/answer', protect, [
  body('questionId', 'Question ID is required').notEmpty(),
  body('userAnswer', 'User answer is required').exists()
], (req, res, next) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
}, submitAnswer);

// @desc    Complete test and calculate final score
// @route   POST /api/tests/:id/complete
// @access  Private
router.post('/:id/complete', protect, completeTest);

// @desc    Get test results with review
// @route   GET /api/tests/:id/results
// @access  Private
router.get('/:id/results', protect, getTestResults);

// @desc    Get student's test history for a quiz
// @route   GET /api/tests/history/:quizId
// @access  Private
router.get('/history/:quizId', protect, getTestHistory);

// @desc    Get all tests for a student
// @route   GET /api/tests/my-tests
// @access  Private
router.get('/my-tests', protect, getMyTests);

// @desc    Get all test attempts for a quiz (instructor/admin view)
// @route   GET /api/tests/quiz/:quizId/attempts
// @access  Private (Course instructor or admin)
router.get('/quiz/:quizId/attempts', protect, getQuizAttempts);

// @desc    Delete test attempt (admin only or student can delete their own in-progress test)
// @route   DELETE /api/tests/:id
// @access  Private
router.delete('/:id', protect, deleteTest);

module.exports = router;
