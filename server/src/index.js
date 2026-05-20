require('dotenv').config({ path: require('path').join(__dirname, '../../server/.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const passport = require('./config/passport');
const { getAIAnswer } = require('./utils/aiResponses');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const quizRoutes = require('./routes/quizzes');
const testRoutes = require('./routes/tests');
const certificateRoutes = require('./routes/certificates');
const aiRoutes = require('./routes/ai');
const subscriptionRoutes = require('./routes/subscription');
const googleAuthRoutes = require('./routes/googleAuth');

require('./models/User');
require('./models/Course');
require('./models/Lesson');
require('./models/Quiz');
require('./models/Question');
require('./models/Test');
require('./models/Certificate');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();

app.use(helmet());

const rateLimiter = require('./utils/rateLimiter');
app.use('/api/', rateLimiter.apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(hpp());

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
app.use(passport.initialize());

app.use('/certificates', express.static(path.join(__dirname, 'uploads/certificates')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/auth', googleAuthRoutes);

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

app.use(require('./utils/errorHandler'));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/learning-platform';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Успешное подключение к MongoDB');

    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        origin: uniqueAllowedOrigins,
        credentials: true,
      },
    });

    const onlineUsers = new Map();

    const getSocketIdByUserId = (userId) => onlineUsers.get(String(userId));

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      let currentUserId = null;

      socket.on('register', (userId) => {
        if (!userId) return;

        currentUserId = String(userId);
        onlineUsers.set(currentUserId, socket.id);
        socket.join(currentUserId);
        socket.broadcast.emit('userOnline', currentUserId);
      });

      socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
      });

      socket.on('getMessages', async ({ userId, partnerId }) => {
        try {
          const messages = await Message.find({
            $or: [
              { senderId: userId, receiverId: partnerId },
              { senderId: partnerId, receiverId: userId },
            ],
          }).sort({ createdAt: 1 });

          socket.emit('messagesHistory', messages);
        } catch (error) {
          socket.emit('chatError', { message: 'Не удалось загрузить историю сообщений' });
        }
      });

      socket.on('sendMessage', async (data) => {
        try {
          const { senderId, receiverId, content } = data;
          if (!senderId || !receiverId || !content?.trim()) {
            socket.emit('chatError', { message: 'Некорректные данные сообщения' });
            return;
          }

          const cleanContent = content.trim();
          const message = await Message.create({ senderId, receiverId, content: cleanContent });

          io.to(String(senderId)).emit('newMessage', message);
          io.to(String(receiverId)).emit('newMessage', message);

          const receiverOnline = onlineUsers.has(String(receiverId));
          if (!receiverOnline && String(senderId) !== String(receiverId)) {
            const receiver = await User.findById(receiverId).select('role');
            const shouldReplyAsAI = receiver?.role === 'teacher';

            if (shouldReplyAsAI) {
              const aiAnswer = getAIAnswer(cleanContent);
              const aiMessage = await Message.create({
                senderId: receiverId,
                receiverId: senderId,
                content: aiAnswer,
                isFromAI: true,
              });

              setTimeout(() => {
                io.to(String(senderId)).emit('newMessage', aiMessage);
              }, 500);
            }
          }
        } catch (error) {
          socket.emit('chatError', { message: 'Ошибка отправки сообщения' });
        }
      });

      socket.on('leaveConversation', (conversationId) => {
        socket.leave(conversationId);
      });

      socket.on('call-user', ({ targetUserId, offer, callerUserId }) => {
        const targetSocketId = getSocketIdByUserId(targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('incoming-call', {
            offer,
            callerUserId,
          });
        }
      });

      socket.on('offer', (data) => {
        const targetSocketId = getSocketIdByUserId(data.targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('offer', {
            offer: data.offer,
            senderUserId: data.senderUserId,
          });
        }
      });

      socket.on('answer', (data) => {
        const targetSocketId = getSocketIdByUserId(data.targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('answer', {
            answer: data.answer,
            senderUserId: data.senderUserId,
          });
        }
      });

      socket.on('ice-candidate', (data) => {
        const targetSocketId = getSocketIdByUserId(data.targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('ice-candidate', {
            candidate: data.candidate,
            senderUserId: data.senderUserId,
          });
        }
      });

      socket.on('disconnect', () => {
        let disconnectedUserId = currentUserId;

        if (!disconnectedUserId) {
          for (const [uid, sid] of onlineUsers.entries()) {
            if (sid === socket.id) {
              disconnectedUserId = uid;
              break;
            }
          }
        }

        if (disconnectedUserId) {
          onlineUsers.delete(String(disconnectedUserId));
          socket.broadcast.emit('userOffline', String(disconnectedUserId));
        }
      });
    });

    server.listen(PORT, () => {
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