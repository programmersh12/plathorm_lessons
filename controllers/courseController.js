const Course = require('../models/Course');
const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Получить все курсы
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

// @desc      Получить один курс
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

    // Если курс не опубликован, только инструктор или админ может получить доступ
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

// @desc      Создать новый курс
// @route     POST /api/courses
// @access    Private (Только преподаватель или админ)
exports.addCourse = async (req, res, next) => {
  try {
    // Добавить ID инструктора в тело запроса
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

// @desc      Обновить курс
// @route     PUT /api/courses/:id
// @access    Private (Владелец курса или админ)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Разрешить только инструктору или админу обновлять курс
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

// @desc      Удалить курс
// @route     DELETE /api/courses/:id
// @access    Private (Владелец курса или админ)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Разрешить только инструктору или админу удалять курс
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

// @desc      Записаться на курс
// @route     POST /api/courses/:id/enroll
// @access    Private (Только студенты)
exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Проверить, записан ли пользователь уже на курс
    const isAlreadyEnrolled = course.studentsEnrolled.some(student =>
      student.userId.toString() === req.user.id
    );

    if (isAlreadyEnrolled) {
      return next(new ErrorResponse('You are already enrolled in this course', 400));
    }

    // Только студенты могут записываться на курсы
    if (req.user.role !== 'student') {
      return next(new ErrorResponse('Only students can enroll in courses', 403));
    }

    // Добавить студента на курс
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

// @desc      Отписаться от курса
// @route     DELETE /api/courses/:id/unenroll
// @access    Private
exports.unenrollFromCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Найти и удалить студента из курса
    const studentIndex = course.studentsEnrolled.findIndex(student =>
      student.userId.toString() === req.user.id
    );

    if (studentIndex === -1) {
      return next(new ErrorResponse('You are not enrolled in this course', 400));
    }

    // Разрешить пользователю отписаться или инструктору/админу удалить студентов
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

// @desc      Получить курсы пользователя
// @route     GET /api/courses/my-courses
// @access    Private
exports.getMyCourses = async (req, res, next) => {
  try {
    // Найти курсы, на которые записан пользователь
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

// @desc      Получить курсы преподавателя
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

// @desc      Обновить прогресс студента на курсе
// @route     PUT /api/courses/:id/progress
// @access    Private (Только студент)
exports.updateCourseProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;

    // Валидировать прогресс
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return next(new ErrorResponse('Progress must be a number between 0 and 100', 400));
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Проверить, записан ли пользователь на курс
    const studentIndex = course.studentsEnrolled.findIndex(student =>
      student.userId.toString() === req.user.id
    );

    if (studentIndex === -1) {
      return next(new ErrorResponse('You are not enrolled in this course', 403));
    }

    // Только студенты могут обновлять свой прогресс
    if (req.user.role !== 'student') {
      return next(new ErrorResponse('Only students can update their progress', 403));
    }

    // Сохранить старый прогресс для определения завершения
    const oldProgress = course.studentsEnrolled[studentIndex].progress;

    // Обновить прогресс
    course.studentsEnrolled[studentIndex].progress = progress;

    // Отметить как завершённый, если прогресс 100%
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

// @desc      Получить аналитику курса
// @route     GET /api/courses/:id/analytics
// @access    Private (Только преподаватель или админ)
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    // Разрешить только инструктору или админу доступ к аналитике
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access course analytics', 401));
    }

    // Рассчитать аналитику
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