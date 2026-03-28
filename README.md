# PathAI - AI-Powered Personalized Learning Platform 🚀

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/Abhay-Sharma-coder/pathAI)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js->=16.0.0-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

> Transform learning with AI - Generate personalized learning roadmaps, track progress, and level up your skills with adaptive learning!

## 🎯 Key Features

- 🤖 **AI Roadmap Generation** - Auto-generate 3-30 day custom learning paths using N8N webhooks
- 🔐 **User Authentication** - Secure JWT-based authentication with email/password signup
- 📚 **Adaptive Quizzes** - AI-powered MCQ generation tailored to learning content
- 🔥 **Daily Streaks** - Gamified streak tracking with freeze tokens
- ⭐ **XP & Leveling** - Earn points for activities, unlock levels and badges
- 💬 **Doubt Solver** - Ask questions and get AI-powered explanations based on content
- 📊 **Progress Tracking** - Visual dashboards, history, and statistics
- 🎓 **Badge System** - Unlock achievements for milestones
- 💾 **Cloud Sync** - Save and manage multiple roadmaps
- 📱 **Responsive Design** - Works on desktop and mobile

## 🏗️ Tech Stack

### Frontend
- React 18 with Hooks
- Vanilla HTML/CSS/JavaScript
- Axios for API calls
- Real-time state management

### Backend
- Node.js + Express.js
- MongoDB Atlas (Cloud Database)
- JWT Authentication
- Environment-based configuration

### External Integrations
- **N8N Webhooks** - Roadmap generation & doubt solving
- **POE API** - Quiz generation using GPT-4
- **DeepSeek/NVIDIA** - Adaptive AI features

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- Python 3.6+
- MongoDB Atlas Account

### 1️⃣ Clone & Setup

```bash
# Clone repository
git clone https://github.com/Abhay-Sharma-coder/pathAI.git
cd pathAI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../react-app
npm install
```

### 2️⃣ Configure Environment

```bash
# Create backend/.env file
cd backend
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
POE_API_KEY=your_poe_api_key
N8N_ROADMAP_WEBHOOK=https://workflow.ccbp.in/webhook/generate-path
N8N_DOUBT_WEBHOOK=https://workflow.ccbp.in/webhook/doubt-solver
PORT=5000
EOF
```

### 3️⃣ Start Servers

**Terminal 1 - Backend API:**
```bash
cd backend
npm start
# 🚀 Backend running on http://localhost:5000
```

**Terminal 2 - Frontend Server:**
```bash
# From project root
python -m http.server 8000
# Serving HTTP on port 8000
```

### 4️⃣ Access Application

Open browser: **http://localhost:8000/PathAI-React-App.html**

### 📝 Demo Account
```
Email: demo@pathai.com
Password: demo123
```

## 📁 Project Structure

```
pathAI/
├── backend/
│   ├── routes/
│   │   ├── auth.js              (Authentication)
│   │   ├── roadmap.js           (Roadmap CRUD)
│   │   ├── quiz.js              (Quiz generation & grading)
│   │   ├── streak.js            (Streak tracking)
│   │   ├── n8n.js               (N8N proxy)
│   │   ├── adaptive-quiz.js      (Adaptive quizzes)
│   │   └── adaptive-doubt.js     (Doubt solver)
│   ├── models/
│   │   ├── User.js
│   │   ├── Roadmap.js
│   │   ├── Streak.js
│   │   └── QuizAttempt.js
│   ├── middleware/
│   │   └── auth.js              (JWT verification)
│   ├── server.js                (Express app)
│   ├── demoData.js              (Demo database)
│   ├── sharedStore.js           (In-memory storage)
│   └── package.json
│
├── react-app/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   └── index.js
│   └── package.json
│
├── PathAI-React-App.html        (Main frontend)
├── PathAI-Agent-new.js          (API integration)
├── PathAI-Agent.css             (Styles)
├── README.md                    (This file)
├── docs/
│   ├── QUICKSTART.md            (5-min setup)
│   ├── SETUP_DETAILED.md        (Full guide)
│   ├── API_DOCS.md              (API reference)
│   └── FEATURES.md              (Feature docs)
└── .env                         (Configuration)
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup           Create account
POST   /api/auth/login            Login user
GET    /api/auth/me               Get profile (Protected)
PUT    /api/auth/profile          Update profile (Protected)
```

### Roadmaps
```
POST   /api/roadmap               Create roadmap (Protected)
GET    /api/roadmap               Get all roadmaps (Protected)
GET    /api/roadmap/:id           Get roadmap details (Protected)
PUT    /api/roadmap/:id           Update progress (Protected)
DELETE /api/roadmap/:id           Delete roadmap (Protected)
```

