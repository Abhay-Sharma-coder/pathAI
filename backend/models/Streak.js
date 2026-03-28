import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCheckInDate: Date,
  checkInHistory: [
    {
      date: { type: Date, default: Date.now },
      completed: { type: Boolean, default: true },
      action: String // 'roadmap_completed', 'quiz_taken', 'daily_checkin'
    }
  ],
  frozenDays: { type: Number, default: 0 }, // user can freeze streak once per month
  lastFreezeDate: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Streak', streakSchema);
