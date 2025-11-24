import { NavLink } from 'react-router-dom';
import { Home, BarChart3, MessageSquare, BrainCircuit, PlayCircle, BookText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: Home, labelKey: 'nav.dashboard' },
  { path: '/mood-tracker', icon: BarChart3, labelKey: 'nav.mood_tracker' },
  { path: '/chat', icon: MessageSquare, labelKey: 'nav.chat' },
  { path: '/journal', icon: BookText, labelKey: 'nav.journal' },
  { path: '/media', icon: PlayCircle, labelKey: 'nav.media' },
  { path: '/mindfulness', icon: BrainCircuit, labelKey: 'nav.mindfulness' },
];

const BottomNav = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-50">
      <div className="bg-card backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-primary/10">
        <div className="mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-full text-sm transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-secondary hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{t(item.labelKey)}</span>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1.5 w-2 h-2 bg-primary rounded-full"
                      layoutId="active-indicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
