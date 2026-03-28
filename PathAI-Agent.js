window.onload = function() {
    const savedRoadmap = localStorage.getItem('pathAIRoadmap');
    if (savedRoadmap) {
        renderRoadmap(savedRoadmap);
        loadCheckState();
    }
};

function linkify(text) {
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlPattern, url => `<a href="${url}" target="_blank" class="text-indigo-400 font-bold underline">View Resource</a>`);
}

async function generatePath() {
    const topic = document.getElementById('userPrompt').value;
    if (!topic) return alert("Please enter a goal first!");

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('resultArea').classList.add('hidden');

    try {
        const res = await fetch('https://workflow.ccbp.in/webhook/generate-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatInput: topic
            })
        });
        const data = await res.json();
        const content = data.learningPath || data.learningpath || data.output;

        if (content) {
            localStorage.setItem('pathAIRoadmap', content);
            renderRoadmap(content);
        }
    } catch (err) {
        alert("n8n Workflow is not ACTIVE!");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}

function renderRoadmap(content) {
    // Content ko "📅 DAY" ya "DAY" ke basis par split karna
    // Taaki har din ka apna ek alag card ho
    const dayBlocks = content.split(/📅 DAY \d+:|DAY \d+:/g).filter(b => b.trim() !== "");
    let html = "";

    // Header Goal ko top par dikhana
    const goalMatch = content.match(/🚀 GOAL: .*/);
    if (goalMatch) {
        html += `<div class="p-4 bg-indigo-900/30 rounded-2xl border border-indigo-500/20 text-center font-bold text-indigo-300 mb-6">${goalMatch[0]}</div>`;
    }

    dayBlocks.forEach((block, i) => {
        const dayNum = i + 1;
        // Text ko clean karna aur links clickable banana
        const cleanContent = linkify(block.trim().replace(/\n/g, '<br>'));

        html += `
            <div class="day-card rounded-2xl overflow-hidden mb-6 shadow-lg bg-gray-900/40 border border-gray-800">
                <div class="p-4 flex items-center justify-between bg-white/5 border-b border-gray-800">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="check-${dayNum}" class="roadmap-check w-5 h-5 accent-purple-500 cursor-pointer" onchange="syncProgress()">
                        <span class="font-black text-purple-400 text-sm tracking-widest uppercase">DAY ${dayNum}</span>
                    </div>
                    <span class="text-[10px] text-gray-500 font-bold uppercase">In Progress</span>
                </div>
                <div class="p-5 text-sm text-gray-300 leading-relaxed">
                    ${cleanContent}
                </div>
            </div>`;
    });

    document.getElementById('roadmapDisplay').innerHTML = html;
    document.getElementById('resultArea').classList.remove('hidden');
    document.getElementById('progressSection').classList.remove('hidden');
    syncProgress();
}

function syncProgress() {
    const total = document.querySelectorAll('.roadmap-check').length;
    const checked = document.querySelectorAll('.roadmap-check:checked').length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    document.getElementById('progressBar').style.width = percentage + "%";
    document.getElementById('progressText').innerText = percentage + "% Completed";

    // Save checkbox states
    const states = Array.from(document.querySelectorAll('.roadmap-check')).map(c => c.checked);
    localStorage.setItem('pathAIChecks', JSON.stringify(states));
}

function loadCheckState() {
    const saved = JSON.parse(localStorage.getItem('pathAIChecks'));
    if (saved) {
        const checks = document.querySelectorAll('.roadmap-check');
        checks.forEach((c, i) => {
            if (saved[i]) c.checked = true;
        });
        syncProgress();
    }
}

function clearData() {
    if (confirm("Are you sure? This will delete your current progress.")) {
        localStorage.clear();
        location.reload();
    }
}

function downloadPDF() {
    const element = document.getElementById('downloadSection');
    const opt = {
        margin: 10,
        filename: 'MyPathAI_Roadmap.pdf',
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0f172a'
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };
    html2pdf().set(opt).from(element).save();
}

function toggleChat() {
    const chat = document.getElementById('chatWindow');
    chat.style.display = (chat.style.display === 'flex' ? 'none' : 'flex');
}

async function askDoubt() {
    const input = document.getElementById('chatInput');
    const box = document.getElementById('chatBox');
    if (!input.value.trim()) return;

    const userText = input.value;
    box.innerHTML += `<div class="p-4 bg-indigo-600/20 rounded-2xl text-right ml-10 text-white font-medium border border-indigo-500/10">👤 You: ${userText}</div>`;
    
    // Show loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'p-4 bg-gray-800/80 rounded-2xl mr-10 text-indigo-300 font-medium border border-gray-700/50 animate-pulse flex items-center gap-2';
    loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 🧠 Analyzing roadmap...';
    box.appendChild(loadingMsg);
    
    input.value = '';
    box.scrollTop = box.scrollHeight;

    try {
        // Get roadmap content from localStorage
        const roadmapContent = localStorage.getItem('pathAIRoadmap') || '';
        
        if (!roadmapContent) {
            box.removeChild(loadingMsg);
            box.innerHTML += `<div class="p-4 bg-yellow-900/20 rounded-2xl mr-10 text-yellow-300 text-sm border border-yellow-600/30">⚠️ No roadmap generated yet. Please create a roadmap first!</div>`;
            box.scrollTop = box.scrollHeight;
            return;
        }
        
        // Extract topic from roadmap (usually in the first line)
        const topicMatch = roadmapContent.match(/🚀 GOAL: ([^\n]+)/);
        const roadmapTopic = topicMatch ? topicMatch[1].trim() : 'Learning Path';

        console.log('[Ask Doubt] Question:', userText);
        console.log('[Ask Doubt] Topic:', roadmapTopic);
        console.log('[Ask Doubt] Roadmap length:', roadmapContent.length);

        // Call backend Mistral API endpoint
        const res = await fetch('http://localhost:5000/api/adaptive/doubt/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-token-for-demo'
            },
            body: JSON.stringify({
                question: userText,
                roadmapContent: roadmapContent,
                roadmapTopic: roadmapTopic
            })
        });

        if (!res.ok) {
            box.removeChild(loadingMsg);
            throw new Error(`Backend error: ${res.status}`);
        }
        
        const data = await res.json();
        const aiMsg = data.answer || data.output || "❌ Could not find an answer in your roadmap.";
        
        console.log('[Ask Doubt] Answer received:', aiMsg.substring(0, 100));
        
        box.removeChild(loadingMsg);
        box.innerHTML += `<div class="p-4 bg-gray-800/80 rounded-2xl mr-10 text-indigo-300 font-medium border border-indigo-500/30">🎓 Mentor: ${linkify(aiMsg)}</div>`;
        box.scrollTop = box.scrollHeight;
    } catch (err) {
        console.error('[Ask Doubt] Error:', err.message);
        if (loadingMsg && loadingMsg.parentNode) {
            box.removeChild(loadingMsg);
        }
        box.innerHTML += `<div class="text-red-400 p-3 rounded-2xl bg-red-900/20 border border-red-600/30 text-center text-xs">❌ Error: ${err.message}\n\n✅ Make sure backend is running: http://localhost:5000</div>`;
        box.scrollTop = box.scrollHeight;
    }
}