const jwt = require('jsonwebtoken');

/**
 * Генерирует JWT токен
 * @param {String} id - ID пользователя
 * @param {String} secret - JWT секрет
 * @param {String} expiresIn - Время истечения
 * @returns {String} JWT токен
 */
const generateToken = (id, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRE || '30d') => {
  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

/**
 * Проверяет JWT токен
 * @param {String} token - JWT токен
 * @param {String} secret - JWT секрет
 * @returns {Object} Декодированный токен
 */
const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};

/**
 * Декодирует JWT токен (без проверки)
 * @param {String} token - JWT токен
 * @returns {Object} Декодированный токен
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Генерирует refresh токен
 * @param {String} id - ID пользователя
 * @returns {String} Refresh токен
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Получает токен из заголовка запроса
 * @param {Object} req - Объект запроса Express
 * @returns {String|null} Токен или null
 */
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  getTokenFromHeader,
};