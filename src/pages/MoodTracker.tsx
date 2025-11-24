import { useState, useMemo, useEffect } from 'react';
import { loadMoods, saveMoods } from '../lib/storage';
import { useAuth } from '../hooks/useAuth';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Mood, MoodOption } from '../types';
import Card from '../components/ui/Card';
import PageWrapper from '../components/PageWrapper';
import ReactECharts from 'echarts-for-react';
import { motion, AnimatePresence } from 'framer-motion';

const moodOptions: MoodOption[] = [
  { emotion: 'Happy', emoji: '😊', label: 'moods.happy' },
  { emotion: 'Calm', emoji: '😌', label: 'moods.calm' },
  { emotion: 'Anxious', emoji: '😟', label: 'moods.anxious' },
  { emotion: 'Sad', emoji: '😢', label: 'moods.sad' },
];

const moodValues = { 'Happy': 4, 'Calm': 3, 'Anxious': 2, 'Sad': 1 };
const moodColors = { 'Happy': '#34D399', 'Calm': '#60A5FA', 'Anxious': '#FBBF24', 'Sad': '#F87171' };

const MoodTracker = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const [sleepHours, setSleepHours] = useState<number | ''>('');
  const [exerciseMinutes, setExerciseMinutes] = useState<number | ''>('');
  const [socialMinutes, setSocialMinutes] = useState<number | ''>('');
  const [selectedFactor, setSelectedFactor] = useState<'sleep' | 'exercise' | 'social'>('sleep');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      const stored = loadMoods(user.name);
      setMoods(stored);
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && isLoaded) {
      saveMoods(user.name, moods);
    }
  }, [moods, user, isLoaded]);

  // Helper to get local YYYY-MM-DD string
  const getLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const logMood = (mood: MoodOption) => {
    const dateString = getLocalDateString(selectedDate);
    const newMoods = moods.filter(m => m.date !== dateString);
    const entry: Mood = {
      date: dateString,
      emotion: mood.emotion,
      emoji: mood.emoji,
      note: note || undefined,
      sleepHours: sleepHours === '' ? undefined : Number(sleepHours),
      exerciseMinutes: exerciseMinutes === '' ? undefined : Number(exerciseMinutes),
      socialMinutes: socialMinutes === '' ? undefined : Number(socialMinutes),
    };
    setMoods([...newMoods, entry]);
    // reset modal fields
    setNote(''); setSleepHours(''); setExerciseMinutes(''); setSocialMinutes('');
    setIsModalOpen(false);
  };

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dateString = getLocalDateString(date);
      const mood = moods.find(m => m.date === dateString);
      if (mood) {
        return <span className="mood-emoji">{mood.emoji}</span>;
      }
    }
    return null;
  };

  const currentWeekMoods = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    const currentDay = selectedDate.getDay() || 7; // 1 (Mon) to 7 (Sun)
    startOfWeek.setDate(selectedDate.getDate() - currentDay + 1);

    const weekDates = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDates.add(getLocalDateString(d));
    }

    return moods.filter(m => weekDates.has(m.date));
  }, [moods, selectedDate]);

  const weeklyTrends = useMemo(() => {
    const trendData = moodOptions.map(option => ({
      value: currentWeekMoods.filter(m => m.emotion === option.emotion).length,
      name: t(option.label),
      itemStyle: { color: moodColors[option.emotion] }
    }));

    const totalValue = currentWeekMoods.reduce((sum, m) => sum + moodValues[m.emotion], 0);
    const avgValue = currentWeekMoods.length > 0 ? totalValue / currentWeekMoods.length : 0;

    let avgMoodLabel = 'N/A';
    let avgMoodEmoji = '📭';

    if (currentWeekMoods.length > 0) {
      if (avgValue > 3.5) { avgMoodLabel = t('moods.happy'); avgMoodEmoji = '😊'; }
      else if (avgValue > 2.5) { avgMoodLabel = t('moods.calm'); avgMoodEmoji = '😌'; }
      else if (avgValue > 1.5) { avgMoodLabel = t('moods.anxious'); avgMoodEmoji = '😟'; }
      else { avgMoodLabel = t('moods.sad'); avgMoodEmoji = '😢'; }
    } else {
      avgMoodLabel = 'No Data';
    }

    return { trendData, avgMoodLabel, avgMoodEmoji };
  }, [currentWeekMoods, t]);

  const chartOption = {
    tooltip: { trigger: 'item', backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--primary))', textStyle: { color: 'hsl(var(--foreground))' } },
    legend: { top: 'bottom', textStyle: { color: 'hsl(var(--secondary))' } },
    series: [{
      name: 'Moods',
      type: 'pie',
      radius: ['50%', '80%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data: weeklyTrends.trendData,
    }],
  };


  return (
    <PageWrapper>
      <div className="py-6 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">{t('mood_tracker_page.title')}</h1>
        <Card>
          <Calendar
            onChange={(value) => handleDayClick(value as Date)}
            value={selectedDate}
            tileContent={tileContent}
            onActiveStartDateChange={({ activeStartDate }) => setSelectedDate(activeStartDate || new Date())}
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-semibold text-foreground mb-3">Weekly Mood Trends</h2>
            <div className="h-64">
              <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </Card>
          <Card className="flex flex-col items-center justify-center text-center">
            <h2 className="font-semibold text-foreground mb-3">Weekly Average Mood</h2>
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-2 filter drop-shadow-lg">{weeklyTrends.avgMoodEmoji}</span>
              <p className="text-2xl font-bold text-primary">{weeklyTrends.avgMoodLabel}</p>
            </div>

            <div className="w-full mt-6 text-left border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-secondary">{t('mood_tracker_page.correlation_with') || 'Correlation with'}</label>
                <select value={selectedFactor} onChange={e => setSelectedFactor(e.target.value as any)} className="text-sm p-1 rounded bg-black/20 border border-white/10 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="sleep">{t('mood_tracker_page.sleep_hours') || 'Sleep'}</option>
                  <option value="exercise">{t('mood_tracker_page.exercise_minutes') || 'Exercise'}</option>
                  <option value="social">{t('mood_tracker_page.social_minutes') || 'Social'}</option>
                </select>
              </div>

              {(() => {
                const dataPoints = currentWeekMoods.map(m => {
                  const y = moodValues[m.emotion] || 0;
                  let x: number | undefined;
                  if (selectedFactor === 'sleep') x = m.sleepHours;
                  if (selectedFactor === 'exercise') x = m.exerciseMinutes;
                  if (selectedFactor === 'social') x = m.socialMinutes;

                  if (x === undefined) return null;
                  return { x, y, note: m.note };
                }).filter((p): p is { x: number, y: number, note: string | undefined } => p !== null);

                const validPoints = dataPoints; // Now we include 0s if they are explicitly logged

                const n = validPoints.length;
                let correlation = 0;
                let slope = 0;
                let intercept = 0;
                let correlationText = "Not enough data";

                if (n > 1) {
                  const sumX = validPoints.reduce((a, b) => a + b.x, 0);
                  const sumY = validPoints.reduce((a, b) => a + b.y, 0);
                  const sumXY = validPoints.reduce((a, b) => a + b.x * b.y, 0);
                  const sumX2 = validPoints.reduce((a, b) => a + b.x * b.x, 0);
                  const sumY2 = validPoints.reduce((a, b) => a + b.y * b.y, 0);

                  const numerator = n * sumXY - sumX * sumY;
                  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

                  if (denominator !== 0) correlation = numerator / denominator;

                  // Regression Line Calculation
                  const denominatorSlope = n * sumX2 - sumX * sumX;
                  if (denominatorSlope !== 0) {
                    slope = (n * sumXY - sumX * sumY) / denominatorSlope;
                    intercept = (sumY - slope * sumX) / n;
                  }

                  if (Math.abs(correlation) < 0.3) correlationText = "Weak correlation";
                  else if (Math.abs(correlation) < 0.7) correlationText = "Moderate correlation";
                  else correlationText = "Strong correlation";
                }

                const scatterData = validPoints.map(p => [p.x, p.y, p.note || '']);
                const minX = Math.min(...validPoints.map(p => p.x), 0);
                const maxX = Math.max(...validPoints.map(p => p.x), 10); // Default max 10 if no data

                const lineData = n > 1 ? [
                  [minX, slope * minX + intercept],
                  [maxX, slope * maxX + intercept]
                ] : [];

                return (
                  <>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-3xl font-bold text-accent">{n > 1 ? correlation.toFixed(2) : 'N/A'}</p>
                        <p className="text-xs text-secondary">{correlationText}</p>
                      </div>
                    </div>
                    <div className="h-40">
                      <ReactECharts option={{
                        tooltip: {
                          trigger: 'item',
                          formatter: (params: any) => {
                            if (params.seriesType === 'line') return null;
                            const data = params.data as any;
                            return `Value: ${data[0]}<br/>Mood Score: ${data[1]}<br/>${data[2] ? `Note: ${data[2]}` : ''}`;
                          },
                          backgroundColor: 'hsl(var(--card))',
                          textStyle: { color: 'hsl(var(--foreground))' }
                        },
                        grid: { left: 30, right: 10, top: 10, bottom: 20 },
                        xAxis: { type: 'value', splitLine: { show: false }, axisLabel: { color: 'hsl(var(--secondary))' } },
                        yAxis: { type: 'value', min: 0, max: 5, splitLine: { lineStyle: { type: 'dashed', color: 'white/10' } }, axisLabel: { color: 'hsl(var(--secondary))' } },
                        series: [
                          {
                            type: 'scatter',
                            data: scatterData,
                            itemStyle: { color: 'hsl(var(--primary))' },
                            symbolSize: 10
                          },
                          {
                            type: 'line',
                            data: lineData,
                            showSymbol: false,
                            lineStyle: { type: 'dashed', color: 'hsl(var(--accent))', width: 2 },
                            animation: false
                          }
                        ]
                      }} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-11/12 max-w-sm shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold mb-6 text-center">{t('mood_tracker_page.log_your_mood')}</h2>
                <div className="flex justify-around">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-secondary">{t('mood_tracker_page.log_note') || 'Add a note (optional)'}</label>
                      <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 rounded-md bg-black/20 border border-white/10 text-foreground" rows={2} />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm text-secondary">{t('mood_tracker_page.sleep_hours') || 'Sleep (hrs)'}</label>
                        <input type="number" step="0.5" min="0" value={sleepHours as any} onChange={e => setSleepHours(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 rounded-md bg-black/20 border border-white/10 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-secondary">{t('mood_tracker_page.exercise_minutes') || 'Exercise (min)'}</label>
                        <input type="number" min="0" value={exerciseMinutes as any} onChange={e => setExerciseMinutes(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 rounded-md bg-black/20 border border-white/10 text-foreground" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm text-secondary">{t('mood_tracker_page.social_minutes') || 'Social (min)'}</label>
                        <input type="number" min="0" value={socialMinutes as any} onChange={e => setSocialMinutes(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 rounded-md bg-black/20 border border-white/10 text-foreground" />
                      </div>
                      <div className="flex-1 flex items-end justify-end">
                        <div className="flex gap-3">
                          {moodOptions.map(mood => (
                            <motion.button
                              key={mood.emotion}
                              onClick={() => logMood(mood)}
                              className="flex flex-col items-center space-y-2 text-secondary hover:text-primary transition-colors group"
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="text-4xl drop-shadow-lg transition-transform group-hover:scale-125">{mood.emoji}</span>
                              <span className="text-xs">{t(mood.label)}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default MoodTracker;
