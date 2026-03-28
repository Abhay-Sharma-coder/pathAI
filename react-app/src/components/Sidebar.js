import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ roadmaps, selectedRoadmap, onSelect }) {
  const getRoadmapStatus = (roadmap) => {
    const progress = roadmap.progress || 0;
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981'; // Green
      case 'in-progress':
        return '#a78bfa'; // Purple
      case 'upcoming':
        return '#6b7280'; // Gray
      default:
        return '#6b7280';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'completed':
        return '🟢';
      case 'in-progress':
        return '🟣';
      case 'upcoming':
        return '⚪';
      default:
        return '⚪';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>📚 Your Roadmaps</h3>
      </div>

      <div className="sidebar-list">
        {roadmaps.length === 0 ? (
          <div className="sidebar-empty">
            <p>No roadmaps yet</p>
            <small>Generate one from Dashboard</small>
          </div>
        ) : (
          roadmaps.map((roadmap) => {
            const status = getRoadmapStatus(roadmap);
            const isSelected = selectedRoadmap?.id === roadmap.id;

            return (
              <div
                key={roadmap.id}
                className={`sidebar-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelect(roadmap)}
              >
                <div className="sidebar-item-header">
                  <span className="status-dot">{getStatusDot(status)}</span>
                  <span className="roadmap-title">{roadmap.topic}</span>
                </div>
                <div className="sidebar-item-meta">
                  <span className="days">📅 {roadmap.days}d</span>
                  <span className="progress">{Math.round(roadmap.progress || 0)}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="sidebar-legend">
        <div className="legend-item">
          <span className="legend-dot">🟢</span>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot">🟣</span>
          <span>In Progress</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot">⚪</span>
          <span>Upcoming</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
