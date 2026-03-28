# 🌟 Complete Features Guide

Detailed documentation of all PathAI features.

## Table of Contents
1. [Authentication](#authentication)
2. [Roadmap Generation](#roadmap-generation)
3. [Quiz System](#quiz-system)
4. [Streak & Gamification](#streak--gamification)
5. [Doubt Solver](#doubt-solver)
6. [Dashboard & Analytics](#dashboard--analytics)

## Authentication

### Signup
Users can create an account with email, password, and learning goal.

**Flow:**
1. User clicks "Sign Up"
2. Enters email, password (min 6 chars), name, learning goal
3. Email is validated & checked for duplicates
4. Password is hashed with bcryptjs
5. Account created in MongoDB
6. JWT token generated (30-day expiry)
7. User logged in automatically

### Login
Existing users can authenticate with email and password.

**Security:**
- Password never stored in plain text
- Bcryptjs 10 salt rounds
- JWT tokens with expiration
- Protected routes require token verification

### Profile Management
Users can view and update their profile.

**Profile Data:**
- Name, email, learning goal
- Level, XP, streak
- Badges, stats, history

---

## Roadmap Generation

### How It Works
1. User enters topic (e.g., "Python Basics")
2. System calls N8N webhook with topic
3. AI generates day-by-day learning path
4. Content parsed and saved to MongoDB
5. User can view, resume, or delete roadmaps

### Format
```
📅 DAY 1: Title
- Task 1
- Task 2

📅 DAY 2: Title
- Task 1
- Task 2
```

### Features
- ✅ Custom duration (3-30 days)
- ✅ Difficulty levels (beginner, intermediate, advanced)
- ✅ Progress tracking
- ✅ Multiple roadmap management
- ✅ Task completion tracking
- ✅ Resource links (YouTube, articles)

---

## Quiz System

### AI Quiz Generation
- POE API generates 5 MCQs per day
- Questions based on roadmap content
- 4 options with 1 correct answer

### Adaptive Quizzes
- System tracks performance
- Generates harder questions if user scores well
- Focuses on weak areas
- Topic tagging for analysis

### Grading
- Auto-graded immediately
- Score: (Correct / Total) × 100
- Weak areas identified if score < 70

### Rewards
- Quiz completion: +25 XP
- Score ≥80%: +50 bonus XP
- Perfect score (100%): 💎 Badge

---

## Streak & Gamification

### Daily Streaks
- **Check-in**: Mark learning completed for the day
- **Rewards**: +10 XP per check-in
- **Tracking**: Current and longest streaks
- **Freeze Token**: Protect streak if missed day

### XP System
```
Daily Check-in:           +10 XP
Complete Quiz:            +25 XP
Score ≥80% on Quiz:       +50 bonus XP
Complete Roadmap:         +100 XP
```

### Leveling
- Formula: Level = floor(XP / 100) + 1
- Every 100 XP = 1 level up
- Progress bar to next level

### Badges
```
🥉 Bronze    → 3-day streak
🥈 Silver    → 7-day streak
🥇 Gold      → 14-day streak
💎 Platinum  → 30-day streak
🎓 Scholar   → 1st roadmap completed
🧠 Wise One  → 5 roadmaps completed
⚡ Speed Runner → Complete roadmap in <5 days
🏆 Champion  → 80%+ avg quiz score
```

---

## Doubt Solver

### How It Works
1. User asks a question
2. System extracts relevant content from roadmap
3. AI (DeepSeek) generates answer
4. Answer includes steps & explanations
5. Q&A saved for future reference

### Features
- 🔎 Context-aware answers
- 📝 Step-by-step explanations
- 🔗 Related concepts
- 💾 History tracking
- 🔄 Ask follow-up questions

### Example
```
Question: "How do I create a function in Python?"

Data sent to AI:
- Topic: Python Basics
- Relevant content: [extracted from roadmap]

AI Response:
"To create a function in Python, use the 'def' keyword:

def my_function(parameter1, parameter2):
    # Your code here
    return result

Example:
def add(a, b):
    return a + b

Key Points:
- Use 'def' keyword
- Parameters in parentheses
- Body must be indented
- Use 'return' to send back result"
```

---

## Dashboard & Analytics

### User Dashboard Shows
- 📊 Current level & XP progress
- 🔥 Streak counter
- 🎓 Badges earned
- 📚 Roadmaps in progress
- 📈 Quiz performance

### Statistics Available
- Total roadmaps generated
- Total roadmaps completed
- Total quizzes taken
- Average quiz score
- Weak areas to focus on
- Learning time

### Progress Tracking
- Visual progress bars
- Task completion rates
- Streak history
- Quiz score history
- Badge unlocks

---

## Advanced Features

### Multi-Roadmap Management
Users can:
- Generate multiple roadmaps
- Switch between roadmaps
- Track progress independently
- Resume incomplete roadmaps

### Resource Integration
- YouTube video links extracted
- Article links organized
- Resources grouped by day
- One-click access

### Performance Optimization
- Caching for faster loads
- Lazy loading of content
- Optimized database queries
- Efficient state management

---

## Settings & Customization

### Learning Style
- Visual
- Auditory
- Kinesthetic
- Reading/Writing

### Difficulty Preferences
- Beginner
- Intermediate
- Advanced

### Notifications
- Streak reminders
- Quiz recommendations
- Badge unlocks
- New roadmaps

---

**Questions?** See [API_DOCS.md](API_DOCS.md) for technical details or raise an issue!
