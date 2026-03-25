import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const getAuthErrorMessage = (err, fallbackMessage) => {
    const validationErrors = err?.response?.data?.errors;

    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      return validationErrors
        .map((item) => item?.msg || item?.message)
        .filter(Boolean)
        .join(', ');
    }

    if (err?.response?.data?.message) {
      return err.response.data.message;
    }

    if (err?.request) {
      return t('serverUnavailable', 'Cannot connect to server. Please check backend/CORS settings.');
    }

    return fallbackMessage;
  };

// Проверка существующей сессии при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Проверить валидность токена через запрос профиля
          const response = await authAPI.getProfile();
          const profile = response.data?.user || response.data;
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (error) {
          // Токен невалиден, очистить хранилище
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      // Сохранить токен и пользователя
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, t('loginFailed', 'Login failed. Please try again.'));
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, t('registrationFailed', 'Registration failed. Please try again.'));
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
