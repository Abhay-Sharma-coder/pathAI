import React from 'react';
import '../styles/Badges.css';

function Badges({ achievements }) {
  return (
    <div className="badges-container">
      {achievements.map((badge) => (
        <div
          key={badge.id}
          className={`badge ${badge.unlocked ? 'unlocked' : 'locked'}`}
          title={badge.name}
        >
          <div className="badge-icon">{badge.icon}</div>
          <div className="badge-name">{badge.name}</div>
          {!badge.unlocked && <div className="badge-lock">🔒</div>}
        </div>
      ))}
    </div>
  );
}

export default Badges;
