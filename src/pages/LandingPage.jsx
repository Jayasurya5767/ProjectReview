import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, loading, user, token } = useApp();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const hasNavigatedRef = useRef(false);

  // Watch for successful login and redirect
  useEffect(() => {
    console.log('🔍 useEffect check - token:', !!token, 'user:', !!user);
    
    // Only redirect if we have BOTH token and user from a fresh login
    if (token && user && user.role && !hasNavigatedRef.current) {
      console.log('✨ useEffect: Valid token and user detected');
      console.log('📍 Current route:', window.location.pathname);
      
      hasNavigatedRef.current = true;
      
      // Navigate immediately to avoid race conditions
      if (user.role === 'TEACHER') {
        console.log('➡️ useEffect: Navigating to /teacher/dashboard');
        navigate('/teacher/dashboard', { replace: true });
      } else if (user.role === 'STUDENT') {
        console.log('➡️ useEffect: Navigating to /student/dashboard');
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('🔐 Login attempt with:', { username: formData.username });
    
    const result = await login(formData.username, formData.password);
    
    console.log('📦 Login result:', result);

    if (result.success) {
      console.log('✅ Login successful! User:', result.user);
      console.log('   The useEffect will now handle the redirect');
      // Redirect will be handled by useEffect watching token/user
    } else {
      console.error('❌ Login failed:', result.error);
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Online Assignment Submission & Grading System</h1>
        <p className="landing-subtitle">
          Streamline assignments, submissions, and grading in one place
        </p>

        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="demo-accounts">
            <h3>Demo Accounts:</h3>
            <p><strong>Teacher:</strong> teacher / password</p>
            <p><strong>Student:</strong> student / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
