import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';

const breathCycle = [
  { textKey: 'breathing_exercise_page.breathe_in', duration: 4000 },
  { textKey: 'breathing_exercise_page.hold', duration: 4000 },
  { textKey: 'breathing_exercise_page.breathe_out', duration: 6000 },
];

const affirmations = [
  "I am calm and in control.",
  "I release tension with every breath.",
  "I am safe and grounded.",
  "Peace flows through me.",
  "I am capable of overcoming challenges.",
];

const BreathingExercise = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [cycleStage, setCycleStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState('rain');
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const soundOptions = [
    { key: 'rain', label: 'Rain' },
    { key: 'forest', label: 'Forest' },
    { key: 'white_noise', label: 'White Noise' },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCycleStage((prevStage) => {
        const nextStage = (prevStage + 1) % breathCycle.length;
        // Change affirmation at the start of a new cycle (breathe in)
        if (nextStage === 0) {
          setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
        }
        return nextStage;
      });
    }, breathCycle[cycleStage].duration);

    return () => clearTimeout(timer);
  }, [cycleStage, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && soundEnabled) {
      audio.src = `/sounds/${selectedSound}.mp3`;
      audio.loop = true;
      audio.play().catch(() => { });
    } else if (audio) {
      audio.pause();
    }

    return () => {
      if (audio) audio.pause();
    };
  }, [soundEnabled, selectedSound]);

  const currentStage = breathCycle[cycleStage];
  const stageKey = currentStage.textKey.split('.').pop()!;

  const circleVariants: Record<string, { scale: number; transition: { duration: number; ease: string } }> = {
    breathe_in: { scale: 1.5, transition: { duration: 4, ease: 'easeInOut' } },
    hold: { scale: 1.5, transition: { duration: 4, ease: 'easeInOut' } },
    breathe_out: { scale: 1, transition: { duration: 6, ease: 'easeInOut' } },
  };

  const handleReset = () => {
    setCycleStage(0);
    setIsPlaying(true);
    setAffirmationIndex(0);
  };

  return (
    <PageWrapper>
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-4 overflow-hidden rounded-3xl my-4 mx-2 border border-white/10 shadow-2xl">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2525&auto=format&fit=crop)' }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />

        <div className="absolute top-6 right-6 z-20">
          <Link to="/mindfulness" className="text-foreground/80 hover:text-foreground transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm">
            <X className="w-6 h-6" />
          </Link>
        </div>

        <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 mb-8 z-10">
          {/* Outer Glow */}
          <motion.div
            className="absolute w-full h-full rounded-full bg-primary/20 blur-3xl"
            animate={isPlaying ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute w-full h-full rounded-full bg-gradient-radial from-primary/40 to-primary/0 border border-primary/20 backdrop-blur-sm"
            animate={isPlaying ? circleVariants[stageKey] : {}}
          />
          <motion.div
            className="absolute w-2/3 h-2/3 rounded-full bg-gradient-radial from-primary/60 to-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.3)]"
            animate={isPlaying ? circleVariants[stageKey] : {}}
            transition={{ delay: 0.1 }}
          />
          <motion.div
            className="absolute w-1/3 h-1/3 rounded-full bg-primary shadow-lg shadow-primary/50"
            animate={isPlaying ? circleVariants[stageKey] : {}}
            transition={{ delay: 0.2 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={cycleStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="z-10 text-center"
            >
              <p className="text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-2">
                {t(currentStage.textKey)}
                {stageKey === 'breathe_in' && user?.name && `, ${user.name}`}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Affirmation Text */}
        <div className="h-16 mb-12 flex items-center justify-center px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={affirmationIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-xl text-secondary font-medium italic"
            >
              "{affirmations[affirmationIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center space-y-6 z-20">
          <div className="flex space-x-6">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsPlaying(!isPlaying)} className="bg-card/80 backdrop-blur-lg border border-white/10 rounded-full p-5 shadow-lg hover:bg-card transition-colors">
              {isPlaying ? <Pause className="w-8 h-8 text-primary" /> : <Play className="w-8 h-8 text-primary" />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleReset} className="bg-card/80 backdrop-blur-lg border border-white/10 rounded-full p-5 shadow-lg hover:bg-card transition-colors">
              <RotateCcw className="w-8 h-8 text-primary" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSoundEnabled(!soundEnabled)} className="bg-card/80 backdrop-blur-lg border border-white/10 rounded-full p-5 shadow-lg hover:bg-card transition-colors">
              {soundEnabled ? <VolumeX className="w-8 h-8 text-primary" /> : <Volume2 className="w-8 h-8 text-primary" />}
            </motion.button>
          </div>

          {soundEnabled && (
            <div className="flex space-x-4">
              {soundOptions.map(option => (
                <motion.button
                  key={option.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSound(option.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSound === option.key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card/80 backdrop-blur-lg border border-white/10 text-foreground hover:bg-card'
                    }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <audio ref={audioRef} />
      </div>
    </PageWrapper>
  );
};

export default BreathingExercise;
