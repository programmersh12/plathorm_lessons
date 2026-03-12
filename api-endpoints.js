// Example API endpoint implementations for the online learning platform

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Import models
const { User, Course, Lesson, Quiz, Question, Result, Certificate } = require('./mongoose-schemas');

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware for role-based access control
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// AUTHENTICATION ENDPOINTS
// POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'student'
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/profile
router.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// COURSE ENDPOINTS
// GET /api/courses
router.get('/courses', async (req, res) => {
  try {
    const { category, level, instructor, search } = req.query;
    
    let filter = { isPublished: true }; // Only published courses
    
    if (category) filter.category = new RegExp(category, 'i');
    if (level) filter.level = level;
    if (instructor) filter.instructorId = instructor;
    if (search) filter.title = new RegExp(search, 'i');
    
    const courses = await Course.find(filter)
      .populate('instructorId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(20); // Limit results
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/courses/:id
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'firstName lastName')
      .populate({
        path: 'curriculum.lessons',
        model: 'Lesson',
        select: 'title order type duration isPreview'
      });
      
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses (teacher/admin only)
router.post('/courses', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, category, price, level, requirements, objectives } = req.body;
    
    const course = new Course({
      title,
      description,
      category,
      instructorId: req.user.id, // Current user is the instructor
      price: price || 0,
      level,
      requirements: requirements || [],
      objectives: objectives || [],
      isPublished: false // Default to unpublished
    });
    
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses/:id/enroll
router.post('/courses/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    
    // Check if user is already enrolled
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const alreadyEnrolled = course.studentsEnrolled.some(enrollment => 
      enrollment.userId.toString() === userId
    );
    
    if (alreadyEnrolled) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    // Add user to enrolled students
    course.studentsEnrolled.push({
      userId: userId,
      enrollmentDate: new Date()
    });
    
    await course.save();
    
    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LESSON ENDPOINTS
// GET /api/courses/:courseId/lessons
router.get('/courses/:courseId/lessons', authenticateToken, async (req, res) => {
  try {
    // Check if user is enrolled in the course or is the instructor/admin
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const isEnrolled = course.studentsEnrolled.some(enrollment => 
      enrollment.userId.toString() === req.user.id
    );
    
    const isOwner = course.instructorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isEnrolled && !isOwner && !isAdmin && course.isPublished) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }
    
    // For enrolled students, only return lessons they have access to
    // For instructors/admins, return all lessons
    let lessonsQuery = { courseId: req.params.courseId };
    if (!isOwner && !isAdmin) {
      // Students can only see preview lessons or lessons in published courses they're enrolled in
      lessonsQuery.$or = [
        { isPreview: true },
        { isPreview: false }
      ];
    }
    
    const lessons = await Lesson.find(lessonsQuery).sort({ order: 1 });
    
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// QUIZ ENDPOINTS
// POST /api/quizzes/:id/start
router.post('/quizzes/:id/start', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('questions', 'questionText type options order points')
      .populate('courseId', 'title');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    if (!quiz.isActive) {
      return res.status(400).json({ error: 'Quiz is not active' });
    }
    
    // Check if user has reached max attempts
    const existingResults = await Result.countDocuments({
      quizId: req.params.id,
      userId: req.user.id
    });
    
    if (existingResults >= quiz.maxAttempts) {
      return res.status(400).json({ error: 'Maximum attempts reached for this quiz' });
    }
    
    // Create a new result record to track the attempt
    const newResult = new Result({
      userId: req.user.id,
      quizId: req.params.id,
      courseId: quiz.courseId._id,
      startedAt: new Date(),
      attemptNumber: existingResults + 1,
      score: 0, // Will be calculated upon submission
      totalPoints: 0, // Will be calculated upon submission
      earnedPoints: 0 // Will be calculated upon submission
    });
    
    await newResult.save();
    
    // Return quiz questions for the user to answer
    res.json({
      quizId: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      resultId: newResult._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/quizzes/:id/submit
router.post('/quizzes/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers, resultId } = req.body;
    
    // Verify the result belongs to the current user
    const result = await Result.findById(resultId);
    if (!result || result.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to submit answers for this quiz' });
    }
    
    if (result.completedAt) {
      return res.status(400).json({ error: 'Quiz already submitted' });
    }
    
    // Get the quiz and questions
    const quiz = await Quiz.findById(req.params.id)
      .populate('questions', 'points options correctAnswer type');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    let processedAnswers = [];
    
    for (const answer of answers) {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) continue;
      
      totalPoints += question.points;
      
      let isCorrect = false;
      let pointsAwarded = 0;
      
      if (question.type === 'multiple-choice' || question.type === 'single-choice') {
        // For multiple choice, check if the selected option is correct
        const selectedOption = question.options.find(opt => opt.optionText === answer.selectedOption);
        if (selectedOption && selectedOption.isCorrect) {
          isCorrect = true;
          pointsAwarded = question.points;
          earnedPoints += question.points;
        }
      } else if (question.type === 'true-false') {
        if (answer.selectedOption === question.correctAnswer) {
          isCorrect = true;
          pointsAwarded = question.points;
          earnedPoints += question.points;
        }
      } else if (question.type === 'essay') {
        // Essay questions typically require manual grading
        // For now, we'll mark as not correct and require instructor review
        isCorrect = false;
        pointsAwarded = 0;
      }
      
      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        answerText: answer.answerText,
        isCorrect,
        pointsAwarded
      });
    }
    
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;
    
    // Update the result
    result.answers = processedAnswers;
    result.score = score;
    result.totalPoints = totalPoints;
    result.earnedPoints = earnedPoints;
    result.completedAt = new Date();
    result.passed = passed;
    
    await result.save();
    
    // Check if this is a course completion quiz and generate certificate if needed
    if (passed) {
      const course = await Course.findById(quiz.courseId);
      if (course) {
        // Update user's progress in the course
        await Course.updateOne(
          { _id: course._id, 'studentsEnrolled.userId': req.user.id },
          { 
            $set: { 
              'studentsEnrolled.$.progress': 100, // Assuming this quiz completes the course
              'studentsEnrolled.$.completedAt': new Date()
            }
          }
        );
        
        // Check if we should generate a certificate
        const studentEnrollment = course.studentsEnrolled.find(e => 
          e.userId.toString() === req.user.id
        );
        
        if (studentEnrollment && !studentEnrollment.certificateGenerated) {
          // Generate certificate
          const instructor = await User.findById(course.instructorId);
          const student = await User.findById(req.user.id);
          
          const certificate = new Certificate({
            userId: req.user.id,
            courseId: course._id,
            courseTitle: course.title,
            instructorName: `${instructor.firstName} ${instructor.lastName}`,
            certificateUrl: `/certificates/${course._id}_${req.user.id}.pdf`,
            verificationCode: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          });
          
          await certificate.save();
        }
      }
    }
    
    res.json({
      message: 'Quiz submitted successfully',
      score,
      totalPoints,
      earnedPoints,
      passed,
      result: result.toObject()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;