const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Certificate = require('./models/Certificate');
const certificateService = require('./services/certificateService');

async function testCertificates() {
  try {
    // Подключение к базе данных
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Тестирование функциональности сертификатов...\n');

    // 1. Поиск пользователей и курсов
    console.log('1. Поиск тестовых пользователей и курсов...');
    const student = await User.findOne({ role: 'student' });
    const instructor = await User.findOne({ role: 'teacher' });
    const course = await Course.findOne({ instructorId: instructor._id });

    if (!student || !instructor || !course) {
      console.log('❌ Тестовые данные не найдены. Пожалуйста, создайте сначала студента, инструктора и курс.');
      return;
    }

    console.log(`✓ Найден студент: ${student.firstName} ${student.lastName}`);
    console.log(`✓ Найден инструктор: ${instructor.firstName} ${instructor.lastName}`);
    console.log(`✓ Найден курс: ${course.title}`);

    // 2. Тест генерации сертификата
    console.log('\n2. Тестирование генерации сертификата...');
    
    // Добавляем студента в курс, если он еще не записан
    const isEnrolled = course.studentsEnrolled.some(enrollment =>
      enrollment.userId.toString() === student._id.toString()
    );
    
    if (!isEnrolled) {
      course.studentsEnrolled.push({
        userId: student._id,
        enrollmentDate: new Date(),
        progress: 100, // Завершаем курс
        status: 'completed',
        completedAt: new Date()
      });
      await course.save();
      console.log('✓ Студент записан и завершил курс');
    } else {
      // Обновляем прогресс до 100%, если еще не достигнут
      const studentIndex = course.studentsEnrolled.findIndex(enrollment =>
        enrollment.userId.toString() === student._id.toString()
      );
      if (course.studentsEnrolled[studentIndex].progress < 100) {
        course.studentsEnrolled[studentIndex].progress = 100;
        course.studentsEnrolled[studentIndex].status = 'completed';
        course.studentsEnrolled[studentIndex].completedAt = new Date();
        await course.save();
        console.log('✓ Прогресс студента обновлен до 100%');
      }
    }

    // 3. Генерация сертификата
    console.log('\n3. Генерация сертификата...');
    const result = await certificateService.generateCertificateWithGrade(
      student._id,
      course._id,
      'A+',
      98,
      {
        totalDuration: course.duration || 20,
        totalLessons: 10,
        completedLessons: 10,
        completionPercentage: 100
      }
    );

    console.log('✓ Сертификат успешно сгенерирован!');
    console.log(`  - ID сертификата: ${result.certificateId}`);
    console.log(`  - Код проверки: ${result.verificationCode}`);
    console.log(`  - Путь к файлу: ${result.filePath}`);

    // 4. Тест проверки сертификата
    console.log('\n4. Тестирование проверки сертификата...');
    const verificationResult = await certificateService.verifyCertificate(result.certificateId);
    
    if (verificationResult.valid) {
      console.log('✓ Проверка сертификата успешна!');
      console.log(`  - Действителен: ${verificationResult.valid}`);
      console.log(`  - Имя: ${verificationResult.certificate.userName}`);
      console.log(`  - Курс: ${verificationResult.certificate.courseTitle}`);
      console.log(`  - Оценка: ${verificationResult.certificate.grade}`);
      console.log(`  - Балл: ${verificationResult.certificate.score}%`);
    } else {
      console.log('❌ Проверка сертификата не удалась:', verificationResult.message);
    }

    // 5. Тест проверки с кодом проверки
    console.log('\n5. Тестирование проверки с кодом проверки...');
    const verificationResult2 = await certificateService.verifyCertificate(result.verificationCode);
    
    if (verificationResult2.valid) {
      console.log('✓ Проверка с кодом успешна!');
    } else {
      console.log('❌ Проверка с кодом не удалась:', verificationResult2.message);
    }

    // 6. Тест получения сертификатов пользователя
    console.log('\n6. Тестирование получения сертификатов пользователя...');
    const userCertificates = await certificateService.getUserCertificates(student._id);
    console.log(`✓ Получено ${userCertificates.length} сертификатов для пользователя`);

    // 7. Тест метода проверки действительности сертификата
    console.log('\n7. Тестирование метода проверки действительности сертификата...');
    const certificate = await Certificate.findById(result.certificate._id);
    const isValid = certificate.isValid();
    console.log(`✓ Действительность сертификата: ${isValid}`);

    // 8. Очистка - удаление тестового сертификата
    console.log('\n8. Очистка тестового сертификата...');
    await Certificate.findByIdAndDelete(result.certificate._id);
    console.log('✓ Тестовый сертификат удален.');

    console.log('\n🎉 Все тесты сертификатов успешно пройдены!');
    
  } catch (error) {
    console.error('❌ Ошибка во время тестирования сертификатов:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
  }
}

// Запуск теста
testCertificates();