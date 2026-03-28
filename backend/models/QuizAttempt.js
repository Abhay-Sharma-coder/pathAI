import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
  dayNumber: Number,
  topic: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
      userAnswer: String,
      isCorrect: Boolean
    }
  ],
  score: { type: Number, default: 0 }, // percentage
  timeSpent: Number, // in seconds
  passed: { type: Boolean, default: false }, // if score >= 70
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  feedback: String,
  weakAreas: [String], // topics to review
  attemptNumber: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);
