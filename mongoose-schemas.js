const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in hours
    default: 0
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  requirements: [{
    type: String
  }],
  objectives: [{
    type: String
  }],
  curriculum: [{
    sectionTitle: {
      type: String,
      required: true
    },
    lessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    }]
  }],
  studentsEnrolled: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number, // percentage
      default: 0
    },
    completedAt: {
      type: Date,
      default: null
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'assignment'],
    required: true
  },
  content: {
    type: String, // HTML content or video URL
    required: true
  },
  duration: {
    type: Number, // estimated duration in minutes
    default: 0
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  resources: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String, // 'pdf', 'doc', 'zip', etc.
      required: true
    }
  }],
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null
  }
}, {
  timestamps: true
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: null
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  timeLimit: {
    type: Number, // in minutes
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 1
  },
  passingScore: {
    type: Number, // percentage required to pass
    default: 70
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Question Schema
const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'single-choice', 'true-false', 'essay'],
    required: true
  },
  options: [{
    optionText: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }], // for multiple choice questions
  correctAnswer: {
    type: String // for essay questions or alternative storage
  },
  explanation: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 1
  },
  order: {
    type: Number, // position in the quiz
    required: true
  }
}, {
  timestamps: true
});

// Result Schema
const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  score: {
    type: Number, // percentage
    required: true
  },
  totalPoints: {
    type: Number,
    required: true
  },
  earnedPoints: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOption: {
      type: String // for multiple choice
    },
    answerText: {
      type: String // for essay questions
    },
    isCorrect: {
      type: Boolean
    },
    pointsAwarded: {
      type: Number
    }
  }],
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  certificateUrl: {
    type: String, // URL to the certificate file
    required: true
  },
  verificationCode: {
    type: String, // unique code to verify certificate authenticity
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Question = mongoose.model('Question', questionSchema);
const Result = mongoose.model('Result', resultSchema);
const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = {
  User,
  Course,
  Lesson,
  Quiz,
  Question,
  Result,
  Certificate
};