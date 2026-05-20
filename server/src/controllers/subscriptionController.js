const Subscription = require('../models/Subscription');
const Teacher = require('../models/Teacher');

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('userId', 'firstName lastName profilePicture')
      .populate('courses', 'title');
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('courses').populate('userId', 'firstName lastName profilePicture');
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { teacherId, courseIds } = req.body;

    if (!teacherId) {
      return res.status(400).json({ success: false, message: 'teacherId is required' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const existingSubscription = await Subscription.findOne({
      studentId: req.user.id,
      teacherId,
      status: { $in: ['pending', 'active'] },
    });

    if (existingSubscription) {
      return res.status(409).json({
        success: false,
        message: 'Subscription already exists for this teacher',
      });
    }

    const subscription = await Subscription.create({
      studentId: req.user.id,
      teacherId,
      courseIds: Array.isArray(courseIds) ? courseIds : teacher.courses,
      price: teacher.subscriptionPrice,
      status: 'pending',
    });

    res.status(201).json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ studentId: req.user.id })
      .populate({
        path: 'teacherId',
        populate: {
          path: 'userId',
          select: 'firstName lastName profilePicture',
        },
      })
      .populate('courseIds', 'title');

    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'subscriptionId is required' });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (String(subscription.studentId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    subscription.status = 'active';
    await subscription.save();

    res.json({ success: true, message: 'Payment successful', subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
