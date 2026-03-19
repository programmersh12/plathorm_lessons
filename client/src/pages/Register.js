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
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert(t('passwordsDoNotMatch', 'Passwords do not match'));
      return;
    }
    
    if (formData.password.length < 6) {
      alert(t('passwordMinLength', 'Password must be at least 6 characters'));
      return;
    }

    setLoading(true);

    const { firstName, lastName, email, password, role } = formData;
    const result = await register({
      firstName,
      lastName,
      email,
      password,
      role
    });
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{t('createAccount')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">{t('firstName')}</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-input"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName" className="form-label">{t('lastName')}</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-input"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">{t('email')}</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">{t('password')}</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">{t('confirmPassword')}</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role" className="form-label">{t('role')}</label>
          <select
            id="role"
            name="role"
            className="form-input"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="student">{t('student')}</option>
            <option value="teacher">{t('teacher')}</option>
            <option value="admin">{t('admin')}</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? t('creatingAccount', 'Creating Account...') : t('register')}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>{t('alreadyHaveAccount')} <Link to="/login">{t('login')}</Link></p>
      </div>
    </div>
  );
};

export default Register;