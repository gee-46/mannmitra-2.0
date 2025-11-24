import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageWrapper from '../components/PageWrapper';
import { BrainCircuit, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAntigravity } from '../hooks/useAntigravity';

// Small live-preview notifications shown on Login screen
const sampleNames = [
  'Aisha', 'Rahul', 'Priya', 'Arjun', 'Sneha', 'Kabir', 'Meera', 'Vikram', 'Isha', 'Sameer'
];

const sampleActions = [
  'started using MannMitra',
  'maintained a streak of 5 days',
  'completed a breathing exercise',
  'wrote a journal entry',
  'shared an affirmation',
  'completed a mindful session',
  'started their wellness journey',
  'tracked mood for 7 days',
  'explored calming media',
  'joined a check-in'
];

function getRandomNotification() {
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const action = sampleActions[Math.floor(Math.random() * sampleActions.length)];
  return `${name} ${action}`;
}

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup, error, clearError, user } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Apply antigravity effect to card and icon with different intensities for depth
  useAntigravity(cardRef, { intensity: 10, tiltIntensity: 5, smoothness: 0.1 });
  useAntigravity(iconRef, { intensity: 20, tiltIntensity: 10, smoothness: 0.1 });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
    setUsername('');
    setPassword('');
  }, []);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [isSignUp, clearError]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      if (isSignUp) {
        signup(username.trim(), password.trim());
      } else {
        login(username.trim(), password.trim());
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setUsername('');
    setPassword('');
    clearError();
  };

  // Notification popups on login screen (random messages)
  const [toast, setToast] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // don't show notifications when user is logged in
    if (user) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as unknown as number);
        timeoutRef.current = null;
      }
      setToast(null);
      return;
    }

    // Start showing notifications every 4s
    // Each toast will display for 4s
    const startInterval = () => {
      // show first notification immediately
      setToast(getRandomNotification());
      timeoutRef.current = window.setTimeout(() => setToast(null), 4000);

      intervalRef.current = window.setInterval(() => {
        const txt = getRandomNotification();
        setToast(txt);
        // hide after 4s
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current as unknown as number);
        }
        timeoutRef.current = window.setTimeout(() => setToast(null), 4000);
      }, 4000);
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as unknown as number);
      }
    };
  }, [user]);

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 perspective-1000">
        <motion.div
          ref={cardRef}
          className="w-full max-w-md bg-card backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-primary/10 p-8 transform-style-3d relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />

          <div className="text-center mb-8">
            <div ref={iconRef} className="inline-block mb-4">
              <BrainCircuit className="mx-auto h-16 w-16 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
              Welcome to MannMitra
            </h1>
            <p className="text-secondary text-sm mb-6">Your personal mental wellness companion</p>

            <div className="bg-primary/5 rounded-lg p-4 mb-6 border border-primary/10">
              <p className="text-primary italic font-medium text-sm">
                "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity."
              </p>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-3 mb-6 flex items-center space-x-2"
              >
                <AlertCircle size={16} />
                <span>{t(`login_page.${error}`)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary mb-1">
                {t('login_page.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                required
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-1">
                {t('login_page.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                required
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-300 mt-6"
            >
              {isSignUp ? t('login_page.signup') : t('login_page.login')}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-secondary mb-3">
              {isSignUp ? "Already have an account?" : "New to MannMitra?"}
            </p>
            <button
              onClick={toggleMode}
              className="text-sm font-semibold text-primary hover:text-accent transition-colors flex items-center justify-center gap-2 mx-auto group"
            >
              {isSignUp ? t('login_page.toggle_to_login') : "Sign up to create an account"}
              <span className="block h-px w-0 bg-primary transition-all group-hover:w-full"></span>
            </button>
          </div>
        </motion.div>
        {/* Toast / notification container (fixed) */}
        <AnimatePresence>
          {toast && (
            <div className="fixed bottom-8 left-6 z-50 pointer-events-none">
              <motion.div
                key={toast}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-auto bg-card/80 border border-primary/20 text-sm text-foreground px-4 py-2 rounded-lg shadow-2xl shadow-primary/20 backdrop-blur-md"
              >
                {toast}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Login;
