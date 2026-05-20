import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Trophy,
  Clock,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Target,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    upcomingDeadlines: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allCoursesRes, myCoursesRes] = await Promise.all([
          courseAPI.getCourses(),
          courseAPI.getMyCourses(),
        ]);

        const allCourses = allCoursesRes.data?.data || [];
        const myCourses = myCoursesRes.data?.data || [];

        const completedCourses = myCourses.filter((course) => {
          const student = (course.studentsEnrolled || []).find(
            (s) => String(s.userId) === String(user?._id || user?.id)
          );

          return student?.status === 'completed' || Number(student?.progress || 0) === 100;
        }).length;

        setStats({
          totalCourses: allCourses.length,
          enrolledCourses: myCourses.length,
          completedCourses,
          upcomingDeadlines: 0,
        });

        const activity = myCourses.slice(0, 5).map((course) => {
          const student = (course.studentsEnrolled || []).find(
            (s) => String(s.userId) === String(user?._id || user?.id)
          );

          const progress = Number(student?.progress || 0);
          if (progress >= 100) {
            return { type: 'completed', text: `Курс «${course.title}» завершён`, course };
          }

          return { type: 'in_progress', text: `Вы записаны на курс «${course.title}» (прогресс: ${progress}%)`, course, progress };
        });

        setRecentActivity(activity);
      } catch (error) {
        setStats({
          totalCourses: 0,
          enrolledCourses: 0,
          completedCourses: 0,
          upcomingDeadlines: 0,
        });
        setRecentActivity([]);
      } finally {
        setStatsLoading(false);
      }
    };

    if (user) {
      fetchStats();
    } else {
      setStatsLoading(false);
    }
  }, [user]);

  const statCards = [
    { 
      icon: BookOpen, 
      label: 'Всего курсов', 
      value: stats.totalCourses, 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20'
    },
    { 
      icon: GraduationCap, 
      label: 'Записаны', 
      value: stats.enrolledCourses, 
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-500/20 to-blue-500/20'
    },
    { 
      icon: Trophy, 
      label: 'Завершено', 
      value: stats.completedCourses, 
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/20 to-orange-500/20'
    },
    { 
      icon: Target, 
      label: 'Дедлайны', 
      value: stats.upcomingDeadlines, 
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/20 to-teal-500/20'
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="orb orb-violet" style={{ top: '5%', left: '-5%' }} />
      <div className="orb orb-cyan" style={{ bottom: '10%', right: '-10%' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 p-8 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Добро пожаловать, {user?.firstName}! 👋
            </motion.h1>
            <p className="text-xl text-white/80">
              {t('dashboard')}
            </p>
            <div className="mt-4 flex items-center gap-2 text-white/70">
              <Activity size={16} />
              <span>Статус: Вы авторизованы</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card group"
            >
              <div className={`stat-card-icon bg-gradient-to-br ${stat.bgGradient}`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
              </div>
              <div className="stat-card-value">{statsLoading ? '-' : stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
              <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="premium-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Недавняя активность
                </h2>
              </div>

              {statsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-20 w-full" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400">Пока нет активности — это нормально для нового аккаунта.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item, idx) => (
                    <motion.div
                      key={`${item.text}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        item.type === 'completed' 
                          ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
                          : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                      }`}>
                        {item.type === 'completed' ? (
                          <Trophy className="w-6 h-6 text-white" />
                        ) : (
                          <Clock className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.text}</p>
                        {item.progress !== undefined && (
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                              />
                            </div>
                            <span className="text-sm text-slate-400">{item.progress}%</span>
                          </div>
                        )}
                      </div>
                      {item.course && (
                        <Link
                          to={`/courses/${item.course._id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="premium-card">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Быстрые действия
              </h2>
              
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Все курсы</div>
                    <div className="text-sm text-slate-400">Найти новый курс</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Профиль</div>
                    <div className="text-sm text-slate-400">Редактировать</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                <div className="text-sm text-slate-400 mb-2">Общий прогресс</div>
                <div className="text-3xl font-bold text-white">
                  {stats.completedCourses > 0 ? Math.round((stats.completedCourses / stats.enrolledCourses) * 100) : 0}%
                </div>
                <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    style={{ width: `${stats.enrolledCourses > 0 ? (stats.completedCourses / stats.enrolledCourses) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Link
            to="/courses"
            className="btn-premium inline-flex"
          >
            Просмотреть все курсы
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;