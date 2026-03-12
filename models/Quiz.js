const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
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
    default: 1,
    min: 1
  },
  passingScore: {
    type: Number, // percentage required to pass
    default: 70,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for course to optimize queries
quizSchema.index({ courseId: 1 });
quizSchema.index({ lessonId: 1 });

module.exports = mongoose.model('Quiz', quizSchema);