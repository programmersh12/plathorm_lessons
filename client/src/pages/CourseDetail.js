import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock course data - in a real app, this would come from the backend
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourse = {
        id: courseId,
        title: courseId == '1' ? t('jsBasics', 'Основы JavaScript') : 
               courseId == '2' ? t('reactDev', 'Разработка на React') : 
               t('mobileDev', 'Разработка мобильных приложений'),
        instructor: courseId == '1' ? 'Алексей Петров' : 
                   courseId == '2' ? 'Анна Смирнова' : 
                   'Дмитрий Волков',
        description: courseId == '1' ? t('jsDescription', 'Изучите основы JavaScript и создайте свое первое приложение') :
                       courseId == '2' ? t('reactDescription', 'Создавайте современные веб-приложения на React') :
                       t('mobileDescription', 'Создавайте кроссплатформенные мобильные приложения на React Native'),
        progress: 0,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop',
        lessons: courseId == '1' ? [
          { id: 1, title: 'Введение в JavaScript', order: 1, completed: false, duration: '15 мин' },
          { id: 2, title: 'Переменные и типы данных', order: 2, completed: false, duration: '20 мин' },
          { id: 3, title: 'Функции и области видимости', order: 3, completed: false, duration: '25 мин' },
          { id: 4, title: 'Массивы и объекты', order: 4, completed: false, duration: '30 мин' },
          { id: 5, title: 'DOM манипуляции', order: 5, completed: false, duration: '25 мин' }
        ] : courseId == '2' ? [
          { id: 1, title: 'Основы React компонентов', order: 1, completed: false, duration: '20 мин' },
          { id: 2, title: 'JSX синтаксис', order: 2, completed: false, duration: '15 мин' },
          { id: 3, title: 'Props и State', order: 3, completed: false, duration: '25 мин' },
          { id: 4, title: 'Хуки в React', order: 4, completed: false, duration: '30 мин' },
          { id: 5, title: 'Роутинг в React', order: 5, completed: false, duration: '25 мин' }
        ] : [
          { id: 1, title: 'Введение в React Native', order: 1, completed: false, duration: '20 мин' },
          { id: 2, title: 'Компоненты и стили', order: 2, completed: false, duration: '25 мин' },
          { id: 3, title: 'Навигация в мобильном приложении', order: 3, completed: false, duration: '30 мин' },
          { id: 4, title: 'Работа с API', order: 4, completed: false, duration: '25 мин' },
          { id: 5, title: 'Публикация приложения', order: 5, completed: false, duration: '20 мин' }
        ]
      };
      
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [courseId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {t('loadingCourse', 'Загрузка курса...')}
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {t('courseNotFound', 'Курс не найден')}
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <button 
        onClick={() => navigate('/courses')}
        style={{ 
          marginBottom: '20px', 
          padding: '12px 20px', 
          backgroundColor: 'transparent', 
          color: '#667eea', 
          border: '2px solid #667eea', 
          borderRadius: '10px', 
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#667eea';
        }}
      >
        ← {t('backToCourses', 'Назад к курсам')}
      </button>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '30px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            height: '300px', 
            objectFit: 'cover', 
            borderRadius: '12px', 
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}
        />
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#3c3c3c',
          marginBottom: '10px'
        }}>
          {course.title}
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#6c757d', 
          marginBottom: '10px',
          fontWeight: '500'
        }}>
          {t('instructorLabel', 'Инструктор:')} {course.instructor}
        </p>
        <p style={{ 
          fontSize: '16px', 
          color: '#6c757d',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          {course.description}
        </p>
        
        {/* Overall course progress */}
        <div style={{ width: '100%', maxWidth: '500px', marginTop: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '15px', fontWeight: '600', color: '#3c3c3c' }}>
            <span>{t('overallProgress', 'Общий прогресс:')}</span>
            <span style={{ color: course.progress === 0 ? '#8c8c8c' : '#58cc02', fontWeight: '700' }}>
              {course.progress}%
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            backgroundColor: '#e5e5e5', 
            borderRadius: '10px', 
            height: '14px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div 
              style={{ 
                width: `${course.progress}%`, 
                height: '100%', 
                backgroundColor: '#58cc02',
                borderRadius: '10px',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: course.progress > 0 ? 'inset 0 -2px 0 rgba(0,0,0,0.1)' : 'none'
              }} 
            />
            {[25, 50, 75].map(mark => (
              <div 
                key={mark}
                style={{
                  position: 'absolute',
                  left: `${mark}%`,
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'translateX(-50%)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        color: '#3c3c3c',
        marginBottom: '20px'
      }}>
        {t('courseLessons', 'Уроки курса')}
      </h2>
      <div style={{ marginTop: '20px' }}>
        {course.lessons.map((lesson, index) => (
          <div 
            key={lesson.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px', 
              borderBottom: '1px solid #eee',
              backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
              borderRadius: '12px',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#3c3c3c'
              }}>
                {index + 1}. {lesson.title}
              </h3>
              <p style={{ 
                margin: '0', 
                color: '#6c757d', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>⏱️</span>
                {t('duration', 'Продолжительность:')} {lesson.duration}
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: lesson.completed ? '#d4edda' : '#f8d7da',
                color: lesson.completed ? '#155724' : '#721c24',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {lesson.completed ? t('completed', 'Завершено') : t('notStarted', 'Не начато')}
              </span>
              
              <Link 
                to={`/courses/${course.id}/lessons/${lesson.id}`} 
                className="gradient-button" 
                style={{ 
                  padding: '10px 20px', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  opacity: course.lessons.slice(0, index).every(lesson => lesson.completed) || lesson.completed ? 1 : 0.5,
                  pointerEvents: course.lessons.slice(0, index).every(lesson => lesson.completed) || lesson.completed ? 'auto' : 'none'
                }}
              >
                {lesson.completed ? t('reviewLesson', 'Просмотреть') : 
                 course.lessons.slice(0, index).every(lesson => lesson.completed) ? t('startLesson', 'Начать') : 
                 t('lockedLesson', 'Заблокировано')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
