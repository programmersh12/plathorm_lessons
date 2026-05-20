const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const ensureGoogleOAuthConfigured = (req, res, next) => {
  if (!passport.isGoogleOAuthConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured on this server',
    });
  }
  return next();
};

router.get('/google', 
  ensureGoogleOAuthConfigured,
  (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })(req, res, next);
  }
);

router.get('/google/callback', 
  ensureGoogleOAuthConfigured,
  (req, res, next) => {
    passport.authenticate('google', { 
      failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_auth_failed`
    }, (err, data) => {
      if (err) {
        const errorMessage = encodeURIComponent(err.message || 'Authentication failed');
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=${errorMessage}`);
      }

      if (!data || !data.token) {
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=invalid_response`);
      }

      const { user, token } = data;
      
      res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/google/callback?token=${token}&userId=${user._id}`
      );
    })(req, res, next);
  }
);

module.exports = router;