# Документация API тестирования

## Обзор
Этот документ описывает конечные точки REST API для системы тестирования в образовательной платформе. Система позволяет студентам проходить викторины, отправлять ответы и просматривать результаты с подробной обратной связью.

## Архитектура

### Основные компоненты

1. **Модель Quiz** (`models/Quiz.js`) - Определяет структуру викторины
   - Связана с курсом
   - Содержит несколько вопросов
   - Настраиваемое ограничение по времени и максимальные попытки
   - Порог проходного балла

2. **Модель Question** (`models/Question.js`) - Определяет отдельные вопросы
   - Поддерживает 4 типа вопросов:
     - `single-choice`: Один правильный ответ из вариантов
     - `multiple-choice`: Несколько правильных ответов
     - `true-false`: Ответ "истина/ложь"
     - `essay`: Текстовый ответ, требующий ручной проверки
   - Каждый вопрос имеет баллы и порядок
   - Включает метод `checkAnswer()` для автоматической проверки

3. **Модель Test** (`models/Test.js`) - Отслеживает попытки прохождения теста
   - Связывает студента, викторину и курс
   - Хранит все ответы с результатами проверки
   - Автоматически рассчитывает баллы
   - Отслеживает номер попытки и статус
   - Поддерживает отслеживание лучшей попытки

### Логика проверки ответов

Система использует полиморфный подход к проверке на основе типа вопроса:

```javascript
// Одиночный выбор: точное совпадение
userAnswer === correctAnswer

// Множественный выбор: массивы должны точно совпадать (независимо от порядка)
JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort())

// Истина/ложь: сравнение булевых значений
Boolean(userAnswer) === Boolean(correctAnswer)

// Эссе: хранится, но не проверяется автоматически (needsGrading: true)
```

### Расчет баллов

- **Автоматически проверяемые вопросы**: Баллы начисляются сразу после отправки ответа
- **Вопросы с эссе**: Баллы = 0 изначально, устанавливаются инструктором
- **Общий балл**: Сумма набранных баллов / Сумма общих баллов * 100
- **Сдать/не сдать**: На основе порога проходного балла викторины
- **Лучшая попытка**: Наивысший балл среди всех попыток отмечается

---

## Базовый URL
`/api/tests`

## Аутентификация
Все конечные точки требуют аутентификации через JWT токен:
```
Authorization: Bearer <token>
```

## Контроль доступа по ролям
- **Студенты**: Могут проходить тесты, отправлять ответы, просматривать свои результаты
- **Инструкторы**: Могут просматривать все попытки студентов для своих викторин
- **Администраторы**: Полный доступ ко всем тестам

---

## Конечные точки

### 1. Начать новый тест
**POST** `/api/tests/start/:quizId`

**Доступ**: Только студенты

**Описание**: Создает новую попытку теста и возвращает вопросы викторины (без правильных ответов)

**Ответ**:
```json
{
  "success": true,
  "message": "Тест успешно начат",
  "data": {
    "test": {
      "_id": "test_id",
      "studentId": "user_id",
      "quizId": "quiz_id",
      "courseId": "course_id",
      "attemptNumber": 1,
      "status": "in-progress",
      "startedAt": "2024-01-01T00:00:00.000Z"
    },
    "quiz": {
      "_id": "quiz_id",
      "title": "Название викторины",
      "description": "Описание викторины",
      "timeLimit": 30,
      "passingScore": 70,
      "questions": [
        {
          "_id": "question_id",
          "questionText": "Что такое...?",
          "type": "single-choice",
          "options": [
            { "optionText": "Вариант A", "_id": "opt1" },
            { "optionText": "Вариант B", "_id": "opt2" }
          ],
          "order": 1,
          "points": 2
        }
      ]
    }
  }
}
```

**Ошибки**:
- 400: Максимальное количество попыток достигнуто, викторина неактивна, уже есть активный тест
- 403: Не записан на курс
- 404: Викторина не найдена

---

### 2. Получить детали теста
**GET** `/api/tests/:id`

**Доступ**: Приватный (владелец теста, инструктор или администратор)

**Описание**: Возвращает прогресс теста и ранее отправленные ответы

**Ответ**:
```json
{
  "success": true,
  "data": {
    "test": {
      "_id": "test_id",
      "status": "in-progress",
      "startedAt": "2024-01-01T00:00:00.000Z",
      "completedAt": null,
      "timeSpent": 120,
      "score": { "percentage": 0, "earnedPoints": 0, "totalPoints": 20 },
      "passed": false,
      "attemptNumber": 1
    },
    "quiz": { ... },
    "questions": [
      {
        "questionId": "question_id",
        "questionText": "Что такое...?",
        "type": "single-choice",
        "options": [...],
        "order": 1,
        "points": 2,
        "userAnswer": "opt1",
        "isCorrect": true,
        "pointsEarned": 2
      }
    ]
  }
}
```

---

### 3. Отправить ответ
**POST** `/api/tests/:id/answer`

**Доступ**: Приватный (только владелец теста)

**Тело запроса**:
```json
{
  "questionId": "question_id",
  "userAnswer": "option_id" // или boolean, array, string в зависимости от типа вопроса
}
```

