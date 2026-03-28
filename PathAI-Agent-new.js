// Backend API base URL
const API_BASE = 'http://localhost:5000/api';

// Auth state
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let currentRoadmapContent = null;

window.onload = function() {
  showAppScreen();
  
  const savedRoadmap = localStorage.getItem('currentRoadmap');
  const savedProgress = localStorage.getItem('currentProgress');
  if (savedRoadmap) {
    currentRoadmapContent = JSON.parse(savedRoadmap);
    renderRoadmapPersistent(currentRoadmapContent, savedProgress ? JSON.parse(savedProgress) : {});
    document.getElementById('resultArea').classList.remove('hidden');
    document.getElementById('doubtSolverSection').classList.remove('hidden');
  }
  
  if (authToken) {
    loadUserProfile();
    loadRoadmapHistory();
  } else {
    showGuestMode();
  }
};

function showGuestMode() {
  const profileDiv = document.getElementById('userProfile');
  if (profileDiv) {
    profileDiv.innerHTML = `
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-2xl mb-4 text-center">
        <p class="text-sm text-gray-300">👤 Guest Mode - Browse Freely</p>
        <p class="text-xs text-gray-500 mt-1">Login to save roadmaps & track progress</p>
      </div>
    `;
  }
  document.getElementById('guestLoginBtn').classList.remove('hidden');
}

function showAppScreen() {
  document.getElementById('authWindow')?.classList.add('hidden');
  document.getElementById('appSection')?.classList.remove('hidden');
}

async function loadUserProfile() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load profile');
    }
    
    const data = await response.json();
    currentUser = data;
    
    const profileDiv = document.getElementById('userProfile');
    if (profileDiv) {
      profileDiv.innerHTML = `
        <div class="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 rounded-2xl mb-4 border border-purple-500/30">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg font-bold text-purple-300">👤 ${data.name}</p>
              <p class="text-xs text-gray-400">${data.email}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-yellow-400">${data.xp || 0} XP</p>
              <p class="text-xs text-gray-400">Level ${data.level || 1} • 🔥 ${data.streak || 0} day streak</p>
            </div>
          </div>
          <div class="mt-3 flex gap-2">
            <button onclick="logoutUser()" class="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-bold transition">
              Logout
            </button>
          </div>
        </div>
      `;
    }
    document.getElementById('guestLoginBtn').classList.add('hidden');
  } catch (err) {
    console.error('Profile error:', err);
    // If profile load fails, clear auth and show guest mode
    logoutUser();
  }
}

async function generatePath() {
  const prompt = document.getElementById('userPrompt').value;
  if (!prompt) {
    alert('Please enter a topic');
    return;
  }

  document.getElementById('buildBtn').disabled = true;
  document.getElementById('loader').classList.remove('hidden');

  try {
    const endpoint = `${API_BASE}/n8n/generate-roadmap`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      },
      body: JSON.stringify({ topic: prompt })
    });

    const data = await response.json();
    console.log('🎯 API Response:', data);
    
    // Get roadmap content from the correct field
    let roadmapContent = data.roadmap?.content || data.roadmap || data.learningPath || data.content || '';
    
    if (!roadmapContent) {
      console.error('❌ API Response structure:', data);
      alert('❌ No roadmap generated. Response: ' + JSON.stringify(data));
      return;
    }

    // Ensure it's a string
    if (typeof roadmapContent !== 'string') {
      roadmapContent = JSON.stringify(roadmapContent);
    }

    currentRoadmapContent = roadmapContent;
    localStorage.setItem('currentRoadmap', JSON.stringify(currentRoadmapContent));
    localStorage.setItem('currentProgress', JSON.stringify({}));
    
    // Clear and rebuild result area
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = '';
    
    // Add action buttons
    const buttonsHtml = `
      <div class="flex gap-3 mb-6">
        <button onclick="saveRoadmapPrompt()" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition flex items-center justify-center gap-2">
          <i class="fas fa-save"></i> Save Roadmap
        </button>
        <button onclick="dailyCheckIn()" id="checkinBtn" class="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 ${authToken ? '' : 'hidden'}">
          <i class="fas fa-fire"></i> Daily Check-in
        </button>
      </div>
    `;
    resultArea.insertAdjacentHTML('afterbegin', buttonsHtml);
    
    // Render roadmap content
    renderRoadmapPersistent(currentRoadmapContent, {});
    resultArea.classList.remove('hidden');
    document.getElementById('doubtSolverSection').classList.remove('hidden');
    
    if (authToken) {
      loadRoadmapHistory();
    }
  } catch (err) {
    console.error('Generate error:', err);
    alert('Error: ' + err.message);
  } finally {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('buildBtn').disabled = false;
  }
}

