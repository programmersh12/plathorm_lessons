require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const isGoogleOAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (isGoogleOAuthConfigured) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 
      `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      
      if (!email) {
        return done(new Error('Google account must have an email address'), null);
      }

      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.findOne({ email });
        
        if (user) {
          if (user.provider === 'google') {
            user.googleId = profile.id;
            user.profilePicture = user.profilePicture || profile.photos?.[0]?.value;
            await user.save();
          } else {
            return done(new Error('Email already registered with local account. Please login with your email and password.'), null);
          }
        } else {
          user = await User.create({
            email,
            firstName: profile.name?.givenName || 'Google',
            lastName: profile.name?.familyName || 'User',
            password: null,
            role: 'student',
            isActive: true,
            profilePicture: profile.photos?.[0]?.value,
            provider: 'google',
            googleId: profile.id
          });
        }
      }

      user.lastLoginAt = new Date();
      await user.save();

      const token = generateToken(user._id);

      return done(null, { user, token });
    } catch (error) {
      console.error('[Google OAuth] Error:', error.message);
      return done(error, null);
    }
  }));
} else {
  console.warn('[OAuth] Google OAuth disabled: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET are not set');
}

passport.serializeUser((user, done) => {
  done(null, user.id || user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.isGoogleOAuthConfigured = isGoogleOAuthConfigured;

module.exports = passport;