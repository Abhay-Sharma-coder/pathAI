import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: __dirname + '/.env' });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import roadmapRoutes from './routes/roadmap.js';
import n8nRoutes from './routes/n8n.js';
import quizRoutes from './routes/quiz.js';
import streakRoutes from './routes/streak.js';
import adaptiveQuizRoutes from './routes/adaptive-quiz.js';
import adaptiveDoubtRoutes from './routes/adaptive-doubt.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.warn('⚠️  MongoDB Connection Warning:', err.message);
    console.log('✅ Using Demo Mode - In-memory storage (data will be lost on restart)');
  });

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend Online ✅' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/n8n', n8nRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/adaptive/quiz', adaptiveQuizRoutes);
app.use('/api/adaptive/doubt', adaptiveDoubtRoutes);

// Serve Static Files from frontend
app.use(express.static(__dirname + '/public'));

// SPA Fallback Route - serve index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PathAI Backend running on http://localhost:${PORT}`);
});
