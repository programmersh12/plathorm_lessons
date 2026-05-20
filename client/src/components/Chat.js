import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

const Chat = ({ userId, partnerId, partnerName = 'Преподаватель' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);

  const normalizeId = (value) => String(value);

  useEffect(() => {
    if (!userId || !partnerId) return undefined;

    socket.emit('register', userId);
    socket.emit('getMessages', { userId, partnerId });

    socket.on('messagesHistory', (history) => {
      setMessages(history);
    });

    socket.on('newMessage', (message) => {
      const senderId = normalizeId(message.senderId);
      const receiverId = normalizeId(message.receiverId);

      if (
        (senderId === normalizeId(userId) && receiverId === normalizeId(partnerId)) ||
        (senderId === normalizeId(partnerId) && receiverId === normalizeId(userId))
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('userOnline', (onlineUserId) => {
      if (onlineUserId === normalizeId(partnerId)) {
        setIsOnline(true);
      }
    });

    socket.on('userOffline', (offlineUserId) => {
      if (offlineUserId === normalizeId(partnerId)) {
        setIsOnline(false);
      }
    });

    socket.on('chatError', (payload) => {
      setError(payload?.message || 'Ошибка чата');
    });

    return () => {
      socket.off('messagesHistory');
      socket.off('newMessage');
      socket.off('chatError');
      socket.off('userOnline');
      socket.off('userOffline');
    };
  }, [userId, partnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    socket.emit('sendMessage', {
      senderId: userId,
      receiverId: partnerId,
      content: input,
    });

    setInput('');
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="chat-header-title">{partnerName}</h2>
          <div className="chat-header-status">
            <span className={`chat-status-dot ${isOnline ? '' : 'offline'}`} />
            <span>{isOnline ? 'Онлайн' : 'Офлайн'}</span>
          </div>
        </div>

        {error && <div className="chat-error">{error}</div>}

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              Начните общение...
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message ${normalizeId(msg.senderId) === normalizeId(userId) ? 'sent' : 'received'}`}
              >
                {msg.isFromAI && <span className="ai-label">🤖 AI:</span>}
                <p>{msg.content}</p>
                <small className="timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите сообщение..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;