**Ответ**:
```json
{
  "success": true,
  "message": "Ответ успешно отправлен",
  "data": {
    "isCorrect": true,
    "pointsEarned": 2,
    "needsGrading": false
  }
}
```

**Примечания**:
- Ответы проверяются сразу с использованием метода `checkAnswer()` вопроса
- Баллы начисляются автоматически для автоматически проверяемых вопросов
- Вопросы с эссе отмечаются как `needsGrading: true`

**Ошибки**:
- 400: Тест не в процессе, ошибка валидации, вопрос не найден
- 403: Не авторизован
- 404: Тест или вопрос не найден

---

### 4. Завершить тест
**POST** `/api/tests/:id/complete`

**Доступ**: Приватный (только владелец теста)

**Описание**: Завершает тест, рассчитывает итоговый балл и определяет сдал/не сдал

**Ответ**:
```json
{
  "success": true,
  "message": "Тест успешно завершен",
  "data": {
    "testId": "test_id",
    "score": {
      "totalPoints": 20,
      "earnedPoints": 18,
      "percentage": 90,
      "autoGradedPoints": 18,
      "essayPoints": 0
    },
    "passed": true,
    "isBestAttempt": true,
    "completedAt": "2024-01-01T00:30:00.000Z"
  }
}
```

**Примечания**:
- Рассчитывает итоговый балл из всех отправленных ответов
- Сравнивает с другими попытками, чтобы определить лучший результат
- Устанавливает флаг `isBestAttempt` на лучший результат
- Статус теста меняется на `completed`

**Ошибки**:
- 400: Тест не в процессе
- 403: Не авторизован
- 404: Тест не найден

---

### 5. Получить результаты теста
**GET** `/api/tests/:id/results`

**Доступ**: Приватный (владелец теста, инструктор курса или администратор)

**Описание**: Возвращает подробные результаты теста с правильными ответами и пояснениями

**Ответ**:
```json
{
  "success": true,
  "data": {
    "test": {
      "_id": "test_id",
      "quizId": "quiz_id",
      "quizTitle": "Название викторины",
      "status": "completed",
      "startedAt": "2024-01-01T00:00:00.000Z",
      "completedAt": "2024-01-01T00:30:00.000Z",
      "timeSpent": 1800,
      "score": { "percentage": 90, "earnedPoints": 18, "totalPoints": 20 },
      "passed": true,
      "isBestAttempt": true,
      "attemptNumber": 1
    },
    "answers": [
      {
        "questionId": "question_id",
        "questionText": "Что такое JavaScript?",
        "type": "single-choice",
        "options": [...],
        "order": 1,
        "points": 2,
        "userAnswer": "opt1",
        "isCorrect": true,
        "pointsEarned": 2,
        "needsGrading": false,
        "correctAnswer": "opt1",
        "explanation": "JavaScript это язык программирования..."
      },
      {
        "questionId": "essay_question_id",
        "questionText": "Объясните замыкания...",
        "type": "essay",
        "userAnswer": "Мой текст ответа...",
        "isCorrect": null,
        "pointsEarned": 0,
        "needsGrading": true,
        "correctAnswer": null,
        "explanation": "Требуется ручная проверка"
      }
    ]
  }
}
```

---

### 6. Получить историю тестов
**GET** `/api/tests/history/:quizId`

**Доступ**: Приватный (студент для своей истории, администратор)

**Параметры запроса**:
- `page` (число): Номер страницы
- `limit` (число): Элементов на странице

**Ответ**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "test_id",
      "attemptNumber": 1,
      "status": "completed",
      "startedAt": "2024-01-01T00:00:00.000Z",
      "completedAt": "2024-01-01T00:30:00.000Z",
      "timeSpent": 1800,
      "score": { "percentage": 90 },
      "passed": true,
      "isBestAttempt": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 7. Получить мои тесты
**GET** `/api/tests/my-tests`

**Доступ**: Приватный

**Описание**: Возвращает все попытки тестов текущего студента по всем викторинам

**Параметры запроса**:
- `page` (число): Номер страницы (по умолчанию: 1)
- `limit` (число): Элементов на странице (по умолчанию: 10)

