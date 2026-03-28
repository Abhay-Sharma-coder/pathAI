import React, { useState } from 'react';
import '../styles/Dashboard.css';

function Dashboard({ user, roadmaps }) {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState('2');
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = 'http://localhost:5000';

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login first to generate roadmaps');
      return;
    }

    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BACKEND_URL}/n8n/generate-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, days: parseInt(days) })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('currentRoadmap', JSON.stringify(data.roadmap));
        localStorage.setItem('currentRoadmapId', data.roadmapId);
        alert('✅ Roadmap generated! Go to Roadmap page to view it.');
        setTopic('');
      } else {
        alert('Error generating roadmap');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalDays = roadmaps.reduce((sum, r) => sum + (r.days || 0), 0);
  const completedRoadmaps = roadmaps.filter(r => r.status === 'completed').length;
  const totalXp = user?.xp || 0;
  const level = user?.level || 1;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🚀 Welcome back, {user?.name || 'Guest'}!</h1>
        <p>Your learning journey starts here</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-value">{roadmaps.length}</div>
            <div className="stat-label">Roadmaps Created</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{totalDays}</div>
            <div className="stat-label">Total Learning Days</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completedRoadmaps}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">Lv {level}</div>
            <div className="stat-label">{totalXp} XP</div>
          </div>
        </div>
      </div>

      {user && (
        <div className="generate-section">
          <h2>✨ Generate New Roadmap</h2>
          <form onSubmit={handleGenerateRoadmap} className="generate-form">
            <div className="form-group">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., React for Beginners, Machine Learning, Backend Automation..."
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <select value={days} onChange={(e) => setDays(e.target.value)} disabled={loading}>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="5">5 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-generate">
              {loading ? '⏳ Generating...' : '🎯 Generate Roadmap'}
            </button>
          </form>
        </div>
      )}

      {!user && (
        <div className="login-prompt">
          <h2>👋 Join PathAI Today!</h2>
          <p>Login to generate personalized learning roadmaps and track your progress</p>
        </div>
      )}

      <div className="recent-roadmaps">
        <h2>📚 Recent Roadmaps</h2>
        {roadmaps.length === 0 ? (
          <p className="empty-message">No roadmaps yet. Generate one to get started!</p>
        ) : (
          <div className="roadmaps-list">
            {roadmaps.slice(0, 5).map((roadmap) => (
              <div key={roadmap.id} className="roadmap-item">
                <div className="roadmap-info">
                  <h3>{roadmap.topic}</h3>
                  <p>{roadmap.days} days • {roadmap.status}</p>
                </div>
                <div className="roadmap-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${roadmap.progress || 0}%` }}
                    ></div>
                  </div>
                  <span>{roadmap.progress || 0}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
