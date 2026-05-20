const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

class CertificateService {
  constructor() {
    this.certificatesDir = path.join(__dirname, '../certificates');
    fs.ensureDirSync(this.certificatesDir);
  }

  async generateCertificate(userId, courseId, additionalData = {}) {
    try {
      const [user, course] = await Promise.all([
        User.findById(userId).select('firstName lastName email'),
        Course.findById(courseId).select('title')
      ]);

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      if (!course) {
        throw new Error('Курс не найден');
      }

      const pdfDoc = await PDFDocument.create();
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const page = pdfDoc.addPage([600, 800]);
      
      page.drawRectangle({
        x: 50,
        y: 50,
        width: 500,
        height: 700,
        borderColor: rgb(0, 0.53, 0.71), // Синий цвет
        borderWidth: 3,
        color: rgb(1, 1, 1), // Белая заливка
      });

      // Рисуем внутреннюю рамку
      page.drawRectangle({
        x: 60,
        y: 60,
        width: 480,
        height: 680,
        borderColor: rgb(0.8, 0.8, 0.8), // Светло-серый
        borderWidth: 1,
      });

      // Добавляем заголовок
      page.drawText('СЕРТИФИКАТ О ЗАВЕРШЕНИИ', {
        x: 120,
        y: 680,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0.3, 0.6), // Темно-синий
      });

      // Добавляем подзаголовок
      page.drawText('Настоящим подтверждается, что', {
        x: 200,
        y: 630,
        size: 16,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Добавляем имя пользователя
      page.drawText(`${user.firstName} ${user.lastName}`, {
        x: 180,
        y: 580,
        size: 28,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      // Добавляем текст о завершении курса
      page.drawText('успешно завершил(а) курс', {
        x: 130,
        y: 530,
        size: 16,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Добавляем название курса
      page.drawText(`"${course.title}"`, {
        x: 150,
        y: 480,
        size: 20,
        font: helveticaBoldFont,
        color: rgb(0, 0.4, 0.7), // Синий
      });

      const currentDate = new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      page.drawText(`Дата завершения: ${currentDate}`, {
        x: 160,
        y: 420,
        size: 14,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      const certificateId = `ID: CERT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      page.drawText(certificateId, {
        x: 220,
        y: 380,
        size: 12,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawLine({
        start: { x: 100, y: 280 },
        end: { x: 220, y: 280 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText('Подпись инструктора', {
        x: 120,
        y: 260,
        size: 10,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawLine({
        start: { x: 380, y: 280 },
        end: { x: 500, y: 280 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText('Подпись директора', {
        x: 400,
        y: 260,
        size: 10,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawText('Этот сертификат действителен и может быть проверен на нашей платформе', {
        x: 100,
        y: 200,
        size: 10,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawEllipse({
        x: 80,
        y: 700,
        xScale: 15,
        yScale: 15,
        color: rgb(0, 0.53, 0.71),
        opacity: 0.2,
      });

      page.drawEllipse({
        x: 520,
        y: 700,
        xScale: 15,
        yScale: 15,
        color: rgb(0, 0.53, 0.71),
        opacity: 0.2,
      });

      const pdfBytes = await pdfDoc.save();

      const fileName = `certificate_${userId}_${courseId}_${Date.now()}.pdf`;
      const filePath = path.join(this.certificatesDir, fileName);

      await fs.writeFile(filePath, pdfBytes);

      const certificate = new Certificate({
        userId,
        courseId,
        courseTitle: course.title,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        filePath: `/certificates/${fileName}`,
        ...additionalData
      });

      await certificate.save();

      return {
        success: true,
        certificateId: certificate.certificateId,
        verificationCode: certificate.verificationCode,
        filePath: filePath,
        certificate: certificate.toObject()
      };

    } catch (error) {
      console.error('Ошибка при генерации сертификата:', error);
      throw new Error(`Не удалось сгенерировать сертификат: ${error.message}`);
    }
  }

  async generateCertificateWithGrade(userId, courseId, grade, score, metadata = {}) {
    try {
      const [user, course] = await Promise.all([
        User.findById(userId).select('firstName lastName email'),
        Course.findById(courseId)
      ]);

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      if (!course) {
        throw new Error('Курс не найден');
      }

      const pdfDoc = await PDFDocument.create();
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const page = pdfDoc.addPage([600, 800]);
      
      page.drawRectangle({
        x: 50,
        y: 50,
        width: 500,
        height: 700,
        borderColor: rgb(borderColor.r, borderColor.g, borderColor.b),
        borderWidth: 3,
        color: rgb(1, 1, 1),
      });

      page.drawRectangle({
        x: 60,
        y: 60,
        width: 480,
        height: 680,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });

      page.drawText('СЕРТИФИКАТ О ЗАВЕРШЕНИИ', {
        x: 120,
        y: 680,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0.3, 0.6),
      });

      page.drawText('Национальным подтверждается, что', {
        x: 200,
        y: 630,
        size: 16,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(`${user.firstName} ${user.lastName}`, {
        x: 180,
        y: 580,
        size: 28,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      page.drawText('успешно завершил(а) курс', {
        x: 130,
        y: 530,
        size: 16,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      page.drawText(`"${course.title}"`, {
        x: 150,
        y: 480,
        size: 20,
        font: helveticaBoldFont,
        color: rgb(0, 0.4, 0.7),
      });

      if (grade) {
        page.drawText(`Оценка: ${grade}`, {
          x: 240,
          y: 440,
          size: 18,
          font: helveticaBoldFont,
          color: rgb(0, 0.6, 0),
        });
      }

      if (score !== undefined) {
        page.drawText(`Балл: ${score}%`, {
          x: 240,
          y: 410,
          size: 16,
          font: helveticaFont,
          color: rgb(0.2, 0.2, 0.2),
        });
      }

      if (score !== undefined) {
        page.drawText(`Балл: ${score}%`, {
          x: 240,
          y: 410,
          size: 16,
          font: helveticaFont,
          color: rgb(0.2, 0.2, 0.2),
        });
      }

      const currentDate = new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      page.drawText(`Дата завершения: ${currentDate}`, {
        x: 160,
        y: 360,
        size: 14,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      const certificateId = `ID: ${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      page.drawText(`ID сертификата: ${certificateId}`, {
        x: 180,
        y: 330,
        size: 12,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      const verificationCode = `Проверить на: ${process.env.CLIENT_URL || 'https://yoursite.com'}/verify/${certificateId}`;
      page.drawText(verificationCode, {
        x: 100,
        y: 150,
        size: 10,
        font: helveticaObliqueFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawLine({
        start: { x: 100, y: 260 },
        end: { x: 220, y: 260 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText(instructorName, {
        x: 120,
        y: 240,
        size: 10,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawLine({
        start: { x: 380, y: 260 },
        end: { x: 500, y: 260 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawText(directorName, {
        x: 400,
        y: 240,
        size: 10,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      if (customText) {
        page.drawText(customText, {
          x: 100,
          y: 180,
          size: 10,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
        });
      }

      const pdfBytes = await pdfDoc.save();

      const fileName = `certificate_${userId}_${courseId}_${Date.now()}.pdf`;
      const filePath = path.join(this.certificatesDir, fileName);

      await fs.writeFile(filePath, pdfBytes);

      const certificate = new Certificate({
        userId,
        courseId,
        courseTitle: course.title,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        grade,
        score,
        filePath: `/certificates/${fileName}`,
        metadata
      });

      await certificate.save();

      return {
        success: true,
        certificateId: certificate.certificateId,
        verificationCode: certificate.verificationCode,
        filePath: filePath,
        certificate: certificate.toObject()
      };

    } catch (error) {
      console.error('Ошибка при генерации сертификата с оценкой:', error);
      throw new Error(`Не удалось сгенерировать сертификат: ${error.message}`);
    }
  }

  async verifyCertificate(certificateId) {
    try {
      const certificate = await Certificate.findOne({
        $or: [
          { certificateId },
          { verificationCode: certificateId }
        ]
      }).populate('userId', 'firstName lastName email').populate('courseId', 'title');

      if (!certificate) {
        return {
          valid: false,
          message: 'Сертификат не найден'
        };
      }

      const isValid = certificate.isValid();

      return {
        valid: isValid,
        certificate: {
          id: certificate.certificateId,
          verificationCode: certificate.verificationCode,
          userId: certificate.userId._id,
          userName: `${certificate.userId.firstName} ${certificate.userId.lastName}`,
          userEmail: certificate.userId.email,
          courseId: certificate.courseId._id,
          courseTitle: certificate.courseId.title,
          issueDate: certificate.issueDate,
          expiryDate: certificate.expiryDate,
          grade: certificate.grade,
          score: certificate.score,
          status: certificate.status
        },
        message: isValid ? 'Сертификат действителен' : 'Сертификат недействителен'
      };
    } catch (error) {
      console.error('Ошибка при проверке сертификата:', error);
      return {
        valid: false,
        message: 'Ошибка при проверке сертификата'
      };
    }
  }

  async getUserCertificates(userId) {
    try {
      const certificates = await Certificate.find({ userId })
        .populate('courseId', 'title')
        .sort({ issueDate: -1 });

      return certificates;
    } catch (error) {
      console.error('Ошибка при получении сертификатов пользователя:', error);
      throw new Error(`Не удалось получить сертификаты пользователя: ${error.message}`);
    }
  }

  async getCourseCertificates(courseId) {
    try {
      const certificates = await Certificate.find({ courseId })
        .populate('userId', 'firstName lastName email')
        .sort({ issueDate: -1 });

      return certificates;
    } catch (error) {
      console.error('Ошибка при получении сертификатов курса:', error);
      throw new Error(`Не удалось получить сертификаты курса: ${error.message}`);
    }
  }

  async updateDiplomaSettings(courseId, settings) {
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error('Курс не найден');
      }

      course.diplomaSettings = {
        ...course.diplomaSettings,
        ...settings
      };

      await course.save();

      return course.diplomaSettings;
    } catch (error) {
      console.error('Ошибка при обновлении настроек диплома:', error);
      throw new Error(`Не удалось обновить настройки диплома: ${error.message}`);
    }
  }
}

module.exports = new CertificateService();