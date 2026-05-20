const Test = require('../models/Test');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Start a new test attempt
// @route     POST /api/tests/start/:quizId
// @access    Private (Students only)
exports.startTest = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;

    // Check if quiz exists and is active
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return next(new ErrorResponse('Quiz not found', 404));
    }

    if (!quiz.isActive) {
      return next(new ErrorResponse('This quiz is not active', 400));
    }

    // Check if course exists and user is enrolled
    const course = await Course.findById(quiz.courseId);
    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    const isEnrolled = course.studentsEnrolled.some(student => 
      student.userId.toString() === studentId
    );
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isAdmin) {
      return next(new ErrorResponse('You must be enrolled in the course to take this quiz', 403));
    }

    // Check max attempts
    const existingAttempts = await Test.countDocuments({
      studentId,
      quizId
    });

    if (existingAttempts >= quiz.maxAttempts) {
      return next(new ErrorResponse(`Maximum attempts (${quiz.maxAttempts}) reached for this quiz`, 400));
    }

    // Check if there's an in-progress test
    const inProgressTest = await Test.findOne({
      studentId,
      quizId,
      status: 'in-progress'
    });

    if (inProgressTest) {
      return next(new ErrorResponse('You already have an in-progress test', 400));
    }

    // Create new test attempt
    const attemptNumber = existingAttempts + 1;
    const newTest = await Test.create({
      studentId,
      quizId,
      courseId: quiz.courseId,
      attemptNumber,
      status: 'in-progress',
      startedAt: new Date()
    });

    // Return test with questions (without correct answers)
    const questions = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      options: q.options,
      order: q.order,
      points: q.points
    }));

    res.status(201).json({
      success: true,
      message: 'Test started successfully',
      data: {
        test: newTest,
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          questions: questions.sort((a, b) => a.order - b.order)
        }
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Quiz not found', 404));
    }
    next(error);
  }
};

// @desc      Get test details (for continuing a test)
// @route     GET /api/tests/:id
// @access    Private
exports.getTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('quizId', 'title description timeLimit passingScore maxAttempts')
      .populate({
        path: 'answers.questionId',
        select: 'questionText type options order points'
      });

    if (!test) {
      return next(new ErrorResponse('Test not found', 404));
    }

    // Check if user has access to this test
    if (test.studentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this test', 403));
    }

    // Return questions with user's previous answers
    const questions = test.answers.map(answer => ({
      questionId: answer.questionId._id,
      questionText: answer.questionId.questionText,
      type: answer.questionId.type,
      options: answer.questionId.options,
      order: answer.questionId.order,
      points: answer.questionId.points,
      userAnswer: answer.userAnswer,
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned
    }));

    res.status(200).json({
      success: true,
      data: {
        test: {
          _id: test._id,
          status: test.status,
          startedAt: test.startedAt,
          completedAt: test.completedAt,
          timeSpent: test.timeSpent,
          score: test.score,
          passed: test.passed,
          attemptNumber: test.attemptNumber
        },
        quiz: test.quizId,
        questions: questions.sort((a, b) => a.order - b.order)
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Test not found', 404));
    }
    next(error);
  }
};

// @desc      Submit answer for a question
// @route     POST /api/tests/:id/answer
// @access    Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionId, userAnswer } = req.body;
    const test = await Test.findById(req.params.id);

    if (!test) {
      return next(new ErrorResponse('Test not found', 404));
    }

    // Check if user has access to this test
    if (test.studentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this test', 403));
    }

    // Check if test is still in progress
    if (test.status !== 'in-progress') {
      return next(new ErrorResponse('Test is not in progress', 400));
    }

    // Get question details
    const question = await Question.findById(questionId);
    if (!question) {
      return next(new ErrorResponse('Question not found', 404));
    }

    // Check if question belongs to the quiz
    if (question.quizId.toString() !== test.quizId.toString()) {
      return next(new ErrorResponse('Question does not belong to this quiz', 400));
    }

    // Check if answer already exists
    const existingAnswerIndex = test.answers.findIndex(a => 
      a.questionId.toString() === questionId
    );

    // Check answer using the question's checkAnswer method
    const answerResult = question.checkAnswer(userAnswer);

    // Create answer object
    const answerData = {
      questionId,
      questionOrder: question.order,
      userAnswer,
      isCorrect: answerResult.isCorrect,
      pointsEarned: answerResult.pointsEarned,
      needsGrading: answerResult.needsGrading || false,
      answeredAt: new Date()
    };

    if (existingAnswerIndex !== -1) {
      // Update existing answer
      test.answers[existingAnswerIndex] = answerData;
    } else {
      // Add new answer
      test.answers.push(answerData);
    }

    await test.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        isCorrect: answerResult.isCorrect,
        pointsEarned: answerResult.pointsEarned,
        needsGrading: answerResult.needsGrading
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Test or question not found', 404));
    }
    next(error);
  }
};

