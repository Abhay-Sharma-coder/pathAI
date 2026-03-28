# 🚀 Quick Start Guide

Get PathAI up and running in **5 minutes**!

## Prerequisites
- Node.js v16+
- Python 3.6+
- Git

## 1. Clone Repository

```bash
git clone https://github.com/Abhay-Sharma-coder/pathAI.git
cd pathAI
```

## 2. Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend (Optional React)
```bash
cd ../react-app
npm install
```

## 3. Setup Environment

Create `backend/.env`:
```bash
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
POE_API_KEY=your-poe-key
N8N_ROADMAP_WEBHOOK=https://workflow.ccbp.in/webhook/generate-path
N8N_DOUBT_WEBHOOK=https://workflow.ccbp.in/webhook/doubt-solver
PORT=5000
```

## 4. Run Servers

### Terminal 1 - Backend
```bash
cd backend
npm start
# ✅ Backend running on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
# From root folder
python -m http.server 8000
# ✅ Serving on http://localhost:8000
```

## 5. Access App

Open browser: **http://localhost:8000/PathAI-React-App.html**

### Demo Login
- Email: `demo@pathai.com`
- Password: `demo123`

---

## ✅ You're Done!

Start generating roadmaps and learning! 🎉

**Next Steps:**
- Read [SETUP_DETAILED.md](SETUP_DETAILED.md) for advanced config
- Check [API_DOCS.md](API_DOCS.md) for endpoints
- See [FEATURES.md](FEATURES.md) for feature details
