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
          title: 'Введение в JavaScript',
          type: 'theory-practice',
          xp: 50,
          content: {
            theory: {
              title: 'Теория: Введение в JavaScript',
              text: `JavaScript — это язык программирования, который делает веб-страницы интерактивными.

Что такое JavaScript?
JavaScript — это язык программирования, который работает в браузере и позволяет создавать динамические веб-страницы.

Основные возможности:
• Манипуляции с DOM
• Обработка событий
• Асинхронные запросы
• Валидация форм

Переменные в JavaScript:

let name = "Алекс";
const age = 25;
var oldStyle = "старый стиль";

Типы данных:
• String - строки
• Number - числа
• Boolean - true/false
• Array - массивы
• Object - объекты
• null и undefined

Функции:

function greet(name) {
  return "Привет, " + name + "!";
}

// Или стрелочная функция
const greet = (name) => \`Привет, \${name}!\`;`,
              imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=300&fit=crop',
              tips: [
                'Всегда используйте const или let вместо var',
                'Именуйте переменные понятно и описательно',
                'Изучите разницу между let и const'
              ]
            },
            practice: {
              title: 'Практика: Основы JavaScript',
              questions: [
                {
                  id: 1,
                  question: 'Какое ключевое слово используется для объявления переменной с неизменяемым значением?',
                  options: ['var', 'let', 'const', 'fixed'],
                  correctAnswer: 2,
                  explanation: 'const используется для объявления констант — переменных, значение которых нельзя изменить после присваивания.',
                  type: 'single'
                },
                {
                  id: 2,
                  question: 'Какой тип данных НЕ существует в JavaScript?',
                  options: ['String', 'Integer', 'Boolean', 'Object'],
                  correctAnswer: 1,
                  explanation: 'В JavaScript нет отдельного типа Integer. Все числа представлены типом Number.',
                  type: 'single'
                },
                {
                  id: 3,
                  question: 'Что вернёт выражение typeof null?',
                  options: ['null', 'undefined', 'object', 'number'],
                  correctAnswer: 2,
                  explanation: 'Это известная ошибка в JavaScript — typeof null возвращает "object", хотя null является примитивным значением.',
                  type: 'single'
                },
                {
                  id: 4,
                  question: 'Какой метод используется для добавления элемента в конец массива?',
                  options: ['pop()', 'push()', 'shift()', 'unshift()'],
                  correctAnswer: 1,
                  explanation: 'push() добавляет один или более элементов в конец массива и возвращает новую длину.',
                  type: 'single'
                },
                {
                  id: 5,
                  question: 'Что такое замыкание в JavaScript?',
                  options: [
                    'Функция без имени',
                    'Функция, которая имеет доступ к переменным внешней функции',
                    'Метод закрытия браузерного окна',
                    'Способ объединения двух массивов'
                  ],
                  correctAnswer: 1,
                  explanation: 'Замыкание — это функция, которая запоминает и имеет доступ к переменным своей внешней области видимости.',
                  type: 'single'
                }
              ]
            }
          }
        },
        '2': {
          id: 2,
          courseId: courseId,
          title: 'Основы React компонентов',
          type: 'theory-practice',
          xp: 50,
          content: {
            theory: {
              title: 'Теория: Основы React компонентов',
              text: `React компоненты — это строительные блоки любого React приложения.

Что такое компоненты?
Компоненты похожи на пользовательские HTML-элементы. Они позволяют разделить интерфейс на независимые, многократно используемые части.

Два типа компонентов:

1️⃣ ФУНКЦИОНАЛЬНЫЕ КОМПОНЕНТЫ (Рекомендуется)
• Простые JavaScript функции
• Возвращают JSX (HTML-подобный синтаксис)
• Легче писать и понимать

2️⃣ КЛАССОВЫЕ КОМПОНЕНТЫ
• ES6 классы
• Используются в старом коде

Пример:

function Welcome({ name }) {
  return <h1>Привет, {name}!</h1>;
}`,
              imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop',
              tips: [
                'Всегда начинайте имена компонентов с большой буквы',
                'Props доступны только для чтения',
                'Делайте компоненты маленькими и сфокусированными'
              ]
            },
            practice: {
              title: 'Практика: React компоненты',
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
                  explanation: 'Функциональные компоненты определяются как JavaScript функции, которые возвращают JSX.',
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
                  explanation: 'Props — это входные данные, передаваемые от родительских компонентов дочерним.',
                  type: 'single'
                },
                {
                  id: 3,
                  question: 'Что означает JSX?',
                  options: [
                    'JavaScript XML',
                    'Java Syntax Extension',
                    'JSON XML',
                    'JavaScript Extra'
                  ],
                  correctAnswer: 0,
                  explanation: 'JSX расшифровывается как JavaScript XML.',
                  type: 'single'
                },
                {
                  id: 4,
                  question: 'Как вставить JavaScript переменную в JSX?',
                  options: [
                    '<h1>$variable</h1>',
                    '<h1>{variable}</h1>',
                    '<h1>{{variable}}</h1>',
                    '<h1>${variable}</h1>'
                  ],
                  correctAnswer: 1,
                  explanation: 'Используйте фигурные скобки {} для вставки JavaScript выражений в JSX.',
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
                  explanation: 'Компоненты позволяют разделить интерфейс на независимые, многократно используемые части.',
                  type: 'single'
                }
              ]
            }
          }
        },
        '3': {
          id: 3,
          courseId: courseId,
          title: 'Введение в React Native',
          type: 'theory-practice',
          xp: 50,
          content: {
            theory: {
              title: 'Теория: Введение в React Native',
              text: `React Native — это фреймворк для создания мобильных приложений на JavaScript.

Что такое React Native?
React Native позволяет создавать нативные мобильные приложения для iOS и Android, используя JavaScript и React.

Преимущества:
• Кроссплатформенность (один код для iOS и Android)
• Использование знаний React
• Горячая перезагрузка
• Нативная производительность

Основные компоненты:

import { View, Text, StyleSheet } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text>Привет, мир!</Text>
    </View>
  );
}

Стили создаются с помощью StyleSheet:

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});`,
              imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop',
              tips: [
                'Используйте View вместо div',
                'Text обязателен для отображения любого текста',
                'Стили пишутся на camelCase (backgroundColor)'
              ]
            },
            practice: {
              title: 'Практика: React Native основы',
              questions: [
                {
                  id: 1,
                  question: 'Что такое React Native?',
                  options: [
                    'Библиотека для работы с базами данных',
                    'Фреймворк для создания мобильных приложений',
                    'Язык программирования',
                    'Операционная система'
                  ],
                  correctAnswer: 1,
                  explanation: 'React Native — это фреймворк от Facebook для создания кроссплатформенных мобильных приложений.',
                  type: 'single'
                },
                {
                  id: 2,
                  question: 'Какой компонент используется для создания контейнера в React Native?',
                  options: ['div', 'Container', 'View', 'Box'],
                  correctAnswer: 2,
                  explanation: 'View — это базовый компонент-контейнер в React Native, аналог div в веб-разработке.',
                  type: 'single'
                },
                {
                  id: 3,
                  question: 'Какой компонент ОБЯЗАТЕЛЕН для отображения текста в React Native?',
                  options: ['Paragraph', 'Span', 'Text', 'Label'],
                  correctAnswer: 2,
                  explanation: 'В React Native весь текст должен быть обёрнут в компонент Text.',
                  type: 'single'
                },
                {
                  id: 4,
                  question: 'Как создать стили в React Native?',
                  options: [
                    'С помощью CSS файлов',
                    'С помощью StyleSheet.create()',
                    'Только инлайн стили',
                    'С помощью styled-components'
                  ],
                  correctAnswer: 1,
                  explanation: 'StyleSheet.create() — это стандартный способ создания стилей в React Native.',
                  type: 'single'
                },
                {
                  id: 5,
                  question: 'Какое основное преимущество React Native?',
                  options: [
                    'Работает только на iOS',
                    'Один код для iOS и Android',
                    'Требует знания Swift',
                    'Медленнее нативных приложений'
                  ],
                  correctAnswer: 1,
                  explanation: 'Главное преимущество — возможность писать один код для обеих платформ.',
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
