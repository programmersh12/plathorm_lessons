import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Trophy,
  BookOpen,
  ArrowRight,
  Zap,
  Target,
  Users
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: 'Курсы от практиков',
      text: 'Программы построены вокруг реальных задач, а не сухой теории.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Темп под тебя',
      text: 'Проходи уроки в удобное время и возвращайся к материалам в любой момент.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Trophy,
      title: 'Сертификаты и прогресс',
      text: 'Отслеживай достижения, прокачивай серию и получай подтверждение навыков.',
      gradient: 'from-amber-500 to-orange-500'
    },
  ];

  const stats = [
    { value: '10K+', label: 'Студентов', icon: Users },
    { value: '50+', label: 'Курсов', icon: BookOpen },
    { value: '95%', label: 'Успешных', icon: Target },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="orb orb-violet" />
      <div className="orb orb-cyan" />
      <div className="orb orb-pink" />

      <section className="relative min-h-[85vh] flex items-center pt-20">
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Новая эра онлайн-обучения</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-black leading-tight"
              >
                Платформа для{' '}
                <span className="gradient-text">программистов</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-slate-300 leading-relaxed max-w-lg"
              >
                Осваивай востребованные технологии через практические уроки, тесты и пошаговый прогресс.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {!user ? (
                  <>
                    <Link
                      to="/register"
                      className="btn-premium group"
                    >
                      Начать обучение
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/login"
                      className="btn-secondary-premium"
                    >
                      У меня уже есть аккаунт
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/courses"
                    className="btn-premium group"
                  >
                    Продолжить, {user.firstName}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-8 pt-4"
              >
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 rounded-3xl blur-2xl opacity-30" />
                <div className="relative glass rounded-3xl p-8 border border-slate-700/50">
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${['from-purple-500', 'from-cyan-500', 'from-amber-500'][i-1]} to-transparent flex items-center justify-center`}>
                          {[BookOpen, Clock, Trophy][i-1]({ className: 'w-6 h-6 text-white' })}
                        </div>
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-slate-700 rounded mb-2" />
                          <div className="h-3 w-48 bg-slate-800 rounded" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Прогресс обучения</div>
                        <div className="text-sm text-slate-400">78% завершено</div>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ delay: 1, duration: 1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ключевые <span className="gradient-text">преимущества</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Каждый блок платформы заточен под быстрый и осознанный рост
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="premium-card group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <span className="badge-premium mb-4">
                  <item.icon size={12} />
                  Преимущество
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="premium-card text-center p-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Готов прокачать навыки?
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Создай аккаунт и начни с первого урока уже сегодня
              </p>
              <Link
                to="/register"
                className="btn-premium inline-flex"
              >
                Зарегистрироваться
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;