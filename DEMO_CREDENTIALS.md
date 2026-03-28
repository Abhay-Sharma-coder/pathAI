## 🎉 **DEMO USER CREDENTIALS**

### **Pre-loaded User Account (Ready to Login)**
```
📧 Email: demo@pathai.com
🔐 Password: demo123
```

### **Quick Demo Steps:**

1. **Open Frontend**: http://localhost:3000/PathAI-Agent-Phase2.html
2. **Generate a Roadmap** (No login needed)
   - Enter topic: "React Advanced"
   - Click "GENERATE SMART ROADMAP"
3. **Click "💾 Save This Roadmap"**
4. **In Login Modal - Choose One:**

   **Option A: Login with Pre-loaded Account**
   ```
   Email: demo@pathai.com
   Password: demo123
   ```

   **Option B: Create New Account**
   ```
   Email: your_email@example.com
   Password: any_password
   Learning Goal: Your goal
   ```

---

### **What You Can Do After Login:**

✅ **View Dashboard**
- Level, XP, Streak stats
- Saved roadmaps history
- User profile

✅ **Save Roadmaps**
- Generate as many as you want
- All saved to your profile

✅ **Daily Check-in**
- Click "🔥 Daily Check-in for Streak"
- Builds your learning streak

✅ **Logout**
- Click "Logout" button in profile card
- Back to guest mode

---

### **API Endpoints (For Testing)**

```bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","learningGoal":"Python"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@pathai.com","password":"demo123"}'

# Get profile (replace TOKEN with actual JWT token from login response)
curl http://localhost:5000/api/health
```

---

### **⚠️ Important Notes:**

1. **Data is In-Memory**: All user data stored in RAM - resets when backend restarts
2. **MongoDB**: Connection attempted but not required (graceful fallback)
3. **CORS**: Enabled for localhost:3000
4. **JWT**: 30-day token expiry from login time

---

**Ready to Test! 🚀**
