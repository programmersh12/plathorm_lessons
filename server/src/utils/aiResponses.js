const aiResponses = [
  { keywords: [/курс/i, /курсы/i], response: 'Вы можете найти курсы во вкладке Courses' },
  { keywords: [/тест/i], response: 'Перейдите во вкладку Тесты' },
  { keywords: [/как\s*пройти\s*тест/i], response: 'Перейдите во вкладку Тесты' },
  { keywords: [/оформить/i, /подписаться/i], response: 'Нажмите кнопку "Подписаться" рядом с преподавателем' },
  { keywords: [/платеж/i, /оплата/i], response: 'Оплата доступна на странице курса' },
  { keywords: [/вебинар/i, /звонок/i], response: 'Видеозвонки доступны в вашем расписании' },
];

const getAIAnswer = (question = '') => {
  const match = aiResponses.find((item) => item.keywords.some((re) => re.test(question)));
  return match ? match.response : 'Извините, я пока не знаю ответа на этот вопрос';
};

module.exports = {
  aiResponses,
  getAIAnswer,
};
