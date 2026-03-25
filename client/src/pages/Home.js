import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  SparklesIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from '../components/Icons';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Курсы от практиков',
      text: 'Программы построены вокруг реальных задач, а не сухой теории.',
    },
    {
      icon: ClockIcon,
      title: 'Темп под тебя',
      text: 'Проходи уроки в удобное время и возвращайся к материалам в любой момент.',
    },
    {
      icon: TrophyIcon,
      title: 'Сертификаты и прогресс',
      text: 'Отслеживай достижения, прокачивай серию и получай подтверждение навыков.',
    },
  ];

  return (
    <div className="page-stack">
      <section className="hero-card page-block">
        <div className="hero-grid">
          <div className="page-stack">
            <span className="badge">
              <SparklesIcon size={14} />
              Новая эра онлайн-обучения
            </span>

            <h1 className="section-title">
              Платформа для <span className="brand-gradient-text">программистов</span>
            </h1>

            <p className="section-subtitle">
              Осваивай востребованные технологии через практические уроки, тесты и пошаговый прогресс.
            </p>

            <div className="hero-actions">
              {!user ? (
                <>
                  <Link to="/register" className="btn-base btn-primary">
                    Начать обучение
                    <ArrowRightIcon size={14} />
                  </Link>
                  <Link to="/login" className="btn-base btn-secondary">
                    У меня уже есть аккаунт
                  </Link>
                </>
              ) : (
                <Link to="/courses" className="btn-base btn-primary">
                  {`Продолжить, ${user.firstName}`}
                  <ArrowRightIcon size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell page-block">
        <div className="page-header">
          <div>
            <h2 className="page-title">Ключевые преимущества</h2>
            <p className="page-subtitle">Каждый блок платформы заточен под быстрый и осознанный рост.</p>
          </div>
        </div>

        <div className="features-grid">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="feature-card">
                <span className="badge">
                  <Icon size={14} />
                  Преимущество
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {!user && (
        <section className="section-shell page-block" style={{ textAlign: 'center' }}>
          <div className="page-stack" style={{ gap: '12px' }}>
            <h2 className="page-title">Готов прокачать навыки?</h2>
            <p className="section-subtitle">Создай аккаунт и начни с первого урока уже сегодня.</p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn-base btn-primary">
                {t('register', 'Зарегистрироваться')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
