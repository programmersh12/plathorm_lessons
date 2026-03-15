# Документация API курсов

## Обзор
Этот документ описывает конечные точки REST API для управления курсами в образовательной платформе. API предоставляет полные операции CRUD, регистрацию студентов, связь с преподавателями и контроль ролей.

## Базовый URL
`/api/courses`

## Аутентификация
Все конечные точки, кроме `GET /` и `GET /:id`, требуют аутентификации через JWT токен в заголовке:
```
Authorization: Bearer <token>
```

## Контроль доступа по ролям
- **Студенты**: Могут записываться на курсы, отменять запись, обновлять свой прогресс, просматривать свои курсы
- **Преподаватели**: Могут создавать, обновлять, удалять свои курсы, просматривать свои курсы
- **Администраторы**: Имеют полный доступ ко всем курсам

---

## Конечные точки

### 1. Получить все курсы
**GET** `/api/courses`

**Доступ**: Публичный

**Параметры запроса**:
- `page` (число): Номер страницы (по умолчанию: 1)
- `limit` (число): Элементов на странице (по умолчанию: 10)
- `category` (строка): Фильтр по категории
- `level` (строка): Фильтр по уровню (начальный, средний, продвинутый)
- `instructor` (строка): Фильтр по ID преподавателя
- `search` (строка): Поиск по названию и описанию

**Ответ**:
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "course_id",
      "title": "Название курса",
      "description": "Описание курса",
      "category": "Программирование",
      "instructorId": {
        "_id": "instructor_id",
        "firstName": "Иван",
        "lastName": "Петров",
        "profilePicture": null
      },
      "price": 99.99,
      "duration": 20,
      "level": "начальный",
      "rating": {
        "average": 4.5,
        "count": 25
      },
      "studentCount": 150,
      "isPublished": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Получить один курс
**GET** `/api/courses/:id`

**Доступ**: Публичный (курсы без публикации требуют роль преподавателя/администратора)

**Ответ**:
```json
{
  "success": true,
  "data": {
    "_id": "course_id",
    "title": "Название курса",
    "description": "Описание курса",
    "category": "Программирование",
    "instructorId": {
      "_id": "instructor_id",
      "firstName": "Иван",
      "lastName": "Петров",
      "profilePicture": null
    },
    "price": 99.99,
    "duration": 20,
    "level": "начальный",
    "requirements": ["Базовые навыки работы с компьютером"],
    "objectives": ["Изучить основы программирования"],
    "curriculum": [
      {
        "sectionTitle": "Введение",
        "lessons": [
          {
            "_id": "lesson_id",
            "title": "Урок 1",
            "order": 1,
            "type": "video",
            "duration": 15,
            "isPreview": true
          }
        ]
      }
    ],
    "studentsEnrolled": [
      {
        "userId": "user_id",
        "enrollmentDate": "2024-01-01T00:00:00.000Z",
        "progress": 50,
        "status": "enrolled",
        "completedAt": null
      }
    ],
    "rating": {
      "average": 4.5,
      "count": 25
    },
    "reviews": [],
    "isPublished": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Создать курс
**POST** `/api/courses`

**Доступ**: Приватный (только преподаватели или администраторы)

**Тело запроса**:
```json
{
  "title": "Новый курс",
  "description": "Описание курса",
  "category": "Программирование",
  "level": "начальный",
  "price": 99.99,
  "duration": 20,
  "requirements": ["Базовые навыки"],
  "objectives": ["Изучить что-то"],
  "curriculum": [
    {
      "sectionTitle": "Раздел 1",
      "lessons": ["lesson_id1", "lesson_id2"]
    }
  ],
  "isPublished": false
}
```

**Ответ**:
```json
{
  "success": true,
  "message": "Курс успешно создан",
  "data": {
    "_id": "new_course_id",
    "title": "Новый курс",
    "instructorId": "user_id",
    ...
  }
}
```

---

### 4. Обновить курс
**PUT** `/api/courses/:id`

**Доступ**: Приватный (владелец курса или администратор)

**Тело запроса**: То же, что и при создании, все поля необязательны

**Ответ**:
```json
{
  "success": true,
  "message": "Курс успешно обновлен",
  "data": {
    "_id": "course_id",
    ...
  }
}
```

---

### 5. Удалить курс
**DELETE** `/api/courses/:id`

**Доступ**: Приватный (владелец курса или администратор)

**Ответ**:
```json
{
  "success": true,
  "message": "Курс успешно удален"
}
```

---

### 6. Записаться на курс
**POST** `/api/courses/:id/enroll`

**Доступ**: Приватный (только студенты)

**Ответ**:
```json
{
  "success": true,
  "message": "Успешно записались на курс",
  "data": {
    "courseId": "course_id",
    "title": "Название курса"
  }
}
```

**Ошибки**:
- 400: Уже записаны на курс
- 403: Пользователь не является студентом

---

### 7. Отменить запись с курса
**DELETE** `/api/courses/:id/unenroll`

**Доступ**: Приватный
- Студенты могут отменить свою запись
- Преподаватели могут удалить студентов из своих курсов
- Администраторы могут удалить любого студента

**Ответ**:
```json
{
  "success": true,
  "message": "Успешно отменили запись с курса"
}
```

**Ошибки**:
- 400: Не записаны на курс
- 403: Нет прав на отмену записи

---

### 8. Получить мои курсы
**GET** `/api/courses/my-courses`

**Доступ**: Приватный

**Ответ**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "course_id",
      "title": "Мой курс",
      "description": "...",
      "instructorId": {
        "_id": "instructor_id",
        "firstName": "Иван",
        "lastName": "Петров"
      },
      "studentsEnrolled": [
        {
          "userId": "user_id",
          "enrollmentDate": "2024-01-01T00:00:00.000Z",
          "progress": 75,
          "status": "enrolled",
          "completedAt": null
        }
      ]
    }
  ]
}
```

