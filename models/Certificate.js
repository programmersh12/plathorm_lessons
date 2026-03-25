const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    default: () => `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },
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
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    default: null
  },
  score: {
    type: Number, // Балл в процентах
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active'
  },
  filePath: {
    type: String, // Путь к сгенерированному PDF файлу
    default: null
  },
  verificationCode: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  metadata: {
    totalDuration: {
      type: Number, // Продолжительность курса в часах
      default: 0
    },
    totalLessons: {
      type: Number,
      default: 0
    },
    completedLessons: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

certificateSchema.index({ userId: 1 });
certificateSchema.index({ courseId: 1 });
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ issueDate: -1 });

certificateSchema.methods.isValid = function() {
  if (this.status !== 'active') {
    return false;
  }
  
  if (this.expiryDate && this.expiryDate < new Date()) {
    return false;
  }
  
  return true;
};

certificateSchema.methods.revoke = function(reason = 'Отозван') {
  this.status = 'revoked';
  return this.save();
};

certificateSchema.methods.extendExpiry = function(newExpiryDate) {
  this.expiryDate = newExpiryDate;
  return this.save();
};

module.exports = mongoose.model('Certificate', certificateSchema);