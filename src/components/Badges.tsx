import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Award, Star, Zap, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import { loadMoods } from '../lib/storage';
import { Mood } from '../types';

interface Badge {
    id: string;
    icon: React.ReactNode;
    titleKey: string;
    descKey: string;
    condition: (moods: Mood[]) => boolean;
}

const badges: Badge[] = [
    {
        id: 'first_step',
        icon: <Star size={24} />,
        titleKey: 'badges.first_step',
        descKey: 'badges.first_step_desc',
        condition: (moods) => moods.length >= 1,
    },
    {
        id: 'streak_3',
        icon: <Zap size={24} />,
        titleKey: 'badges.streak_3',
        descKey: 'badges.streak_3_desc',
        condition: (moods) => {
            // Simplified streak check: just check if there are 3 entries
            // In a real app, we'd check consecutive dates
            return moods.length >= 3;
        },
    },
    {
        id: 'week_warrior',
        icon: <Shield size={24} />,
        titleKey: 'badges.week_warrior',
        descKey: 'badges.week_warrior_desc',
        condition: (moods) => moods.length >= 7,
    },
    {
        id: 'zen_master',
        icon: <Heart size={24} />,
        titleKey: 'badges.zen_master',
        descKey: 'badges.zen_master_desc',
        condition: (moods) => moods.filter(m => m.emotion === 'Calm').length >= 5,
    },
];

const Badges = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            const moods = loadMoods(user.name) as Mood[];
            const unlocked = badges.filter(b => b.condition(moods)).map(b => b.id);
            setUnlockedBadges(unlocked);
        }
    }, [user]);

    return (
        <Card>
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award className="text-accent" /> {t('badges.title') || 'Achievements'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map((badge) => {
                    const isUnlocked = unlockedBadges.includes(badge.id);
                    return (
                        <motion.div
                            key={badge.id}
                            className={`flex flex-col items-center text-center p-3 rounded-xl border ${isUnlocked
                                ? 'bg-primary/10 border-primary/30 text-foreground'
                                : 'bg-black/10 border-white/5 text-secondary grayscale opacity-50'
                                }`}
                            whileHover={isUnlocked ? { scale: 1.05 } : {}}
                        >
                            <div className={`p-3 rounded-full mb-2 ${isUnlocked ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-500'}`}>
                                {badge.icon}
                            </div>
                            <h3 className="font-bold text-sm">{t(badge.titleKey) || badge.id}</h3>
                            <p className="text-xs text-secondary mt-1">{t(badge.descKey) || 'Unlock to see'}</p>
                        </motion.div>
                    );
                })}
            </div>
        </Card>
    );
};

export default Badges;
