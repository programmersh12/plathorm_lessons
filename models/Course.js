const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true,
    index: true
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
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number, // in hours
    default: 0
  },
  level: {
    type: String,
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Level must be either beginner, intermediate, or advanced'
    },
    required: true
  },
  requirements: [{
    type: String,
    maxlength: [200, 'Each requirement cannot exceed 200 characters']
  }],
  objectives: [{
    type: String,
    maxlength: [200, 'Each objective cannot exceed 200 characters']
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
      ref: 'User',
      required: true
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
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed', 'dropped'],
      default: 'enrolled'
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
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for common queries
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ instructorId: 1 });
courseSchema.index({ title: 'text', description: 'text' }); // Text search index

// Virtual for student count
courseSchema.virtual('studentCount').get(function() {
  return this.studentsEnrolled.length;
});

// Populate lessons in curriculum when finding courses
courseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'instructorId',
    select: 'firstName lastName profilePicture'
  });
  next();
});

module.exports = mongoose.model('Course', courseSchema);