# Практика "Платформа VyKOD"

![GitHub stars](https://img.shields.io/github/stars/plathform/plathorm)
![GitHub forks](https://img.shields.io/github/forks/plathorm/plathorm)
![License](https://img.shields.io/github/license/plathorm/plathorm)

## Описание

Полнофункциональная платформа для онлайн-обучения программированию, построенная на стеке MERN (MongoDB, Express, React, Node.js).

## Функционал

- Управление курсами и уроками
- Система учителей и студентов
- Real-time чат с Socket.io
- Видеозвонки (WebRTC)
- Генерация сертификатов
- JWT аутентификация + Google OAuth
- Система подписок
- AI ассистент для студентов
- Dark Mode
- Мультиязычность (i18n)

## Технологии

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Socket.io Client
- i18next
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- JWT
- Passport.js (Google OAuth)
- bcryptjs
- PDF-lib (сертификаты)



## Установка

### Требования
- Node.js 18+
- MongoDB 7+
- npm или yarn

### Быстрый старт

1. Клонируйте репозиторий:
```bash
git clone https://github.com/plathorm/plathorm.git
cd plathorm
```

2. Установите зависимости:
```bash
npm run install:all
# или вручную
cd server && npm install
cd ../client && npm install
```

3. Настройте переменные окружения:

```bash
# Server
cd server
cp .env.example .env
# Отредактируйте .env с вашими настройками
```

4. Запустите MongoDB (локально или используйте Atlas)

5. Запустите проект:

```bash
# Режим разработки (оба сервера)
npm run dev

# Или отдельно:
npm run dev:server  # Backend: http://localhost:5000
npm run dev:client # Frontend: http://localhost:3000
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/refresh` - Refresh токен

### Пользователи
- `GET /api/users` - Список пользователей
- `GET /api/users/:id` - Профиль пользователя
- `PUT /api/users/:id` - Обновление профиля

### Курсы
- `GET /api/courses` - Список курсов
- `POST /api/courses` - Создание курса
- `GET /api/courses/:id` - Детали курса
- `PUT /api/courses/:id` - Обновление курса

### Уроки
- `GET /api/lessons` - Список уроков
- `POST /api/lessons` - Создание урока

### Сертификаты
- `POST /api/certificates/generate` - Генерация сертификата
- `GET /api/certificates/:id` - Получить сертификат

### WebSocket Events
- `register` - Регистрация пользователя
- `sendMessage` - Отправка сообщения
- `call-user` - Начало видеозвонка

## Docker (опционально)

```bash
# Запуск с Docker Compose
docker-compose up --build
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|-----------|--------------|
| NODE_ENV | Окружение | development |
| PORT | Порт сервера | 5000 |
| MONGO_URI | MongoDB URI | mongodb://localhost:27017/online_school |
| JWT_SECRET | Секрет JWT ключа | - |
| CLIENT_URL | URL фронтенда | http://localhost:3000 |