---

### 9. Получить курсы преподавателя
**GET** `/api/courses/instructor/:instructorId`

**Доступ**: Публичный (только опубликованные курсы)

**Ответ**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "course_id",
      "title": "Курс преподавателя",
      ...
    }
  ]
}
```

---

### 10. Обновить прогресс курса
**PUT** `/api/courses/:id/progress`

**Доступ**: Приватный (только студенты)

**Тело запроса**:
```json
{
  "progress": 75
}
```

**Ответ**:
```json
{
  "success": true,
  "message": "Прогресс успешно обновлен",
  "data": {
    "courseId": "course_id",
    "progress": 75,
    "status": "enrolled"
  }
}
```

**Примечания**:
- Прогресс должен быть числом от 0 до 100
- Если прогресс достигает 100%, статус автоматически меняется на "completed" и устанавливается `completedAt`
- Если прогресс меньше 100%, статус "enrolled"

---

## Модели данных

### Схема Course
```javascript
{
  title: String (обязательный, макс. 100)
  description: String (обязательный, макс. 2000)
  category: String (обязательный)
  instructorId: ObjectId (ссылка: User, обязательный)
  thumbnail: String (необязательный)
  price: Number (по умолчанию: 0, мин.: 0)
  duration: Number (часы, по умолчанию: 0)
  level: String (значения: начальный, средний, продвинутый)
  requirements: [String]
  objectives: [String]
  curriculum: [{
    sectionTitle: String,
    lessons: [ObjectId (ссылка: Lesson)]
  }]
  studentsEnrolled: [{
    userId: ObjectId (ссылка: User, обязательный)
    enrollmentDate: Date (по умолчанию: сейчас)
    progress: Number (0-100, по умолчанию: 0)
    completedAt: Date (null по умолчанию)
    status: String (значения: enrolled, completed, dropped)
  }]
  rating: {
    average: Number (0-5, по умолчанию: 0)
    count: Number (по умолчанию: 0)
  }
  reviews: [{
    userId: ObjectId (ссылка: User)
    rating: Number (1-5)
    comment: String (макс. 1000)
    createdAt: Date
  }]
  isPublished: Boolean (по умолчанию: false)
  timestamps: true
}
```

---

## Обработка ошибок

Все конечные точки возвращают соответствующие коды состояния HTTP:

- `200` - Успешно
- `201` - Создано
- `400` - Неверный запрос (ошибки валидации)
- `401` - Не авторизован (нет токена или неверный токен)
- `403` - Запрещено (недостаточно прав)
- `404` - Не найдено
- `500` - Внутренняя ошибка сервера

Стандартный формат ответа об ошибке:
```json
{
  "success": false,
  "message": "Описание ошибки",
  "errors": [...] // необязательно, для ошибок валидации
}
```

---

## Ограничение частоты запросов

Все конечные точки API ограничены, чтобы предотвратить злоупотребление:
- Общий API: 100 запросов за 15 минут на IP
- Конечные точки аутентификации: 5 запросов за 15 минут на IP

---

## Функции безопасности

- Helmet.js для заголовков безопасности
- CORS настроен для конкретных источников
- Защита от XSS
- Предотвращение загрязнения параметров
- JWT аутентификация
- Авторизация на основе ролей

---

## Тестирование API

Вы можете тестировать конечные точки с помощью таких инструментов, как:
- Postman
- curl
- Insomnia

Пример команд curl:

```bash
# Получить все курсы
curl http://localhost:5000/api/courses

# Получить один курс
curl http://localhost:5000/api/courses/:id

# Создать курс (с аутентификацией)
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Новый курс","description":"...","category":"Программирование","level":"начальный"}'

# Записаться на курс
curl -X POST http://localhost:5000/api/courses/:id/enroll \
  -H "Authorization: Bearer <token>"

# Получить мои курсы
curl http://localhost:5000/api/courses/my-courses \
  -H "Authorization: Bearer <token>"

# Обновить прогресс
curl -X PUT http://localhost:5000/api/courses/:id/progress \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'