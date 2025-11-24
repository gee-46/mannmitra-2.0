import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/ui/Card';
import { JournalEntry } from '../types';
import JournalEditor from '../components/JournalEditor';
import { useAuth } from '../hooks/useAuth';
import { loadJournalEntries, saveJournalEntries } from '../lib/storage';

const Journal = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      const stored = loadJournalEntries(user.name);
      setEntries(stored);
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && isLoaded) {
      saveJournalEntries(user.name, entries);
    }
  }, [entries, user, isLoaded]);

  const handleSaveEntry = (entry: JournalEntry) => {
    const index = entries.findIndex(e => e.id === entry.id);
    if (index > -1) {
      const updatedEntries = [...entries];
      updatedEntries[index] = entry;
      setEntries(updatedEntries);
    } else {
      setEntries([entry, ...entries]);
    }
    setIsEditorOpen(false);
    setEditingEntry(null);
  };

  const openNewEditor = () => {
    setEditingEntry(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <PageWrapper>
      <div className="py-6 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">{t('journal_page.title')}</h1>
          <motion.button
            onClick={openNewEditor}
            className="flex items-center space-x-2 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>{t('journal_page.new_entry')}</span>
          </motion.button>
        </header>

        {entries.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-16 w-16 text-secondary" />
            <p className="mt-4 text-secondary">{t('journal_page.empty_state')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => openEditEditor(entry)}
                >
                  <Card className="cursor-pointer hover:border-primary/50 transition-all duration-300">
                    <p className="text-sm font-semibold text-primary">{formatDate(entry.date)}</p>
                    <p className="text-secondary mt-2 truncate">{entry.content}</p>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <JournalEditor
            entry={editingEntry}
            onSave={handleSaveEntry}
            onClose={() => setIsEditorOpen(false)}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Journal;
