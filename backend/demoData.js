// Demo In-Memory Database for testing
// This allows signup/login without MongoDB

const demoUsers = [
  {
    id: '66abc123demo001',
    name: 'Demo User',
    email: 'demo@pathai.com',
    password: 'demo123', // Plain text for demo (will be hashed on compare)
    isDemo: true,
    level: 3,
    xp: 250,
    streak: 7,
    longestStreak: 7,
    badges: ['7day_streak', 'first_roadmap'],
    learningGoal: 'React & Node.js',
    completedRoadmaps: 2,
    totalRoadmapsGenerated: 5,
    totalQuizzesTaken: 8,
    avgQuizScore: 82
  }
];

const demoRoadmaps = [];

const demoStreaks = [
  {
    userId: '66abc123demo001',
    currentStreak: 7,
    longestStreak: 7,
    lastCheckInDate: new Date(),
    checkInHistory: [
      { date: new Date(Date.now() - 6*24*60*60*1000), completed: true, action: 'daily_checkin' },
      { date: new Date(Date.now() - 5*24*60*60*1000), completed: true, action: 'daily_checkin' },
      { date: new Date(Date.now() - 4*24*60*60*1000), completed: true, action: 'daily_checkin' },
      { date: new Date(Date.now() - 3*24*60*60*1000), completed: true, action: 'daily_checkin' },
      { date: new Date(Date.now() - 2*24*60*60*1000), completed: true, action: 'daily_checkin' },
      { date: new Date(Date.now() - 1*24*60*60*1000), completed: true, action: 'daily_checkin' },
      { date: new Date(), completed: true, action: 'daily_checkin' }
    ]
  }
];

const demoQuizzes = [];

export { demoUsers, demoRoadmaps, demoStreaks, demoQuizzes };
