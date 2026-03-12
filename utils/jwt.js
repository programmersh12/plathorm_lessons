const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {String} id - User ID
 * @param {String} secret - JWT secret
 * @param {String} expiresIn - Expiration time
 * @returns {String} JWT Token
 */
const generateToken = (id, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRE || '30d') => {
  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT Token
 * @param {String} secret - JWT secret
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};

/**
 * Decode JWT Token (without verification)
 * @param {String} token - JWT Token
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate refresh token
 * @param {String} id - User ID
 * @returns {String} Refresh token
 */
const generateRefreshToken = (id) => {
  // In a real application, refresh tokens would be stored in a secure database
  // and have longer expiration times
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Get token from request header
 * @param {Object} req - Express request object
 * @returns {String|null} Token or null if not found
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