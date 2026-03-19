import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          {t('learningPlatform', 'LearningPlatform')}
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {t('home', 'Home')}
          </Link>
          
          {!user ? (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                {t('login', 'Login')}
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              >
                {t('register', 'Register')}
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                {t('dashboard', 'Dashboard')}
              </Link>
              <Link 
                to="/courses" 
                className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
              >
                {t('courses', 'Courses')}
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                {t('profile', 'Profile')}
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                {t('logout', 'Logout')}
              </button>
            </>
          )}
        </div>
        
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;