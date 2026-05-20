import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../services/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await teacherAPI.getTeachers();
        setTeachers(data.teachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setError('Не удалось загрузить преподавателей');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const subscribeToTeacher = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleSubscribe = async () => {
    try {
      await teacherAPI.subscribe({
        teacherId: selectedTeacher._id,
        courseIds: (selectedTeacher.courses || []).map((c) => c._id),
      });
      alert('Подписка оформлена успешно!');
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error subscribing:', error);
      alert(error?.response?.data?.message || 'Ошибка при оформлении подписки');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="teachers-page">
      <h1>Преподаватели</h1>
      {error && <p style={{ color: '#d14343' }}>{error}</p>}
      <div className="teachers-grid">
        {teachers.map(teacher => (
          <div key={teacher._id} className="teacher-card">
            <img src={teacher.userId.profilePicture || '/default-avatar.png'} alt={teacher.name} />
            <h3>{teacher.name}</h3>
            <p>{teacher.description}</p>
            <p>Подписка: ${teacher.subscriptionPrice}</p>
            <button onClick={() => subscribeToTeacher(teacher)}>Подписаться</button>
          </div>
        ))}
      </div>

      {selectedTeacher && (
        <div className="subscription-modal">
          <h2>Подписка на {selectedTeacher.name}</h2>
          <p>Цена: ${selectedTeacher.subscriptionPrice}</p>
          <p>Количество курсов: {(selectedTeacher.courses || []).length}</p>
          <div className="modal-buttons">
            <button onClick={handleSubscribe}>Оформить подписку</button>
            <button onClick={() => setSelectedTeacher(null)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;