function renderRoadmapPersistent(content, progressMap) {
  if (!content) {
    console.error('❌ No content to render');
    document.getElementById('resultArea').innerHTML = '<p class="text-red-400">Error: No roadmap content</p>';
    return;
  }

  // Ensure content is a string
  if (typeof content !== 'string') {
    console.log('⚠️ Content is not string:', typeof content);
    content = String(content);
  }

  const dayBlocks = content.split(/📅 DAY \d+:|DAY \d+:/g).filter(b => b.trim() !== "");
  let html = '<div class="space-y-4">';
  
  let totalTasks = 0;
  let completedTasks = 0;

  dayBlocks.forEach((block, dayIdx) => {
    const day = dayIdx + 1;
    const lines = block.split('\n').map(l => l.trim());
    const dayTitle = lines.find(l => l && !l.startsWith('•') && !l.startsWith('-') && l.length > 3 && l.length < 100) || `Day ${day}`;
    
    const youtubeLinks = [];
    const articleLinks = [];
    
    lines.forEach(line => {
      const ytMatch = line.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]*/gi);
      if (ytMatch) {
        ytMatch.forEach(url => {
          if (!youtubeLinks.includes(url)) youtubeLinks.push(url);
        });
      }
      
      const urlMatch = line.match(/(https?:\/\/(?:(?!youtube|youtu).)*[^\s<>"{}|\\^`\[\]]*)/gi);
      if (urlMatch) {
        urlMatch.forEach(url => {
          if (!url.includes('youtube') && !articleLinks.includes(url)) articleLinks.push(url);
        });
      }
    });
    
    const tasks = lines
      .filter(t => {
        if (!t || t.length === 0) return false;
        if (/^[-_]+$/.test(t)) return false;
        if (t.length === 1) return false;
        return t.startsWith('•') || t.startsWith('-');
      })
      .map(t => t.replace(/^[-•]\s*/, '').trim())
      .filter(t => t.length > 3)
      .map(t => formatTaskText(t));

    totalTasks += tasks.length;
    
    const dayLabel = `day_${day}`;
    const isDayComplete = progressMap[dayLabel] === true;
    
    let resourcesHtml = '';
    if (youtubeLinks.length > 0 || articleLinks.length > 0) {
      resourcesHtml = `
        <div class="bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-purple-500/30">
          <h4 class="text-sm font-bold text-purple-300 mb-3">📚 Resources</h4>
          <div class="space-y-2">
      `;
      
      youtubeLinks.slice(0, 2).forEach(url => {
        const cleanUrl = url.startsWith('http') ? url : 'https://' + url;
        resourcesHtml += `
          <a href="${cleanUrl}" target="_blank" class="flex items-center gap-2 p-2 rounded hover:bg-blue-600/30 transition text-blue-300 text-xs">
            <i class="fas fa-play-circle text-red-500"></i>
            <span class="truncate">YouTube</span>
            <i class="fas fa-external-link-alt text-xs opacity-50"></i>
          </a>
        `;
      });
      
      articleLinks.slice(0, 2).forEach(url => {
        const domain = new URL(url).hostname.replace('www.', '');
        resourcesHtml += `
          <a href="${url}" target="_blank" class="flex items-center gap-2 p-2 rounded hover:bg-purple-600/30 transition text-purple-300 text-xs">
            <i class="fas fa-link text-purple-400"></i>
            <span class="truncate">${domain}</span>
            <i class="fas fa-external-link-alt text-xs opacity-50"></i>
          </a>
        `;
      });
      
      resourcesHtml += `</div></div>`;
    }
    
    html += `
      <div class="day-card p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border-2 border-purple-500/30 hover:border-purple-500/60 transition-all">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <input type="checkbox" id="check_day_${day}" ${isDayComplete ? 'checked' : ''} 
                onchange="saveTaskProgress('day_${day}', this.checked)"
                class="w-5 h-5 rounded cursor-pointer">
              <div>
                <h3 class="text-xl font-bold text-purple-300">📅 Day ${day}</h3>
                <p class="text-xs text-purple-200">🎯 ${dayTitle}</p>
              </div>
            </div>
            <div class="ml-8 space-y-2">
    `;

    tasks.forEach((task, taskIdx) => {
      const taskId = `task_${day}_${taskIdx}`;
      const isComplete = progressMap[taskId] === true;
      if (isComplete) completedTasks++;
      
      html += `
        <div class="flex items-start gap-3 p-3 rounded hover:bg-gray-700/50 transition bg-gray-800/40 border border-gray-700/50">
          <input type="checkbox" id="${taskId}" ${isComplete ? 'checked' : ''} 
            onchange="saveTaskProgress('${taskId}', this.checked)"
            class="w-4 h-4 mt-1 rounded cursor-pointer accent-green-500 flex-shrink-0">
          <label for="${taskId}" class="flex-1 cursor-pointer text-sm text-gray-200 ${isComplete ? 'line-through text-gray-500' : ''}">
            ${task}
          </label>
        </div>
      `;
    });

    html += `
            </div>
          </div>
          ${resourcesHtml ? `<div class="w-48">${resourcesHtml}</div>` : ''}
        </div>
      </div>
    `;
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  html += `
    <div class="mt-6 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/50">
      <div class="flex justify-between items-center mb-3">
        <span class="text-green-300 font-bold">📊 Overall Progress</span>
        <span class="text-green-400 font-bold text-lg">${progressPercent}% (${completedTasks}/${totalTasks} tasks)</span>
      </div>
      <div class="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all" style="width: ${progressPercent}%"></div>
      </div>
    </div>
  `;
  
  html += '</div>';
  
  const resultDiv = document.getElementById('resultArea');
  if (resultDiv) {
    // Preserve the top buttons section if it exists
    const existingButtons = resultDiv.querySelector('.flex.gap-3.mb-6');
    const buttonsHtml = existingButtons ? existingButtons.outerHTML : '';
    
    // Replace entire content
    resultDiv.innerHTML = buttonsHtml + html;
  }
}

function formatTaskText(text) {
  return text
    .replace(/\b(learn|practice|build|create|master|understand|implement)\b/gi, '<span class="text-yellow-300 font-bold">$1</span>')
    .replace(/\n/g, '<br>');
}

function saveTaskProgress(taskId, isChecked) {
  const progress = JSON.parse(localStorage.getItem('currentProgress') || '{}');
  progress[taskId] = isChecked;
  localStorage.setItem('currentProgress', JSON.stringify(progress));
  
  const roadmapId = localStorage.getItem('currentRoadmapId');
  if (roadmapId) {
    localStorage.setItem(`roadmap_progress_${roadmapId}`, JSON.stringify(progress));
  }
  
  // Only show quiz button, don't re-render everything
  if (taskId.startsWith('day_') && isChecked) {
    const dayNum = taskId.split('_')[1];
    const dayContent = localStorage.getItem('currentRoadmap');
    if (dayContent) {
      setTimeout(() => showQuizButton(dayNum, dayContent), 300);
    }
  }
}

function showQuizButton(dayNum, roadmapContent) {
  const checkbox = document.getElementById(`check_day_${dayNum}`);
  if (checkbox && checkbox.checked) {
    const dayCard = checkbox.closest('.day-card');
    if (dayCard && !dayCard.querySelector('.quiz-prompt')) {
      const prompt = document.createElement('div');
      prompt.className = 'quiz-prompt mt-3 p-3 bg-blue-500/20 border border-blue-400/50 rounded-lg animate-pulse';
      prompt.innerHTML = `
        <p class="text-blue-300 text-sm mb-2">✨ Day ${dayNum} Completed!</p>
        <button onclick="startQuiz(${dayNum}, 'day_${dayNum}')" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-bold transition">
          🎯 Take Quiz (5 Questions)
        </button>
      `;
      dayCard.appendChild(prompt);
    }
  }
}

function resetRoadmap() {
  if (confirm('Reset roadmap?')) {
    localStorage.removeItem('currentRoadmap');
    localStorage.removeItem('currentProgress');
    document.getElementById('resultArea').innerHTML = '';
    document.getElementById('resultArea').classList.add('hidden');
    document.getElementById('userPrompt').value = '';
  }
}

function clearData() {
  resetRoadmap();
}

function showLoginModal() {
  const modal = `
    <div id="saveModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-2xl p-6 w-96 border border-purple-500">
        <h2 class="text-2xl font-bold text-purple-400 mb-4">Login / Signup</h2>
        <div class="space-y-3 mb-4">
          <div>
            <label class="text-sm text-gray-400">📧 Email *</label>
            <input type="email" id="modalEmail" placeholder="example@email.com" required class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 transition" autocomplete="email">
          </div>
          <div>
            <label class="text-sm text-gray-400">🔐 Password * (min 6 chars)</label>
            <input type="password" id="modalPassword" placeholder="At least 6 characters" required class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 transition" autocomplete="current-password">
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="modalSignup()" class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-white transition">
            ✨ Signup
          </button>
          <button onclick="modalLogin()" class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition">
            🔓 Login
          </button>
          <button onclick="closeModal()" class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition">
            ✕
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
}

function closeModal() {
  document.getElementById('saveModal')?.remove();
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function modalSignup() {
  const email = document.getElementById('modalEmail').value.trim();
  const password = document.getElementById('modalPassword').value;
  const topic = document.getElementById('userPrompt').value;
  
  // Validation checks
  if (!email) {
    alert('❌ Email is required');
    return;
  }
  
  if (!validateEmail(email)) {
    alert('❌ Please enter a valid email (e.g., user@example.com)');
    return;
  }
  
  if (!password) {
    alert('❌ Password is required');
    return;
  }
  
  if (!validatePassword(password)) {
    alert('❌ Password must be at least 6 characters long');
    return;
  }
  
  signup_with_data(email, password, topic);
}

function modalLogin() {
  const email = document.getElementById('modalEmail').value.trim();
  const password = document.getElementById('modalPassword').value;
  
  // Validation checks
  if (!email) {
    alert('❌ Email is required');
    return;
  }
  
  if (!validateEmail(email)) {
    alert('❌ Please enter a valid email (e.g., user@example.com)');
    return;
  }
  
  if (!password) {
    alert('❌ Password is required');
    return;
  }
  
  if (!validatePassword(password)) {
    alert('❌ Password must be at least 6 characters long');
    return;
  }
  
  login_with_data(email, password);
}

async function signup_with_data(email, password, learningGoal) {
  const name = email.split('@')[0];
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, learningGoal })
    });
    const data = await response.json();
    if (data.token) {
      authToken = data.token;
      localStorage.setItem('authToken', authToken);
      currentUser = data.user;
      closeModal();
      loadUserProfile();
      saveRoadmapToCloud();
      alert('✅ Account created! Roadmap saved!');
    } else {
      alert('❌ ' + data.error);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function login_with_data(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
      authToken = data.token;
      localStorage.setItem('authToken', authToken);
      currentUser = data.user;
      closeModal();
      loadUserProfile();
      loadRoadmapHistory();
      alert('✅ Welcome ' + data.user.name + '!');
    } else {
      alert('❌ ' + data.error);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function logoutUser() {
  if (confirm('Logout from your account?')) {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentRoadmapId');
    localStorage.removeItem('currentProgress');
    
    // Hide history and show guest mode
    document.getElementById('roadmapHistory').classList.add('hidden');
    showGuestMode();
    
    // Clear profile
    document.getElementById('userProfile').innerHTML = '';
    
    alert('✅ Logged out successfully!');
  }
}

function saveRoadmapPrompt() {
  if (!authToken) {
    alert('❌ Please login to save roadmaps');
    showLoginModal();
  } else {
    saveRoadmapToCloud();
  }
}

async function saveRoadmapToCloud() {
  if (!authToken || !currentRoadmapContent) {
    alert('Please login first');
    return;
  }
  
  const topic = document.getElementById('userPrompt').value || 'Untitled Roadmap';
  const roadmapId = 'roadmap_' + Date.now();

  try {
    const button = event?.target;
    if (button) button.disabled = true;
    
    const response = await fetch(`${API_BASE}/roadmaps/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: roadmapId, topic, content: currentRoadmapContent, createdAt: new Date()
      })
    });
    
    if (response.ok) {
      localStorage.setItem('currentRoadmapId', roadmapId);
      loadRoadmapHistory();
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg font-bold z-50 animate-pulse';
      toast.innerHTML = '✅ Roadmap saved successfully!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
  } catch (err) {
    console.error('Save error:', err);
    alert('❌ Error saving roadmap');
  } finally {
    if (event?.target) event.target.disabled = false;
  }
}

