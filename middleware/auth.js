const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Protect routes
// @access  Private
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and attach to request object
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

// @desc    Grant access to specific roles
// @access  Private
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

// @desc    Check if user is the resource owner
// @access  Private
exports.resourceOwner = (resourceField = 'user') => {
  return (req, res, next) => {
    // For routes like /api/posts/:id where we need to check ownership
    // req.params.id would be the resource ID
    // resourceField would typically be 'user' or 'userId'
    
    // This middleware assumes the resource has a field that references the user
    // It should be used after the resource is fetched and attached to req
    if (!req.resource || req.resource[resourceField].toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }
    
    next();
  };
};

// @desc    Check if user has permission to access a resource
// @access  Private
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    // This is a simplified version - in a real app you might have more complex permission logic
    // For example, checking if user is admin, resource owner, or has specific permissions
    
    // Admins can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Teachers can access their own courses
    if (permission === 'own-course' && req.resource && req.resource.instructorId.toString() === req.user.id) {
      return next();
    }
    
    // Students can access enrolled courses
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