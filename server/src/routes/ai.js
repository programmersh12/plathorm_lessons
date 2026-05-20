const express = require('express');
const router = express.Router();
const { getAIAnswer } = require('../utils/aiResponses');

router.post('/', (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ success: false, message: 'Question is required' });
  }
  const answer = getAIAnswer(question);
  res.json({ success: true, answer });
});

module.exports = router;