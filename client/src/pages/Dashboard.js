import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    upcomingDeadlines: 0
  });

  // In a real app, you would fetch these stats from the backend
  useEffect(() => {
    // Simulate fetching dashboard stats
    const fetchStats = async () => {
      // This would be an API call in a real application
      setStats({
        totalCourses: 12,
        enrolledCourses: 5,
        completedCourses: 2,
        upcomingDeadlines: 3
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.firstName} {user?.lastName}!</p>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">Total Courses</h3>
          <p className="card-content">{stats.totalCourses}</p>
        </div>
        
        <div className="card">
          <h3 className="card-title">Enrolled Courses</h3>
          <p className="card-content">{stats.enrolledCourses}</p>
        </div>
        
        <div className="card">
          <h3 className="card-title">Completed Courses</h3>
          <p className="card-content">{stats.completedCourses}</p>
        </div>
        
        <div className="card">
          <h3 className="card-title">Upcoming Deadlines</h3>
          <p className="card-content">{stats.upcomingDeadlines}</p>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '20px' }}>
        <h3 className="card-title">Recent Activity</h3>
        <ul className="card-content">
          <li>Completed "Introduction to React" course</li>
          <li>Submitted assignment for "Advanced JavaScript"</li>
          <li>Enrolled in "Node.js Backend Development"</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;