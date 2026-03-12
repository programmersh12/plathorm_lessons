const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} User and token
   */
  async register(userData) {
    const { firstName, lastName, email, password, role = 'student' } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    // Generate token
    const token = generateToken(user._id);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} User and token
   */
  async login(email, password) {
    // Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Get user profile
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update user profile
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateProfile(userId, updateData) {
    const allowedUpdates = ['firstName', 'lastName', 'email', 'bio', 'dateOfBirth', 'profilePicture'];
    const updates = Object.keys(updateData);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      throw new Error('Invalid updates!');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Change user password
   * @param {String} userId - User ID
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @returns {Promise<Boolean>} Success status
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Find user (include password field)
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password (Mongoose pre-save hook will hash the new password)
    user.password = newPassword;
    await user.save();

    return true;
  }

  /**
   * Forgot password - create reset token
   * @param {String} email - User email
   * @returns {Promise<String>} Reset token
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('There is no user with that email address');
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    return resetToken;
  }

  /**
   * Reset password
   * @param {String} token - Reset token
   * @param {String} newPassword - New password
   * @returns {Promise<Boolean>} Success status
   */
  async resetPassword(token, newPassword) {
    // Create hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching reset token and not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    // Set new password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return true;
  }

  /**
   * Sanitize user object (remove sensitive fields)
   * @param {Object} user - User object
   * @returns {Object} Sanitized user object
   */
  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.passwordResetToken;
    delete userObj.passwordResetExpires;
    return userObj;
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @returns {Promise<Object>} Decoded token payload
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  /**
   * Check if password was changed after token was issued
   * @param {String} userId - User ID
   * @param {Number} tokenIssuedTime - Token issued time (timestamp)
   * @returns {Promise<Boolean>} True if password was changed after token was issued
   */
  async passwordChangedAfter(userId, tokenIssuedTime) {
    const user = await User.findById(userId);
    if (!user || !user.passwordChangedAt) {
      return false;
    }

    const passwordChangedTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    return tokenIssuedTime < passwordChangedTime;
  }
}

module.exports = new AuthService();