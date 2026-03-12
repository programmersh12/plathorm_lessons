# Learning Platform Backend

A robust backend API for an online learning platform built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization with JWT
- Role-based access control (Student, Teacher, Admin)
- Course management system
- Lesson content delivery
- Quiz and assessment system
- Certificate generation
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learning-platform-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (Teacher/Admin only)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Test Routes
- `GET /api/test` - Public test route
- `GET /api/test/protected` - Protected test route
- `GET /api/test/stats` - Get platform statistics (Admin only)

## Project Structure

```
├── config/           # Configuration files
│   └── db.js         # Database connection
├── middleware/       # Custom middleware
│   └── auth.js       # Authentication middleware
├── models/           # Mongoose models
│   └── User.js       # User model
├── routes/           # Route definitions
│   ├── auth.js       # Authentication routes
│   ├── users.js      # User routes
│   ├── courses.js    # Course routes
│   └── test.js       # Test routes
├── server.js         # Main server file
├── .env             # Environment variables
└── package.json     # Dependencies and scripts
```

## Environment Variables

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT expiration time
- `CLIENT_URL` - Frontend application URL

## Security Measures

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation and sanitization
- Rate limiting to prevent abuse
- Helmet for security headers
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.