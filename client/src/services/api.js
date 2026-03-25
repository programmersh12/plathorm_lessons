import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  const trimmedUrl = (url || '').replace(/\/+$/, '');

  if (!trimmedUrl) {
    return 'http://localhost:5000/api';
  }

  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истёк или невалиден, перенаправить на страницу входа
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.patch(`/auth/reset-password/${token}`, { newPassword }),
};

// Эндпоинты пользователей
export const userAPI = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  getAllUsers: (params) => api.get('/users', { params }),
};

// Эндпоинты курсов
export const courseAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (courseId) => api.get(`/courses/${courseId}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (courseId, courseData) => api.put(`/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),
  enrollInCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
  unenrollFromCourse: (courseId) => api.delete(`/courses/${courseId}/unenroll`),
  getMyCourses: () => api.get('/courses/my-courses'),
  getCoursesByInstructor: (instructorId) => api.get(`/courses/instructor/${instructorId}`),
  updateCourseProgress: (courseId, progressData) => api.put(`/courses/${courseId}/progress`, progressData),
  getCourseAnalytics: (courseId) => api.get(`/courses/${courseId}/analytics`),
};

// Эндпоинты уроков
export const lessonAPI = {
  getLessons: (courseId) => api.get(`/courses/${courseId}/lessons`),
  getLesson: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`),
  createLesson: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  updateLesson: (courseId, lessonId, lessonData) => api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData),
  deleteLesson: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`),
  markLessonComplete: (courseId, lessonId) => api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
};

// Эндпоинты тестов
export const quizAPI = {
  getQuizzes: (params) => api.get('/quizzes', { params }),
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`),
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  updateQuiz: (quizId, quizData) => api.put(`/quizzes/${quizId}`, quizData),
  deleteQuiz: (quizId) => api.delete(`/quizzes/${quizId}`),
  startQuiz: (quizId) => api.post(`/quizzes/${quizId}/start`),
  submitQuiz: (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, answers),
};

// Эндпоинты тестирования
export const testAPI = {
  getTests: (params) => api.get('/tests', { params }),
  getTest: (testId) => api.get(`/tests/${testId}`),
  createTest: (testData) => api.post('/tests', testData),
  updateTest: (testId, testData) => api.put(`/tests/${testId}`, testData),
  deleteTest: (testId) => api.delete(`/tests/${testId}`),
  submitTest: (testId, answers) => api.post(`/tests/${testId}/submit`, answers),
};

// Эндпоинты сертификатов
export const certificateAPI = {
  getCertificates: (params) => api.get('/certificates', { params }),
  getCertificate: (certificateId) => api.get(`/certificates/${certificateId}`),
  createCertificate: (certificateData) => api.post('/certificates', certificateData),
  verifyCertificate: (verificationCode) => api.get(`/certificates/verify/${verificationCode}`),
  getMyCertificates: () => api.get('/certificates/my-certificates'),
  downloadCertificate: (id) => api.get(`/certificates/download/${id}`, { responseType: 'blob' }),
  getDiplomaSettings: (courseId) => api.get(`/certificates/diploma-settings/${courseId}`),
  updateDiplomaSettings: (courseId, settings) => api.put(`/certificates/diploma-settings/${courseId}`, settings),
};

// Эндпоинты отзывов
export const reviewAPI = {
  getReviews: (courseId) => api.get(`/courses/${courseId}/reviews`),
  createReview: (courseId, reviewData) => api.post(`/courses/${courseId}/reviews`, reviewData),
  updateReview: (courseId, reviewId, reviewData) => api.put(`/courses/${courseId}/reviews/${reviewId}`, reviewData),
  deleteReview: (courseId, reviewId) => api.delete(`/courses/${courseId}/reviews/${reviewId}`),
};

export default api;