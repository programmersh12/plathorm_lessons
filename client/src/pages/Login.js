import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import GoogleLogin from '../components/GoogleLogin';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(result.error || t('invalidCredentials', 'Неверные учетные данные'));
    }
    
    setLoading(false);
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
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 rounded-3xl blur-2xl opacity-30" />
        
        <div className="relative premium-card p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-black text-2xl">V</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {t('signInToAccount', 'Войдите в аккаунт')}
            </h2>
            <p className="text-slate-400">Добро пожаловать! Войдите, чтобы продолжить обучение</p>
          </div>
          
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
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-field">
              <label htmlFor="email" className="form-field-label flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-premium pl-12"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="password" className="form-field-label flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Пароль
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-premium pl-12"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              className="btn-premium w-full justify-center"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Вход в систему...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Войти
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </motion.button>
          </form>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-500">или</span>
            </div>
          </div>
          
          <div>
            <GoogleLogin />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Нет аккаунта?{' '}
              <Link 
                to="/register" 
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;