**Ответ**:
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "test_id",
      "quizId": {
        "_id": "quiz_id",
        "title": "Название викторины"
      },
      "courseId": {
        "_id": "course_id",
        "title": "Название курса"
      },
      "attemptNumber": 1,
      "status": "completed",
      "startedAt": "...",
      "completedAt": "...",
      "score": { "percentage": 85 },
      "passed": true,
      "isBestAttempt": true
    }
  ]
}
```

---

### 8. Получить попытки викторины (инструктор/админ)
**GET** `/api/tests/quiz/:quizId/attempts`

**Доступ**: Приватный (инструктор курса или администратор)

**Описание**: Возвращает все попытки студентов для конкретной викторины

**Параметры запроса**:
- `page` (число): Номер страницы (по умолчанию: 1)
- `limit` (число): Элементов на странице (по умолчанию: 20)

**Ответ**:
```json
{
  "success": true,
  "count": 15,
  "total": 50,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "test_id",
      "studentId": {
        "_id": "user_id",
        "firstName": "Иван",
        "lastName": "Петров",
        "email": "ivan@example.com"
      },
      "attemptNumber": 1,
      "status": "completed",
      "startedAt": "...",
      "completedAt": "...",
      "timeSpent": 1800,
      "score": { "percentage": 90 },
      "passed": true,
      "isBestAttempt": true
    }
  ]
}
```

---

### 9. Удалить тест
**DELETE** `/api/tests/:id`

**Доступ**: Приватный
- Студенты могут удалять свои активные тесты
- Администраторы могут удалять любой тест

**Ответ**:
```json
{
  "success": true,
  "message": "Тест успешно удален"
}
```

**Ошибки**:
- 403: Нельзя удалить завершенный тест (если не администратор)
- 404: Тест не найден

---

## Модели данных

### Схема Test
```javascript
{
  studentId: ObjectId (ссылка: User, обязательный)
  quizId: ObjectId (ссылка: Quiz, обязательный)
  courseId: ObjectId (ссылка: Course, обязательный)
  attemptNumber: Number (обязательный)
  status: String (значения: in-progress, completed, expired, graded)
  startedAt: Date (по умолчанию: сейчас)
  completedAt: Date (null до завершения)
  timeSpent: Number (секунды)
  answers: [{
    questionId: ObjectId (ссылка: Question)
    questionOrder: Number
    userAnswer: Mixed
    isCorrect: Boolean
    pointsEarned: Number
    needsGrading: Boolean
    timeSpent: Number (секунд на этот вопрос)
    answeredAt: Date
  }]
  score: {
    totalPoints: Number
    earnedPoints: Number
    percentage: Number (0-100)
    autoGradedPoints: Number
    essayPoints: Number
  }
  passed: Boolean
  isBestAttempt: Boolean
  reviewMode: Boolean
  timestamps: true
}
```

---

## Пример рабочего процесса

1. **Студент начинает викторину**:
   ```
   POST /api/tests/start/:quizId
   → Возвращает викторину с вопросами (без правильных ответов)
   ```

2. **Отправка ответов по одному**:
   ```
   POST /api/tests/:testId/answer
   Body: { "questionId": "...", "userAnswer": "..." }
   → Возвращает немедленную обратную связь (isCorrect, pointsEarned)
   ```

3. **Завершение теста**:
   ```
   POST /api/tests/:testId/complete
   → Рассчитывает итоговый балл, определяет сдал/не сдал
   ```

4. **Просмотр подробных результатов**:
   ```
   GET /api/tests/:testId/results
   → Возвращает все ответы с правильными ответами и пояснениями
   ```

---

## Обработка ошибок

Все конечные точки возвращают соответствующие коды состояния HTTP:

- `200` - Успешно
- `201` - Создано (тест начат)
- `400` - Неверный запрос (валидация, макс. попытки, тест не в процессе)
- `401` - Не авторизован (нет токена)
- `403` - Запрещено (недостаточно прав)
- `404` - Не найдено
- `500` - Внутренняя ошибка сервера

Стандартный ответ об ошибке:
```json
{
  "success": false,
  "message": "Описание ошибки",
  "errors": [...] // необязательно, для ошибок валидации
}
```

---

## Ограничение частоты запросов

Все конечные точки API имеют ограничение частоты:
- Общий API: 100 запросов за 15 минут на IP
- Конечные точки аутентификации: 5 запросов за 15 минут на IP

---

## Функции безопасности

- JWT аутентификация требуется для всех конечных точек теста
- Студенты могут получить доступ только к своим тестам
- Инструкторы могут просматривать только тесты для своих курсов
- Ответы на вопросы с эссе требуют ручной проверки (без автоматической проверки)
- Удаление теста ограничено для активных тестов для студентов

---

## Рассмотрение тестирования

1. **Отслеживание времени**: Система отслеживает время, проведенное на каждом вопросе и общее время теста
2. **Множественные попытки**: Студенты могут пересдавать викторины до `maxAttempts`
3. **Отслеживание лучших результатов**: Наивысший балл отмечается как лучшая попытка
4. **Сохранение прогресса**: Ответы сохраняются сразу, позволяя возобновить тест
5. **Режим просмотра**: Завершенные тесты можно просматривать с правильными ответами

---

## Пример использования с cURL

```bash
# 1. Начать тест
curl -X POST http://localhost:5000/api/tests/start/:quizId \
  -H "Authorization: Bearer <token>"

# 2. Отправить ответ
curl -X POST http://localhost:5000/api/tests/:testId/answer \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"questionId": "q1", "userAnswer": "option1"}'

# 3. Завершить тест
curl -X POST http://localhost:5000/api/tests/:testId/complete \
  -H "Authorization: Bearer <token>"

# 4. Получить результаты
curl http://localhost:5000/api/tests/:testId/results \
  -H "Authorization: Bearer <token>"

# 5. Получить историю тестов
curl http://localhost:5000/api/tests/history/:quizId \
  -H "Authorization: Bearer <token>"