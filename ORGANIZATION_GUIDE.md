🚀 **PathAI - Your Personal AI Learning Roadmap Generator**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v16.0+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-blue)](https://react.dev/)

---

## 📋 Documentation Index

### Getting Started
- [🚀 Quick Start](docs/QUICKSTART.md) - Get up and running in 5 minutes
- [📚 Complete Setup](docs/SETUP_DETAILED.md) - Detailed installation & configuration
- [🌟 Features Guide](docs/FEATURES.md) - Learn about all features
- [🔌 API Reference](docs/API_DOCS.md) - Complete API documentation

### Guides & References
- [🎓 Demo Account](docs/DEMO_CREDENTIALS.md) - Test PathAI with demo account
- [🆘 Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues & solutions
- [🤝 Contributing](/.github/CONTRIBUTING.md) - Contribute to PathAI
- [📝 Code of Conduct](/.github/CODE_OF_CONDUCT.md) - Community standards

### Integration
- [📄 API Examples](API_EXAMPLES.rest) - Real API request examples

---

## ⚡ Quick Start (5 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/Abhay-Sharma-coder/pathAI.git
cd pathAI
cd backend && npm install
```

### 2. Setup Environment
```bash
# Create backend/.env file with:
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
POE_API_KEY=your_poe_key
```

### 3. Run Backend & Frontend
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
python -m http.server 8000
```

### 4. Access App
Open: **http://localhost:8000/PathAI-React-App.html**

Demo Login: `demo@pathai.com / demo123`

---

## 🎯 Key Features

### 📚 **AI Roadmap Generation**
- Generate personalized learning paths with N8N AI
- Adaptive difficulty (Beginner, Intermediate, Advanced)
- Day-by-day structured learning
- Progress tracking & completion

### 🧠 **Smart Quiz System**
- AI-generated MCQs based on roadmap content
- Auto-grading with instant feedback
- Performance analytics
- Weak area identification

### 🔥 **Gamification**
- **Streaks**: Daily check-in tracking with freeze tokens
- **XP System**: Earn points and level up (100 XP = 1 Level)
- **Badges**: Unlock achievements for milestones
- **Leaderboard**: Compete with other learners

### 💡 **Doubt Solver**
- Ask questions about learning content
- AI-powered contextual answers
- Step-by-step explanations
- Question history

### 📊 **Analytics Dashboard**
- XP & Level progress
- Streak history
- Quiz performance insights
- Learning statistics

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Authentication** | JWT (30-day expiry) |
| **AI Models** | POE API (GPT-4), DeepSeek, NVIDIA |
| **Workflows** | N8N Webhooks |

---

## 📂 Project Structure

```
pathAI/
├── backend/
│   ├── routes/        # API endpoints
│   ├── models/        # Database models
│   ├── middleware/    # Auth & validation
│   ├── server.js      # Express server
│   └── package.json
├── react-app/         # React frontend (optional)
├── docs/              # Documentation
├── README.md          # This file
├── .gitignore         # Git exclusions
└── LICENSE            # MIT License
```

---

## 🔌 30+ API Endpoints

### Authentication (4)
- `POST /auth/signup` - Create account
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get profile
- `PUT /auth/profile` - Update profile

### Roadmap (5)
- `POST /roadmap` - Create roadmap
- `GET /roadmap` - List roadmaps
- `GET /roadmap/:id` - Get details
- `PATCH /roadmap/:id` - Update progress
- `DELETE /roadmap/:id` - Delete roadmap

### Quiz (6)
- `POST /quiz/generate` - Generate quiz
- `POST /quiz/submit` - Submit answers
- `GET /quiz/history` - Quiz history
- `GET /quiz/stats` - Statistics
- Multiple adaptive quiz variants

### Streaks & Gamification (7)
- `POST /streak/checkin` - Daily check-in
- `GET /streak/stats` - Streak data
- `POST /streak/freeze` - Use freeze token
- Badge tracking endpoints

### Doubt Solver (3)
- `POST /adaptive/doubt/ask` - Ask question
- `GET /adaptive/doubt/history` - Q&A history
- `POST /adaptive/doubt/rate` - Rate answers

### Plus 5+ additional endpoints for:
- Health checks
- Analytics
- Adaptive learning
- N8N integration

**Full API docs:** See [API_DOCS.md](docs/API_DOCS.md)

---

## 🎮 Gamification System

### XP Rewards
```
Daily Check-in:           +10 XP 🎯
Complete Quiz:            +25 XP ✅
Score ≥80% on Quiz:       +50 XP 🌟
Complete Roadmap:        +100 XP 🏆
```

### Streaks
- **Current Streak**: Count of consecutive check-ins
- **Longest Streak**: Best streak achieved
- **Freeze Token**: Skip 1 day without breaking streak

### Badges
```
🥉 Bronze Learner      → 3-day streak
🥈 Silver Scholar      → 7-day streak
🥇 Gold Expert         → 14-day streak
💎 Platinum Master     → 30-day streak
🎓 First Graduate      → Complete 1 roadmap
🧠 Knowledge Seeker    → 5 roadmaps completed
⚡ Speed Runner        → Complete roadmap in <5 days
🏆 Quiz Champion       → 80%+ average quiz score
```

### Levels
```
Formula: Level = floor(XP / 100) + 1

Level 1-5:     Beginner (0-500 XP)
Level 6-10:    Intermediate (500-1000 XP)
Level 11+:     Advanced (1000+ XP)
```

---

## 🚀 Deployment

### Production Checklist
- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables set
- [ ] SSL certificates obtained
- [ ] API keys configured
- [ ] N8N workflows updated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error logging setup
- [ ] Backup strategy deployed

### Deploy to Platforms
- **Heroku**: `git push heroku main`
- **Vercel** (frontend): `vercel deploy`
- **Railway**: Connect GitHub repository
- **AWS/Azure**: Standard Node.js deployment

---

## 📚 Learning Paths Available

Popular topics you can generate roadmaps for:
- Python Basics, Advanced, Django, FastAPI
- JavaScript, React, Next.js, Vue.js
- Web Development (HTML, CSS, JavaScript)
- Database (SQL, MongoDB, PostgreSQL)
- Data Science & Machine Learning
- GenAI & LLMs
- DevOps & Cloud
- Mobile Development
- And many more...

---

## 🔐 Security Features

- 🔒 Password hashing (bcryptjs, 10 salt rounds)
- 🎫 JWT authentication (30-day expiry)
- ✅ Email validation & verification
- 🚫 Rate limiting on API endpoints
- 🛡️ XSS protection
- 📋 Input validation & sanitization
- 🔑 Secure environment variables

---

## 📊 Performance

- ⚡ Response time: <200ms for most endpoints
- 🚀 Concurrent users: 1000+
- 💾 Database queries: Optimized with indexing
- 📦 Bundle size: <500KB (frontend)
- 🔄 Auto-scaling ready

---

## 👥 Contributing

We welcome contributions! To get started:

1. Fork repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push to branch: `git push origin feature/awesome-feature`
5. Open Pull Request

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details.

---

## ❓ FAQ

**Q: Do I need MongoDB to run this?**  
A: No, it works in demo mode without MongoDB. For production, MongoDB is recommended.

**Q: Can I use different AI APIs?**  
A: Yes! The system supports POE, DeepSeek, and NVIDIA. Modify routes to add your API.

**Q: How is my data stored?**  
A: In MongoDB Atlas (encrypted). Demo mode stores in memory.

**Q: Can I self-host?**  
A: Yes! Deploy on any Node.js-supporting platform (Heroku, Railway, AWS, etc.).

**Q: Is there a free tier?**  
A: Yes, with MongoDB Atlas free tier and POE free trial.

---

## 📞 Support

- 📧 **Email**: support@pathai.com
- 🐛 **Issues**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions
- 📚 **Docs**: [Full Documentation](docs/)

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🎉 Acknowledgments

- Built with ❤️ by [Abhay Sharma](https://github.com/Abhay-Sharma-coder)
- Powered by AI: POE, DeepSeek, NVIDIA, N8N
- Special thanks to all contributors

---

## 🌟 Show Your Support

If you find this project helpful, give it a ⭐ on GitHub!

```bash
git clone https://github.com/Abhay-Sharma-coder/pathAI.git
cd pathAI
```

**Happy Learning! 🚀📚**

---

<div align="center">

Made with 💜 | Built for learners | Open Source

[⬆ Back to top](#pathai---your-personal-ai-learning-roadmap-generator)

</div>
