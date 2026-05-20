const rateLimit = require('express-rate-limit');

// Ограничение запросов до 100 за 15 минут для общих API эндпоинтов
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Ограничение: 100 запросов с одного IP за период
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Возвращать информацию об ограничении в заголовках
  legacyHeaders: false, // Отключить заголовки X-RateLimit
});

// Более строгое ограничение для эндпоинтов аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Ограничение: 5 запросов с одного IP для авторизации
  message: {
    status: 'fail',
    message: 'Too many login attempts from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Ограничение для запросов сброса пароля
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Ограничение: 3 запроса сброса пароля с одного IP
  message: {
    status: 'fail',
    message: 'Too many password reset attempts from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
};