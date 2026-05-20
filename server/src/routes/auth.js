const express = require('express');
const { body, validationResult } = require('express-validator');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword, 
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, passwordResetLimiter } = require('../utils/rateLimiter');

const router = express.Router();

// @desc    Регистрация пользователя
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authLimiter, [
  body('firstName', 'First name is required').notEmpty().trim().isLength({ min: 2, max: 30 }),
  body('lastName', 'Last name is required').notEmpty().trim().isLength({ min: 2, max: 30 }),
  body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Role must be student, teacher, or admin')
], (req, res, next) => {
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
}, register);

// @desc    Вход пользователя
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authLimiter, [
  body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').notEmpty()
], (req, res, next) => {
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
}, login);

// @desc    Получение профиля текущего пользователя
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, getProfile);

// @desc    Обновление профиля пользователя
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().trim().isLength({ min: 2, max: 30 }).withMessage('First name must be between 2 and 30 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 30 }).withMessage('Last name must be between 2 and 30 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth'),
  body('profilePicture').optional().isURL().withMessage('Please provide a valid URL for profile picture')
], (req, res, next) => {
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
}, updateProfile);

// @desc    Изменение пароля
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, [
  body('currentPassword', 'Current password is required').notEmpty(),
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], (req, res, next) => {
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
}, changePassword);

// @desc    Запрос на восстановление пароля
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', passwordResetLimiter, [
  body('email', 'Please provide a valid email').isEmail().normalizeEmail()
], (req, res, next) => {
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
}, forgotPassword);

// @desc    Сброс пароля
// @route   PATCH /api/auth/reset-password/:token
// @access  Public
router.patch('/reset-password/:token', passwordResetLimiter, [
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], (req, res, next) => {
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
}, resetPassword);

// @desc    Выход пользователя
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, logout);

module.exports = router;