import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <header style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h1>{t('welcomeToLearningPlatform', 'Welcome to LearningPlatform')}</h1>
        <p>{t('journeyToKnowledge', 'Your journey to knowledge starts here')}</p>
      </header>

      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {!user ? (
          <div>
            <p>{t('joinCommunity', 'Join our learning community today!')}</p>
            <Link to="/register" className="form-button" style={{ marginRight: '10px', display: 'inline-block' }}>
              {t('getStarted', 'Get Started')}
            </Link>
            <Link to="/login" className="nav-link" style={{ display: 'inline-block', marginLeft: '10px' }}>
              {t('login')}
            </Link>
          </div>
        ) : (
          <div>
            <p>{t('readyToContinue', `Hello, ${user.firstName}! Ready to continue learning?`)}</p>
            <Link to="/dashboard" className="form-button" style={{ display: 'inline-block' }}>
              {t('goToDashboard', 'Go to Dashboard')}
            </Link>
          </div>
        )}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3>{t('learnFromExperts', 'Learn from Experts')}</h3>
          <p>{t('accessHighQuality', 'Access high-quality courses taught by industry professionals.')}</p>
        </div>
        
        <div className="card">
          <h3>{t('flexibleSchedule', 'Flexible Schedule')}</h3>
          <p>{t('studyOwnPace', 'Study at your own pace, anytime, anywhere.')}</p>
        </div>
        
        <div className="card">
          <h3>{t('certification', 'Certification')}</h3>
          <p>{t('earnCertificates', 'Earn certificates to showcase your skills.')}</p>
        </div>
      </section>
    </div>
  );
};

export default Home;