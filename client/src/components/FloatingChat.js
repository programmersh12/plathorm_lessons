import React, { useState, useEffect, useRef } from 'react';

const COMMANDS = [
  { cmd: '/help', keywords: ['помощь', 'команды', 'help'], response: 'Доступные команды:\n/courses - Список курсов\n/tests - Доступные тесты\n/profile - Ваш профиль\n/certificates - Ваши сертификаты\n/teachers - Преподаватели\n/quiz - Начать викторину\n/info - О платформе' },
  { cmd: '/courses', keywords: ['курс', 'курсы', 'courses'], response: 'Перейдите в раздел "Courses" в меню или нажмите /courses для просмотра доступных курсов.' },
  { cmd: '/tests', keywords: ['тест', 'тесты', 'tests'], response: 'Раздел "Tests" содержит тесты для проверки знаний. Найдите его в меню платформы.' },
  { cmd: '/profile', keywords: ['профиль', 'profile'], response: 'Ваш профиль доступен по ссылке /profile. Там вы можете редактировать свои данные.' },
  { cmd: '/certificates', keywords: ['сертификат', 'сертификаты', 'certificate'], response: 'Ваши сертификаты доступны в разделе Certificates после успешного прохождения курсов.' },
  { cmd: '/teachers', keywords: ['преподаватель', 'учитель', 'teachers'], response: 'Список преподавателей доступен в разделе Teachers. Там можно выбрать наставника.' },
  { cmd: '/quiz', keywords: ['викторина', 'quiz'], response: 'Для прохождения викторины перейдите в раздел Quizzes в меню курса.' },
  { cmd: '/info', keywords: ['информация', 'info', 'о платформе'], response: 'Платформа VyKodLearn - онлайн-обучение с преподавателями и AI-помощником.' },
  { cmd: '/payment', keywords: ['оплата', 'платеж', 'payment'], response: 'Оплата доступна на странице курса. Нажмите кнопку "Subscribe" рядом с выбранным курсом.' },
  { cmd: '/lesson', keywords: ['урок', 'lessons'], response: 'Уроки доступны внутри каждого курса. Откройте курс и выберите урок для изучения.' },
  { cmd: '/support', keywords: ['поддержка', 'support'], response: 'По вопросам пишите в чат. Также можете связаться через раздел Contact.' },
];

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId] = useState(() => localStorage.getItem('userId'));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = (text) => {
    const lowerText = text.toLowerCase().trim();

    const cmdMatch = COMMANDS.find(c => c.cmd === lowerText || c.cmd === `/${lowerText}`);
    if (cmdMatch) return cmdMatch.response;

    const keywordMatch = COMMANDS.find(c => c.keywords.some(k => lowerText.includes(k)));
    if (keywordMatch) return keywordMatch.response;

    const fallbackResponses = [
      'Я получил ваше сообщение. Напишите /help для списка команд.',
      'Попробуйте использовать команды. Нажмите /help для справки.',
      'Для получения информации используйте команды. /help - список команд.',
      'Я пока не полностью понимаю. Напишите /help для доступных команд.',
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      _id: Date.now(),
      content: input.trim(),
      senderId: userId,
      isUser: true,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        _id: Date.now() + 1,
        content: getAIResponse(input.trim()),
        senderId: 'ai',
        isFromAI: true,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 500 + Math.random() * 1000);
  };

  const normalizeId = (val) => String(val);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center animate-bounce"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-600 to-indigo-600">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h3 className="text-white font-semibold">AI Помощник</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm">
                <p className="mb-2">👋 Привет!</p>
                <p>Я AI помощник платформы.</p>
                <p className="mt-2 text-xs">Напиши <span className="text-violet-400">/help</span> для списка команд</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`max-w-[85%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
                  msg.isUser
                    ? 'ml-auto bg-violet-600 text-white rounded-br-sm'
                    : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                }`}
              >
                {!msg.isUser && <span className="text-xs text-indigo-300 mb-1 block">🤖 AI Помощник</span>}
                <p>{msg.content}</p>
                <span className="text-xs opacity-50 block mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[85%] p-3 rounded-xl text-sm bg-gray-800 text-gray-400 rounded-bl-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Напишите сообщение..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;