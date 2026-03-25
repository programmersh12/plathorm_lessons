import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import VyKodHome from './pages/VyKodHome'; // New VYKOD home page
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Lesson from './pages/Lesson';
import Profile from './pages/Profile';
import CourseDetail from './pages/CourseDetail';
import './App.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <div className="app-shell">
            <div className="app-orb orb-violet" />
            <div className="app-orb orb-cyan" />
            <Navbar />
            <main className="main-content">
              <Routes>
  <Route path="/" element={<VyKodHome />} />
  <Route path="/platform" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/courses" 
    element={
      <ProtectedRoute>
        <Courses />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/courses/:courseId" 
    element={
      <ProtectedRoute>
        <CourseDetail />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/courses/:courseId/lessons/:lessonId" 
    element={
      <ProtectedRoute>
        <Lesson />
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } 
  />
</Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
