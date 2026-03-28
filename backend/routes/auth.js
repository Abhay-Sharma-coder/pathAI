import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { verifyToken } from '../middleware/auth.js';
import { demoUsers, demoStreaks } from '../demoData.js';

const router = express.Router();

// Initialize global users if not already done
if (!global.users) {
  global.users = JSON.parse(JSON.stringify(demoUsers));
} else if (!Array.isArray(global.users)) {
  global.users = JSON.parse(JSON.stringify(demoUsers));
}

// Initialize global streaks
if (!global.streaks) {
  global.streaks = JSON.parse(JSON.stringify(demoStreaks));
}

const getUsers = () => global.users;

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, learningGoal } = req.body;

    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = {
      id: 'user_' + Date.now(),
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: hashedPassword,
      learningGoal,
      level: 1,
      xp: 0,
      streak: 0,
      longestStreak: 0,
      badges: [],
      completedRoadmaps: 0,
      totalRoadmapsGenerated: 0,
      totalQuizzesTaken: 0,
      avgQuizScore: 0,
      createdAt: new Date()
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // For demo user, do plain text comparison
    let isValid = false;
    if (user.isDemo) {
      isValid = password === user.password;
    } else {
      isValid = await bcryptjs.compare(password, user.password);
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: Math.floor(user.xp / 100) + 1,
        xp: user.xp,
        streak: user.streak,
        learningGoal: user.learningGoal
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User (with streaks merged in)
router.get('/me', verifyToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Import streaks (add at top if not already imported)
    const streakRecord = global.streaks?.find(s => s.userId === req.userId);
    
    // Merge streak data into user profile
    const currentStreak = streakRecord?.currentStreak || user.streak || 0;
    const longestStreak = streakRecord?.longestStreak || user.longestStreak || 0;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      learningGoal: user.learningGoal,
      level: Math.floor(user.xp / 100) + 1,  // Calculate level from XP
      xp: user.xp || 0,
      streak: currentStreak,
      longestStreak: longestStreak,
      badges: user.badges || [],
      totalRoadmapsGenerated: user.totalRoadmapsGenerated || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0,
      avgQuizScore: user.avgQuizScore || 0,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alias for /me (for compatibility)
router.get('/profile', verifyToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      learningGoal: user.learningGoal,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      longestStreak: user.longestStreak || 0,
      badges: user.badges || [],
      totalRoadmapsGenerated: user.totalRoadmapsGenerated || 0,
      totalQuizzesTaken: user.totalQuizzesTaken || 0,
      avgQuizScore: user.avgQuizScore || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
router.put('/update', verifyToken, (req, res) => {
  try {
    const { learningGoal, learningStyle } = req.body;
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.learningGoal = learningGoal || user.learningGoal;
    user.learningStyle = learningStyle || user.learningStyle;
    user.updatedAt = new Date();

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
