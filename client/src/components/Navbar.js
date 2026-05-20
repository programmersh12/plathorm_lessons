import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  DashboardIcon,
  BookOpenIcon,
  UserIcon,
  LogInIcon,
  UserPlusIcon,
  LogoutIcon,
} from './Icons';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`));

  const guestLinks = [
    { to: '/', label: t('home', 'Главная'), icon: HomeIcon },
    { to: '/login', label: t('login', 'Войти'), icon: LogInIcon },
  ];

  const userLinks = [
    { to: '/', label: t('home', 'Главная'), icon: HomeIcon },
    { to: '/dashboard', label: t('dashboard', 'Панель управления'), icon: DashboardIcon },
    { to: '/courses', label: t('courses', 'Курсы'), icon: BookOpenIcon },
    { to: '/profile', label: t('profile', 'Профиль'), icon: UserIcon },
  ];

  const links = user ? userLinks : guestLinks;

  return (
    <header className="navbar">
      <div className="nav-wrap glass-card">
        <Link to="/" className="brand-link" aria-label="Vykod главная">
          <img src="/logo.png" alt="Логотип Vykod" className="brand-logo" />
          <div>
            <div className="brand-title">Vykod</div>
            <div className="brand-subtitle">образовательная платформа</div>
          </div>
        </Link>

        <div className="nav-center">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}>
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          ))}

          {!user ? (
            <Link to="/register" className="nav-link nav-link-cta">
              <UserPlusIcon size={15} />
              <span>{t('register', 'Зарегистрироваться')}</span>
            </Link>
          ) : (
            <button type="button" onClick={logout} className="logout-btn">
              <LogoutIcon size={15} />
              <span>{t('logout', 'Выход')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
