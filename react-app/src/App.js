import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import RoadmapPage from './components/RoadmapPage';
import ProgressPage from './components/ProgressPage';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = 'http://localhost:5000';

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserProfile(token);
    }
  }, []);

  const loadUserProfile = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        loadRoadmaps(token);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      localStorage.removeItem('authToken');
    }
  };

  const loadRoadmaps = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/roadmap`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data);
      }
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
    loadRoadmaps(token);
  };

  const handleLogout = () => {
    setUser(null);
    setRoadmaps([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentRoadmap');
  };

  return (
    <Router>
      <div className="app-container">
        <Navigation user={user} onLogout={handleLogout} onLoginSuccess={handleLogin} />
        <Routes>
          <Route path="/" element={<Dashboard user={user} roadmaps={roadmaps} />} />
          <Route path="/roadmap" element={<RoadmapPage user={user} roadmaps={roadmaps} setRoadmaps={setRoadmaps} />} />
          <Route path="/progress" element={<ProgressPage user={user} roadmaps={roadmaps} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
