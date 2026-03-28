import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation({ user, onLogout, onLoginSuccess }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login or signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const BACKEND_URL = 'http://localhost:5000';

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => password.length >= 6;

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('❌ Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('❌ Please enter a valid email (e.g., user@example.com)');
      return;
    }
    if (!password) {
      setError('❌ Password is required');
      return;
    }
    if (!validatePassword(password)) {
      setError('❌ Password must be at least 6 characters long');
      return;
    }

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/signup';
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(`❌ ${data.error || 'Authentication failed'}`);
        return;
      }

      onLoginSuccess(data.user, data.token);
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('❌ Connection error. Check backend.');
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            🤖 PathAI
          </Link>

          <div className="nav-tabs">
            <Link to="/" className={`nav-tab ${isActive('/')}`}>
              📊 Dashboard
            </Link>
            {user && (
              <>
                <Link to="/roadmap" className={`nav-tab ${isActive('/roadmap')}`}>
                  🗺️ Roadmap
                </Link>
                <Link to="/progress" className={`nav-tab ${isActive('/progress')}`}>
                  📈 Progress
                </Link>
              </>
            )}
          </div>

          <div className="nav-user">
            {user ? (
              <div className="user-section">
                <span className="user-name">👤 {user.name}</span>
                <button className="btn-logout" onClick={onLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="btn-login"
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('login');
                  setError('');
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>

            <form onSubmit={handleAuth}>
              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>🔐 Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-submit">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-toggle">
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError('');
                    }}
                    className="toggle-link"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError('');
                    }}
                    className="toggle-link"
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            <div className="demo-section">
              <p>📌 Demo Account:</p>
              <small>Email: demo@pathai.com | Password: demo123</small>
            </div>

            <button
              type="button"
              className="btn-close-modal"
              onClick={() => setShowAuthModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;