async function loadRoadmapHistory() {
  if (!authToken) {
    document.getElementById('roadmapHistory').classList.add('hidden');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/roadmaps/`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!response.ok) {
      console.error('Failed to load history:', response.status);
      document.getElementById('roadmapHistory').classList.add('hidden');
      return;
    }
    
    const data = await response.json();
    const historyDiv = document.getElementById('roadmapHistory');
    const historyList = document.getElementById('historyList');
    
    if (data.roadmaps && data.roadmaps.length > 0) {
      let html = `<div class="mb-3 flex justify-between items-center">
        <h3 class="text-lg font-bold text-blue-300">📚 Your Saved Roadmaps (${data.roadmaps.length})</h3>
      </div>`;
      
      html += '<div class="space-y-2">';
      data.roadmaps.forEach(rm => {
        html += `
          <div class="flex justify-between items-center p-4 bg-gray-800/60 rounded-lg hover:bg-gray-800/80 transition border border-gray-700/50">
            <button onclick="selectRoadmap('${rm.id}')" class="text-blue-300 hover:text-blue-200 text-left flex-1 font-medium">
              📖 ${rm.topic}
              <span class="text-xs text-gray-400 ml-2">${rm.totalDays} days • ${rm.progress}% complete</span>
            </button>
            <button onclick="deleteRoadmap('${rm.id}')" class="text-red-400 hover:text-red-300 ml-3 px-3 py-2 bg-red-900/20 rounded text-sm font-bold transition">
              🗑️ Delete
            </button>
          </div>
        `;
      });
      html += '</div>';
      
      historyList.innerHTML = html;
      historyDiv.classList.remove('hidden');
    } else {
      historyDiv.classList.add('hidden');
    }
  } catch (err) {
    console.error('History error:', err);
    document.getElementById('roadmapHistory').classList.add('hidden');
  }
}

async function deleteRoadmap(roadmapId) {
  if (!confirm('Delete this roadmap?')) return;
  try {
    await fetch(`${API_BASE}/roadmaps/${roadmapId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    loadRoadmapHistory();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function selectRoadmap(roadmapId) {
  try {
    const response = await fetch(`${API_BASE}/roadmaps/${roadmapId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const roadmap = await response.json();
    if (roadmap && roadmap.content) {
      currentRoadmapContent = roadmap.content;
      const savedProgress = localStorage.getItem(`roadmap_progress_${roadmapId}`);
      const progressMap = savedProgress ? JSON.parse(savedProgress) : {};
      localStorage.setItem('currentRoadmap', JSON.stringify(roadmap.content));
      localStorage.setItem('currentRoadmapId', roadmapId);
      localStorage.setItem('currentProgress', JSON.stringify(progressMap));
      
      // Clear and rebuild with buttons
      const resultArea = document.getElementById('resultArea');
      resultArea.innerHTML = '';
      
      // Add buttons
      const buttonsHtml = `
        <div class="flex gap-3 mb-6">
          <button onclick="saveRoadmapPrompt()" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition flex items-center justify-center gap-2">
            <i class="fas fa-save"></i> Save Roadmap
          </button>
          <button onclick="dailyCheckIn()" class="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-bold transition flex items-center justify-center gap-2">
            <i class="fas fa-fire"></i> Daily Check-in
          </button>
        </div>
      `;
      resultArea.insertAdjacentHTML('afterbegin', buttonsHtml);
      
      // Render content
      renderRoadmapPersistent(roadmap.content, progressMap);
      document.getElementById('resultArea').scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ===== QUIZ FUNCTIONS =====

async function startQuiz(dayNum, dayLabel) {
  if (!authToken) {
    alert('Please login to take quizzes');
    showLoginModal();
    return;
  }

  const roadmapContent = localStorage.getItem('currentRoadmap');
  if (!roadmapContent) {
    alert('No roadmap available');
    return;
  }

  const dayBlocks = roadmapContent.split(/📅 DAY \d+:|DAY \d+:/g).filter(b => b.trim() !== "");
  const dayContent = dayBlocks[dayNum - 1] || '';
  const dayTitle = roadmapContent.match(new RegExp(`📅 DAY ${dayNum}[\\s\\S]*?(?=📅 DAY|$)`))?.[0]?.split('\n')?.[0] || `Day ${dayNum}`;

  try {
    showQuizLoader();

    const response = await fetch(`${API_BASE}/quiz/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: dayTitle,
        dayContent: dayContent.substring(0, 1000),
        dayNumber: dayNum
      })
    });

    const data = await response.json();
    hideQuizLoader();

    if (data.success && data.quiz?.questions) {
      showQuizModal(data.quiz, dayNum);
    } else {
      alert('Error: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    hideQuizLoader();
    alert('Error: ' + err.message);
  }
}

function showQuizLoader() {
  const loader = document.createElement('div');
  loader.id = 'quizLoader';
  loader.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  loader.innerHTML = `
    <div class="bg-gray-900 rounded-2xl p-8 text-center border border-blue-500">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-blue-300 font-bold">Generating AI Quiz... 🤖</p>
      <p class="text-gray-400 text-xs mt-2">Creating 5 intelligent questions</p>
    </div>
  `;
  document.body.appendChild(loader);
}

function hideQuizLoader() {
  const loader = document.getElementById('quizLoader');
  if (loader) loader.remove();
}

function showQuizModal(quiz, dayNum) {
  let questionHtml = '';
  
  quiz.questions.forEach((q, idx) => {
    questionHtml += `
      <div class="question-card p-5 bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
        <div class="flex gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-300 font-bold text-sm">${idx + 1}</div>
          <p class="text-gray-100 font-semibold">${q.question}</p>
        </div>
        <div class="space-y-2 ml-11">
          ${q.options.map((opt, optIdx) => `
            <label class="flex items-center gap-3 p-2 rounded hover:bg-blue-600/20 cursor-pointer transition">
              <input type="radio" name="q${idx}" value="${optIdx}" class="w-4 h-4 accent-blue-500 cursor-pointer" required>
              <span class="text-gray-300 text-sm">${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  });

  const modal = document.createElement('div');
  modal.id = 'quizModal';
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto';
  modal.innerHTML = `
    <div class="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full my-8 border-2 border-blue-500/30">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-blue-300">🎯 Day ${dayNum} Quiz</h2>
          <p class="text-gray-400 text-sm mt-1">5 Questions • 5 minutes</p>
        </div>
        <button onclick="document.getElementById('quizModal')?.remove()" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <form id="quizForm" class="space-y-4 mb-6">
        ${questionHtml}
      </form>

      <div class="flex gap-3">
        <button onclick="document.getElementById('quizModal')?.remove()" class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition">
          Cancel
        </button>
        <button onclick="submitQuiz(${dayNum})" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition flex items-center justify-center gap-2">
          <i class="fas fa-check"></i> Submit Answers
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

async function submitQuiz(dayNum) {
  const form = document.getElementById('quizForm');
  if (!form) return;

  const answers = [];
  let answered = 0;

  const questions = form.querySelectorAll('.question-card');
  questions.forEach((q, idx) => {
    const selected = q.querySelector(`input[name="q${idx}"]:checked`);
    if (selected) {
      answers.push(parseInt(selected.value));
      answered++;
    } else {
      answers.push(-1);
    }
  });

  if (answered < questions.length) {
    alert(`Answer all ${questions.length} questions!`);
    return;
  }

  try {
    const quizModal = document.getElementById('quizModal');
    if (quizModal) {
      quizModal.innerHTML = `
        <div class="bg-gray-900 rounded-2xl p-8 text-center border-2 border-blue-500/30">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-blue-300 font-bold">Scoring your answers...</p>
        </div>
      `;
    }

    const response = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quizId: 'quiz_' + Date.now(),
        answers: answers
      })
    });

    const data = await response.json();

    if (data.success) {
      showQuizResults(data.result, dayNum);
    } else {
      alert('Error: ' + (data.error || 'Unknown error'));
      document.getElementById('quizModal')?.remove();
    }
  } catch (err) {
    alert('Error: ' + err.message);
    document.getElementById('quizModal')?.remove();
  }
}

function showQuizResults(result, dayNum) {
  const modal = document.getElementById('quizModal');
  if (!modal) return;

  const isPerfect = result.scorePercentage === 100;
  const isGood = result.scorePercentage >= 80;

  modal.innerHTML = `
    <div class="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border-2 ${isPerfect ? 'border-yellow-500/50' : isGood ? 'border-green-500/50' : 'border-blue-500/30'}">
      <div class="text-center mb-6">
        <div class="text-5xl mb-3">${isPerfect ? '🏆' : isGood ? '🎉' : '👍'}</div>
        <h2 class="text-3xl font-bold ${isPerfect ? 'text-yellow-300' : isGood ? 'text-green-300' : 'text-blue-300'} mb-2">${result.message}</h2>
        <p class="text-gray-400">${result.message}</p>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-600/20 rounded-lg p-4 text-center border border-blue-500/30">
          <p class="text-gray-400 text-sm">Score</p>
          <p class="text-3xl font-bold text-blue-300">${result.scorePercentage}%</p>
        </div>
        <div class="bg-green-600/20 rounded-lg p-4 text-center border border-green-500/30">
          <p class="text-gray-400 text-sm">Correct</p>
          <p class="text-3xl font-bold text-green-300">${result.correctAnswers}/${result.totalQuestions}</p>
        </div>
        <div class="bg-purple-600/20 rounded-lg p-4 text-center border border-purple-500/30">
          <p class="text-gray-400 text-sm">XP Earned</p>
          <p class="text-3xl font-bold text-purple-300">+${result.xpEarned}</p>
        </div>
      </div>

      ${result.badge ? `
        <div class="bg-yellow-600/20 rounded-lg p-4 text-center border border-yellow-500/30 mb-6">
          <p class="text-yellow-300 font-bold text-lg">${result.badge}</p>
        </div>
      ` : ''}

      <div class="flex gap-3">
        <button onclick="location.reload()" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition">
          Continue Learning
        </button>
        <button onclick="document.getElementById('quizModal')?.remove()" class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition">
          Close
        </button>
      </div>
    </div>
  `;
}

async function dailyCheckIn() {
  if (!authToken) {
    alert('Please login');
    showLoginModal();
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/streak/checkin`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    alert(`🔥 Streak Check-in: ${data.currentStreak} days!`);
    loadUserProfile();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function askDoubt() {
  const question = document.getElementById('doubtInput').value;
  if (!question) {
    alert('Ask a question first');
    return;
  }

  const answerDiv = document.getElementById('doubtAnswer');
  answerDiv.innerHTML = '<p class="text-blue-300">🤔 Finding answer...</p>';
  answerDiv.classList.remove('hidden');

  try {
    const response = await fetch(`${API_BASE}/n8n/doubt-solver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    
    if (data.answer) {
      answerDiv.innerHTML = `
        <div class="space-y-2">
          <p class="text-green-400 font-bold text-sm">✅ Answer Found</p>
          <p class="text-gray-200 text-sm leading-relaxed">${data.answer}</p>
        </div>
      `;
    } else {
      answerDiv.innerHTML = '<p class="text-yellow-400">⚠️ Could not find answer. Try a different question.</p>';
    }
  } catch (err) {
    console.error('Doubt error:', err);
    answerDiv.innerHTML = '<p class="text-red-400">❌ Error: ' + err.message + '</p>';
  }
}
