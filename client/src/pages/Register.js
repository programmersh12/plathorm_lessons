import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Sparkles, Check } from 'lucide-react';

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
    
    if (formData.firstName.length < 2) {
      setErrorMessage('Имя должно содержать не менее 2 символов');
      return;
    }
    
    if (formData.lastName.length < 2) {
      setErrorMessage('Фамилия должна содержать не менее 2 символов');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }
    
    if (formData.password.length < 6) {
      setErrorMessage('Пароль должен содержать не менее 6 символов');
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
        setSuccessMessage('Регистрация успешна!');
        setTimeout(() => {
          navigate('/profile');
        }, 1200);
      } else {
        setErrorMessage(result?.error || 'Ошибка регистрации. Попробуйте снова.');
      }
    } catch (err) {
      setErrorMessage('Ошибка регистрации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      <div className="orb orb-violet" style={{ top: '10%', left: '10%' }} />
      <div className="orb orb-cyan" style={{ bottom: '10%', right: '10%' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl blur-2xl opacity-30" />
        
        <div className="relative premium-card p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-600 flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-black text-2xl">V</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Создать аккаунт
            </h2>
            <p className="text-slate-400">Присоединяйтесь к сообществу разработчиков</p>
          </div>
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-field">
                <label htmlFor="firstName" className="form-field-label flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  Имя
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="input-premium"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Иван"
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="lastName" className="form-field-label flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  Фамилия
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="input-premium"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Иванов"
                  required
                />
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="email" className="form-field-label flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-premium"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="password" className="form-field-label flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input-premium"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-field-label flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Подтвердите пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input-premium"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="role" className="form-field-label flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                Роль
              </label>
              <select
                id="role"
                name="role"
                className="input-premium cursor-pointer"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Студент</option>
                <option value="teacher">Преподаватель</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            
            <motion.button 
              type="submit" 
              className="btn-premium w-full justify-center mt-2"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Создание аккаунта...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Зарегистрироваться
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </motion.button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Уже есть аккаунт?{' '}
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;