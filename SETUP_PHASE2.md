# PathAI Phase 2 - Setup & Run Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create/edit `.env` file in `backend/` folder:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
POE_API_KEY=your_poe_api_key
N8N_ROADMAP_WEBHOOK=https://workflow.ccbp.in/webhook/generate-path
N8N_DOUBT_WEBHOOK=https://workflow.ccbp.in/webhook/doubt-solver
PORT=5000
```

### 3. Start Backend
```bash
npm start
```
Backend should start on `http://localhost:5000`

### 4. Check Health
```bash
curl http://localhost:5000/api/health
```

---

## Frontend Changes

### Old Setup (Phase 1)
- File: `PathAI-Agent.html` + `PathAI-Agent.js`
- Directly called n8n webhooks (no auth)

### New Setup (Phase 2)
- File: `PathAI-Agent-Phase2.html` + `PathAI-Agent-new.js`
- Includes auth (signup/login)
- Calls backend APIs for all operations
- Backend proxies to n8n (keeps your webhook safe)
- Tracks roadmap history, streaks, quizzes

### To Use Phase 2 Frontend
1. Open `PathAI-Agent-Phase2.html` in browser
2. Or serve via simple HTTP server:
   ```bash
   # In project root
   python -m http.server 3000
   # Open http://localhost:3000/PathAI-Agent-Phase2.html
   ```

---

## Implemented Features

### Authentication
- ✅ Signup with name, email, password, learning goal
- ✅ Login
- ✅ JWT token-based sessions
- ✅ User profile with stats (Level, XP, Streak, Badges)

### Roadmap Management
- ✅ Generate roadmap (via n8n through backend)
- ✅ Save roadmap to history
- ✅ View all generated roadmaps
- ✅ Track progress per day
- ✅ Mark days as completed

### Streak System
- ✅ Daily check-in
- ✅ Current streak counter
- ✅ Longest streak tracking
- ✅ Freeze streak (once per month)
- ✅ Streak badges (7-day, 30-day)

### Quiz Engine
- ✅ Generate topic-wise quizzes
- ✅ Submit and score quizzes
- ✅ XP rewards (10 for quiz, 25 if passed, 50 for 100%)
- ✅ Quiz history tracking
- ✅ Track weak areas

### Gamification
- ✅ XP system (level up every 100 XP)
- ✅ Badges for achievements
- ✅ Leaderboard-ready data structure

### API Endpoints

**Auth**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update profile

**Roadmaps**
- `POST /api/roadmaps/create` - Save generated roadmap
- `GET /api/roadmaps` - Get all user roadmaps
- `GET /api/roadmaps/:id` - Get roadmap details
- `POST /api/roadmaps/:id/complete-day` - Mark day complete

**Quiz**
- `POST /api/quiz/generate` - Generate quiz
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get quiz history

**Streak**
- `POST /api/streak/checkin` - Daily check-in
- `POST /api/streak/freeze` - Freeze streak
- `GET /api/streak/stats` - Get streak stats

**n8n Proxy**
- `POST /api/n8n/generate-roadmap` - Call n8n roadmap generator
- `POST /api/n8n/doubt-solver` - Call n8n doubt solver

---

## Next Phase (Phase 2 Enhancements)

### Additional Winning Features to Add
1. **Leaderboard** - Global rankings by XP, Streak
2. **AI Recommendations** - Suggest next learning paths based on profile
3. **Resource Library** - Pre-curated YouTube/Coursera links per topic
4. **Mobile App** - React Native or Flutter companion
5. **Social Features** - Study groups, buddy system
6. **Analytics Dashboard** - Time spent, completion rates, performance trends
7. **Adaptive Difficulty** - Adjust roadmap based on quiz performance
8. **Notifications** - Email reminders, achievement alerts
9. **Certificates** - Generate completion certificates (PDF)
10. **Scheduling** - Calendar view with daily targets

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is available
# Kill process: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### MongoDB connection fails
- Verify `.env` has correct `MONGODB_URI`
- Check network access in MongoDB Atlas (IP whitelist)

### CORS errors
- Backend already has CORS enabled
- Ensure frontend calls `http://localhost:5000`

### n8n webhook fails
- Ensure n8n workflows are active
- Test manually: `curl -X POST https://workflow.ccbp.in/webhook/generate-path -d '{"chatInput": "test"}'`

---

**You're ready to deploy Phase 2!** 🎉
