const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: {
      values: ['video', 'text', 'quiz', 'assignment'],
      message: 'Type must be either video, text, quiz, or assignment'
    },
    required: true
  },
  content: {
    type: String, // HTML контент или URL видео
    required: [true, 'Lesson content is required']
  },
  duration: {
    type: Number, // Ориентировочная продолжительность в минутах
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
      type: String, // 'pdf', 'doc', 'zip' и т.д.
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

// Индекс для курса и порядка для оптимизации запросов
lessonSchema.index({ courseId: 1, order: 1 });

// Виртуальное поле для прогресса урока
lessonSchema.virtual('progress').get(function() {
  // Будет заполнено на основе взаимодействия пользователя с уроком
  return 0; // Заглушка
});

module.exports = mongoose.model('Lesson', lessonSchema);