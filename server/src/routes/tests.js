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

// @desc    Начать новую попытку теста
// @route   POST /api/tests/start/:quizId
// @access  Private
// @access  Private (Students only)
router.post('/start/:quizId', protect, startTest);

// @desc    Получить детали теста (для продолжения)
// @route   GET /api/tests/:id
// @access  Private
// @access  Private
router.get('/:id', protect, getTest);

// @desc    Ответить на вопрос
// @route   POST /api/tests/:id/answer
// @access  Private
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

// @desc    Завершить тест и рассчитать итоговый балл
// @route   POST /api/tests/:id/complete
// @access  Private
// @access  Private
router.post('/:id/complete', protect, completeTest);

// @desc    Получить результаты теста с проверкой
// @route   GET /api/tests/:id/results
// @access  Private
// @access  Private
router.get('/:id/results', protect, getTestResults);

// @desc    Получить историю тестов студента для теста
// @route   GET /api/tests/history/:quizId
// @access  Private
// @access  Private
router.get('/history/:quizId', protect, getTestHistory);

// @desc    Получить все тесты студента
// @route   GET /api/tests/my-tests
// @access  Private
// @access  Private
router.get('/my-tests', protect, getMyTests);

// @desc    Получить все попытки теста для теста (вид инструктора/админа)
// @route   GET /api/tests/quiz/:quizId/attempts
// @access  Private (Instructor/Admin)
// @access  Private (Course instructor or admin)
router.get('/quiz/:quizId/attempts', protect, getQuizAttempts);

// @desc    Удалить попытку теста (только админ или студент может удалить свою незавершённую попытку)
// @route   DELETE /api/tests/:id
// @access  Private
// @access  Private
router.delete('/:id', protect, deleteTest);

module.exports = router;
