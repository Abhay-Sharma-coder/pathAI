import express from 'express';
import axios from 'axios';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Helper function to extract relevant roadmap sections
function extractRelevantContent(roadmapContent, question) {
  const lines = roadmapContent.split('\n');
  const questionWords = question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  // Find lines that match question keywords
  let relevantLines = [];
  for (let line of lines) {
    const lineText = line.toLowerCase();
    for (let word of questionWords) {
      if (lineText.includes(word)) {
        relevantLines.push(line);
        break;
      }
    }
  }
  
  // If no relevant lines found, include first 500 chars and find DAY sections
  if (relevantLines.length === 0) {
    const dayMatch = roadmapContent.match(/📅 DAY \d+:?([^📅]*)/g);
    if (dayMatch) {
      relevantLines = dayMatch.map(d => d.substring(0, 300));
    } else {
      relevantLines = [roadmapContent.substring(0, 500)];
    }
  }
  
  return relevantLines.slice(0, 5).join('\n'); // Return top 5 matching sections
}

// Ask Question and Get Answer from Roadmap
router.post('/ask', verifyToken, async (req, res) => {
  try {
    const { question, roadmapContent, roadmapTopic } = req.body;
    
    console.log('[Doubt] User Question:', question);
    console.log('[Doubt] Topic:', roadmapTopic);
    
    // Extract only relevant roadmap sections
    const relevantContent = extractRelevantContent(roadmapContent, question);
    
    const prompt = `You are an expert instructor teaching ${roadmapTopic}. Answer the student's question accurately and precisely using ONLY the provided roadmap content.

IMPORTANT RULES:
- Answer ONLY based on the roadmap sections below
- Do NOT give generic advice or outside knowledge
- If the answer is NOT in the roadmap, say: "This topic is not covered in your roadmap for ${roadmapTopic}"
- Keep answer short: 1-2 sentences maximum
- Be specific and cite the exact concept/day from roadmap if possible
- Use simple, student-friendly language

ROADMAP CONTENT FOR ${roadmapTopic}:
${relevantContent}

===

STUDENT QUESTION: "${question}"

Your ACCURATE answer based ONLY on above roadmap (1-2 sentences):`;

    console.log('[Doubt] Calling Mistral with relevant content...');
    
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: process.env.MISTRAL_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a strict instructor. Answer questions ONLY using provided material. Never add outside knowledge. If information is not provided, clearly state it is not covered."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 256,
        temperature: 0.1, // Very low for accuracy
        top_p: 0.9,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    let answer = response.data.choices[0].message.content.trim();
    
    // Ensure answer is not too long
    if (answer.length > 300) {
      answer = answer.substring(0, 300) + '...';
    }
    
    console.log('[Doubt] Answer received:', answer);
    
    res.json({
      success: true,
      question,
      answer,
      topic: roadmapTopic,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('[Doubt] Error:', error.message);
    
    // Provide a helpful error response
    res.status(500).json({
      success: false,
      error: error.message,
      answer: `⚠️ Could not process your question. Please try again.`
    });
  }
});

export default router;
