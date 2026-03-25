const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, account is deactivated',
        });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token',
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please log in again',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Roles allowed: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

exports.resourceOwner = (resourceField = 'user') => {
  return (req, res, next) => {
    if (!req.resource || req.resource[resourceField].toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }
    
    next();
  };
};

exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }
    
    if (permission === 'own-course' && req.resource && req.resource.instructorId.toString() === req.user.id) {
      return next();
    }
    
    if (permission === 'enrolled-course' && req.resource && req.resource.studentsEnrolled) {
      const isEnrolled = req.resource.studentsEnrolled.some(student => 
        student.userId.toString() === req.user.id
      );
      if (isEnrolled) {
        return next();
      }
    }
    
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  };
};