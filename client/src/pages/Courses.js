import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courseAPI } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: ''
  });
  const { t } = useTranslation();

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.search) params.search = filters.search;
      
      const response = await courseAPI.getCourses(params);
      setCourses(response.data.data || response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(t('failedToLoadCourses', 'Не удалось загрузить курсы. Попробуйте позже.'));
      // Set mock data for demo purposes
      setCourses([
        {
          _id: '1',
          title: 'Основы React',
          description: 'Изучите основы React с нуля',
          category: 'Программирование',
          level: 'beginner',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop',
          price: 0,
          duration: 12,
          instructorId: { firstName: 'John', lastName: 'Doe' },
          rating: { average: 4.5, count: 100 },
          studentsEnrolled: []
        },
        {
          _id: '2',
          title: 'Продвинутый JavaScript',
          description: 'Мастер-класс по JavaScript',
          category: 'Программирование',
          level: 'advanced',
          thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=300&fit=crop',
          price: 49,
          duration: 20,
          instructorId: { firstName: 'Jane', lastName: 'Smith' },
          rating: { average: 4.8, count: 250 },
          studentsEnrolled: []
        },
        {
          _id: '3',
          title: 'Веб-дизайн для начинающих',
          description: 'Создавайте красивые веб-сайты',
          category: 'Design',
          level: 'beginner',
          thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop',
          price: 0,
          duration: 8,
          instructorId: { firstName: 'Mike', lastName: 'Johnson' },
          rating: { average: 4.3, count: 75 },
          studentsEnrolled: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const categories = [
    'Программирование',
    'Дизайн',
    'Бизнес',
    'Маркетинг',
    'Наука'
  ];

  const levels = [
    { value: 'beginner', label: 'Начинающий' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];

  if (loading) {
    return (
      <div className="courses-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('loadingCourses', 'Загрузка курсов...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1 className="courses-title">{t('allCourses', 'Все курсы')}</h1>
        <p className="courses-subtitle">Найдите идеальный курс для себя</p>
      </div>

      <div className="courses-filters">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            placeholder={t('searchCourses', 'Поиск курсов...')}
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Все категории</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Все уровни</option>
            {levels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="courses-grid">
        {courses.length === 0 ? (
          <div className="no-courses">
            <p>{t('noCoursesFound', 'Курсы не найдены.')}</p>
          </div>
        ) : (
          courses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-thumbnail">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop'} 
                  alt={course.title} 
                />
                <div className="course-level-badge">
                  {levels.find(l => l.value === course.level)?.label || course.level}
                </div>
              </div>
              
              <div className="course-content">
                <div className="course-category">{course.category}</div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">
                  {course.description?.substring(0, 100)}...
                </p>
                
                <div className="course-meta">
                  <div className="course-rating">
                    <span className="rating-star">⭐</span>
                    <span>{course.rating?.average?.toFixed(1) || '0.0'}</span>
                    <span className="rating-count">
                      ({course.rating?.count || 0} отзывов)
                    </span>
                  </div>
                  <div className="course-duration">
                    <span>⏱</span>
                    <span>{course.duration} ч</span>
                  </div>
                </div>

                <div className="course-instructor">
                  {course.instructorId?.firstName} {course.instructorId?.lastName}
                </div>

                <div className="course-footer">
                  <div className="course-price">
                    {course.price === 0 ? (
                      <span className="price-free">Бесплатно</span>
                    ) : (
                      <span className="price-amount">${course.price}</span>
                    )}
                  </div>
                  <Link to={`/courses/${course._id}`} className="course-button">
                    Смотреть
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;