import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { demoStreaks } from '../demoData.js';

const router = express.Router();

// Initialize or use global streaks
if (!global.streaks) {
  global.streaks = JSON.parse(JSON.stringify(demoStreaks));
}

const getStreaks = () => global.streaks;

// Daily check-in
router.post('/checkin', verifyToken, (req, res) => {
  try {
    const streaks = getStreaks();
    let streak = streaks.find(s => s.userId === req.userId);
    
    if (!streak) {
      streak = {
        userId: req.userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null,
        checkInHistory: []
      };
      streaks.push(streak);
    }

    const today = new Date().toDateString();
    const lastCheckIn = streak.lastCheckInDate ? new Date(streak.lastCheckInDate).toDateString() : null;

    if (lastCheckIn === today) {
      return res.json({ message: 'Already checked in today', streak: streak.currentStreak });
    }

    streak.currentStreak += 1;
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastCheckInDate = new Date();
    streak.checkInHistory.push({
      date: new Date(),
      completed: true,
      action: 'daily_checkin'
    });

    res.json({
      message: 'Check-in successful',
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      xpGain: 10
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get streak stats
router.get('/stats', verifyToken, (req, res) => {
  try {
    const streaks = getStreaks();
    const streak = streaks.find(s => s.userId === req.userId) || { currentStreak: 0, longestStreak: 0 };
    res.json({
      currentStreak: streak.currentStreak || 0,
      longestStreak: streak.longestStreak || 0,
      lastCheckIn: streak.lastCheckInDate,
      frozenDays: streak.frozenDays || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
