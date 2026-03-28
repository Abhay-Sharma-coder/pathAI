# 🔌 API Reference

Complete API documentation for PathAI backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Protect routes require JWT token:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Sign Up
Create new user account.

```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "learningGoal": "Master Python"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1710000000000",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
Authenticate existing user.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1710000000000",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 1,
    "xp": 0,
    "streak": 0
  }
}
```

### Get Profile
Fetch current user profile.

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_1710000000000",
  "name": "John Doe",
  "email": "john@example.com",
  "level": 3,
  "xp": 250,
  "streak": 7,
  "longestStreak": 14,
  "badges": ["7day_streak", "first_roadmap"],
  "totalRoadmapsGenerated": 5,
  "totalQuizzesTaken": 12,
  "avgQuizScore": 78.5
}
```

---

## Roadmap Endpoints

### Create Roadmap
Generate and save new roadmap.

```http
POST /roadmap
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "React.js Fundamentals",
  "difficulty": "intermediate"
}
```

### Get All Roadmaps
Fetch all roadmaps for user.

```http
GET /roadmap
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total": 3,
  "roadmaps": [
    {
      "id": "roadmap_1710000000001",
      "topic": "Python Basics",
      "days": 7,
      "progress": 45,
      "status": "active",
      "createdAt": "2026-03-20T10:00:00Z"
    }
  ]
}
```

### Get Roadmap Details
Fetch specific roadmap with full content.

```http
GET /roadmap/:id
Authorization: Bearer <token>
```

### Update Roadmap Progress
Mark tasks/days as completed.

```http
PATCH /roadmap/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentDay": 2,
  "progress": 25
}
```

### Delete Roadmap
Remove roadmap.

```http
DELETE /roadmap/:id
Authorization: Bearer <token>
```

---

## Quiz Endpoints

### Generate Quiz
Create AI quiz for specific day.

```http
POST /quiz/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Python Functions",
  "dayContent": "Content from day 2...",
  "dayNumber": 2
}
```

**Response:**
```json
{
  "success": true,
  "quiz": {
    "id": "quiz_1710000000001",
    "questions": [
      {
        "id": 1,
        "question": "What is a function?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 0,
        "explanation": "Explanation..."
      }
    ],
    "totalQuestions": 5
  }
}
```

### Submit Quiz
Grade quiz answers.

```http
POST /quiz/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizId": "quiz_1710000000001",
  "answers": [0, 2, 1, 3, 0]
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "scorePercentage": 80,
    "correctAnswers": 4,
    "totalQuestions": 5,
    "xpEarned": 75,
    "badge": null,
    "message": "🎉 Excellent!"
  }
}
```

### Get Quiz History
Fetch all quiz attempts.

```http
GET /quiz/history
Authorization: Bearer <token>
```

---

## Streak Endpoints

### Daily Check-in
Mark learning completed.

```http
POST /streak/checkin
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Check-in successful",
  "currentStreak": 7,
  "longestStreak": 14,
  "xpGain": 10
}
```

### Get Streak Stats
Fetch streak information.

```http
GET /streak/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "currentStreak": 7,
  "longestStreak": 14,
  "lastCheckIn": "2026-03-28T10:00:00Z",
  "frozenDays": 0
}
```

---

## Doubt Solver Endpoints

### Ask Question
Get AI answer to doubt.

```http
POST /adaptive/doubt/ask
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "How do I create a function?",
  "roadmapContent": "Content from roadmap...",
  "roadmapTopic": "Python Basics"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "To create a function in Python...",
  "relatedTopics": ["Functions", "Parameters"],
  "resources": [...]
}
```

---

## Error Handling

### Error Response Format
```json
{
  "error": "Error message here"
}
```

### Common Errors

| Code | Error | Solution |
|------|-------|----------|
| 400 | Invalid email format | Use valid email |
| 401 | Invalid token | Login again |
| 404 | Resource not found | Check ID |
| 500 | Server error | Retry or contact support |

---

## Rate Limiting

- 100 requests per minute per IP
- Quiz generation: 5 per minute
- N8N calls: 10 per minute

---

## Testing API

### Using cURL
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Profile
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Import [API_EXAMPLES.rest](../API_EXAMPLES.rest)
2. Set environment variables
3. Run requests

---

**Need help?** Check [FEATURES.md](FEATURES.md) or raise an issue!