### Quizzes
```
POST   /api/quiz/generate         Generate quiz (Protected)
POST   /api/quiz/submit           Submit answers (Protected)
GET    /api/quiz/history          Quiz history (Protected)
```

### Streaks
```
POST   /api/streak/checkin        Daily check-in (Protected)
GET    /api/streak/stats          Get streak stats (Protected)
```

### Doubt Solver
```
POST   /api/adaptive/doubt/ask    Ask question (Protected)
GET    /api/adaptive/doubt/history Get history (Protected)
```

**Full API docs:** See [docs/API_DOCS.md](docs/API_DOCS.md)

## 📊 Features Explained

### AI Roadmap Generation
- User enters topic (e.g., "Python Basics")
- System calls N8N webhook with topic
- AI generates day-by-day learning path
- Content saved to MongoDB for persistence

### Quiz System
- Choose quiz for a specific day
- System extracts day content from roadmap
- POE API generates 5 intelligent MCQs
- Auto-grading with XP rewards

### Gamification
- **Check-ins**: Daily +10 XP
- **Quizzes**: Completion +25 XP, Score ≥80% +50 bonus XP
- **Roadmaps**: Completion +100 XP
- **Streaks**: 3/7/14/30 days unlock badges
- **Level Up**: Every 100 XP = new level

### Adaptive Learning
- System tracks weak areas from quizzes
- Generates harder questions on weak topics
- Suggests relevant resources
- AI doubt solver provides context-aware answers

## 🎓 Database Models

### User
```javascript
{
  id, name, email, password,
  level, xp, streak, longestStreak,
  badges[], completedRoadmaps,
  totalQuizzesTaken, avgQuizScore
}
```

### Roadmap
```javascript
{
  id, userId, topic, content,
  days[], currentDay, overallProgress,
  status, difficulty, startDate, completionDate
}
```

### Streak
```javascript
{
  userId, currentStreak, longestStreak,
  lastCheckInDate, checkInHistory[]
}
```

See [docs/FEATURES.md](docs/FEATURES.md) for complete documentation.

## 🔑 Environment Variables

Create `.env` in backend folder:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# Security
JWT_SECRET=your_super_secret_key_at_least_32_chars

# External APIs
POE_API_KEY=sk-poe-your-key
DEEPSEEK_API_KEY=your-key
NVIDIA_BASE_URL=https://api.nvidia.com/v1/

# Webhooks
N8N_ROADMAP_WEBHOOK=https://workflow.ccbp.in/webhook/generate-path
N8N_DOUBT_WEBHOOK=https://workflow.ccbp.in/webhook/doubt-solver

# Server
PORT=5000
NODE_ENV=development
```

## 📚 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - 5-minute setup
- **[Detailed Setup](docs/SETUP_DETAILED.md)** - Complete installation
- **[API Reference](docs/API_DOCS.md)** - All endpoints documented
- **[Features Guide](docs/FEATURES.md)** - Feature documentation
- **[Demo Credentials](docs/DEMO_CREDENTIALS.md)** - Test accounts

## 🙋 FAQ

**Q: Do I need MongoDB?**  
A: For production yes. For testing, we have in-memory demo mode.

**Q: How do I get API keys?**  
A: 
- POE API: https://poe.com/api
- MongoDB: https://www.mongodb.com/cloud/atlas
- DeepSeek: https://github.com/deepseek-ai

**Q: Can I use this for production?**  
A: Yes! Just ensure MongoDB is properly configured and API keys are secure.

**Q: How do I deploy?**  
A: See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Heroku, Vercel, or AWS guides.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details.

### Steps to Contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙌 Acknowledgments

- **N8N** for workflow automation
- **MongoDB Atlas** for cloud database
- **POE API** for AI capabilities
- **Express.js** for backend framework
- **React** for frontend framework

## 📞 Support & Contact

- 📧 Email: support@pathai.com
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Abhay-Sharma-coder/pathAI/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Abhay-Sharma-coder/pathAI/discussions)
- 💬 **Discord**: Join our community server

## ⭐ Star & Follow

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🔔 Following on GitHub
- 📢 Sharing with others
- 🤝 Contributing

---

**Made with ❤️ by [Abhay Sharma](https://github.com/Abhay-Sharma-coder)**

<div align="center">
  <p>
    <a href="https://github.com/Abhay-Sharma-coder/pathAI" target="_blank">
      <img src="https://img.shields.io/github/stars/Abhay-Sharma-coder/pathAI?style=social" alt="GitHub stars">
    </a>
    <a href="https://github.com/Abhay-Sharma-coder/pathAI" target="_blank">
      <img src="https://img.shields.io/github/forks/Abhay-Sharma-coder/pathAI?style=social" alt="GitHub forks">
    </a>
  </p>
</div>
