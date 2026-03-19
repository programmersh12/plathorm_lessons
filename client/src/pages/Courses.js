import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // In a real app, you would fetch courses from the backend
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses([
        {
          id: 1,
          title: t('introToReact', 'Introduction to React'),
          instructor: 'John Doe',
          description: t('learnFundamentals', 'Learn the fundamentals of React and build your first application'),
          progress: 75,
          thumbnail: 'https://via.placeholder.com/300x200'
        },
        {
          id: 2,
          title: t('advancedJS', 'Advanced JavaScript'),
          instructor: 'Jane Smith',
          description: t('deepDiveJS', 'Deep dive into advanced JavaScript concepts and patterns'),
          progress: 30,
          thumbnail: 'https://via.placeholder.com/300x200'
        },
        {
          id: 3,
          title: t('nodeBackend', 'Node.js Backend Development'),
          instructor: 'Bob Johnson',
          description: t('buildScalable', 'Build scalable backend services with Node.js and Express'),
          progress: 0,
          thumbnail: 'https://via.placeholder.com/300x200'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {t('loadingCourses', 'Loading courses...')}
      </div>
    );
  }

  return (
    <div>
      <h1>{t('myCourses', 'My Courses')}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {courses.map(course => (
          <div key={course.id} className="card">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px 4px 0 0' }}
            />
            <div style={{ padding: '15px' }}>
              <h3>{course.title}</h3>
              <p>{t('instructorLabel', 'Instructor:')} {course.instructor}</p>
              <p>{course.description}</p>
              
              {course.progress > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>{t('progressLabel', 'Progress:')}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px', 
                    height: '10px' 
                  }}>
                    <div 
                      style={{ 
                        width: `${course.progress}%`, 
                        backgroundColor: '#007bff', 
                        height: '100%', 
                        borderRadius: '4px' 
                      }} 
                    />
                  </div>
                </div>
              )}
              
              <button 
                className="form-button" 
                style={{ marginTop: '15px', width: '100%' }}
              >
                {course.progress > 0 ? t('continueCourse', 'Continue') : t('startCourse', 'Start Course')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;