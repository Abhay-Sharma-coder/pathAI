import express from 'express';
import axios from 'axios';
import { verifyToken } from '../middleware/auth.js';
import { demoUsers } from '../demoData.js';

const router = express.Router();
let quizzes = [];
let quizResults = [];

// Initialize global users if not already done
if (!global.users) {
  global.users = JSON.parse(JSON.stringify(demoUsers));
} else if (!Array.isArray(global.users)) {
  global.users = JSON.parse(JSON.stringify(demoUsers));
}

const getUsers = () => global.users;

// Generate AI quiz using POE API
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { topic, dayContent, dayNumber } = req.body;

    console.log(`[Quiz] Generating for Day ${dayNumber}: ${topic}`);

    // Try POE API first
    try {
      const prompt = `Generate exactly 5 multiple choice questions (MCQs) in JSON format from this syllabus:

Topic: ${topic}
Day: ${dayNumber}
Content: ${dayContent.substring(0, 500)}

Return ONLY valid JSON:
{ "questions": [{"id": 1, "question": "Q?", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Why"}] }`;

      const options = {
        method: 'POST',
        url: 'https://api.poe.com/api/chat',
        headers: {
          'Authorization': `Bearer ${process.env.POE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        },
        timeout: 12000
      };

      const poeResponse = await axios(options);
      let quizContent = poeResponse.data?.choices?.[0]?.message?.content || '';
      
      if (quizContent) {
        const jsonMatch = quizContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const quizData = JSON.parse(jsonMatch[0]);
          
          if (quizData.questions && quizData.questions.length === 5) {
            const quiz = {
              id: 'quiz_' + Date.now(),
              userId: req.userId,
              topic,
              dayNumber,
              questions: quizData.questions,
              createdAt: new Date(),
              completed: false
            };

            quizzes.push(quiz);
            console.log(`[Quiz] Generated ${quiz.questions.length} MCQs via POE`);

            return res.json({
              success: true,
              quiz: {
                id: quiz.id,
                questions: quiz.questions,
                totalQuestions: quiz.questions.length
              }
            });
          }
        }
      }
    } catch (poeErr) {
      console.warn('[Quiz] POE failed:', poeErr.message);
    }

    // Fallback: Generate intelligent quiz
    console.log('[Quiz] Using fallback generator');
    const fallbackQuiz = {
      id: 'quiz_' + Date.now(),
      userId: req.userId,
      topic,
      dayNumber,
      questions: generateFallbackQuiz(topic, dayNumber),
      createdAt: new Date(),
      completed: false
    };

    quizzes.push(fallbackQuiz);

    res.json({
      success: true,
      quiz: {
        id: fallbackQuiz.id,
        questions: fallbackQuiz.questions,
        totalQuestions: fallbackQuiz.questions.length,
        isAI: false
      }
    });
  } catch (err) {
    console.error('[Quiz] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Submit quiz answers
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = quizzes.find(q => q.id === quizId && q.userId === req.userId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correctAnswers = 0;
    const detailedResults = quiz.questions.map((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || 'Check your understanding'
      };
    });

    const scorePercentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const xpEarned = Math.ceil((correctAnswers / quiz.questions.length) * 50);

    // Award XP
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);
    if (user) {
      user.xp = (user.xp || 0) + xpEarned;
      user.totalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
      
      // Update average score
      if (!user.avgQuizScore) {
        user.avgQuizScore = scorePercentage;
      } else {
        user.avgQuizScore = Math.round(
          (user.avgQuizScore * (user.totalQuizzesTaken - 1) + scorePercentage) / 
          user.totalQuizzesTaken
        );
      }
      
      if (scorePercentage >= 80 && !user.badges?.includes('quiz_master')) {
        if (!user.badges) user.badges = [];
        user.badges.push('quiz_master');
      }
      
      if (scorePercentage === 100) {
        if (!user.badges) user.badges = [];
        if (!user.badges.includes('perfect_score')) {
          user.badges.push('perfect_score');
        }
      }
    }

    const result = {
      id: 'result_' + Date.now(),
      quizId,
      userId: req.userId,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      scorePercentage,
      xpEarned,
      detailedResults,
      completedAt: new Date()
    };

    quizResults.push(result);
    quiz.completed = true;

    res.json({
      success: true,
      result: {
        scorePercentage,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        xpEarned,
        badge: scorePercentage === 100 ? '🏆 Perfect Score!' : null,
        message: scorePercentage >= 80 ? '🎉 Excellent!' : scorePercentage >= 60 ? '👍 Good!' : '📚 Keep Learning!'
      }
    });
  } catch (err) {
    console.error('[Quiz] Submit error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get quiz results
router.get('/results', verifyToken, async (req, res) => {
  try {
    const userResults = quizResults.filter(r => r.userId === req.userId);
    
    res.json({
      totalQuizzes: userResults.length,
      averageScore: userResults.length > 0 
        ? Math.round(userResults.reduce((sum, r) => sum + r.scorePercentage, 0) / userResults.length)
        : 0,
      totalXpEarned: userResults.reduce((sum, r) => sum + r.xpEarned, 0),
      results: userResults
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateFallbackQuiz(topic, dayNumber) {
  return [
    {
      id: 1,
      question: `What is the PRIMARY goal of learning ${topic} on Day ${dayNumber}?`,
      options: [
        'Understand core concepts and fundamentals',
        'Memorize syntax',
        'Build production apps',
        'Skip to advanced topics'
      ],
      correctAnswer: 0,
      explanation: 'Day 1-2 focuses on building a strong foundation of core concepts.'
    },
    {
      id: 2,
      question: `Which learning approach is MOST effective for ${topic}?`,
      options: [
        'Theory + hands-on practice projects',
        'Only watching tutorials',
        'Only reading documentation',
        'Trial and error'
      ],
      correctAnswer: 0,
      explanation: 'Combining theory with practical coding projects ensures comprehensive learning.'
    },
    {
      id: 3,
      question:`What is a KEY BENEFIT of mastering ${topic}?`,
      options: [
        'Improved problem-solving skills and code quality',
        'Faster typing speed',
        'Memorization abilities',
        'No benefits, just required'
      ],
      correctAnswer: 0,
      explanation: '${topic} improves your ability to write clean, maintainable code.'
    },
    {
      id: 4,
      question: `How should you structure your learning path for ${topic}?`,
      options: [
        'Start with basics, then gradually increase complexity',
        'Jump directly to advanced topics',
        'Learn modules randomly',
        'Focus only on one aspect'
      ],
      correctAnswer: 0,
      explanation: 'Progressive learning from foundations to advanced concepts ensures mastery.'
    },
    {
      id: 5,
      question: `What should you do after completing Day ${dayNumber} of ${topic}?`,
      options: [
        'Build a small project to reinforce learning',
        'Immediately move to advanced topics',
        'Take a break without practicing',
        'Review only theory'
      ],
      correctAnswer: 0,
      explanation: 'Practical projects solidify your understanding and build real-world skills.'
    }
  ];
}

export default router;
