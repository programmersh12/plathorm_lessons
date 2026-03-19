# Testing System Architecture

This document describes the comprehensive testing system implemented for the online learning platform.

## Overview

The testing system provides a complete solution for creating, taking, and evaluating tests/quizzes within the learning platform. It supports various question types, automatic grading, and detailed analytics.

## Core Components

### 1. Question Model
The Question model defines individual questions within a quiz.

#### Schema
```javascript
{
  quizId: ObjectId,           // Reference to the parent quiz
  questionText: String,       // The actual question text
  type: String,               // Type: 'multiple-choice', 'single-choice', 'true-false', 'essay'
  options: [{                 // Available options for choice questions
    optionText: String,       // Option text
    isCorrect: Boolean        // Whether this option is correct
  }],
  correctAnswer: Mixed,       // Correct answer (varies by type)
  explanation: String,        // Explanation of the correct answer
  points: Number,             // Points awarded for correct answer
  order: Number               // Order of the question in the quiz
}
```

#### Methods
- `checkAnswer(userAnswer)` - Validates user's answer and returns correctness and points
- `getCorrectAnswer()` - Returns correct answer and explanation (for instructors)

### 2. Test Model
The Test model tracks individual test attempts by students.

#### Schema
```javascript
{
  studentId: ObjectId,        // Reference to the student taking the test
  quizId: ObjectId,           // Reference to the quiz being taken
  courseId: ObjectId,         // Reference to the course containing the quiz
  attemptNumber: Number,      // Attempt number (1st, 2nd, etc.)
  status: String,             // 'in-progress', 'completed', 'expired', 'graded'
  startedAt: Date,            // When the test was started
  completedAt: Date,          // When the test was completed
  timeSpent: Number,          // Total time spent on the test (seconds)
  answers: [testAnswerSchema], // Array of answers provided by the student
  score: {                    // Score breakdown
    totalPoints: Number,      // Maximum possible points
    earnedPoints: Number,     // Points earned by the student
    percentage: Number,       // Percentage score (0-100)
    autoGradedPoints: Number, // Points from auto-graded questions
    essayPoints: Number       // Points from manually graded questions
  },
  passed: Boolean,            // Whether the student passed the test
  isBestAttempt: Boolean,     // Whether this is the best attempt for the student
  reviewMode: Boolean         // Whether the student can review answers
}
```

#### Answer Sub-schema
```javascript
{
  questionId: ObjectId,       // Reference to the question
  questionOrder: Number,      // Order of the question in the quiz
  userAnswer: Mixed,          // Answer provided by the user
  isCorrect: Boolean,         // Whether the answer is correct
  pointsEarned: Number,       // Points earned for this answer
  needsGrading: Boolean,      // Whether this answer requires manual grading
  timeSpent: Number,          // Time spent on this question (seconds)
  answeredAt: Date            // When the answer was submitted
}
```

#### Methods
- `calculateScore()` - Calculates total scores based on answers
- `completeTest()` - Marks test as completed and calculates final score
- `checkPassStatus(passingScore)` - Determines if test was passed

## Architecture of Answer Checking

### 1. Single Choice Questions
- User selects one option from multiple choices
- System compares user's selection with the correct answer
- Points awarded if selection matches correct option

### 2. Multiple Choice Questions
- User selects multiple options from available choices
- System compares user's selections with correct answers as arrays
- Points awarded only if all correct options are selected and no incorrect ones

### 3. True/False Questions
- User selects true or false
- System converts both user answer and correct answer to boolean
- Points awarded if values match

### 4. Essay Questions
- User provides text answer
- System marks as needing manual grading
- Points awarded later by instructor

### 5. Automatic Grading Process
1. When user submits an answer, the system calls `question.checkAnswer(userAnswer)`
2. The method determines correctness based on question type
3. Points are calculated and stored in the test's answers array
4. Scores are updated in real-time

## API Endpoints

### Starting a Test
- `POST /api/tests/start/:quizId` - Starts a new test attempt
- Validates user enrollment in course
- Checks max attempts limit
- Creates new test record

### Managing Answers
- `POST /api/tests/:id/answer` - Submits an answer for a question
- Validates user access to test
- Checks answer correctness using question model
- Updates test record with answer

### Completing a Test
- `POST /api/tests/:id/complete` - Finalizes the test
- Calculates final score
- Determines pass/fail status
- Updates best attempt status

### Retrieving Results
- `GET /api/tests/:id/results` - Gets detailed test results
- Shows user answers alongside correct answers
- Includes explanations for learning

### Test History
- `GET /api/tests/history/:quizId` - Gets student's test history for a quiz
- `GET /api/tests/my-tests` - Gets all tests for current student
- `GET /api/tests/quiz/:quizId/attempts` - Gets all attempts for a quiz (instructor view)

## Security and Access Control

### Role-Based Access
- **Students**: Can start and take tests, view their own results
- **Teachers**: Can view test attempts for their courses, grade essay questions
- **Admins**: Full access to all tests and functionality

### Validation Checks
- User must be enrolled in the course to take quizzes
- Max attempts validation prevents unlimited tries
- Time limits enforced where applicable
- Test integrity maintained through answer validation

## Scoring System

### Point Calculation
- Each question has a point value (default: 1)
- Points awarded based on correctness
- Partial credit possible for some question types
- Final percentage calculated as (earned/total) * 100

### Pass/Fail Determination
- Based on quiz's passing score requirement
- Automatically calculated upon test completion
- Best attempt tracking ensures highest score is recorded

## Data Storage

### MongoDB Collections
- `tests` - Stores individual test attempts
- `questions` - Stores question bank
- `quizzes` - Stores quiz definitions
- `courses` - Links to course information

### Indexing Strategy
- Tests indexed by studentId, quizId for quick retrieval
- Questions indexed by quizId for efficient population
- Compound indexes for common query patterns

## Error Handling

The system implements comprehensive error handling:
- Validation errors for malformed requests
- Authorization errors for unauthorized access
- Resource not found errors
- Database operation errors
- Business logic validation errors

## Performance Considerations

- Efficient querying with proper indexing
- Population of related documents optimized
- Pagination for large result sets
- Caching strategies for frequently accessed data

## Extensibility

The system is designed to be extensible:
- New question types can be added easily
- Grading algorithms can be customized
- Additional metadata can be stored with minimal changes
- Integration with external grading systems possible