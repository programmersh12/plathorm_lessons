# Course Management System

This document describes the comprehensive course management system implemented for the online learning platform.

## Features

- Course CRUD operations
- Instructor-course relationship
- Student enrollment/unenrollment
- Progress tracking
- Reviews and ratings
- Role-based access control
- Advanced filtering and search
- Course analytics

## Architecture

The course system consists of several layers:

### 1. Model Layer
- **Course Model**: Contains course schema with all necessary fields
- Relations to instructors, students, lessons, and reviews
- Built-in validation and indexing

### 2. Controller Layer
- **CourseController**: Handles all course-related business logic
- Implements all CRUD operations
- Manages enrollment and progress tracking
- Provides analytics functionality

### 3. Route Layer
- **Course Routes**: Defines API endpoints for course management
- Implements role-based access control
- Applies input validation

## API Endpoints

### Course Management
- `GET /api/courses` - Get all courses (with filtering, sorting, pagination)
- `POST /api/courses` - Create a new course (Teacher/Admin only)
- `GET /api/courses/:id` - Get a specific course
- `PUT /api/courses/:id` - Update a course (Owner/Admin only)
- `DELETE /api/courses/:id` - Delete a course (Owner/Admin only)

### Enrollment Management
- `POST /api/courses/:id/enroll` - Enroll in a course (Student only)
- `DELETE /api/courses/:id/unenroll` - Unenroll from a course
- `GET /api/courses/my-courses` - Get user's enrolled courses

### Progress & Analytics
- `PUT /api/courses/:id/progress` - Update course progress (Student only)
- `GET /api/courses/:id/analytics` - Get course analytics (Instructor/Admin only)

### Related Resources
- `GET /api/courses/:courseId/lessons` - Get lessons for a course
- `GET /api/courses/:courseId/reviews` - Get reviews for a course
- `POST /api/courses/:courseId/reviews` - Add a review for a course
- `GET /api/courses/instructor/:instructorId` - Get courses by instructor

## Course Schema

```javascript
{
  title: String,           // Course title
  description: String,     // Course description
  category: String,        // Course category
  instructorId: ObjectId,  // Reference to User (instructor)
  thumbnail: String,       // Course thumbnail URL
  price: Number,           // Course price
  duration: Number,        // Duration in hours
  level: String,           // Difficulty level (beginner, intermediate, advanced)
  requirements: [String],  // Prerequisites
  objectives: [String],    // Learning objectives
  curriculum: [{          // Course curriculum
    sectionTitle: String,
    lessons: [ObjectId]    // References to Lesson documents
  }],
  studentsEnrolled: [{    // Students enrolled in the course
    userId: ObjectId,     // Reference to User
    enrollmentDate: Date,
    progress: Number,     // Percentage complete
    completedAt: Date,
    status: String        // enrolled, completed, dropped
  }],
  rating: {              // Average rating
    average: Number,
    count: Number
  },
  reviews: [{            // Course reviews
    userId: ObjectId,     // Reference to User
    rating: Number,       // Rating (1-5)
    comment: String,
    createdAt: Date
  }],
  isPublished: Boolean   // Whether the course is visible to students
}
```

## Role-Based Access Control

The system implements three user roles with different permissions:

- **Student**: Can browse published courses, enroll/unenroll, track progress, leave reviews
- **Teacher**: Can create/manage own courses, view analytics, manage lessons
- **Admin**: Full access to all courses and functionalities

## Usage Examples

### Creating a Course
```javascript
// POST /api/courses
// Headers: Authorization: Bearer <token> (Teacher/Admin only)
{
  "title": "Introduction to React",
  "description": "Learn the fundamentals of React",
  "category": "Programming",
  "level": "beginner",
  "requirements": ["JavaScript basics"],
  "objectives": ["Build a React app", "Understand components"]
}
```

### Enrolling in a Course
```javascript
// POST /api/courses/:id/enroll
// Headers: Authorization: Bearer <token> (Student only)
```

### Updating Progress
```javascript
// PUT /api/courses/:id/progress
// Headers: Authorization: Bearer <token> (Student only)
{
  "progress": 75
}
```

## Security Measures

- JWT-based authentication
- Role-based authorization
- Input validation and sanitization
- Rate limiting
- Data validation at the model level

## Error Handling

The system implements comprehensive error handling:

- Validation errors with detailed messages
- Authorization errors
- Resource not found errors
- Database operation errors

## Filtering and Search

The GET /api/courses endpoint supports advanced filtering:

- `?category=Programming` - Filter by category
- `?level=beginner` - Filter by difficulty level
- `?instructor=12345` - Filter by instructor
- `?search=React` - Search in title and description
- `?sort=-createdAt` - Sort by creation date (newest first)
- `?page=1&limit=10` - Pagination
- `?fields=title,description,instructorId` - Field selection

## Analytics

Instructors and admins can access detailed course analytics:

- Total enrolled students
- Completion rate
- Average progress
- Student progress tracking
- Review statistics