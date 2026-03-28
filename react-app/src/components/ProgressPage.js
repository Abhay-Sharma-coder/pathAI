import React, { useState, useEffect } from 'react';
import ActivityChart from './ActivityChart';
import Badges from './Badges';
import '../styles/ProgressPage.css';

function ProgressPage({ user, roadmaps }) {
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    totalXp: 0,
    streak: 0,
    level: 1,
    roadmapsCompleted: 0
  });

  useEffect(() => {
    const totalDays = roadmaps.reduce((sum, r) => sum + (r.days || 0), 0);
    const roadmapsCompleted = roadmaps.filter(r => r.status === 'completed').length;

    setStats({
      totalDays,
      completedDays: Math.floor(totalDays * 0.4), // Placeholder calculation
      totalXp: user?.xp || 0,
      streak: user?.streak || 0,
      level: user?.level || 1,
      roadmapsCompleted
    });
  }, [user, roadmaps]);

  const generateWeeklyData = () => {
    // Mock weekly activity data
    return [
      { day: 'Mon', hours: 2 },
      { day: 'Tue', hours: 3 },
      { day: 'Wed', hours: 1 },
      { day: 'Thu', hours: 4 },
      { day: 'Fri', hours: 2 },
      { day: 'Sat', hours: 3 },
      { day: 'Sun', hours: 2 }
    ];
  };

  const achievements = [
    { id: 1, name: 'Quick Learner', icon: '⚡', unlocked: stats.completedDays > 5 },
    { id: 2, name: '7-Day Streak', icon: '🔥', unlocked: stats.streak >= 7 },
    { id: 3, name: 'First Roadmap', icon: '🚀', unlocked: roadmaps.length > 0 },
    { id: 4, name: 'Master', icon: '👑', unlocked: stats.roadmapsCompleted >= 5 },
    { id: 5, name: 'Social Butterfly', icon: '🦋', unlocked: stats.level >= 5 },
    { id: 6, name: 'XP Collector', icon: '💎', unlocked: stats.totalXp >= 1000 }
  ];

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>📈 Your Learning Progress</h1>
        <p>Track your achievements and learning trends</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <div className="card-value">{stats.totalDays}</div>
            <div className="card-label">Total Learning Days</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <div className="card-value">{stats.completedDays}</div>
            <div className="card-label">Days Completed</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <div className="card-value">{stats.level}</div>
            <div className="card-label">Current Level</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🔥</div>
          <div className="card-content">
            <div className="card-value">{stats.streak}</div>
            <div className="card-label">Day Streak</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">💫</div>
          <div className="card-content">
            <div className="card-value">{stats.totalXp}</div>
            <div className="card-label">Total XP</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <div className="card-value">{stats.roadmapsCompleted}</div>
            <div className="card-label">Roadmaps Completed</div>
          </div>
        </div>
      </div>

      <div className="activity-section">
        <h2>📊 Weekly Activity</h2>
        <ActivityChart data={generateWeeklyData()} />
      </div>

      <div className="achievements-section">
        <h2>🏆 Achievements</h2>
        <Badges achievements={achievements} />
      </div>

      <div className="level-progress">
        <h2>🌟 Level Progress</h2>
        <div className="level-info">
          <div className="level-bar-container">
            <div className="level-bar">
              <div className="level-fill" style={{ width: `${(stats.totalXp % 1000) / 10}%` }}></div>
            </div>
            <span className="xp-text">{stats.totalXp % 1000} / 1000 XP to next level</span>
          </div>
        </div>
      </div>

      <div className="roadmap-stats">
        <h2>📚 Roadmap Statistics</h2>
        <div className="roadmap-grid">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="roadmap-stat-card">
              <h3>{roadmap.topic}</h3>
              <div className="stat-row">
                <span>Days:</span>
                <strong>{roadmap.days}</strong>
              </div>
              <div className="stat-row">
                <span>Status:</span>
                <strong className={`status-${roadmap.status}`}>{roadmap.status}</strong>
              </div>
              <div className="progress-mini">
                <div className="progress-bar-mini">
                  <div
                    className="progress-fill-mini"
                    style={{ width: `${roadmap.progress || 0}%` }}
                  ></div>
                </div>
                <span>{Math.round(roadmap.progress || 0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
