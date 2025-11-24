import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import PageWrapper from '../components/PageWrapper';
import DailyAffirmation from '../components/DailyAffirmation';
import { Wind, Gamepad2, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

import HeadsetModal from '../components/HeadsetModal';
import { useState, useEffect } from 'react';

const Mindfulness = () => {
  const { t } = useTranslation();
  const [showHeadsetModal, setShowHeadsetModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenHeadsetModal');
    if (!hasSeenModal) {
      setShowHeadsetModal(true);
      localStorage.setItem('hasSeenHeadsetModal', 'true');
    }
  }, []);

  return (
    <PageWrapper>
      <HeadsetModal isOpen={showHeadsetModal} onClose={() => setShowHeadsetModal(false)} />
      <div className="py-6 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">{t('mindfulness_page.title')}</h1>

        <div className="space-y-6">
          <Link to="/mindfulness/breathing">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="flex items-center space-x-6 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <Wind className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{t('breathing_exercise')}</h3>
                  <p className="text-sm text-secondary">Find your calm in 5 minutes</p>
                </div>
              </Card>
            </motion.div>
          </Link>

          <Link to="/mindfulness/pmr">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="flex items-center space-x-6 hover:border-green-500/50 transition-all duration-300 cursor-pointer">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <Dumbbell className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{t('pmr_page.title')}</h3>
                  <p className="text-sm text-secondary">{t('pmr_page.description')}</p>
                </div>
              </Card>
            </motion.div>
          </Link>

          <Link to="/mindfulness/snake">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="flex items-center space-x-6 hover:border-green-500/50 transition-all duration-300 cursor-pointer">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <Gamepad2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{t('mindfulness_page.snake_game')}</h3>
                  <p className="text-sm text-secondary">{t('mindfulness_page.snake_game_desc')}</p>
                </div>
              </Card>
            </motion.div>
          </Link>

          <DailyAffirmation />

        </div>
      </div>
    </PageWrapper>
  );
};

export default Mindfulness;
