const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getTeachers,
  getTeacher,
  subscribe,
  getMySubscriptions,
  processPayment,
} = require('../controllers/subscriptionController');

const router = express.Router();

router.get('/teachers', getTeachers);
router.get('/teachers/:id', getTeacher);
router.post('/subscribe', protect, subscribe);
router.get('/my-subscriptions', protect, getMySubscriptions);
router.post('/payment', protect, processPayment);

module.exports = router;