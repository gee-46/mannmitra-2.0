export type Mood = {
  date: string; // YYYY-MM-DD
  emotion: 'Happy' | 'Calm' | 'Anxious' | 'Sad';
  emoji: string;
  note?: string; // optional user note about the day
  sleepHours?: number; // optional factor
  exerciseMinutes?: number; // optional factor
  socialMinutes?: number; // optional factor
};

export const MoodOptions: MoodOption[] = [
  { emotion: 'Happy', emoji: '😊', label: 'Happy' },
  { emotion: 'Calm', emoji: '😌', label: 'Calm' },
  { emotion: 'Anxious', emoji: '😰', label: 'Anxious' },
  { emotion: 'Sad', emoji: '😢', label: 'Sad' },
];

export type MoodOption = {
  emotion: 'Happy' | 'Calm' | 'Anxious' | 'Sad';
  emoji: string;
  label: string;
};

export type ChatMessage = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  isCrisisCard?: boolean;
  action?: {
    type: 'navigate';
    path: string;
    label: string;
  };
};

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
};

// Utility function for calculating 7-day analytics.
export const getMoodAnalytics = (currentMoods: Mood[], days = 7) => {
  const sevenDaysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recentMoods = currentMoods.filter(m => new Date(m.date) >= sevenDaysAgo);

  if (recentMoods.length === 0) {
    return { averageScore: 0, topMood: null, topCount: 0, daysLogged: 0, moodDip: false };
  }

  // Calculate Average Score
  const totalScore = recentMoods.reduce((sum, mood) => sum + (MoodScores[mood.emotion] || 0), 0);
  const averageScore = totalScore / recentMoods.length;

  // Calculate Top Mood
  const moodCounts = recentMoods.reduce((acc, mood) => {
    acc[mood.emotion] = (acc[mood.emotion] || 0) + 1;
    return acc;
  }, {} as Record<Mood['emotion'], number>);

  let topMood: Mood['emotion'] | null = null;
  let topCount = 0;
  Object.entries(moodCounts).forEach(([emotion, count]) => {
    if (count > topCount) {
      topCount = count;
      topMood = emotion as Mood['emotion'];
    }
  });

  // Simple Dip Detection (Compare last day to average)
  const todayMood = recentMoods.find(m => m.date === formatDate(new Date()));
  const moodDip = todayMood && (MoodScores[todayMood.emotion] || 0) < averageScore - 1.0; // Dip if today's score is 1 point lower than average

  return { averageScore, topMood, topCount, daysLogged: recentMoods.length, moodDip };
};

// Utility function for calculating streak (consecutive days logged ending today/yesterday).
export const calculateStreak = (moods: Mood[]) => {
  // Sort moods by date ascending
  const sortedMoods = moods.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let streak = 0;
  let currentDate = new Date();

  // Check if user logged today (or yesterday if it's past midnight)
  let checkDate = new Date();
  // For simplicity, let's assume a day is logged if the date matches.
  const todayStr = formatDate(currentDate);
  const yesterdayStr = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  if (moods.some(m => m.date === todayStr)) {
    // Logged today, start streak check from today
  } else if (moods.some(m => m.date === yesterdayStr)) {
    // Didn't log today, but logged yesterday. Streak is up to yesterday.
    currentDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  } else {
    return { streak: 0, loggedToday: false };
  }

  let loggedToday = moods.some(m => m.date === todayStr);

  while (true) {
    const checkStr = formatDate(currentDate);
    if (moods.some(m => m.date === checkStr)) {
      streak++;
      // Move back one day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, loggedToday };
};

// Mock Affirmations array (for seamless integration).
export const DailyAffirmations: string[] = [
  "I am worthy of love and happiness.",
  "I choose peace over worry.",
  "Every breath I take calms my mind.",
  "I am resilient and capable of handling anything.",
  "I release what no longer serves me.",
];

// Helper function to format date
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Mood Scores for analytics
export const MoodScores: Record<Mood['emotion'], number> = {
  'Happy': 4,
  'Calm': 3,
  'Anxious': 2,
  'Sad': 1,
};
