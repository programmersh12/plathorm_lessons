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
    type: String, // HTML content or video URL
    required: [true, 'Lesson content is required']
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

// Index for course and order to optimize queries
lessonSchema.index({ courseId: 1, order: 1 });

// Virtual for lesson progress
lessonSchema.virtual('progress').get(function() {
  // This would be populated based on user's interaction with the lesson
  return 0; // Placeholder
});

module.exports = mongoose.model('Lesson', lessonSchema);