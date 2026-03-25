import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();
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
    setLoading(true);
    setErrorMessage(''); // Clear previous error

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(result.error || t('invalidCredentials', 'Неверные учетные данные'));
    }
    
    setLoading(false);
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
          {t('signInToAccount', 'Войдите в свой аккаунт')}
        </h2>
        
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
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('email', 'Email')}
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
          
          <div className="form-group">
            <label htmlFor="password" className="form-label" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057',
              fontSize: '14px'
            }}>
              {t('password', 'Password')}
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
              marginTop: '10px'
            }}
          >
            {loading ? t('loggingIn', 'Вход в систему...') : t('login', 'Войти')}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            {t('dontHaveAccount', 'Нет аккаунта?')}{' '}
            <Link to="/register" style={{ 
              color: '#212529', 
              fontWeight: '600', 
              textDecoration: 'none' 
            }}>
              {t('register', 'Зарегистрироваться')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
