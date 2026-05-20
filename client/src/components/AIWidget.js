import React, { useState } from 'react';
import { aiAPI } from '../services/api';

const AIWidget = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await aiAPI.ask(question);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error asking AI:', error);
      setAnswer('Извините, произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-widget">
      <h2>AI Помощник</h2>
      <div className="input-group">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Задайте ваш вопрос..."
        />
        <button onClick={askAI} disabled={loading}>
          {loading ? '...' : 'Задать'}
        </button>
      </div>
      {answer && (
        <div className="answer">
          <h3>Ответ:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AIWidget;