const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

// Загрузка переменных окружения
dotenv.config();

// Инициализация express приложения
const app = express();

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const quizRoutes = require('./routes/quizzes');
const testRoutes = require('./routes/tests'); // Маршруты попыток тестирования
const certificateRoutes = require('./routes/certificates');

// Импорт моделей для загрузки
require('./models/User');
require('./models/Course');
require('./models/Lesson');
require('./models/Quiz');
require('./models/Question');
require('./models/Test');
require('./models/Certificate');

// Установка заголовков безопасности HTTP
app.use(helmet());

// Ограничение запросов с одного IP
app.use('/api/', require('./utils/rateLimiter').apiLimiter);

// Middleware для парсинга тела
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Санитизация данных от XSS
app.use(xss());

// Предотвращение загрязнения параметров
app.use(hpp());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware для логирования
app.use(morgan('combined'));

// Обслуживание статических файлов из директории сертификатов
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/tests', testRoutes); // Маршруты попыток тестирования
app.use('/api/certificates', certificateRoutes);

// Эндпоинт проверки работоспособности
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Обработчик 404
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Не найден маршрут ${req.originalUrl} на этом сервере!`
  });
});

// Middleware глобального обработчика ошибок
app.use(require('./utils/errorHandler'));

// Подключение к MongoDB и запуск сервера
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Успешное подключение к MongoDB');
  
  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Окружение: ${process.env.NODE_ENV || 'development'}`);
  });
})
.catch((error) => {
  console.error('Ошибка подключения к MongoDB:', error);
  process.exit(1);
});

// Корректное завершение работы
process.on('SIGINT', async () => {
  console.log('\nПолучен SIGINT. Корректное завершение работы...');
  await mongoose.connection.close();
  process.exit(0);
});