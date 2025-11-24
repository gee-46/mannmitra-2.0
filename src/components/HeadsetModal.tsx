import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, X } from 'lucide-react';

interface HeadsetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HeadsetModal = ({ isOpen, onClose }: HeadsetModalProps) => {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-card backdrop-blur-xl border border-primary/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-secondary hover:text-foreground transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-6 flex justify-center">
                            <div className="p-4 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
                                <Headphones size={48} className="text-primary" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            {t('headset_modal.title') || 'Use Headphones'}
                        </h2>

                        <p className="text-secondary mb-8 text-lg">
                            {t('headset_modal.description') || 'For the best immersive experience, please connect your headphones.'}
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg shadow-primary/20"
                        >
                            {t('headset_modal.continue') || 'Continue'}
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HeadsetModal;
