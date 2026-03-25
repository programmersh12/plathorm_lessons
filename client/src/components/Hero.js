import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Изучай программирование
              </span>{' '}
              <br />
              <span className="text-gray-800">умно и эффективно</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-lg"
            >
              Интерактивные онлайн-курсы для новичков и опытных разработчиков
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Начать обучение
              </button>
              <button 
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
              >
                Смотреть курсы
              </button>
            </motion.div>
          </div>
          
          {/* Visual Content */}
          <div className="lg:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full h-full flex flex-col">
                  <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-auto">
                    <pre className="text-white text-sm font-mono">
                      <code>{`function приветVykod() {\n  console.log("Привет, VYKOD!");\n  return "Учиться просто";\n}\n\nприветVykod();`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-2xl">🚀</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-xl">💡</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;