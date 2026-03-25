import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Pricing = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      name: "Базовый",
      price: "$0",
      period: "навсегда",
      description: "Отлично подходит для старта в программировании",
      features: [
        "Доступ к базовым курсам",
        "Поддержка сообщества",
        "Ограниченное число проектов",
        "Базовые тесты"
      ],
      cta: "Начать",
      popular: false
    },
    {
      name: "Про",
      price: "$19",
      period: "в месяц",
      description: "Для тех, кто хочет прогрессировать быстрее",
      features: [
        "Все курсы включены",
        "Приоритетная поддержка",
        "Реальные проекты",
        "Продвинутые тесты",
        "Сертификат о прохождении",
        "Карьерные рекомендации"
      ],
      cta: "Попробовать бесплатно",
      popular: true
    },
    {
      name: "Премиум",
      price: "$49",
      period: "в месяц",
      description: "Для профессионалов, которым нужен максимальный результат",
      features: [
        "Всё из тарифа Про",
        "Индивидуальное наставничество",
        "Разбор портфолио",
        "Помощь с трудоустройством",
        "Эксклюзивные материалы",
        "Онлайн-воркшопы"
      ],
      cta: "Попробовать бесплатно",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Простые и прозрачные <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">тарифы</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Выберите тариф, который лучше всего подходит вашему пути обучения
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative rounded-2xl shadow-lg p-8 ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 bg-gradient-to-b from-white to-gray-50 transform -translate-y-2' 
                  : 'bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Самый популярный
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-600"> / {plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate('/register')}
                className={`w-full py-4 font-semibold rounded-lg transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;