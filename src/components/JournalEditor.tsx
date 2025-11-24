import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mic, MicOff, Save, X } from 'lucide-react';
import { JournalEntry } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface JournalEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
  onClose: () => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ entry, onSave, onClose }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState(entry?.content || '');
  const { isListening, transcript, startListening, stopListening, hasRecognitionSupport, error } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setContent(prev => prev + (prev.length > 0 ? ' ' : '') + transcript);
    }
  }, [transcript]);

  const handleSave = () => {
    const newEntry: JournalEntry = {
      id: entry?.id || new Date().toISOString(),
      date: entry?.date || new Date().toISOString(),
      content: content,
    };
    onSave(newEntry);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-card border border-white/10 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl shadow-primary/10"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-foreground">
            {entry ? t('journal_page.editor_title_edit') : t('journal_page.editor_title_new')}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </header>
        <div className="flex-grow p-4 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('journal_page.placeholder')}
            className="w-full h-full bg-transparent text-foreground placeholder:text-secondary resize-none focus:outline-none text-lg leading-relaxed"
          />
        </div>
        <footer className="flex items-center justify-between p-4 border-t border-white/10">
          <div>
            {hasRecognitionSupport ? (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                <span className="text-sm font-semibold">{isListening ? t('journal_page.stop_listening') : t('journal_page.start_listening')}</span>
                {isListening && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
              </button>
            ) : (
              <p className="text-xs text-secondary">{t('journal_page.voice_not_supported')}</p>
            )}
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-primary text-primary-foreground font-bold py-2 px-6 rounded-full hover:bg-primary/90 transition-colors transform hover:scale-105"
          >
            <Save size={20} />
            <span>{t('journal_page.save')}</span>
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default JournalEditor;
