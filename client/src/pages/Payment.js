import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  Sparkles,
  Shield
} from 'lucide-react';

const MOCK_COURSES = {
  'react-fundamentals': { title: 'React Fundamentals', price: 49, description: 'Изучите основы React с нуля' },
  'advanced-javascript': { title: 'Advanced JavaScript', price: 79, description: 'Продвинутый JavaScript для профессионалов' },
  'nodejs-mastery': { title: 'Node.js Mastery', price: 69, description: 'Станьте мастером Node.js' },
  'python-for-beginners': { title: 'Python for Beginners', price: 39, description: 'Начните программировать на Python' },
};

const Payment = () => {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState('');
  const [course, setCourse] = useState(null);
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardFlip, setCardFlip] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('courseId') || 'react-fundamentals';
    setCourseId(id);
    setCourse(MOCK_COURSES[id] || MOCK_COURSES['react-fundamentals']);
  }, []);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    } else if (name === 'cardHolder') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    }

    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      newErrors.cardNumber = 'Введите номер карты';
    } else if (cardNumber.length < 15) {
      newErrors.cardNumber = 'Номер карты должен быть 16 цифр';
    }

    if (!formData.cardHolder) {
      newErrors.cardHolder = 'Введите имя владельца';
    } else if (formData.cardHolder.length < 2) {
      newErrors.cardHolder = 'Имя слишком короткое';
    }

    const [month, year] = formData.expiryDate.split('/');
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Введите срок действия';
    } else if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
      newErrors.expiryDate = 'Неверная дата';
    } else {
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Карта просрочена';
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = 'Введите CVV';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV должен быть 3-4 цифры';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    const paidCourses = JSON.parse(localStorage.getItem('paidCourses') || '[]');
    if (!paidCourses.includes(courseId)) {
      localStorage.setItem('paidCourses', JSON.stringify([...paidCourses, courseId]));
    }

    setIsProcessing(false);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/courses');
  };

  const getCardType = () => {
    const firstDigit = formData.cardNumber.replace(/\s/g, '')[0];
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return null;
  };

  const cardType = getCardType();

  return (
    <div className="min-h-screen relative py-12 px-4 overflow-hidden">
      <div className="orb orb-violet" style={{ top: '5%', left: '-10%' }} />
      <div className="orb orb-cyan" style={{ bottom: '10%', right: '-10%' }} />
      <div className="orb orb-pink" style={{ top: '40%', left: '30%', opacity: 0.2 }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Безопасная оплата</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Оплата <span className="gradient-text">курса</span>
          </h1>
          <p className="text-xl text-slate-400">Заполните данные карты для завершения покупки</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div 
              className="relative h-64 cursor-pointer perspective-1000"
              onMouseEnter={() => setCardFlip(true)}
              onMouseLeave={() => setCardFlip(false)}
            >
              <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${cardFlip ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl backface-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
                    }} />
                    
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
                  </div>
                  
                  <div className="relative h-full p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded opacity-90" />
                      {cardType === 'visa' && (
                        <div className="text-2xl font-bold text-white/80 tracking-widest">VISA</div>
                      )}
                      {cardType === 'mastercard' && (
                        <div className="flex -space-x-2">
                          <div className="w-10 h-10 rounded-full bg-red-500/80 border-2 border-slate-800" />
                          <div className="w-10 h-10 rounded-full bg-orange-500/80 border-2 border-slate-800" />
                        </div>
                      )}
                      {cardType === 'amex' && (
                        <div className="text-xl font-bold text-white/80">AMEX</div>
                      )}
                    </div>

                    <div>
                      <div className="text-2xl tracking-[0.2em] text-slate-200 font-mono mb-6">
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Владелец</div>
                          <div className="text-sm text-slate-200 font-medium tracking-wider uppercase">
                            {formData.cardHolder || 'YOUR NAME'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Срок</div>
                          <div className="text-sm text-slate-200 font-mono">
                            {formData.expiryDate || 'MM/YY'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-50" />
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Курс</span>
                <span className="text-white font-semibold">{course?.title}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Описание</span>
                <span className="text-slate-300 text-sm text-right max-w-[200px]">{course?.description}</span>
              </div>
              <div className="border-t border-slate-700/50 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">К оплате</span>
                  <span className="text-3xl font-bold text-emerald-400">${course?.price}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                Данные карты
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-field">
                  <label className="form-field-label">Номер карты</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`input-premium ${errors.cardNumber ? 'border-red-500' : ''}`}
                    />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  </div>
                  {errors.cardNumber && <p className="text-red-400 text-sm mt-2">{errors.cardNumber}</p>}
                </div>

                <div className="form-field">
                  <label className="form-field-label">Имя владельца</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="IVAN IVANOV"
                    className={`input-premium uppercase ${errors.cardHolder ? 'border-red-500' : ''}`}
                  />
                  {errors.cardHolder && <p className="text-red-400 text-sm mt-2">{errors.cardHolder}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-field">
                    <label className="form-field-label">Срок действия</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`input-premium ${errors.expiryDate ? 'border-red-500' : ''}`}
                    />
                    {errors.expiryDate && <p className="text-red-400 text-sm mt-2">{errors.expiryDate}</p>}
                  </div>
                  <div className="form-field">
                    <label className="form-field-label">CVV</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="•••"
                        maxLength={4}
                        className={`input-premium ${errors.cvv ? 'border-red-500' : ''}`}
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                    {errors.cvv && <p className="text-red-400 text-sm mt-2">{errors.cvv}</p>}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-premium w-full justify-center mt-6"
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Обработка платежа...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Оплатить ${course?.price}
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </motion.button>

                <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Ваши данные защищены</span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="premium-card p-8 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Оплата успешна!</h3>
              <p className="text-slate-400 mb-6">
                Спасибо за покупку курса "{course?.title}". Теперь у вас есть доступ к материалам курса.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Номер заказа</span>
                  <span className="text-white font-mono">#{Math.random().toString(36).substr(2, 10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Сумма</span>
                  <span className="text-emerald-400 font-semibold">${course?.price}</span>
                </div>
              </div>

              <button
                onClick={handleCloseSuccess}
                className="btn-premium w-full justify-center"
              >
                Перейти к курсам
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;