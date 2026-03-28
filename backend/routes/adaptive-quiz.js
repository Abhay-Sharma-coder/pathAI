import express from 'express';
import { OpenAI } from 'openai';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize DeepSeek client lazily
let deepseekClient = null;

const getDeepseekClient = () => {
  if (!deepseekClient) {
    deepseekClient = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL
    });
  }
  return deepseekClient;
};

// Generate Topic-Tagged Quiz Questions
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { dayNumber, roadmapContent } = req.body;
    
    console.log('[Quiz] Generating for Day', dayNumber);
    
    // Extract day-specific content
    const dayRegex = new RegExp(`day\\s+${dayNumber}([\\s\\S]*?)(?=day\\s+${dayNumber + 1}|$)`, 'i');
    const match = roadmapContent.match(dayRegex);
    const dayContent = match ? match[1].substring(0, 800) : roadmapContent.substring(0, 500);
    
    const prompt = `You are an expert instructor. Generate 4 PROFESSIONAL multiple-choice questions for Day ${dayNumber}.

ROADMAP CONTENT:
"${dayContent}"

REQUIREMENTS:
✓ Each question about different topics from above
✓ Include topic name in brackets [topic]
✓ EXACTLY ONE correct answer per question
✓ Professional intermediate level
✓ Mark correct with " - CORRECT"

FORMAT (exactly):
Q1: [Variables] Question?|||Option A|||Option B - CORRECT|||Option C|||Option D
Q2: [Loops] Question?|||Option A - CORRECT|||Option B|||Option C|||Option D
Q3: [Functions] Question?|||Option A|||Option B|||Option C - CORRECT|||Option D
Q4: [Concepts] Question?|||Option A|||Option B|||Option C|||Option D - CORRECT`;

    console.log('[Quiz] Calling DeepSeek...');
    
    const client = getDeepseekClient();
    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    });
    
    const response = completion.choices[0].message.content;
    console.log('[Quiz] DeepSeek Response:', response.substring(0, 200));
    
    // Parse questions with topic tags
    const questions = [];
    const lines = response.split('\n').filter(l => l.match(/^Q\d/i) && l.includes('|||'));
    
    for (let line of lines.slice(0, 4)) {
      const topicMatch = line.match(/\[([^\]]+)\]/);
      const topic = topicMatch ? topicMatch[1] : 'General';
      
      const cleaned = line.replace(/^\[.*?\]/,'').replace(/^Q\d+:\s*/i, '');
      const parts = cleaned.split('|||').map(p => p.trim());
      
      if (parts.length >= 5) {
        let correctIdx = -1;
        const options = [];
        
        for (let i = 1; i <= 4; i++) {
          const opt = parts[i].replace(' - CORRECT', '').trim();
          if (opt.length > 3) {
            if (parts[i].includes('CORRECT')) correctIdx = options.length;
            options.push(opt);
          }
        }
        
        if (correctIdx >= 0 && options.length === 4) {
          questions.push({
            id: questions.length,
            question: parts[0],
            topic: topic,
            options: options,
            correct: correctIdx
          });
        }
      }
    }
    
    res.json({ success: true, questions, dayNumber });
    console.log('[Quiz] Success:', questions.length, 'questions');
  } catch (error) {
    console.error('[Quiz] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Submit Quiz and Calculate Weak Topics
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { dayNumber, roadmapId, questions, answers } = req.body;
    
    console.log('[Quiz] Submitting Day', dayNumber);
    
    let score = 0;
    const topicScores = {};
    
    // Calculate per-topic accuracy
    for (let i = 0; i < questions.length; i++) {
      const isCorrect = answers[i] === questions[i].correct;
      const topic = questions[i].topic;
      
      if (!topicScores[topic]) {
        topicScores[topic] = { correct: 0, total: 0 };
      }
      
      topicScores[topic].total++;
      if (isCorrect) {
        topicScores[topic].correct++;
        score++;
      }
    }
    
    const scorePercentage = Math.round((score / questions.length) * 100);
    
    // Identify weak topics (< 60%)
    const weakTopics = [];
    for (let [topic, stats] of Object.entries(topicScores)) {
      const accuracy = Math.round((stats.correct / stats.total) * 100);
      if (accuracy < 60) {
        weakTopics.push({ topic, accuracy });
      }
    }
    
    console.log('[Quiz] Score:', scorePercentage + '%', 'Weak Topics:', weakTopics);
    
    // Save to localStorage format (could extend to DB)
    const result = {
      dayNumber,
      roadmapId,
      score: scorePercentage,
      topicScores,
      weakTopics,
      timestamp: new Date(),
      badge: scorePercentage === 100 ? '🏆 PERFECT' : scorePercentage >= 80 ? '🥇 EXCELLENT' : scorePercentage >= 60 ? '🥈 GOOD' : '📚 LEARNING'
    };
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('[Quiz] Submit error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
