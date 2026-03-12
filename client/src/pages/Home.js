import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <header style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h1>Welcome to LearningPlatform</h1>
        <p>Your journey to knowledge starts here</p>
      </header>

      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {!user ? (
          <div>
            <p>Join our learning community today!</p>
            <Link to="/register" className="form-button" style={{ marginRight: '10px', display: 'inline-block' }}>
              Get Started
            </Link>
            <Link to="/login" className="nav-link" style={{ display: 'inline-block', marginLeft: '10px' }}>
              Login
            </Link>
          </div>
        ) : (
          <div>
            <p>Hello, {user.firstName}! Ready to continue learning?</p>
            <Link to="/dashboard" className="form-button" style={{ display: 'inline-block' }}>
              Go to Dashboard
            </Link>
          </div>
        )}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3>Learn from Experts</h3>
          <p>Access high-quality courses taught by industry professionals.</p>
        </div>
        
        <div className="card">
          <h3>Flexible Schedule</h3>
          <p>Study at your own pace, anytime, anywhere.</p>
        </div>
        
        <div className="card">
          <h3>Certification</h3>
          <p>Earn certificates to showcase your skills.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;