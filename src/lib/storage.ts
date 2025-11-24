import { Mood, JournalEntry } from '../types';

const MOODS_KEY_PREFIX = 'mm_moods_';
const JOURNAL_KEY_PREFIX = 'mm_journal_';

export const loadMoods = (userId: string): Mood[] => {
  try {
    const raw = localStorage.getItem(`${MOODS_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw) as Mood[];
  } catch (e) {
    console.error('Failed to load moods from storage', e);
    return [];
  }
};

export const saveMoods = (userId: string, moods: Mood[]) => {
  try {
    localStorage.setItem(`${MOODS_KEY_PREFIX}${userId}`, JSON.stringify(moods));
  } catch (e) {
    console.error('Failed to save moods to storage', e);
  }
};

export const loadJournalEntries = (userId: string): JournalEntry[] => {
  try {
    const raw = localStorage.getItem(`${JOURNAL_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw) as JournalEntry[];
  } catch (e) {
    console.error('Failed to load journal entries from storage', e);
    return [];
  }
};

export const saveJournalEntries = (userId: string, entries: JournalEntry[]) => {
  try {
    localStorage.setItem(`${JOURNAL_KEY_PREFIX}${userId}`, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save journal entries to storage', e);
  }
};

export default { loadMoods, saveMoods, loadJournalEntries, saveJournalEntries };
