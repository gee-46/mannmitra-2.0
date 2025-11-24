import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, Palette, Moon, Sun, Leaf } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { saveMoods, loadMoods, saveJournalEntries, loadJournalEntries } from '../lib/storage';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if (!user) return;
        const data = {
            moods: loadMoods(user.name),
            journal: loadJournalEntries(user.name),
            theme,
            // Add other data here if needed
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mannmitra-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (user) {
                    if (data.moods) {
                        saveMoods(user.name, data.moods);
                    }
                    if (data.journal) {
                        saveJournalEntries(user.name, data.journal);
                    }
                }
                if (data.theme) {
                    setTheme(data.theme);
                }
                alert('Data imported successfully! Please refresh the page.');
                window.location.reload();
            } catch (err) {
                alert('Failed to import data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-11/12 max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-foreground">Settings</h2>
                            <button onClick={onClose} className="text-secondary hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Theme Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
                                    <Palette size={16} /> Appearance
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setTheme('ocean')}
                                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${theme === 'ocean'
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : 'bg-black/20 border-transparent text-secondary hover:bg-black/30'
                                            }`}
                                    >
                                        <Moon size={24} className="mb-2" />
                                        <span className="text-xs">Ocean</span>
                                    </button>
                                    <button
                                        onClick={() => setTheme('nature')}
                                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${theme === 'nature'
                                            ? 'bg-green-500/20 border-green-500 text-green-500'
                                            : 'bg-black/20 border-transparent text-secondary hover:bg-black/30'
                                            }`}
                                    >
                                        <Leaf size={24} className="mb-2" />
                                        <span className="text-xs">Nature</span>
                                    </button>
                                    <button
                                        onClick={() => setTheme('sunset')}
                                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${theme === 'sunset'
                                            ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                                            : 'bg-black/20 border-transparent text-secondary hover:bg-black/30'
                                            }`}
                                    >
                                        <Sun size={24} className="mb-2" />
                                        <span className="text-xs">Sunset</span>
                                    </button>
                                </div>
                            </div>

                            {/* Data Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
                                    <Download size={16} /> Data Management
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleExport}
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-black/20 hover:bg-black/30 text-foreground transition-colors border border-white/10"
                                    >
                                        <Download size={18} />
                                        Export Data
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-black/20 hover:bg-black/30 text-foreground transition-colors border border-white/10"
                                    >
                                        <Upload size={18} />
                                        Import Data
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImport}
                                        accept=".json"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => {
                                            logout();
                                            onClose();
                                            window.location.href = '/login';
                                        }}
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500 transition-colors border border-red-500/30 mt-4"
                                    >
                                        <Download size={18} className="rotate-90" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
