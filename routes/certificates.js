const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs-extra');

const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const certificateService = require('../services/certificateService');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Генерация сертификата для завершенного курса
router.post('/generate', protect, [
  body('courseId', 'ID курса обязателен').notEmpty(),
  body('grade').optional().isIn(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']),
  body('score').optional().isFloat({ min: 0, max: 100 }),
  body('metadata').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: errors.array()
      });
    }

    const { courseId, grade, score, metadata } = req.body;
    const userId = req.user.id;

    // Проверяем, что пользователь записан на курс и завершил его
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }

    const studentIndex = course.studentsEnrolled.findIndex(student =>
      student.userId.toString() === userId
    );

    if (studentIndex === -1) {
      return res.status(403).json({
        success: false,
        message: 'Вы не записаны на этот курс'
      });
    }

    // Проверяем, что студент завершил курс (прогресс 100%)
    if (course.studentsEnrolled[studentIndex].progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Вы должны завершить курс для получения сертификата'
      });
    }

    // Проверяем, что сертификат еще не существует для этого пользователя и курса
    const existingCertificate = await Certificate.findOne({
      userId,
      courseId
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Сертификат уже существует для этого курса'
      });
    }

    // Генерируем сертификат
    const result = await certificateService.generateCertificateWithGrade(
      userId,
      courseId,
      grade,
      score,
      metadata
    );

    res.status(201).json({
      success: true,
      message: 'Сертификат успешно создан',
      data: result
    });
  } catch (error) {
    console.error('Ошибка при создании сертификата:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании сертификата'
    });
  }
});

// Получение сертификатов пользователя
router.get('/my-certificates', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const certificates = await Certificate.find({ userId })
      .populate('courseId', 'title')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments({ userId });

    res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: certificates
    });
  } catch (error) {
    console.error('Ошибка при получении сертификатов пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении сертификатов'
    });
  }
});

// Получение сертификата по ID
router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      $or: [
        { certificateId: req.params.id },
        { _id: req.params.id }
      ]
    })
    .populate('userId', 'firstName lastName email')
    .populate('courseId', 'title');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }

    // Проверяем, имеет ли пользователь доступ к этому сертификату
    const isOwner = certificate.userId._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isInstructor = certificate.courseId &&
      (await Course.findById(certificate.courseId._id)).instructorId.toString() === req.user.id;

    if (!isOwner && !isAdmin && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав для доступа к этому сертификату'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    console.error('Ошибка при получении сертификата:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении сертификата'
    });
  }
});

// Загрузка PDF сертификата
router.get('/download/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      $or: [
        { certificateId: req.params.id },
        { _id: req.params.id }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }

    // Проверяем, имеет ли пользователь доступ к загрузке этого сертификата
    const isOwner = certificate.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isInstructor = certificate.courseId &&
      (await Course.findById(certificate.courseId)).instructorId.toString() === req.user.id;

    if (!isOwner && !isAdmin && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав для загрузки этого сертификата'
      });
    }

    if (!certificate.filePath) {
      return res.status(404).json({
        success: false,
        message: 'Файл сертификата не найден'
      });
    }

    const fullPath = path.join(__dirname, '..', certificate.filePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'Файл сертификата не найден на диске'
      });
    }

    res.download(fullPath, `certificate_${certificate.certificateId}.pdf`, (err) => {
      if (err) {
        console.error('Ошибка при загрузке сертификата:', err);
        res.status(500).json({
          success: false,
          message: 'Ошибка при загрузке файла сертификата'
        });
      }
    });
  } catch (error) {
    console.error('Ошибка при загрузке сертификата:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при загрузке сертификата'
    });
  }
});

// Проверка действительности сертификата
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    const result = await certificateService.verifyCertificate(certificateId);

    res.status(200).json({
      success: result.valid,
      ...result
    });
  } catch (error) {
    console.error('Ошибка при проверке сертификата:', error);
    res.status(500).json({
      success: false,
      valid: false,
      message: 'Ошибка сервера при проверке сертификата'
    });
  }
});

// Получение сертификатов для курса (только инструктор/админ)
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Проверяем, является ли пользователь инструктором курса или админом
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }

    const isInstructor = course.instructorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Нет прав для просмотра сертификатов курса'
      });
    }

    const certificates = await Certificate.find({ courseId })
      .populate('userId', 'firstName lastName email')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments({ courseId });

    res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: certificates
    });
  } catch (error) {
    console.error('Ошибка при получении сертификатов курса:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении сертификатов курса'
    });
  }
});

// Отзыв сертификата (только админ)
router.put('/revoke/:id', protect, authorize('admin'), [
  body('reason', 'Причина отзыва обязательна').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: errors.array()
      });
    }

    const { reason } = req.body;
    const certificate = await Certificate.findOne({
      $or: [
        { certificateId: req.params.id },
        { _id: req.params.id }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }

    certificate.status = 'revoked';
    certificate.revocationReason = reason;
    certificate.revokedAt = new Date();
    
    await certificate.save();

    res.status(200).json({
      success: true,
      message: 'Сертификат успешно отозван',
      data: certificate
    });
  } catch (error) {
    console.error('Ошибка при отзыве сертификата:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при отзыве сертификата'
    });
  }
});

// Продление срока действия сертификата
router.put('/extend/:id', protect, authorize('admin'), [
  body('expiryDate', 'Действительная дата окончания обязательна').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: errors.array()
      });
    }

    const { expiryDate } = req.body;
    const certificate = await Certificate.findOne({
      $or: [
        { certificateId: req.params.id },
        { _id: req.params.id }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }

    certificate.expiryDate = new Date(expiryDate);
    await certificate.save();

    res.status(200).json({
      success: true,
      message: 'Срок действия сертификата успешно продлен',
      data: certificate
    });
  } catch (error) {
    console.error('Ошибка при продлении срока действия сертификата:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Сертификат не найден'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при продлении срока действия сертификата'
    });
  }
});

module.exports = router;