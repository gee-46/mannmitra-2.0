import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const pmrSteps = [
  { textKey: 'pmr_page.tense_feet', duration: 5000, part: 'feet' },
  { textKey: 'pmr_page.relax_feet', duration: 10000, part: 'feet' },
  { textKey: 'pmr_page.tense_calves', duration: 5000, part: 'legs' },
  { textKey: 'pmr_page.relax_calves', duration: 10000, part: 'legs' },
  { textKey: 'pmr_page.tense_thighs', duration: 5000, part: 'legs' },
  { textKey: 'pmr_page.relax_thighs', duration: 10000, part: 'legs' },
  { textKey: 'pmr_page.tense_abdomen', duration: 5000, part: 'torso' },
  { textKey: 'pmr_page.relax_abdomen', duration: 10000, part: 'torso' },
  { textKey: 'pmr_page.tense_chest', duration: 5000, part: 'torso' },
  { textKey: 'pmr_page.relax_chest', duration: 10000, part: 'torso' },
  { textKey: 'pmr_page.tense_arms', duration: 5000, part: 'arms' },
  { textKey: 'pmr_page.relax_arms', duration: 10000, part: 'arms' },
  { textKey: 'pmr_page.tense_hands', duration: 5000, part: 'hands' },
  { textKey: 'pmr_page.relax_hands', duration: 10000, part: 'hands' },
  { textKey: 'pmr_page.tense_neck', duration: 5000, part: 'head' },
  { textKey: 'pmr_page.relax_neck', duration: 10000, part: 'head' },
  { textKey: 'pmr_page.tense_face', duration: 5000, part: 'head' },
  { textKey: 'pmr_page.relax_face', duration: 10000, part: 'head' },
];

const PMR = () => {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const timer = setTimeout(() => {
      setStepIndex((prevIndex) => {
        if (prevIndex + 1 >= pmrSteps.length) {
          setIsPlaying(false);
          setIsComplete(true);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, pmrSteps[stepIndex].duration);

    return () => clearTimeout(timer);
  }, [stepIndex, isPlaying, isComplete]);

  const currentStep = pmrSteps[stepIndex];
  const isTensing = currentStep.textKey.includes('tense');

  const handleReset = () => {
    setStepIndex(0);
    setIsPlaying(false);
    setIsComplete(false);
  };

  return (
    <PageWrapper>
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-4 overflow-hidden rounded-3xl my-4 mx-2 border border-white/10 shadow-2xl">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2670&auto=format&fit=crop)' }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95" />

        <div className="absolute top-6 right-6 z-20">
          <Link to="/mindfulness" className="text-foreground/80 hover:text-foreground transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm">
            <X className="w-6 h-6" />
          </Link>
        </div>

        {!isComplete ? (
          <>
            <div className="text-center mb-12 z-10 max-w-md relative">
              <h1 className="text-3xl font-bold text-foreground mb-4 drop-shadow-md">{t('pmr_page.title')}</h1>
              <p className="text-secondary text-lg font-medium">{t('pmr_page.instruction')}</p>
            </div>

            <div className="relative flex items-center justify-center w-80 h-80 mb-12 z-10">
              {/* Pulse Effect */}
              <motion.div
                className={`absolute w-full h-full rounded-full ${isTensing ? 'bg-red-500/20' : 'bg-green-500/20'} blur-3xl`}
                animate={isPlaying ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                transition={{ duration: currentStep.duration / 1000, ease: "easeInOut" }}
              />

              {/* Central Visual */}
              <motion.div
                className={`w-48 h-48 rounded-full flex items-center justify-center border-4 ${isTensing ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'
                  } shadow-2xl backdrop-blur-md`}
                animate={{
                  scale: isTensing ? 1.1 : 1,
                  borderColor: isTensing ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)',
                  backgroundColor: isTensing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className={`w-32 h-32 rounded-full ${isTensing ? 'bg-red-500' : 'bg-green-500'} shadow-inner`}
                  animate={{ scale: isTensing ? [1, 0.9, 1] : [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-24 w-full text-center"
                >
                  <p className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {t(currentStep.textKey)}
                  </p>
                  <p className="text-sm text-white/80 mt-2 uppercase tracking-widest font-semibold">
                    {isTensing ? 'Tense' : 'Relax'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex space-x-6 z-20 mt-8">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsPlaying(!isPlaying)} className="bg-card/80 backdrop-blur-lg border border-white/10 rounded-full p-5 shadow-lg hover:bg-card transition-colors">
                {isPlaying ? <Pause className="w-8 h-8 text-green-500" /> : <Play className="w-8 h-8 text-green-500" />}
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleReset} className="bg-card/80 backdrop-blur-lg border border-white/10 rounded-full p-5 shadow-lg hover:bg-card transition-colors">
                <RotateCcw className="w-8 h-8 text-green-500" />
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10 p-8 bg-card/50 backdrop-blur-xl rounded-3xl border border-white/10 max-w-md"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Session Complete</h2>
            <p className="text-secondary mb-8">You have successfully relaxed your entire body. Take a moment to feel the difference.</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-3 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded-full font-semibold transition-colors"
              >
                Restart
              </motion.button>
              <Link to="/mindfulness">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg shadow-primary/20"
                >
                  Finish
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};

export default PMR;
