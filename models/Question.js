const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: {
      values: ['multiple-choice', 'single-choice', 'true-false', 'essay'],
      message: 'Type must be either multiple-choice, single-choice, true-false, or essay'
    },
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
    default: '',
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  },
  order: {
    type: Number, // position in the quiz
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Index for quiz to optimize queries
questionSchema.index({ quizId: 1 });

module.exports = mongoose.model('Question', questionSchema);