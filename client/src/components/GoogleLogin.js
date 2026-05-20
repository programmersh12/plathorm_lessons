import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        window.history.replaceState({}, document.title, '/login');
        return;
      }

      if (token && userId) {
        setLoading(true);
        try {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);

          const response = await authAPI.getProfile();
          const user = response.data?.user || response.data;
          
          localStorage.setItem('user', JSON.stringify(user));
          
          window.history.replaceState({}, document.title, '/dashboard');
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error('[GoogleLogin] Profile fetch error:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setError('Failed to complete authentication');
        } finally {
          setLoading(false);
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const handleGoogleLogin = () => {
    setError(null);
    setLoading(true);
    
    const apiUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    const baseUrl = apiUrl.replace(/\/api$/, '').replace(/\/+$/, '');
    
    window.location.href = `${baseUrl}/api/auth/google`;
  };

  if (loading) {
    return (
      <button
        disabled
        className="google-login-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          border: '2px solid #e9ecef',
          borderRadius: '8px',
          cursor: 'not-allowed',
          opacity: 0.7
        }}
      >
        <span>Processing...</span>
      </button>
    );
  }

  return (
    <div>
      {error && (
        <div style={{
          padding: '10px 12px',
          marginBottom: '12px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          color: '#856404',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="google-login-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#fff',
          border: '2px solid #dadce0',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '500',
          color: '#3c4043',
          transition: 'all 0.2s ease'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;