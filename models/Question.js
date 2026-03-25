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
  }], // Для вопросов с выбором
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed // Может быть String, Boolean, Array или Object в зависимости от типа
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
    type: Number, // Позиция в тесте
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Метод проверки правильности ответа
questionSchema.methods.checkAnswer = function(userAnswer) {
  const questionType = this.type;
  const correctAnswer = this.correctAnswer;

  // Обработка null/undefined ответов
  if (userAnswer === undefined || userAnswer === null) {
    return { isCorrect: false, pointsEarned: 0 };
  }

  let result;

  switch (questionType) {
    case 'single-choice':
      // Для одиночного выбора userAnswer должен быть ID опции или текстом
      // correctAnswer хранит правильный идентификатор опции
      const singleIsCorrect = userAnswer === correctAnswer;
      result = {
        isCorrect: singleIsCorrect,
        pointsEarned: singleIsCorrect ? this.points : 0
      };
      break;

    case 'multiple-choice':
      // Для множественного выбора оба должны быть массивами
      const userAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [userAnswer];
      const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer.sort() : [correctAnswer];
      const multiIsCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
      result = {
        isCorrect: multiIsCorrect,
        pointsEarned: multiIsCorrect ? this.points : 0
      };
      break;

    case 'true-false':
      // Для true-false сравниваем булевы значения
      const boolUserAnswer = Boolean(userAnswer);
      const boolCorrectAnswer = Boolean(correctAnswer);
      const tfIsCorrect = boolUserAnswer === boolCorrectAnswer;
      result = {
        isCorrect: tfIsCorrect,
        pointsEarned: tfIsCorrect ? this.points : 0
      };
      break;

    case 'essay':
      // Эссе требуют ручной проверки или ИИ оценки
      // Пока сохраним ответ, но не оцениваем автоматически
      result = {
        isCorrect: null, // null означает, что не оценивается автоматически
        pointsEarned: 0, // будет установлено инструктором
        needsGrading: true
      };
      break;

    default:
      result = { isCorrect: false, pointsEarned: 0 };
  }

  return result;
};

// Метод получения правильного ответа (для админа/инструктора)
questionSchema.methods.getCorrectAnswer = function() {
  return {
    correctAnswer: this.correctAnswer,
    explanation: this.explanation
  };
};

// Индекс для теста для оптимизации запросов
questionSchema.index({ quizId: 1 });

module.exports = mongoose.model('Question', questionSchema);