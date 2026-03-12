# Online Learning Platform Architecture

## Overview
This document describes the architecture for an online learning platform built with React frontend, Node.js/Express backend, and MongoDB database with JWT authentication.

## Database Models

### 1. User Model
The User model represents different types of users in the system: students, teachers, and administrators.

```javascript
{
  _id: ObjectId,
  email: String, // unique
  password: String, // hashed
  firstName: String,
  lastName: String,
  role: String, // 'student', 'teacher', 'admin'
  profilePicture: String, // URL to image
  dateOfBirth: Date,
  bio: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  lastLoginAt: Date
}
```

### 2. Course Model
The Course model represents educational courses offered on the platform.

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  instructorId: ObjectId, // Reference to User (teacher)
  thumbnail: String, // URL to course image
  price: Number,
  duration: Number, // in hours
  level: String, // 'beginner', 'intermediate', 'advanced'
  requirements: [String],
  objectives: [String],
  curriculum: [{
    sectionTitle: String,
    lessons: [ObjectId] // References to Lesson documents
  }],
  studentsEnrolled: [{
    userId: ObjectId, // Reference to User (student)
    enrollmentDate: Date,
    progress: Number, // percentage
    completedAt: Date
  }],
  rating: {
    average: Number,
    count: Number
  },
  reviews: [{
    userId: ObjectId, // Reference to User (student)
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Lesson Model
The Lesson model represents individual lessons within a course.

```javascript
{
  _id: ObjectId,
  courseId: ObjectId, // Reference to Course
  title: String,
  description: String,
  order: Number, // position in the course
  type: String, // 'video', 'text', 'quiz', 'assignment'
  content: String, // HTML content or video URL
  duration: Number, // estimated duration in minutes
  isPreview: Boolean, // if lesson is available without enrollment
  resources: [{
    name: String,
    url: String,
    type: String // 'pdf', 'doc', 'zip', etc.
  }],
  quizId: ObjectId, // Optional reference to Quiz if lesson includes a quiz
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Quiz Model
The Quiz model represents quizzes associated with lessons or courses.

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  courseId: ObjectId, // Reference to Course
  lessonId: ObjectId, // Optional reference to Lesson
  questions: [ObjectId], // References to Question documents
  timeLimit: Number, // in minutes
  maxAttempts: Number,
  passingScore: Number, // percentage required to pass
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Question Model
The Question model represents individual questions in quizzes.

```javascript
{
  _id: ObjectId,
  quizId: ObjectId, // Reference to Quiz
  questionText: String,
  type: String, // 'multiple-choice', 'single-choice', 'true-false', 'essay'
  options: [{ // for multiple choice questions
    optionText: String,
    isCorrect: Boolean
  }],
  correctAnswer: String, // for essay questions or alternative storage
  explanation: String, // explanation of the correct answer
  points: Number,
  order: Number, // position in the quiz
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Result Model
The Result model stores quiz/test results for users.

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User (student)
  quizId: ObjectId, // Reference to Quiz
  courseId: ObjectId, // Reference to Course
  score: Number, // percentage
  totalPoints: Number,
  earnedPoints: Number,
  answers: [{
    questionId: ObjectId, // Reference to Question
    selectedOption: String, // for multiple choice
    answerText: String, // for essay questions
    isCorrect: Boolean,
    pointsAwarded: Number
  }],
  startedAt: Date,
  completedAt: Date,
  attemptNumber: Number,
  passed: Boolean,
  createdAt: Date
}
```

### 7. Certificate Model
The Certificate model represents certificates issued to students upon course completion.

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User (student)
  courseId: ObjectId, // Reference to Course
  courseTitle: String,
  instructorName: String,
  issueDate: Date,
  certificateUrl: String, // URL to the certificate file
  verificationCode: String, // unique code to verify certificate authenticity
  isVerified: Boolean,
  createdAt: Date
}
```

## Relationships Between Models

### One-to-Many Relationships:
- User (instructor) -> Course (one instructor can create many courses)
- Course -> Lesson (one course contains many lessons)
- Course -> Quiz (one course can have many quizzes)
- Quiz -> Question (one quiz contains many questions)
- User (student) -> Result (one student can have many results)
- User (student) -> Certificate (one student can earn many certificates)

### Many-to-Many Relationships:
- User (student) <-> Course (many students can enroll in many courses)
- Course -> User (student) through the studentsEnrolled array

### Embedded Documents:
- Course.studentsEnrolled embeds user references with enrollment data
- Course.reviews embeds user reviews
- Course.curriculum embeds lesson organization
- Lesson.resources embeds resource files
- Result.answers embeds user responses

## REST API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- POST /api/auth/refresh - Refresh JWT token
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update user profile

### Users
- GET /api/users - Get all users (admin only)
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user (admin only)
- GET /api/users/:id/courses - Get courses of a specific user

### Courses
- GET /api/courses - Get all courses
- GET /api/courses/:id - Get course by ID
- POST /api/courses - Create new course (teacher/admin only)
- PUT /api/courses/:id - Update course (owner/admin only)
- DELETE /api/courses/:id - Delete course (owner/admin only)
- POST /api/courses/:id/enroll - Enroll in course
- DELETE /api/courses/:id/unenroll - Unenroll from course
- GET /api/courses/:id/students - Get enrolled students (instructor only)

### Lessons
- GET /api/courses/:courseId/lessons - Get all lessons in a course
- GET /api/lessons/:id - Get lesson by ID
- POST /api/courses/:courseId/lessons - Create new lesson (instructor only)
- PUT /api/lessons/:id - Update lesson (instructor only)
- DELETE /api/lessons/:id - Delete lesson (instructor only)

### Quizzes
- GET /api/quizzes/:id - Get quiz by ID
- GET /api/courses/:courseId/quizzes - Get all quizzes in a course
- POST /api/courses/:courseId/quizzes - Create new quiz (instructor only)
- PUT /api/quizzes/:id - Update quiz (instructor only)
- DELETE /api/quizzes/:id - Delete quiz (instructor only)
- POST /api/quizzes/:id/start - Start quiz
- POST /api/quizzes/:id/submit - Submit quiz answers

### Questions
- GET /api/quizzes/:quizId/questions - Get all questions in a quiz
- GET /api/questions/:id - Get question by ID
- POST /api/quizzes/:quizId/questions - Create new question (instructor only)
- PUT /api/questions/:id - Update question (instructor only)
- DELETE /api/questions/:id - Delete question (instructor only)

### Results
- GET /api/results - Get all results for authenticated user
- GET /api/results/:id - Get specific result
- GET /api/users/:userId/results - Get results for a specific user (admin/instructor)
- GET /api/quizzes/:quizId/results - Get all results for a quiz (instructor only)

### Certificates
- GET /api/certificates - Get all certificates for authenticated user
- GET /api/certificates/:id - Get specific certificate
- GET /api/users/:userId/certificates - Get certificates for a specific user
- POST /api/courses/:courseId/certificates/generate - Generate certificate (after course completion)

## Architectural Decisions

### 1. Role-Based Access Control (RBAC)
- Implemented through the `role` field in the User model
- Different permissions for students, teachers, and admins
- Middleware checks roles before allowing access to protected routes

### 2. Data Embedding vs Referencing Strategy
- Embedded documents used for closely related data that's frequently accessed together
- References used for data that might be accessed independently
- Balances between query efficiency and data duplication

### 3. Progress Tracking
- Course progress stored in the `studentsEnrolled` array within Course documents
- Individual quiz results stored separately in Results collection
- Allows for detailed analytics and reporting

### 4. Content Organization
- Curriculum organized in sections with lessons
- Flexible content types (videos, text, quizzes, assignments)
- Preview functionality for marketing purposes

### 5. Assessment System
- Separate Quiz and Question models for flexibility
- Multiple question types supported
- Detailed result tracking with answer analysis

### 6. Security Considerations
- Passwords stored as bcrypt hashes
- JWT tokens for session management
- Input validation and sanitization
- Rate limiting for API endpoints
- Proper authorization checks on all sensitive operations

### 7. Scalability Features
- Indexes on frequently queried fields
- Pagination for large datasets
- Efficient querying patterns
- Caching strategies for static content