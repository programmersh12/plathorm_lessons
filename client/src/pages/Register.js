import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const requiredAsteriskStyle = {
    color: '#212529',
    marginLeft: '4px',
    fontWeight: '700'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    // Basic validation
    if (formData.firstName.length < 2) {
      setErrorMessage(t('firstNameMinLength', 'Имя должно содержать не менее 2 символов'));
      return;
    }
    
    if (formData.lastName.length < 2) {
      setErrorMessage(t('lastNameMinLength', 'Фамилия должна содержать не менее 2 символов'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t('passwordsDoNotMatch', 'Пароли не совпадают'));
      return;
    }
    
    if (formData.password.length < 6) {
      setErrorMessage(t('passwordMinLength', 'Пароль должен содержать не менее 6 символов'));
      return;
    }

    setLoading(true);

    try {
      const { firstName, lastName, email, password, role } = formData;
      const result = await register({
        firstName,
        lastName,
        email,
        password,
        role
      });
      
      if (result && result.success) {
        setSuccessMessage(t('registrationSuccessful', 'Регистрация успешна!'));
        // Redirect to personal profile after a short delay to show the success message
        setTimeout(() => {
          navigate('/profile');
        }, 1200);
      } else {
        setErrorMessage(result?.error || t('registrationFailed', 'Ошибка регистрации. Попробуйте снова.'));
      }
    } catch (err) {
      setErrorMessage(t('registrationFailed', 'Ошибка регистрации. Попробуйте снова.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title" style={{ 
          color: '#212529',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '24px'
        }}>
          {t('createAccount', 'Создать аккаунт')}
        </h2>
        
        {successMessage && (
          <div className="success-message" style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid #c3e6cb',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✅ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-message" style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid #f5c6cb',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ❌ {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="firstName" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('firstName', 'Имя')}
              <span style={requiredAsteriskStyle} aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                color: '#212529',
                caretColor: '#212529'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="lastName" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('lastName', 'Фамилия')}
              <span style={requiredAsteriskStyle} aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                color: '#212529',
                caretColor: '#212529'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="email" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('email', 'Электронная почта')}
              <span style={requiredAsteriskStyle} aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                color: '#212529',
                caretColor: '#212529'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="password" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('password', 'Пароль')}
              <span style={requiredAsteriskStyle} aria-hidden="true">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                color: '#212529',
                caretColor: '#212529'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="confirmPassword" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('confirmPassword', 'Подтвердите пароль')}
              <span style={requiredAsteriskStyle} aria-hidden="true">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                color: '#212529',
                caretColor: '#212529'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="role" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('role', 'Роль')}
            </label>
            <select
              id="role"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                color: '#212529'
              }}
            >
              <option value="student">{t('student', 'Студент')}</option>
              <option value="teacher">{t('teacher', 'Преподаватель')}</option>
              <option value="admin">{t('admin', 'Администратор')}</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="form-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(33, 37, 41, 0.2)',
              marginTop: '5px'
            }}
          >
            {loading ? t('creatingAccount', 'Создание аккаунта...') : t('register', 'Зарегистрироваться')}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            {t('alreadyHaveAccount', 'Уже есть аккаунт?')}{' '}
            <Link to="/login" style={{ 
              color: '#212529', 
              fontWeight: '600', 
              textDecoration: 'none' 
            }}>
              {t('login', 'Войти')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
