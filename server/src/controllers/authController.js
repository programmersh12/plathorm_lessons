const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const { token, user } = await authService.register({
      firstName,
      lastName,
      email,
      password,
      role: role || 'student',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message.includes('User already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// Обработка входа пользователя в систему
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const { token, user } = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// Получение профиля текущего пользователя
exports.getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
    });
  }
};

// Обновление профиля пользователя
exports.updateProfile = async (req, res) => {
  try {
    const updateData = {};
    const allowedFields = ['firstName', 'lastName', 'email', 'bio', 'dateOfBirth', 'profilePicture'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await authService.updateProfile(req.user.id, updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
    });
  }
};

// Изменение пароля пользователя
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const success = await authService.changePassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    if (error.message === 'User not found' || error.message === 'Current password is incorrect') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while changing password',
    });
  }
};

// Выход пользователя из системы
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const resetToken = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: 'Password reset token sent',
      resetToken,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error.message === 'There is no user with that email address') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while processing password reset request',
    });
  }
};

// Сброс пароля пользователя
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const success = await authService.resetPassword(token, newPassword);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.message === 'Token is invalid or has expired') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while resetting password',
    });
  }
};