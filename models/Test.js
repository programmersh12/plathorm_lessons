const mongoose = require('mongoose');

const testAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  questionOrder: {
    type: Number,
    required: true
  },
  userAnswer: {
    type: mongoose.Schema.Types.Mixed // can be String, Boolean, Array, or Object
  },
  isCorrect: {
    type: Boolean
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  needsGrading: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
});

const testSchema = new mongoose.Schema({
  studentId: {
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
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: {
      values: ['in-progress', 'completed', 'expired', 'graded'],
      message: 'Status must be in-progress, completed, expired, or graded'
    },
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  timeSpent: {
    type: Number, // total time in seconds
    default: 0
  },
  answers: [testAnswerSchema],
  score: {
    totalPoints: {
      type: Number,
      default: 0
    },
    earnedPoints: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    autoGradedPoints: {
      type: Number,
      default: 0
    },
    essayPoints: {
      type: Number,
      default: 0
    }
  },
  passed: {
    type: Boolean,
    default: false
  },
  isBestAttempt: {
    type: Boolean,
    default: false
  },
  reviewMode: {
    type: Boolean,
    default: false // if true, student can review answers after completion
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
testSchema.index({ studentId: 1, quizId: 1, attemptNumber: -1 });
testSchema.index({ studentId: 1, status: 1 });
testSchema.index({ quizId: 1, createdAt: -1 });
testSchema.index({ courseId: 1 });

// Virtual for checking if test is passed
testSchema.virtual('isPassed').get(function() {
  return this.passed;
});

// Pre-save middleware to calculate percentage
testSchema.pre('save', function(next) {
  if (this.score.totalPoints > 0) {
    this.score.percentage = (this.score.earnedPoints / this.score.totalPoints) * 100;
    // Round to 2 decimal places
    this.score.percentage = Math.round(this.score.percentage * 100) / 100;
  }
  next();
});

// Method to calculate total score
testSchema.methods.calculateScore = function() {
  let totalPoints = 0;
  let earnedPoints = 0;
  let autoGradedPoints = 0;
  let essayPoints = 0;

  this.answers.forEach(answer => {
    if (answer.pointsEarned !== undefined) {
      totalPoints += answer.questionId.points || 1;
      earnedPoints += answer.pointsEarned;
      
      if (answer.needsGrading) {
        essayPoints += answer.pointsEarned;
      } else {
        autoGradedPoints += answer.pointsEarned;
      }
    }
  });

  this.score.totalPoints = totalPoints;
  this.score.earnedPoints = earnedPoints;
  this.score.autoGradedPoints = autoGradedPoints;
  this.score.essayPoints = essayPoints;
  this.score.percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  this.score.percentage = Math.round(this.score.percentage * 100) / 100;

  return this.score;
};

// Method to mark test as completed
testSchema.methods.completeTest = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  this.calculateScore();
  return this;
};

// Method to check if test is passed (based on quiz passing score)
testSchema.methods.checkPassStatus = function(passingScore = 70) {
  this.passed = this.score.percentage >= passingScore;
  return this.passed;
};

module.exports = mongoose.model('Test', testSchema);
