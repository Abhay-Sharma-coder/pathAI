import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import '../styles/RoadmapPage.css';

function RoadmapPage({ user, roadmaps, setRoadmaps }) {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [roadmapContent, setRoadmapContent] = useState(null);
  const [progress, setProgress] = useState({});
  const [doubt, setDoubt] = useState('');
  const [doubtAnswer, setDoubtAnswer] = useState('');
  const [loadingDoubt, setLoadingDoubt] = useState(false);
  const BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
    const saved = localStorage.getItem('currentRoadmap');
    if (saved) {
      setRoadmapContent(JSON.parse(saved));
      const roadmapId = localStorage.getItem('currentRoadmapId');
      const progressKey = `roadmap_progress_${roadmapId}`;
      const savedProgress = localStorage.getItem(progressKey);
      setProgress(savedProgress ? JSON.parse(savedProgress) : {});
    }
  }, []);

  const handleSelectRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
    localStorage.setItem('currentRoadmapId', roadmap.id);
  };

  const handleCheckTask = (dayIndex, taskIndex) => {
    const key = `day_${dayIndex}_task_${taskIndex}`;
    const updated = { ...progress, [key]: !progress[key] };
    setProgress(updated);

    const roadmapId = localStorage.getItem('currentRoadmapId');
    localStorage.setItem(`roadmap_progress_${roadmapId}`, JSON.stringify(updated));
  };

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!doubt.trim()) return;

    setLoadingDoubt(true);
    setDoubtAnswer('');

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BACKEND_URL}/n8n/doubt-solver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: doubt })
      });

      const data = await res.json();
      setDoubtAnswer(data.answer || '❌ Could not get answer');
    } catch (err) {
      setDoubtAnswer('❌ Error: ' + err.message);
    } finally {
      setLoadingDoubt(false);
    }
  };

  return (
    <div className="roadmap-page">
      <div className="roadmap-container">
        <Sidebar roadmaps={roadmaps} selectedRoadmap={selectedRoadmap} onSelect={handleSelectRoadmap} />

        <div className="roadmap-content">
          {!roadmapContent || !selectedRoadmap ? (
            <div className="empty-roadmap">
              <h2>📖 Select a Roadmap from the sidebar</h2>
              <p>or generate a new one on the Dashboard</p>
            </div>
          ) : (
            <>
              <div className="roadmap-header">
                <h1>{selectedRoadmap.topic}</h1>
                <div className="roadmap-meta">
                  <span>📅 {selectedRoadmap.days} days</span>
                  <span>📊 {Math.round((selectedRoadmap.progress || 0))}% complete</span>
                </div>
              </div>

              <div className="roadmap-body">
                {roadmapContent.split('📅').map((section, i) => {
                  if (!section.trim()) return null;
                  const lines = section.split('\n').filter(l => l.trim());
                  const dayHeader = lines[0];

                  return (
                    <div key={i} className="day-section">
                      <h3 className="day-header">📅{dayHeader}</h3>
                      <div className="day-content">
                        {lines.slice(1).map((line, j) => (
                          <div key={j} className="content-line">
                            {line}
                          </div>
                        ))}
                      </div>

                      <div className="day-tasks">
                        <label className="task-checkbox">
                          <input
                            type="checkbox"
                            checked={progress[`day_${i}_task_0`] || false}
                            onChange={() => handleCheckTask(i, 0)}
                          />
                          <span>Mark day as complete</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="doubt-section">
                <h3>💬 Ask a Doubt</h3>
                <form onSubmit={handleAskDoubt} className="doubt-form">
                  <input
                    type="text"
                    value={doubt}
                    onChange={(e) => setDoubt(e.target.value)}
                    placeholder="Ask anything about the topic..."
                    disabled={loadingDoubt}
                  />
                  <button type="submit" disabled={loadingDoubt}>
                    {loadingDoubt ? '⏳ Asking...' : '🔍 Ask'}
                  </button>
                </form>
                {doubtAnswer && (
                  <div className="doubt-answer">
                    <p>{doubtAnswer}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;
