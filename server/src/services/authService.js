const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

// Сервис аутентификации пользователей
class AuthService {
  // Регистрация нового пользователя
  async register(userData) {
    const { firstName, lastName, email, password, role = 'student' } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await user.save();

    const token = generateToken(user._id);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  // Аутентификация пользователя
  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    user.lastLoginAt = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  // Получение профиля пользователя
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  // Обновление профиля пользователя
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

  // Изменение пароля пользователя
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return true;
  }

  // Запрос на восстановление пароля
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('There is no user with that email address');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    return resetToken;
  }

  // Сброс пароля по токену
  async resetPassword(token, newPassword) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return true;
  }

  // Удаление чувствительных данных из объекта пользователя
  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.passwordResetToken;
    delete userObj.passwordResetExpires;
    return userObj;
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

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