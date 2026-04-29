import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { number: '3', label: 'Курса', icon: '📚' },
    { number: '15+', label: 'Уроков', icon: '📖' },
    { number: '50+', label: 'Вопросов', icon: '❓' },
    { number: '100%', label: 'Практики', icon: '💻' },
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Практический подход',
      description: 'Никакой сухой теории — только реальные задачи и практические упражнения',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '⚡',
      title: 'Современные технологии',
      description: 'Изучайте актуальные технологии: JavaScript, React, React Native',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🎓',
      title: 'Пошаговое обучение',
      description: 'От простого к сложному — идеальная структура для начинающих',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🏆',
      title: 'Проверка знаний',
      description: 'Тесты и вопросы после каждого урока для закрепления материала',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-sm mb-4">
            О проекте VYKOD
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Платформа нового{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              поколения
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            VYKOD — это современная образовательная платформа для изучения программирования, 
            созданная для тех, кто хочет освоить востребованные навыки быстро и эффективно
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`}></div>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Наша миссия
            </h3>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              Сделать качественное образование в сфере программирования доступным для каждого. 
              Мы верим, что правильный подход к обучению и практические задания могут превратить 
              новичка в уверенного разработчика.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-2xl">✅</span>
                <span className="text-white font-medium">Актуальные курсы</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-2xl">🎯</span>
                <span className="text-white font-medium">Практика 100%</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-2xl">📱</span>
                <span className="text-white font-medium">Доступно везде</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-700 mb-6">
            Готовы начать свой путь в программировании?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#courses"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Смотреть курсы
            </a>
            <a
              href="/register"
              className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
            >
              Зарегистрироваться
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