// @desc      Complete test and calculate final score
// @route     POST /api/tests/:id/complete
// @access    Private
exports.completeTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('quizId', 'passingScore')
      .populate('answers.questionId', 'points type');

    if (!test) {
      return next(new ErrorResponse('Test not found', 404));
    }

    // Check if user has access to this test
    if (test.studentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this test', 403));
    }

    // Check if test is in progress
    if (test.status !== 'in-progress') {
      return next(new ErrorResponse('Test is not in progress', 400));
    }

    // Calculate final score
    test.completeTest();
    test.checkPassStatus(test.quizId.passingScore);

    // Mark as best attempt if it's the highest score
    const otherAttempts = await Test.find({
      studentId: test.studentId,
      quizId: test.quizId,
      _id: { $ne: test._id }
    });

    const isBestScore = otherAttempts.every(attempt => 
      attempt.score.percentage <= test.score.percentage
    );

    if (isBestScore) {
      // Reset best attempt flag on other attempts
      await Test.updateMany(
        { studentId: test.studentId, quizId: test.quizId, _id: { $ne: test._id } },
        { isBestAttempt: false }
      );
      test.isBestAttempt = true;
    }

    await test.save();

    res.status(200).json({
      success: true,
      message: 'Test completed successfully',
      data: {
        testId: test._id,
        score: test.score,
        passed: test.passed,
        isBestAttempt: test.isBestAttempt,
        completedAt: test.completedAt
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Test not found', 404));
    }
    next(error);
  }
};

// @desc      Get test results with review
// @route     GET /api/tests/:id/results
// @access    Private
exports.getTestResults = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('quizId', 'title description passingScore')
      .populate({
        path: 'answers.questionId',
        select: 'questionText type options order points explanation'
      });

    if (!test) {
      return next(new ErrorResponse('Test not found', 404));
    }

    // Check if user has access to this test
    const isOwner = test.studentId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isInstructor = test.quizId.courseId && 
      (await Course.findById(test.quizId.courseId)).instructorId.toString() === req.user.id;

    if (!isOwner && !isAdmin && !isInstructor) {
      return next(new ErrorResponse('Not authorized to view these results', 403));
    }

    // Prepare detailed results
    const detailedAnswers = test.answers.map(answer => {
      const question = answer.questionId;
      let correctAnswerDisplay = null;

      // Only show correct answers to instructors/admins or if test is completed
      if (isAdmin || isInstructor || test.status === 'completed') {
        correctAnswerDisplay = question.correctAnswer;
      }

      return {
        questionId: question._id,
        questionText: question.questionText,
        type: question.type,
        options: question.options,
        order: question.order,
        points: question.points,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        needsGrading: answer.needsGrading,
        correctAnswer: correctAnswerDisplay,
        explanation: question.explanation
      };
    });

    res.status(200).json({
      success: true,
      data: {
        test: {
          _id: test._id,
          quizId: test.quizId._id,
          quizTitle: test.quizId.title,
          status: test.status,
          startedAt: test.startedAt,
          completedAt: test.completedAt,
          timeSpent: test.timeSpent,
          score: test.score,
          passed: test.passed,
          isBestAttempt: test.isBestAttempt,
          attemptNumber: test.attemptNumber
        },
        answers: detailedAnswers.sort((a, b) => a.order - b.order)
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Test not found', 404));
    }
    next(error);
  }
};

// @desc      Get student's test history for a quiz
// @route     GET /api/tests/history/:quizId
// @access    Private
exports.getTestHistory = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;

    // Check if user is admin or the student themselves
    if (req.user.role !== 'admin' && req.user.id !== studentId) {
      return next(new ErrorResponse('Not authorized to view this test history', 403));
    }

    const tests = await Test.find({
      studentId,
      quizId
    })
    .sort({ createdAt: -1 })
    .select('_id attemptNumber status startedAt completedAt timeSpent score passed isBestAttempt createdAt');

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Quiz not found', 404));
    }
    next(error);
  }
};

// @desc      Get all tests for a student
// @route     GET /api/tests/my-tests
// @access    Private
exports.getMyTests = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tests = await Test.find({ studentId })
      .populate('quizId', 'title courseId')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Test.countDocuments({ studentId });

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: tests
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Get all test attempts for a quiz (instructor/admin view)
// @route     GET /api/tests/quiz/:quizId/attempts
// @access    Private (Course instructor or admin)
exports.getQuizAttempts = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get quiz and course
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(new ErrorResponse('Quiz not found', 404));
    }

    const course = await Course.findById(quiz.courseId);
    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    // Check if user is course instructor or admin
    const isInstructor = course.instructorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return next(new ErrorResponse('Not authorized to view quiz attempts', 403));
    }

    const tests = await Test.find({ quizId })
      .populate('studentId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Test.countDocuments({ quizId });

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: tests
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Quiz not found', 404));
    }
    next(error);
  }
};

// @desc      Delete test attempt (admin only or student can delete their own in-progress test)
// @route     DELETE /api/tests/:id
// @access    Private
exports.deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return next(new ErrorResponse('Test not found', 404));
    }

    // Student can only delete their own in-progress tests
    const isOwner = test.studentId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (isOwner && test.status === 'in-progress') {
      await test.remove();
    } else if (isAdmin) {
      await test.remove();
    } else {
      return next(new ErrorResponse('Not authorized to delete this test', 403));
    }

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse('Test not found', 404));
    }
    next(error);
  }
};