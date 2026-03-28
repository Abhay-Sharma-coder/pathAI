# 🆘 Troubleshooting Guide

Common issues and how to fix them.

## 1. MongoDB Connection Issues

### Error: `querySrv ECONNREFUSED`

**Cause:** Cannot connect to MongoDB Atlas

**Solutions:**
```bash
# Check internet connection
ping google.com

# Verify connection string
# Go to MongoDB Atlas → Clusters → Connect
# Copy the correct connection string

# Try with local MongoDB
MONGODB_URI=mongodb://localhost:27017/pathai

# Test connection manually
mongo "your-connection-string"
```

### Error: `ECONNREFUSED` with local MongoDB

**Cause:** MongoDB server not running

**Solution:**
```bash
# macOS
brew services start mongodb-community

# Windows - Start MongoDB Service
net start MongoDB

# Linux
sudo systemctl start mongodb
```

---

## 2. Port Already in Use

### Error: `Error: EADDRINUSE :::5000`

**Solution:**
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
# Output: TCP  [::1]:5000  [::]:0  LISTENING  12345
taskkill /PID 12345 /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**Alternative:** Change port in `.env`
```bash
PORT=3000
```

---

## 3. Module Not Found Errors

### Error: `Cannot find module 'express'`

**Solution:**
```bash
# Navigate to backend directory
cd backend

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Verify installation
npm list express
```

### Error: `Cannot find module 'dotenv'`

**Solution:**
```bash
npm install dotenv --save
npm start
```

---

## 4. Environment Variables Not Loading

### Error: `process.env.JWT_SECRET is undefined`

**Cause:** Missing `.env` file or incorrect path

**Solution:**
```bash
# Verify .env file exists
# Path should be: backend/.env (NOT root/.env)

# Check file content
cat backend/.env

# Ensure all required variables are present
# Required: MONGODB_URI, JWT_SECRET, POE_API_KEY

# Restart backend
npm start
```

---

## 5. API Key Issues

### Error: `403 Unauthorized - POE API`

**Cause:** Invalid or missing POE_API_KEY

**Solution:**
```bash
# Get key from https://poe.com/api/auth/session
# Verify it's in .env file exactly:
POE_API_KEY=sk-poe-abc123xyz789...

# Check .env doesn't have spaces
# ✓ Correct:   POE_API_KEY=sk-poe-abc123
# ✗ Wrong:     POE_API_KEY = sk-poe-abc123
```

---

## 6. Frontend Not Loading

### Error: `Cannot GET /PathAI-React-App.html`

**Cause:** Frontend server not running

**Solution:**
```bash
# Start HTTP server from root folder
python -m http.server 8000

# Or use alternative
python3 -m http.server 8000
```

### Error: 404 when loading assets

**Cause:** Incorrect asset paths

**Solution:**
```bash
# Check file structure
ls -la

# Verify paths in HTML
# Use relative paths: ./styles/App.css
# NOT absolute paths: /styles/App.css
```

---

## 7. CORS Issues

### Error: `Access to XMLHttpRequest blocked by CORS`

**Cause:** Cross-origin requests blocked

**Solution:**
```bash
# Verify backend has CORS enabled (it should)
# In server.js, check for:
const cors = require('cors');
app.use(cors());

# Restart backend
npm start
```

---

## 8. Quiz Generation Fails

### Error: `N8N webhook returned error`

**Cause:** N8N workflow not running or timeout

**Solution:**
```bash
# Verify webhook URL is correct
# Check N8N workflow is active
# Try manually: curl https://workflow.ccbp.in/webhook/generate-path

# Test with mock data (already implemented)
# Backend will use demo quiz if N8N fails
```

---

## 9. Authentication Issues

### Error: `Invalid token` when logged in

**Cause:** Token expired or JWT_SECRET changed

**Solution:**
```bash
# Login again to get fresh token
# Verify JWT_SECRET in .env hasn't changed

# Clear localStorage
# Open DevTools → Application → localStorage
# Delete 'token' and 'user'
# Login again
```

### Error: `Cannot signup - email already exists`

**Solution:**
```bash
# Use different email
# Or delete user from MongoDB if testing
# CLI: db.users.deleteOne({email: "test@test.com"})
```

---

## 10. Database Persistence Issues

### Error: `Data lost after restart`

**Cause:** Using demo mode instead of MongoDB

**Solution:**
```bash
# Verify MongoDB connection
# Check .env has valid MONGODB_URI
# Test: npm test (if available)

# Or explicitly use demo mode:
# Ensure .env has: NODE_ENV=development
# Backend will auto-use demo data
```

---

## 11. Build/Compile Errors

### Error: `SyntaxError: Unexpected token`

**Cause:** Invalid JavaScript syntax

**Solution:**
```bash
# Check the error line number
# Most common: Missing comma, bracket, or semicolon

# Example:
// ✗ Wrong
const obj = {
  name: "Test"
  age: 25    // Missing comma!
}

// ✓ Correct
const obj = {
  name: "Test",
  age: 25
}
```

---

## 12. Performance Issues

### Slow Quiz Generation

**Solution:**
```bash
# Issue: POE API is slow
# Wait 5-10 seconds on first quiz
# Subsequent quizzes should be fast

# Or: Use fallback mock quiz
# It's faster but less personalized
```

### High Memory Usage

**Solution:**
```bash
# Restart backend
npm start

# Or use PM2 to monitor
npm install -g pm2
pm2 start backend/server.js
pm2 monit
```

---

## Getting Help

### Check These First
1. Verify `.env` file exists in `backend/` folder
2. Ensure all services are running
3. Check internet connection
4. Look at error in browser console (F12)
5. Check terminal output for error logs

### If Still Stuck
- 📧 Email: support@pathai.com
- 🐛 GitHub Issues: https://github.com/Abhay-Sharma-coder/pathAI/issues
- 💬 GitHub Discussions

---

**Still need help?** Create a detailed issue with error logs and we'll help! 🎯
