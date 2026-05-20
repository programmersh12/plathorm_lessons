import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courseAPI } from '../services/api';
import { MOCK_COURSES } from '../data/mockCourses';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  User, 
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: ''
  });
  const { t } = useTranslation();

  const applyFilters = (items) => {
    return items.filter((course) => {
      const byCategory = filters.category ? course.category === filters.category : true;
      const byLevel = filters.level ? course.level === filters.level : true;
      const search = filters.search?.trim().toLowerCase();
      const bySearch = search
        ? `${course.title || ''} ${course.description || ''}`.toLowerCase().includes(search)
        : true;

      return byCategory && byLevel && bySearch;
    });
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.search) params.search = filters.search;
      
      const response = await courseAPI.getCourses(params);
      const apiCourses = response.data.data || response.data || [];
      setCourses(apiCourses.length ? apiCourses : applyFilters(MOCK_COURSES));
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(t('failedToLoadCourses', 'Не удалось загрузить курсы. Попробуйте позже.'));
      setCourses(applyFilters(MOCK_COURSES));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const categories = [
    'Программирование',
    'Дизайн',
    'Бизнес',
    'Маркетинг',
    'Наука'
  ];

  const levels = [
    { value: 'beginner', label: 'Начинающий' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative py-12 px-4">
        <div className="orb orb-violet" style={{ top: '20%', left: '0%' }} />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="skeleton h-12 w-64 mx-auto mb-4" />
            <div className="skeleton h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-80 w-full rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-12 px-4">
      <div className="orb orb-violet" style={{ top: '10%', left: '-5%' }} />
      <div className="orb orb-cyan" style={{ bottom: '20%', right: '-5%' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Образование нового поколения</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Все <span className="gradient-text">курсы</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Найдите идеальный курс для себя и начните свой путь к успеху
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="glass rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="search"
                  placeholder="Поиск курсов..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="input-premium pl-12"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input-premium pl-12 cursor-pointer appearance-none"
                >
                  <option value="">Все категории</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  className="input-premium pl-12 cursor-pointer appearance-none"
                >
                  <option value="">Все уровни</option>
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-xl text-slate-400">Курсы не найдены</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="premium-card p-0 overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop'} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass text-xs font-semibold text-white">
                        {levels.find(l => l.value === course.level)?.label || course.level}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="badge-premium text-xs">
                          {course.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {course.description?.substring(0, 100)}...
                      </p>
                      
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/30">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-white font-semibold">{course.rating?.average?.toFixed(1) || '0.0'}</span>
                          <span className="text-slate-500 text-sm">({course.rating?.count || 0})</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{course.duration} ч</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <User className="w-4 h-4" />
                          <span>{course.instructorId?.firstName} {course.instructorId?.lastName}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-xl font-bold">
                          {course.price === 0 ? (
                            <span className="text-emerald-400">Бесплатно</span>
                          ) : (
                            <span className="text-white">${course.price}</span>
                          )}
                        </div>
                        {course.price === 0 ? (
                          <Link 
                            to={`/courses/${course._id}`}
                            className="btn-secondary-premium px-4 py-2 text-sm"
                          >
                            Смотреть
                          </Link>
                        ) : (
                          <Link 
                            to={`/payment?courseId=${course._id}`}
                            className="btn-premium px-4 py-2 text-sm"
                          >
                            Купить
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Courses;