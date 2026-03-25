const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

dotenv.config();

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const quizRoutes = require('./routes/quizzes');
const testRoutes = require('./routes/tests');
const certificateRoutes = require('./routes/certificates');

require('./models/User');
require('./models/Course');
require('./models/Lesson');
require('./models/Quiz');
require('./models/Question');
require('./models/Test');
require('./models/Certificate');

app.use(helmet());

app.use('/api/', require('./utils/rateLimiter').apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(hpp());

// Настройка CORS для безопасности
const parseAllowedOrigins = (origins) =>
  (origins || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseAllowedOrigins(process.env.CLIENT_URL),
  ...parseAllowedOrigins(process.env.CORS_ORIGIN),
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (uniqueAllowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));

app.use(morgan('combined'));

app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// API маршруты для аутентификации
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/tests', testRoutes); // Маршруты тестирования
app.use('/api/certificates', certificateRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Не найден маршрут ${req.originalUrl} на этом сервере!`
  });
});

// Обработчик ошибок
app.use(require('./utils/errorHandler'));

// Подключение к MongoDB и запуск сервера
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Успешное подключение к MongoDB');
  
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Окружение: ${process.env.NODE_ENV || 'development'}`);
  });
})
.catch((error) => {
  console.error('Ошибка подключения к MongoDB:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('\nПолучен SIGINT. Корректное завершение работы...');
  await mongoose.connection.close();
  process.exit(0);
});