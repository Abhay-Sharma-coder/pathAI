# PathAI 3-Page Standalone App - Integration Guide

## Overview
The complete 3-page PathAI learning platform is now fully integrated into a single standalone application running on the backend server. The app features:
- **Dashboard Page**: Create roadmaps, view stats
- **Progress Page**: Track achievements and analytics
- **Authentication**: Built-in login/signup system

## Architecture

### Frontend
- **Location**: `backend/public/index.html`
- **Technology**: Standalone React + Babel (no build step needed)
- **Features**: 
  - 3-page SPA (Single Page Application)
  - Responsive design
  - Dark theme with cyan/purple gradients
  - Real-time data fetching from backend API

### Backend
- **Location**: `backend/server.js`
- **Technology**: Express.js
- **Features**:
  - Serves static files from `backend/public/`
  - API endpoints for auth, roadmaps, quizzes, etc.
  - SPA routing fallback to `index.html`

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/pathai
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
N8N_API_KEY=your_n8n_key_here
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### 3. Start the Server
```bash
npm start
```

The server will:
- ✅ Connect to MongoDB (or use demo mode)
- ✅ Serve API at `http://localhost:5000/api/`
- ✅ Serve Frontend at `http://localhost:5000/`

### 4. Open in Browser
Navigate to: **`http://localhost:5000`**

### Test Credentials
- 📧 Email: `demo@pathai.com`
- 🔑 Password: `demo123`

## File Structure

```
backend/
├── public/
│   └── index.html           ← 3-Page React App (Standalone)
├── server.js                ← Express server with SPA routing
├── .env                     ← Environment variables
├── package.json
├── routes/
│   ├── auth.js             ← Authentication endpoints
│   ├── roadmap.js          ← Roadmap CRUD
│   ├── n8n.js              ← N8N integration
│   ├── quiz.js             ← Quiz endpoints
│   └── ... (other routes)
└── models/
    ├── User.js             ← User schema
    ├── Roadmap.js          ← Roadmap schema
    └── ... (other models)
```

## Features

### Dashboard
- 📊 View user stats (level, XP, day streak)
- 📚 See all created roadmaps with progress bars
- ✨ Generate new roadmaps by topic
- 🎯 Real-time roadmap creation with N8N

### Progress Page
- 📈 Detailed analytics
- 🏆 Achievement/Badge system
- 📅 Roadmap statistics
- ⭐ Level progression tracking

### Authentication
- 🔐 Secure JWT-based auth
- 📝 Sign up / Login flow
- 👤 User profile management
- 🚪 Logout functionality

## How to Deploy

### Vercel (Recommended for Backend)
1. Push code to GitHub
2. Connect backend folder to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Local Development
```bash
npm start        # Starts at http://localhost:5000
npm run dev      # With nodemon (if configured)
```

### Production Build
```bash
# Backend is already production-ready
# Frontend is served as static files from public/
npm start        # Same command for production
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Roadmaps
- `GET /api/roadmap` - Get all roadmaps
- `POST /api/roadmap` - Create roadmap
- `GET /api/roadmap/:id` - Get roadmap details
- `PUT /api/roadmap/:id` - Update roadmap

### N8N Integration
- `POST /api/n8n/generate-roadmap` - AI-powered roadmap generation

### Other Endpoints
- `/api/quiz/*` - Quiz routes
- `/api/streak/*` - Streak tracking
- `/api/adaptive/*` - Adaptive learning

## Frontend Auto-Detection

The app automatically detects the API URL:
```javascript
const getAPIUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return window.location.origin;  // Production URL
};
```

This means:
- **Development**: `http://localhost:5000/api/*`
- **Production**: `https://your-domain.com/api/*`

## Troubleshooting

### CORS Errors
✅ Already configured in `server.js` with `cors()` middleware

### Static Files Not Loading
✅ Verify `backend/public/index.html` exists
✅ Check `express.static(__dirname + '/public')` in server.js

### API Not Responding
✅ Check backend is running on correct port
✅ Verify environment variables are set
✅ Check MongoDB connection

### Auth Issues
✅ Ensure JWT_SECRET is set in .env
✅ Check token is stored in localStorage
✅ Verify Authorization header format: `Bearer <token>`

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/pathai` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing key | `your-secret-key-123` |
| `N8N_API_KEY` | N8N authentication | `n8n-key-xxx` |
| `N8N_WEBHOOK_URL` | N8N webhook endpoint | `https://n8n.io/webhook/...` |

## Development Workflow

### Making Changes to Frontend
1. Edit `backend/public/index.html`
2. Refresh browser (browser cache will update automatically)
3. Changes reflected immediately

### Making Changes to Backend
1. Edit backend files (routes, models, etc.)
2. Restart server: `npm start`
3. API will reflect changes

### Adding New Routes
1. Create route file in `backend/routes/`
2. Import in `server.js`: `import yourRoutes from './routes/your-route.js'`
3. Mount in middleware: `app.use('/api/your-path', yourRoutes)`

## Performance Optimization

### Frontend
- Uses React 18 for fast rendering
- Lazy loads components via state
- Minimal re-renders
- CSS-in-JS for optimized styling

### Backend
- Express.js for fast request handling
- MongoDB indexing for queries
- JWT for stateless authentication
- N8N webhooks for async operations

## Security

- ✅ JWT authentication on all protected routes
- ✅ CORS configured for safe cross-origin requests
- ✅ Environment variables for sensitive data
- ✅ Password hashing with bcrypt (in User model)
- ✅ Input validation on routes

## Testing the App

### Manual Test Flow
1. Open `http://localhost:5000`
2. Click "🔐 Login"
3. Enter demo credentials:
   - Email: `demo@pathai.com`
   - Password: `demo123`
4. View Dashboard
5. Create a roadmap: "React Advanced"
6. Check Progress page
7. Logout and test again

### API Test (cURL)
```bash
# Test server health
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@pathai.com","password":"demo123"}'

# Get user profile (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me
```

## GitHub Repository

Push all code to GitHub:

```bash
git add .
git commit -m "feat: Add 3-page standalone app integrated with backend"
git push origin main
```

Include in commit message:
- ✅ 3-page React SPA integrated
- ✅ Backend SPA routing configured
- ✅ Static file serving from backend/public
- ✅ Full authentication flow
- ✅ Dashboard and Progress pages
- ✅ Real-time roadmap generation
- ✅ Production-ready deployment

## Next Steps

1. ✅ Test locally at `http://localhost:5000`
2. ✅ Commit to GitHub
3. ✅ Deploy backend to Vercel/Heroku
4. ✅ Enable N8N integration
5. ✅ Add database with real MongoDB
6. ✅ Monitor performance and errors
7. ✅ Gather user feedback
8. ✅ Iterate and improve

## Support

For issues or questions:
1. Check TROUBLESHOOTING section above
2. Review API_DOCS.md in docs/ folder
3. Check backend logs for errors
4. Open browser DevTools (F12) for frontend errors

---

**Last Updated**: 2024
**Version**: 1.0.0 - Fully Integrated
**Status**: ✅ Production Ready
