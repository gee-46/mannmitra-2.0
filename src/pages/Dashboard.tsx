import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import PageWrapper from '../components/PageWrapper';
import { loadMoods, saveMoods } from '../lib/storage';
import { useState, useEffect, useMemo } from 'react';
import { Mood, MoodOptions, calculateStreak, DailyAffirmations, formatDate } from '../types';
import { ChevronDown, Heart, Wind, BookOpen, Zap, Trophy, Award, Star, Calendar, MessageCircle, Settings, LogOut, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [todayMood, setTodayMood] = useState<Mood | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load moods on mount
  useEffect(() => {
    if (user) {
      const stored = loadMoods(user.name);
      setMoods(stored);
      const today = formatDate(new Date());
      const todayMoodEntry = stored.find(m => m.date === today);
      setTodayMood(todayMoodEntry || null);
      setIsLoaded(true);
    }
  }, [user]);

  // Save moods when they change
  useEffect(() => {
    if (user && isLoaded && moods.length > 0) {
      saveMoods(user.name, moods);
    }
  }, [moods, user, isLoaded]);

  const streakData = useMemo(() => calculateStreak(moods), [moods]);

  // Handle mood selection
  const handleMoodClick = (emotion: string) => {
    const today = formatDate(new Date());
    const existingIndex = moods.findIndex(m => m.date === today);
    const moodOption = MoodOptions.find(m => m.emotion === emotion);

    if (moodOption) {
      const newMood: Mood = {
        date: today,
        emotion: emotion as 'Happy' | 'Calm' | 'Anxious' | 'Sad',
        emoji: moodOption.emoji,
      };

      if (existingIndex >= 0) {
        const updatedMoods = [...moods];
        updatedMoods[existingIndex] = newMood;
        setMoods(updatedMoods);
      } else {
        setMoods([...moods, newMood]);
      }
      setTodayMood(newMood);
    }
  };

  // Get creative greeting
  const getCreativeGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = t('greeting', { name: user?.name || 'Friend' });
    else if (hour < 18) greeting = `Good Afternoon, ${user?.name || 'Friend'}!`;
    else greeting = `Good Evening, ${user?.name || 'Friend'}!`;
    return greeting;
  };

  // Get all achievements with unlock status
  const getAllAchievements = () => {
    const calmCount = moods.filter(m => m.emotion === 'Calm').length;
    const anxiousCount = moods.filter(m => m.emotion === 'Anxious').length;
    const sadCount = moods.filter(m => m.emotion === 'Sad').length;
    const happyCount = moods.filter(m => m.emotion === 'Happy').length;
    const totalCount = moods.length;

    return [
      {
        icon: <Trophy className="w-6 h-6" />,
        title: 'First Step',
        description: 'Register your first mood',
        color: 'text-yellow-500',
        unlocked: totalCount >= 1,
        requirement: 'Log 1 mood'
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: '3-Day Streak',
        description: 'Maintain a 3-day streak',
        color: 'text-blue-500',
        unlocked: streakData.streak >= 3,
        requirement: `Current: ${streakData.streak} days`
      },
      {
        icon: <Award className="w-6 h-6" />,
        title: '7-Day Streak',
        description: 'Maintain a 7-day streak',
        color: 'text-purple-500',
        unlocked: streakData.streak >= 7,
        requirement: `Current: ${streakData.streak} days`
      },
      {
        icon: <Heart className="w-6 h-6" />,
        title: 'Happy Days',
        description: 'Log 5 happy moods',
        color: 'text-red-500',
        unlocked: happyCount >= 5,
        requirement: `${happyCount}/5 happy moods`
      },
      {
        icon: <Wind className="w-6 h-6" />,
        title: 'Calm Master',
        description: 'Log 5 calm moods',
        color: 'text-cyan-500',
        unlocked: calmCount >= 5,
        requirement: `${calmCount}/5 calm moods`
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: 'Mood Tracker',
        description: 'Log 10 moods total',
        color: 'text-amber-500',
        unlocked: totalCount >= 10,
        requirement: `${totalCount}/10 moods`
      },
      {
        icon: <BookOpen className="w-6 h-6" />,
        title: 'Wellness Warrior',
        description: 'Log 30 moods total',
        color: 'text-green-500',
        unlocked: totalCount >= 30,
        requirement: `${totalCount}/30 moods`
      },
      {
        icon: <MessageCircle className="w-6 h-6" />,
        title: 'Seeker of Balance',
        description: 'Experience all 4 moods',
        color: 'text-indigo-500',
        unlocked: happyCount > 0 && calmCount > 0 && anxiousCount > 0 && sadCount > 0,
        requirement: `Emotions: Happy(${happyCount}) Calm(${calmCount}) Anxious(${anxiousCount}) Sad(${sadCount})`
      }
    ];
  };

  const allAchievements = getAllAchievements();

  // Feature list for the bottom section
  const features = [
    { icon: <Calendar className="w-6 h-6" />, name: 'Mood Tracking', desc: 'Monitor your daily emotions' },
    { icon: <MessageCircle className="w-6 h-6" />, name: 'AI Chat', desc: 'Talk to your companion' },
    { icon: <BookOpen className="w-6 h-6" />, name: 'Journaling', desc: 'Express your thoughts' },
    { icon: <Wind className="w-6 h-6" />, name: 'Mindfulness', desc: 'Breathing & relaxation' },
    { icon: <Zap className="w-6 h-6" />, name: 'Media', desc: 'Uplifting content' },
  ];

  return (
    <PageWrapper>
      <div className="py-6 space-y-8">
        {/* Header with Greeting and Settings */}
        <div className="flex items-start justify-between">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {getCreativeGreeting()}
            </h1>
            <p className="text-secondary text-lg">{t('how_are_you_feeling')}</p>
          </motion.div>

          {/* Settings Button */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-card backdrop-blur-xl rounded-lg border border-white/10 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
              title="Settings"
            >
              <Settings className="w-6 h-6 text-primary" />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                className="absolute top-0 left-full ml-2 bg-card border border-white/10 rounded-xl shadow-lg z-40 min-w-[250px] overflow-hidden"
              >
                {/* Theme Selection */}
                <div className="p-4 space-y-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Palette className="w-4 h-4" /> {t('Theme')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['light', 'ocean', 'nature', 'sunset'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => {
                          setTheme(themeOption as any);
                          setShowSettings(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          theme === themeOption
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : 'bg-white/5 text-secondary hover:bg-white/10'
                        }`}
                      >
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setShowSettings(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3 border-t border-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">{t('Logout')}</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* How are you feeling section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card backdrop-blur-xl rounded-2xl border border-white/10 p-8 space-y-6 relative z-30 overflow-visible"
        >
          {/* Mood Buttons */}
          <div className="grid grid-cols-4 gap-4">
            {MoodOptions.map(({ emotion, emoji }) => (
              <motion.button
                key={emotion}
                onClick={() => handleMoodClick(emotion)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  todayMood?.emotion === emotion
                    ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-4xl mb-2">{emoji}</div>
                <p className="text-xs font-medium text-secondary">{emotion}</p>
              </motion.button>
            ))}
          </div>

          {/* Mood-specific content */}
          {todayMood && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-primary/5 rounded-xl border border-primary/20"
            >
              {todayMood.emotion === 'Happy' && (
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">Amazing! Here's a quote for you:</p>
                  <p className="text-secondary italic">"{DailyAffirmations[Math.floor(Math.random() * DailyAffirmations.length)]}"</p>
                </div>
              )}

              {todayMood.emotion === 'Calm' && (
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">Glad you're feeling calm!</p>
                  <p className="text-secondary mb-4">Check out some uplifting media to maintain this feeling.</p>
                  <button
                    onClick={() => navigate('/media')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Watch Media
                  </button>
                </div>
              )}

              {todayMood.emotion === 'Anxious' && (
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">It's okay to feel anxious.</p>
                  <p className="text-secondary mb-4">Try journaling to process your feelings.</p>
                  <button
                    onClick={() => navigate('/journal')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Open Journal
                  </button>
                </div>
              )}

              {todayMood.emotion === 'Sad' && (
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-foreground">We're here to help you feel better.</p>
                  <p className="text-secondary mb-4">Explore these features designed to lift your mood:</p>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-between"
                    >
                      Choose a tool
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 w-full bg-card border border-white/10 rounded-xl shadow-2xl z-50"
                      >
                        <button
                          onClick={() => {
                            navigate('/mood-tracker');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-white/10"
                        >
                          📊 Track Your Mood
                        </button>
                        <button
                          onClick={() => {
                            navigate('/journal');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-white/10"
                        >
                          📝 Journal
                        </button>
                        <button
                          onClick={() => {
                            navigate('/mindfulness');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-white/10"
                        >
                          🧘 Mindfulness Tools
                        </button>
                        <button
                          onClick={() => {
                            navigate('/chat');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-white/10"
                        >
                          💬 Chat with AI
                        </button>
                        <button
                          onClick={() => {
                            navigate('/media');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors"
                        >
                          🎬 Watch Media
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allAchievements.map((achievement: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: achievement.unlocked ? 1.08 : 1.02 }}
                className={`relative rounded-xl p-5 border-2 transition-all backdrop-blur-xl ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${achievement.color}/10 border-${achievement.color.split('-')[1]}-500/50 shadow-lg shadow-${achievement.color.split('-')[1]}-500/30`
                    : 'bg-card border-white/10 opacity-60'
                }`}
              >
                {/* Glow effect for unlocked achievements */}
                {achievement.unlocked && (
                  <motion.div
                    className={`absolute inset-0 rounded-xl blur-lg -z-10 ${achievement.color.replace('text', 'bg')}/30`}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className={`flex items-center justify-between mb-3 ${achievement.unlocked ? achievement.color : 'text-gray-500'}`}>
                  <div className="text-2xl">{achievement.icon}</div>
                  {achievement.unlocked && (
                    <span className="text-lg">✨</span>
                  )}
                </div>

                <h3 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-foreground' : 'text-secondary'}`}>
                  {achievement.title}
                </h3>
                <p className={`text-xs mb-3 ${achievement.unlocked ? 'text-secondary' : 'text-secondary/60'}`}>
                  {achievement.description}
                </p>

                <div className={`text-xs px-2 py-1 rounded-md ${
                  achievement.unlocked
                    ? 'bg-primary/20 text-primary'
                    : 'bg-white/5 text-secondary/60'
                }`}>
                  {achievement.requirement}
                </div>

                {achievement.unlocked && (
                  <div className="mt-3 text-center">
                    <span className="text-xs font-bold text-primary bg-primary/20 px-3 py-1 rounded-full">
                      UNLOCKED ✓
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why use MannMitra section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-foreground">Why use MannMitra?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-card backdrop-blur-xl rounded-xl border border-white/10 p-6 space-y-3"
              >
                <div className="text-primary">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.name}</h3>
                  <p className="text-sm text-secondary">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
