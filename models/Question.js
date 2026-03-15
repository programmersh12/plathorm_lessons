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
  }], // for choice questions
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed // can be String, Boolean, Array, or Object depending on type
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

// Method to check if an answer is correct
questionSchema.methods.checkAnswer = function(userAnswer) {
  const questionType = this.type;
  const correctAnswer = this.correctAnswer;

  // Handle null/undefined answers
  if (userAnswer === undefined || userAnswer === null) {
    return { isCorrect: false, pointsEarned: 0 };
  }

  let result;

  switch (questionType) {
    case 'single-choice':
      // For single choice, userAnswer should be the option ID or text
      // correctAnswer stores the correct option identifier
      const singleIsCorrect = userAnswer === correctAnswer;
      result = {
        isCorrect: singleIsCorrect,
        pointsEarned: singleIsCorrect ? this.points : 0
      };
      break;

    case 'multiple-choice':
      // For multiple choice, both should be arrays
      const userAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [userAnswer];
      const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer.sort() : [correctAnswer];
      const multiIsCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
      result = {
        isCorrect: multiIsCorrect,
        pointsEarned: multiIsCorrect ? this.points : 0
      };
      break;

    case 'true-false':
      // For true-false, compare boolean values
      const boolUserAnswer = Boolean(userAnswer);
      const boolCorrectAnswer = Boolean(correctAnswer);
      const tfIsCorrect = boolUserAnswer === boolCorrectAnswer;
      result = {
        isCorrect: tfIsCorrect,
        pointsEarned: tfIsCorrect ? this.points : 0
      };
      break;

    case 'essay':
      // Essay questions require manual grading or AI evaluation
      // For now, we'll store the answer but not auto-grade
      result = {
        isCorrect: null, // null indicates not auto-graded
        pointsEarned: 0, // to be set by instructor
        needsGrading: true
      };
      break;

    default:
      result = { isCorrect: false, pointsEarned: 0 };
  }

  return result;
};

// Method to get correct answer (for admin/instructor view)
questionSchema.methods.getCorrectAnswer = function() {
  return {
    correctAnswer: this.correctAnswer,
    explanation: this.explanation
  };
};

// Index for quiz to optimize queries
questionSchema.index({ quizId: 1 });

module.exports = mongoose.model('Question', questionSchema);