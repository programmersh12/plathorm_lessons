import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    upcomingDeadlines: 0
  });

  // In a real app, you would fetch these stats from the backend
  useEffect(() => {
    // Simulate fetching dashboard stats
    const fetchStats = async () => {
      // This would be an API call in a real application
      setStats({
        totalCourses: 12,
        enrolledCourses: 5,
        completedCourses: 2,
        upcomingDeadlines: 3
      });
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          margin: '0 0 10px 0',
          background: 'linear-gradient(to right, #ffffff, #e0e0ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {t('dashboard')}
        </h1>
        <p style={{ 
          fontSize: '18px', 
          margin: '0',
          opacity: 0.9
        }}>
          {t('welcomeBack', `С возвращением, ${user?.firstName} ${user?.lastName}!`)}
        </p>
      </div>
      
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }}>
          <h3 className="card-title" style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#667eea',
            marginBottom: '12px'
          }}>
            {t('totalCourses', 'Всего курсов')}
          </h3>
          <p className="card-content" style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#3c3c3c',
            margin: 0
          }}>
            {stats.totalCourses}
          </p>
        </div>
        
        <div className="card" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }}>
          <h3 className="card-title" style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#667eea',
            marginBottom: '12px'
          }}>
            {t('enrolledCourses', 'Записан на курсы')}
          </h3>
          <p className="card-content" style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#3c3c3c',
            margin: 0
          }}>
            {stats.enrolledCourses}
          </p>
        </div>
        
        <div className="card" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }}>
          <h3 className="card-title" style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#667eea',
            marginBottom: '12px'
          }}>
            {t('completedCourses', 'Завершено курсов')}
          </h3>
          <p className="card-content" style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#3c3c3c',
            margin: 0
          }}>
            {stats.completedCourses}
          </p>
        </div>
        
        <div className="card" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }}>
          <h3 className="card-title" style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#667eea',
            marginBottom: '12px'
          }}>
            {t('upcomingDeadlines', 'Предстоящие дедлайны')}
          </h3>
          <p className="card-content" style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#3c3c3c',
            margin: 0
          }}>
            {stats.upcomingDeadlines}
          </p>
        </div>
      </div>
      
      <div className="card" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e9ecef',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <h3 className="card-title" style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#3c3c3c',
          marginBottom: '16px'
        }}>
          {t('recentActivity', 'Недавняя активность')}
        </h3>
        <ul className="card-content" style={{ 
          listStyle: 'none', 
          padding: 0,
          margin: 0
        }}>
          <li style={{ 
            padding: '12px 0', 
            borderBottom: '1px solid #f0f0f0',
            fontSize: '15px',
            color: '#5c5c5c'
          }}>
            {t('activityCompletedReact', 'Завершен курс "Введение в React"')}
          </li>
          <li style={{ 
            padding: '12px 0', 
            borderBottom: '1px solid #f0f0f0',
            fontSize: '15px',
            color: '#5c5c5c'
          }}>
            {t('activitySubmittedJS', 'Отправлено задание по "Продвинутому JavaScript"')}
          </li>
          <li style={{ 
            padding: '12px 0', 
            fontSize: '15px',
            color: '#5c5c5c'
          }}>
            {t('activityEnrolledNode', 'Записан на курс "Node.js: серверная разработка"')}
          </li>
        </ul>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Link 
          to="/courses" 
          className="gradient-button"
          style={{ 
            padding: '14px 30px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '10px',
            textDecoration: 'none',
            color: 'white',
            display: 'inline-block',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          {t('viewAllCourses', 'Просмотреть все курсы')}
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
