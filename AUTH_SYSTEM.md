# JWT Authentication System

This document describes the comprehensive JWT-based authentication system implemented for the online learning platform.

## Features

- User registration with role-based access
- Secure login/logout functionality
- JWT token generation and validation
- Password encryption with bcrypt
- Role-based access control (student, teacher, admin)
- Password reset functionality
- Account activation/deactivation
- Security measures (rate limiting, XSS protection, etc.)

## Architecture

The authentication system consists of several layers:

### 1. Model Layer
- **User Model**: Contains user schema with encrypted password storage, role management, and account status
- Implements password hashing using bcrypt
- Includes methods for password comparison and change detection

### 2. Service Layer
- **AuthService**: Business logic layer that handles all authentication operations
- Provides methods for registration, login, profile management, and password operations
- Implements security features like password reset tokens

### 3. Controller Layer
- **AuthController**: Handles HTTP requests and responses
- Validates input data
- Interacts with the service layer
- Returns appropriate responses

### 4. Middleware Layer
- **Auth Middleware**: Protects routes and enforces role-based access
- Verifies JWT tokens
- Checks user permissions

### 5. Route Layer
- **Auth Routes**: Defines API endpoints for authentication
- Implements rate limiting for security
- Applies input validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `PATCH /api/auth/reset-password/:token` - Reset password with token

### Profile Management
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

## Security Measures

### 1. Password Security
- Passwords are hashed using bcrypt with salt rounds of 12
- Password strength validation (minimum 6 characters)
- Password change history tracking

### 2. JWT Security
- Tokens have configurable expiration (default 30 days)
- Tokens are verified on every protected request
- Support for detecting password changes after token issuance

### 3. Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per 15 minutes

### 4. Input Validation
- All inputs are validated using express-validator
- Sanitization against XSS attacks
- Protection against parameter pollution

### 5. Additional Security Headers
- Helmet.js for setting security headers
- CORS configured for specific origins
- XSS protection enabled

## Role-Based Access Control

The system implements three user roles:

- **Student**: Can enroll in courses, take quizzes, view content
- **Teacher**: Can create and manage courses, lessons, and quizzes
- **Admin**: Full access to all system features and user management

## Usage Examples

### Registration
```javascript
// POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

### Login
```javascript
// POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```javascript
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "profilePicture": null,
    "lastLoginAt": "2023-01-20T14:22:00.000Z"
  }
}
```

### Protected Route Access
```javascript
// GET /api/auth/profile
// Headers: Authorization: Bearer <token>
```

## Environment Variables

The authentication system requires the following environment variables:

```env
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-platform
CLIENT_URL=http://localhost:3000
```

## Error Handling

The system implements comprehensive error handling:

- Validation errors with detailed messages
- Authentication-specific errors
- Database operation errors
- JWT-related errors (expired, invalid, etc.)
- Rate limiting errors

## Testing

To test the authentication system:

1. Register a new user via `POST /api/auth/register`
2. Login with the registered credentials via `POST /api/auth/login`
3. Use the returned JWT token in the Authorization header for protected routes
4. Test role-based access by attempting to access restricted endpoints

## Best Practices Implemented

- Separation of concerns with distinct layers
- Input validation and sanitization
- Proper error handling and logging
- Security best practices (password hashing, rate limiting, etc.)
- Comprehensive documentation
- Follows REST API principles
- JWT best practices (expiration, verification, etc.)