import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true }, // Full roadmap content from n8n
  days: [
    {
      dayNumber: Number,
      title: String,
      tasks: [String],
      completed: { type: Boolean, default: false },
      completedAt: Date,
      quizAttempts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizAttempt' }]
    }
  ],
  currentDay: { type: Number, default: 1 },
  overallProgress: { type: Number, default: 0 }, // percentage
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  estimatedCompletionDays: { type: Number, default: 30 },
  startDate: { type: Date, default: Date.now },
  completionDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Roadmap', roadmapSchema);
