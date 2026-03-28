import React from 'react';
import '../styles/ActivityChart.css';

function ActivityChart({ data }) {
  const maxHours = Math.max(...data.map(d => d.hours));

  return (
    <div className="activity-chart">
      <div className="chart-container">
        {data.map((item, i) => {
          const height = (item.hours / maxHours) * 100;
          return (
            <div key={i} className="chart-bar-group">
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.max(height, 20)}px`,
                    opacity: 0.6 + (height / 100) * 0.4
                  }}
                ></div>
              </div>
              <div className="chart-label">{item.day}</div>
              <div className="chart-value">{item.hours}h</div>
            </div>
          );
        })}
      </div>
      <div className="chart-axis">
        <span>Weekly Learning Hours</span>
      </div>
    </div>
  );
}

export default ActivityChart;
