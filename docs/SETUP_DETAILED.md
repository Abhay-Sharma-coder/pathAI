# 📚 Complete Setup Guide

Detailed setup instructions for production and development.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Starting Servers](#starting-servers)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Node.js v16.0.0 or higher
- Python 3.6 or higher
- npm or yarn
- Git

### Third-Party Accounts
- MongoDB Atlas account (free tier available)
- POE API key
- N8N account (optional)

## Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/Abhay-Sharma-coder/pathAI.git
cd pathAI
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies (Optional)
```bash
cd ../react-app
npm install
```

## Configuration

### Create Environment File
Create `backend/.env`:
```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# JWT Configuration
JWT_SECRET=your_super_secret_key_at_least_32_characters

# Third-party APIs
POE_API_KEY=sk-poe-your-api-key
DEEPSEEK_API_KEY=your-deepseek-key
NVIDIA_BASE_URL=https://api.nvidia.com/v1/

# N8N Webhooks
N8N_ROADMAP_WEBHOOK=https://workflow.ccbp.in/webhook/generate-path
N8N_DOUBT_WEBHOOK=https://workflow.ccbp.in/webhook/doubt-solver

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Validate Configuration
```bash
# Test backend connection
node -e "require('dotenv').config(); console.log('✅ Config loaded')"
```

## Database Setup

### Using MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Create database user
5. Whitelist IP (0.0.0.0/0 for dev)
6. Copy connection string
7. Add to `.env` file

### Using Local MongoDB
```bash
# Install MongoDB
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community

# Start MongoDB
mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/pathai
```

## Starting Servers

### Development Mode

**Terminal 1 - Backend API:**
```bash
cd backend
npm start
# Output: 🚀 PathAI Backend running on http://localhost:5000
```

**Terminal 2 - Frontend Server:**
```bash
# From root
python -m http.server 8000
# Output: Serving HTTP on :: port 8000
```

**Terminal 3 - React App (Optional):**
```bash
cd react-app
npm start
# Output: Compiled successfully! http://localhost:3000
```

### Production Mode

```bash
# Build React app
cd react-app
npm run build

# Start backend with PM2
cd ../backend
npm install -g pm2
pm2 start server.js --name "pathAI"
```

## Troubleshooting

### MongoDB Connection Error
```
Error: querySrv ECONNREFUSED
```
**Solution:**
- Check internet connection
- Verify IP whitelist in MongoDB Atlas
- Verify credentials
- Try: `mongo "mongodb://connection-string"`

### Port Already in Use
```
Error: EADDRINUSE :::5000
```
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Module Not Found
```bash
# Clear cache
cd backend
rm -rf node_modules
npm install
```

### API Key Issues
- Verify .env file exists in `backend/` folder
- Check `.env` file has all required keys
- Ensure no spaces around `=` in .env

## Verification

### Check Backend Health
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"Backend Online ✅"}
```

### Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@pathai.com","password":"demo123"}'
```

---

**All set? Let's start building!** 🚀
