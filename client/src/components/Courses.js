import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Courses = () => {
  const navigate = useNavigate();
  
  const courses = [
    {
      _id: '1',
      title: "Основы JavaScript",
      difficulty: "Начинающий",
      description: "Освойте основы JavaScript на практических упражнениях.",
      level: "beginner"
    },
    {
      _id: '2',
      title: "Разработка на React",
      difficulty: "Средний",
      description: "Создавайте современные веб-приложения на React и изучайте продвинутые возможности.",
      level: "intermediate"
    },
    {
      _id: '5',
      title: "Разработка мобильных приложений",
      difficulty: "Продвинутый",
      description: "Создавайте кроссплатформенные мобильные приложения на React Native.",
      level: "advanced"
    }
  ];

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Популярные <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">курсы</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Выберите подходящую программу из нашей подборки курсов по программированию
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.level)}`}>
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{course.description}</p>
                <button 
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Перейти к курсу
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;