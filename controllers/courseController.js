const Course = require('../models/Course');
const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all courses
// @route     GET /api/courses
// @access    Public
exports.getCourses = async (req, res, next) => {
  try {
    // Use advanced filtering, sorting, pagination, and field selection
    const features = new APIFeatures(
      Course.find({ isPublished: true }).populate('instructorId', 'firstName lastName profilePicture'),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const courses = await features.query;

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Get single course
// @route     GET /api/courses/:id
// @access    Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'firstName lastName profilePicture')
      .populate({
        path: 'curriculum.lessons',
        model: 'Lesson',
        select: 'title order type duration isPreview'
      });

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // If course is not published, only the instructor or admin can access it
    if (!course.isPublished) {
      if (req.user) {
        if (req.user.id !== course.instructorId._id.toString() && req.user.role !== 'admin') {
          return next(new ErrorResponse('Access denied. Course is not published.', 403));
        }
      } else {
        return next(new ErrorResponse('Access denied. Course is not published.', 403));
      }
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    next(error);
  }
};

// @desc      Create new course
// @route     POST /api/courses
// @access    Private (Teacher or Admin only)
exports.addCourse = async (req, res, next) => {
  try {
    // Add instructor ID to the request body
    req.body.instructorId = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Update course
// @route     PUT /api/courses/:id
// @access    Private (Course owner or Admin only)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Only allow instructor or admin to update the course
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this course', 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('instructorId', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    next(error);
  }
};

// @desc      Delete course
// @route     DELETE /api/courses/:id
// @access    Private (Course owner or Admin only)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Only allow instructor or admin to delete the course
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this course', 401));
    }

    await course.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    next(error);
  }
};

// @desc      Enroll in a course
// @route     POST /api/courses/:id/enroll
// @access    Private (Students only)
exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Check if user is already enrolled
    const isAlreadyEnrolled = course.studentsEnrolled.some(student =>
      student.userId.toString() === req.user.id
    );

    if (isAlreadyEnrolled) {
      return next(new ErrorResponse('You are already enrolled in this course', 400));
    }

    // Only students can enroll in courses
    if (req.user.role !== 'student') {
      return next(new ErrorResponse('Only students can enroll in courses', 403));
    }

    // Add student to course
    course.studentsEnrolled.push({
      userId: req.user.id
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in the course',
      data: {
        courseId: course._id,
        title: course.title
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    next(error);
  }
};

// @desc      Unenroll from a course
// @route     DELETE /api/courses/:id/unenroll
// @access    Private
exports.unenrollFromCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Find and remove student from course
    const studentIndex = course.studentsEnrolled.findIndex(student =>
      student.userId.toString() === req.user.id
    );

    if (studentIndex === -1) {
      return next(new ErrorResponse('You are not enrolled in this course', 400));
    }

    // Allow the user to unenroll (student) or allow instructor/admin to remove students
    if (
      req.user.id !== course.studentsEnrolled[studentIndex].userId.toString() &&
      course.instructorId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(new ErrorResponse('Not authorized to unenroll from this course', 403));
    }

    course.studentsEnrolled.splice(studentIndex, 1);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from the course'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    next(error);
  }
};

// @desc      Get user's enrolled courses
// @route     GET /api/courses/my-courses
// @access    Private
exports.getMyCourses = async (req, res, next) => {
  try {
    // Find courses where the user is enrolled
    const courses = await Course.find({
      'studentsEnrolled.userId': req.user.id
    }).populate('instructorId', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Get courses by instructor
// @route     GET /api/courses/instructor/:instructorId
// @access    Public
exports.getCoursesByInstructor = async (req, res, next) => {
  try {
    const courses = await Course.find({
      instructorId: req.params.instructorId,
      isPublished: true
    }).populate('instructorId', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc      Update student progress in a course
// @route     PUT /api/courses/:id/progress
// @access    Private (Student only)
exports.updateCourseProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;

    // Validate progress
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return next(new ErrorResponse('Progress must be a number between 0 and 100', 400));
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Check if user is enrolled in the course
    const studentIndex = course.studentsEnrolled.findIndex(student =>
      student.userId.toString() === req.user.id
    );

    if (studentIndex === -1) {
      return next(new ErrorResponse('You are not enrolled in this course', 403));
    }

    // Only students can update their own progress
    if (req.user.role !== 'student') {
      return next(new ErrorResponse('Only students can update their progress', 403));
    }

    // Store old progress to detect completion
    const oldProgress = course.studentsEnrolled[studentIndex].progress;

    // Update progress
    course.studentsEnrolled[studentIndex].progress = progress;

    // Mark as completed if progress is 100%
    if (progress === 100 && !course.studentsEnrolled[studentIndex].completedAt) {
      course.studentsEnrolled[studentIndex].status = 'completed';
      course.studentsEnrolled[studentIndex].completedAt = Date.now();
    } else if (progress < 100) {
      course.studentsEnrolled[studentIndex].status = 'enrolled';
      course.studentsEnrolled[studentIndex].completedAt = null;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        courseId: course._id,
        progress: course.studentsEnrolled[studentIndex].progress,
        status: course.studentsEnrolled[studentIndex].status
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    next(error);
  }
};

// @desc      Get course analytics
// @route     GET /api/courses/:id/analytics
// @access    Private (Instructor or Admin only)
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Only allow instructor or admin to access analytics
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access course analytics', 401));
    }

    // Calculate analytics
    const totalEnrolled = course.studentsEnrolled.length;
    const completedStudents = course.studentsEnrolled.filter(student => student.status === 'completed').length;
    const avgProgress = totalEnrolled > 0 
      ? course.studentsEnrolled.reduce((sum, student) => sum + student.progress, 0) / totalEnrolled 
      : 0;
    const completionRate = totalEnrolled > 0 ? (completedStudents / totalEnrolled) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        courseId: course._id,
        title: course.title,
        totalEnrolled,
        completedStudents,
        avgProgress: Math.round(avgProgress * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        students: course.studentsEnrolled.map(student => ({
          userId: student.userId,
          progress: student.progress,
          status: student.status,
          enrollmentDate: student.enrollmentDate,
          completedAt: student.completedAt
        }))
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    next(error);
  }
};