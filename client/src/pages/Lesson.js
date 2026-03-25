import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [lesson, setLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalStreak, setTotalStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [showTheory, setShowTheory] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockLessons = {
        '1': {
          id: 1,
          courseId: courseId,
          title: 'Основы React компонентов',
          type: 'theory-practice',
          xp: 50,
          content: {
            theory: {
              title: 'Теория: Основы React компонентов',
              text: `React компоненты — это строительные блоки любого React приложения. Это независимые, многократно используемые части интерфейса.

Что такое компоненты?
Компоненты похожи на пользовательские HTML-элементы. Они позволяют разделить интерфейс на независимые, многократно используемые части.

Два типа компонентов:

1️⃣ ФУНКЦИОНАЛЬНЫЕ КОМПОНЕНТЫ (Рекомендуется)
• Простые JavaScript функции
• Возвращают JSX (HTML-подобный синтаксис)
• Легче писать и понимать
• Предпочтительны в современном React

2️⃣ КЛАССОВЫЕ КОМПОНЕНТЫ
• ES6 классы, расширяющие React.Component
• Имеют больше возможностей (методы жизненного цикла)
• Используются в старом коде

Пример функционального компонента:

function Welcome({ name }) {
  return <h1>Привет, {name}!</h1>;
}

Ключевые моменты:
• Компоненты получают входные данные called "props"
• Они должны возвращать один корневой элемент
• Имена компонентов должны начинаться с большой буквы
• Думайте о компонентах как о LEGO-блоках!`,
              imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop',
              tips: [
                'Всегда начинайте имена компонентов с большой буквы',
                'Props доступны только для чтения — никогда не изменяйте их напрямую',
                'Делайте компоненты маленькими и сфокусированными на одной задаче'
              ]
            },
            practice: {
              title: 'Практика: Проверь свои знания',
              questions: [
                {
                  id: 1,
                  question: 'Какой правильный способ создать функциональный компонент в React?',
                  options: [
                    'function MyComponent() { return <div>Привет</div>; }',
                    'class MyComponent extends React.Element',
                    'let MyComponent = <div>Привет</div>',
                    'const MyComponent = <div>Привет</div>'
                  ],
                  correctAnswer: 0,
                  explanation: 'Функциональные компоненты определяются как JavaScript функции, которые возвращают JSX. Они должны начинаться с большой буквы.',
                  type: 'single'
                },
                {
                  id: 2,
                  question: 'Что такое "props" в React?',
                  options: [
                    'Внутреннее состояние компонента',
                    'Данные, передаваемые от родителя к дочернему компоненту',
                    'CSS стили',
                    'Подключения к базе данных'
                  ],
                  correctAnswer: 1,
                  explanation: 'Props (сокращение от properties) — это входные данные, передаваемые от родительских компонентов дочерним компонентам.',
                  type: 'single'
                },
                {
                  id: 3,
                  question: 'Какое утверждение о React компонентах ВЕРНО?',
                  options: [
                    'Компоненты всегда должны быть классовыми',
                    'Компоненты могут быть вложены в другие компоненты',
                    'Компоненты не могут возвращать массивы',
                    'Компоненты должны иметь метод render'
                  ],
                  correctAnswer: 1,
                  explanation: 'Одна из основных концепций React — композиция: вы можете использовать компоненты внутри других компонентов для создания сложных интерфейсов.',
                  type: 'single'
                },
                {
                  id: 4,
                  question: 'Что означает JSX?',
                  options: [
                    'JavaScript XML',
                    'Java Syntax Extension',
                    'JSON XML',
                    'JavaScript Extra'
                  ],
                  correctAnswer: 0,
                  explanation: 'JSX расшифровывается как JavaScript XML. Это позволяет писать HTML-подобный синтаксис в JavaScript.',
                  type: 'single'
                },
                {
                  id: 5,
                  question: 'В чем главное преимущество React компонентов?',
                  options: [
                    'Более быстрые запросы к базе данных',
                    'Повторное использование и модульность',
                    'Автоматическое стилизация',
                    'Только серверный рендеринг'
                  ],
                  correctAnswer: 1,
                  explanation: 'Компоненты позволяют разделить интерфейс на независимые, многократно используемые части — как LEGO-блоки!',
                  type: 'single'
                }
              ]
            }
          }
        },
        '2': {
          id: 2,
          courseId: courseId,
          title: 'Основы JSX',
          type: 'theory-practice',
          xp: 50,
          content: {
            theory: {
              title: 'Теория: Основы JSX',
              text: `JSX — это синтаксическое расширение для JavaScript, которое позволяет писать HTML-подобную разметку внутри JavaScript файлов.

Зачем нужен JSX?
Вместо разделения разметки и логики в разные файлы, React объединяет их с помощью JSX.

Основные правила JSX:
• Возвращайте один корневой элемент
• Закрывайте все теги (<br />, а не <br>)
• Используйте camelCase для атрибутов
• Используйте className вместо class

Базовый пример:

const element = <h1>Привет, мир!</h1>;

Использование переменных:

const name = "Анна";
const element = <h1>Привет, {name}!</h1>;

Использование выражений:

const a = 5;
const b = 10;
const element = <h1>{a + b} равно 15</h1>;

Использование компонентов в JSX:

function Greeting({ name }) {
  return <h1>Привет, {name}!</h1>;
}

const element = <Greeting name="Мария" />;`,
              imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=300&fit=crop',
              tips: [
                'JSX не обязателен, но делает код React чище',
                'Используйте фигурные скобки {} для JavaScript выражений',
                'В JSX используется className вместо class'
              ]
            },
            practice: {
              title: 'Практика: Викторина по JSX',
              questions: [
                {
                  id: 1,
                  question: 'Что означает JSX?',
                  options: [
                    'JavaScript XML',
                    'Java Syntax Extension', 
                    'JSON XML',
                    'JavaScript Extra'
                  ],
                  correctAnswer: 0,
                  explanation: 'JSX расшифровывается как JavaScript XML. Это позволяет писать HTML-подобный синтаксис в JavaScript.',
                  type: 'single'
                },
                {
                  id: 2,
                  question: 'Как добавить CSS класс к элементу в JSX?',
                  options: [
                    'class="text"',
                    'className="text"',
                    'cssClass="text"',
                    'style="text"'
                  ],
                  correctAnswer: 1,
                  explanation: 'В JSX используется className вместо class, потому что class — это зарезервированное слово в JavaScript.',
                  type: 'single'
                },
                {
                  id: 3,
                  question: 'Как вставить JavaScript переменную в JSX?',
                  options: [
                    '<h1>$variable</h1>',
                    '<h1>{variable}</h1>',
                    '<h1>{{variable}}</h1>',
                    '<h1>${variable}</h1>'
                  ],
                  correctAnswer: 1,
                  explanation: 'Используйте фигурные скобки {} для вставки любого JavaScript выражения в JSX.',
                  type: 'single'
                },
                {
                  id: 4,
                  question: 'Что отрендерит этот код: const x = <div>Привет</div>?',
                  options: [
                    'Ошибка',
                    'Элемент div с текстом "Привет"',
                    'Строку "divПривет"',
                    'Ничего'
                  ],
                  correctAnswer: 1,
                  explanation: 'JSX выглядит как HTML, но создаёт React элементы. Это создаёт правильный DOM элемент.',
                  type: 'single'
                }
              ]
            }
          }
        },
        '3': {
          id: 3,
          courseId: courseId,
          title: 'React как библиотека для UI',
          type: 'theory-practice',
          xp: 50,
          content: {
            theory: {
              title: 'Теория: React для создания пользовательских интерфейсов',
              text: `React — это JavaScript библиотека для создания пользовательских интерфейсов, разработанная Facebook.

Основные цели React:
• Архитектура на основе компонентов
• Декларативный подход
• Изучи один раз, пиши везде

На основе компонентов:
Создавайте инкапсулированные компоненты, которые управляют своим состоянием, а затем объединяйте их для создания сложных интерфейсов.

Декларативность:
React делает безболезненным создание интерактивных интерфейсов. Создавайте простые представления для каждого состояния вашего приложения.

Виртуальный DOM:
React создаёт виртуальную копию DOM в памяти. Когда состояние изменяется, React сравнивает новый виртуальный DOM с предыдущим и обновляет только изменившиеся части.

Ключевые особенности:
• Односторонний поток данных
• Виртуальный DOM для производительности
• Богатая экосистема
• Синтаксис JSX
• Серверный рендеринг

Когда использовать React:
• Одностраничные приложения (SPA)
• Интерактивные дашборды
• Приложения социальных сетей
• Интернет-магазины
• Любой динамичный пользовательский интерфейс`,
              imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop',
              tips: [
                'React — это библиотека, а не фреймворк',
                'Он фокусируется только на слое UI',
                'Хорошо работает с другими библиотеками для маршрутизации, управления состоянием и т.д.'
              ]
            },
            practice: {
              title: 'Практика: Викторина по React',
              questions: [
                {
                  id: 1,
                  question: 'Для чего в основном используется React?',
                  options: [
                    'Backend разработка',
                    'Управление базой данных',
                    'Создание пользовательских интерфейсов',
                    'Операционные системы'
                  ],
                  correctAnswer: 2,
                  explanation: 'React — это JavaScript библиотека, предназначенная специально для создания пользовательских интерфейсов.',
                  type: 'single'
                },
                {
                  id: 2,
                  question: 'Что такое Виртуальный DOM?',
                  options: [
                    'Физическое устройство DOM',
                    'Облегчённая копия реального DOM в памяти',
                    'CSS фреймворк',
                    'Система базы данных'
                  ],
                  correctAnswer: 1,
                  explanation: 'Виртуальный DOM — это концепция, при которой React хранит облегчённую копию реального DOM в памяти для лучшей производительности.',
                  type: 'single'
                },
                {
                  id: 3,
                  question: 'Кто разработал React?',
                  options: [
                    'Google',
                    'Microsoft',
                    'Facebook (Meta)',
                    'Amazon'
                  ],
                  correctAnswer: 2,
                  explanation: 'React был разработан Facebook (ныне Meta) и выпущен как open source в 2013 году.',
                  type: 'single'
                },
                {
                  id: 4,
                  question: 'Какой тип потока данных использует React?',
                  options: [
                    'Двустороннее связывание',
                    'Односторонний (направленный) поток данных',
                    'Нет потока данных',
                    'Случайный поток данных'
                  ],
                  correctAnswer: 1,
                  explanation: 'React использует односторонний поток данных — данные передаются от родителя к ребёнку через props.',
                  type: 'single'
                }
              ]
            }
          }
        }
      };

      const selectedLesson = mockLessons[lessonId] || mockLessons['1'];
      setLesson(selectedLesson);
      setLoading(false);
    }, 500);
  }, [courseId, lessonId]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (lesson && lesson.content.practice.questions[currentQuestion]) {
      const isCorrect = selectedAnswer === lesson.content.practice.questions[currentQuestion].correctAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        setStreak(streak + 1);
        if (streak + 1 > totalStreak) {
          setTotalStreak(streak + 1);
        }
      } else {
        setStreak(0);
        setHearts(Math.max(0, hearts - 1));
      }
      
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < lesson.content.practice.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleCompleteLesson = () => {
    alert(t('lessonCompleted', `🎉 Урок завершён! Вы заработали ${lesson.xp} XP!`));
    navigate(`/courses/${courseId}`);
  };

  // Duolingo-style progress bar
  const renderProgressBar = () => {
    const progress = ((currentQuestion + 1) / lesson.content.practice.questions.length) * 100;
    return (
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        marginBottom: '20px'
      }}>
        {lesson.content.practice.questions.map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              backgroundColor: index < currentQuestion 
                ? '#58cc02' 
                : index === currentQuestion 
                  ? '#58cc02' 
                  : '#e5e5e5',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>{t('loadingLesson', 'Загрузка урока...')}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>😕</div>
        <p>{t('lessonNotFound', 'Урок не найден')}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#fff'
    }}>
      {/* Duolingo-style Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        padding: '16px 20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '16px'
      }}>
        {/* Left: Back button and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(`/courses/${courseId}`)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e5e5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ←
          </button>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700',
              color: '#3c3c3c'
            }}>
              {lesson.title}
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '14px', 
              color: '#8c8c8c',
              fontWeight: '500'
            }}>
              {`Вопрос ${currentQuestion + 1} из ${lesson.content.practice.questions.length}`}
            </p>
          </div>
        </div>

        {/* Right: Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Hearts */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: hearts > 0 ? '#fff' : '#f7f7f7',
            padding: '8px 14px',
            borderRadius: '20px',
            border: '2px solid',
            borderColor: hearts > 0 ? '#ff4b4b' : '#e5e5e5'
          }}>
            <span style={{ marginRight: '6px', fontSize: '18px' }}></span>
            <span style={{ 
              fontWeight: '700', 
              color: hearts > 0 ? '#ff4b4b' : '#8c8c8c'
            }}>
              {hearts}
            </span>
          </div>
          {/* Streak */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: streak > 0 ? '#fff' : '#f7f7f7',
            padding: '8px 14px',
            borderRadius: '20px',
            border: '2px solid',
            borderColor: streak > 0 ? '#ffc800' : '#e5e5e5',
            boxShadow: streak > 0 ? '0 2px 8px rgba(255,200,0,0.3)' : 'none'
          }}>
            <span style={{ marginRight: '6px', fontSize: '18px' }}></span>
            <span style={{ 
              fontWeight: '700', 
              color: streak > 0 ? '#3c3c3c' : '#8c8c8c'
            }}>
              {streak}
            </span>
          </div>
          {/* XP */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#fff',
            padding: '8px 14px',
            borderRadius: '20px',
            border: '2px solid #ffd700'
          }}>
            <span style={{ marginRight: '6px', fontSize: '18px' }}>⭐</span>
            <span style={{ fontWeight: '700', color: '#3c3c3c' }}>
              {lesson.xp} XP
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Toggle between Theory and Practice */}
      {!completed && (
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setShowTheory(true)}
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: showTheory ? '#1cb0f6' : '#f7f7f7',
              color: showTheory ? 'white' : '#8c8c8c',
              boxShadow: showTheory ? '0 4px 0 #1496d4' : 'none'
            }}
          >
            Теория
          </button>
          <button
            onClick={() => setShowTheory(false)}
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: !showTheory ? '#58cc02' : '#f7f7f7',
              color: !showTheory ? 'white' : '#8c8c8c',
              boxShadow: !showTheory ? '0 4px 0 #46a302' : 'none'
            }}
          >
            Практика
          </button>
        </div>
      )}

      {/* Theory Section */}
      {showTheory && !completed && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#1cb0f6', 
            marginBottom: '16px',
            fontSize: '22px',
            fontWeight: '700'
          }}>
            {lesson.content.theory.title}
          </h2>
          
          {/* Theory Image */}
          {lesson.content.theory.imageUrl && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={lesson.content.theory.imageUrl} 
                alt="Иллюстрация теории" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxHeight: '250px',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
          
          {/* Theory Text */}
          <div style={{ 
            backgroundColor: '#f7f7f7', 
            padding: '24px', 
            borderRadius: '16px', 
            borderLeft: '4px solid #1cb0f6',
            marginBottom: '20px'
          }}>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: '"Nunito", sans-serif', 
              fontSize: '16px', 
              lineHeight: '1.7',
              color: '#3c3c3c',
              margin: 0
            }}>
              {lesson.content.theory.text}
            </pre>
          </div>
          
          {/* Tips Section */}
          {lesson.content.theory.tips && (
            <div style={{
              backgroundColor: '#fffbe6',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #ffd700'
            }}>
              <h3 style={{ 
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '700',
                color: '#3c3c3c'
              }}>
                Советы для успеха
              </h3>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '20px',
                color: '#5c5c5c'
              }}>
                {lesson.content.theory.tips.map((tip, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Practice Section */}
      {!showTheory && !completed && (
        <div>
          <h2 style={{ 
            color: '#58cc02', 
            marginBottom: '20px',
            fontSize: '22px',
            fontWeight: '700'
          }}>
            {lesson.content.practice.title}
          </h2>
          
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
            border: '2px solid #e5e5e5'
          }}>
            {/* Question */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#3c3c3c',
                lineHeight: '1.5',
                margin: 0
              }}>
                {lesson.content.practice.questions[currentQuestion].question}
              </p>
            </div>
            
            {/* Options */}
            <div style={{ marginBottom: '28px' }}>
              {lesson.content.practice.questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index} 
                  style={{ marginBottom: '10px' }}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                >
                  <label style={{
                    display: 'block',
                    padding: '18px',
                    border: showResult 
                      ? (index === lesson.content.practice.questions[currentQuestion].correctAnswer 
                          ? '3px solid #58cc02' 
                          : (selectedAnswer === index ? '3px solid #ff4b4b' : '2px solid #e5e5e5'))
                      : (selectedAnswer === index ? '3px solid #1cb0f6' : '2px solid #e5e5e5'),
                    borderRadius: '14px',
                    cursor: showResult ? 'default' : 'pointer',
                    backgroundColor: showResult 
                      ? (index === lesson.content.practice.questions[currentQuestion].correctAnswer 
                          ? '#e6f9e6' 
                          : (selectedAnswer === index ? '#ffe6e6' : 'white'))
                      : (selectedAnswer === index ? '#e6f7ff' : 'white'),
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '3px solid #e5e5e5',
                        marginRight: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: showResult 
                          ? (index === lesson.content.practice.questions[currentQuestion].correctAnswer 
                              ? '#58cc02' 
                              : (selectedAnswer === index ? '#ff4b4b' : 'white'))
                          : (selectedAnswer === index ? '#1cb0f6' : 'white'),
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '800'
                      }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span style={{ 
                        color: '#3c3c3c', 
                        fontSize: '16px',
                        fontWeight: selectedAnswer === index ? '600' : '400'
                      }}>
                        {option}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            {/* Submit Button */}
            {!showResult ? (
              <button 
                className="form-button"
                onClick={handleSubmit}
                disabled={selectedAnswer === '' || hearts === 0}
                style={{ 
                  width: '100%', 
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s ease'
                }}
              >
                {hearts === 0 ? 'Сердца закончились' : 'Проверить'}
              </button>
            ) : (
              <div>
                {/* Result */}
                <div style={{ 
                  padding: '20px', 
                  borderRadius: '14px', 
                  marginBottom: '20px',
                  backgroundColor: selectedAnswer === lesson.content.practice.questions[currentQuestion].correctAnswer 
                    ? '#e6f9e6' 
                    : '#ffe6e6',
                  border: `2px solid ${selectedAnswer === lesson.content.practice.questions[currentQuestion].correctAnswer 
                    ? '#58cc02' 
                    : '#ff4b4b'}`
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '12px',
                    color: selectedAnswer === lesson.content.practice.questions[currentQuestion].correctAnswer 
                      ? '#46a302' 
                      : '#c5221f',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    {selectedAnswer === lesson.content.practice.questions[currentQuestion].correctAnswer ? (
                      <>
                        <span style={{ fontSize: '28px', marginRight: '12px' }}></span>
                        Правильно!
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '28px', marginRight: '12px' }}></span>
                        Неправильно!
                      </>
                    )}
                  </div>
                  <p style={{ 
                    margin: 0,
                    color: '#5c5c5c',
                    lineHeight: '1.6',
                    fontSize: '15px'
                  }}>
                    <strong>Пояснение:</strong> {lesson.content.practice.questions[currentQuestion].explanation}
                  </p>
                </div>
                
                {/* Next Button */}
                <button 
                  className="form-button"
                  onClick={handleNextQuestion}
                  style={{ 
                    width: '100%', 
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {currentQuestion < lesson.content.practice.questions.length - 1 
                  ? 'Следующий вопрос' 
                  : 'Завершить урок'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Completed State */}
      {completed && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ 
            color: '#58cc02', 
            marginBottom: '16px',
            fontSize: '28px',
            fontWeight: '800'
          }}>
            Урок завершён!
          </h2>
          
          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: '#fffbe6',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #ffd700'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
              <div style={{ fontWeight: '700', color: '#3c3c3c' }}>{lesson.xp}</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>XP</div>
            </div>
            <div style={{
              backgroundColor: '#e6f9e6',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #58cc02'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}></div>
              <div style={{ fontWeight: '700', color: '#3c3c3c' }}>
                {score}/{lesson.content.practice.questions.length}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Правильно
              </div>
            </div>
            <div style={{
              backgroundColor: '#fff4e6',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #ff9600'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}></div>
              <div style={{ fontWeight: '700', color: '#3c3c3c' }}>{totalStreak}</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Серия
              </div>
            </div>
          </div>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#8c8c8c', 
            marginBottom: '24px'
          }}>
            {`Вы завершили "${lesson.title}"!`}
          </p>
          
          <button 
            className="form-button"
            onClick={handleCompleteLesson}
            style={{ 
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease'
            }}
          >
            Продолжить обучение
          </button>
        </div>
      )}
    </div>
  );
};

export default Lesson;
