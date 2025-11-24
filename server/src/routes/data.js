import express from 'express';
import { authMiddleware } from '../auth.js';
import { runAsync, allAsync, getAsync } from '../database.js';

const router = express.Router();

// Get all moods for user
router.get('/moods', authMiddleware, async (req, res) => {
  try {
    const moods = await allAsync(
      'SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(moods);
  } catch (err) {
    console.error('Error fetching moods:', err);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// Save mood
router.post('/moods', authMiddleware, async (req, res) => {
  try {
    const { mood, intensity, notes } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const result = await runAsync(
      'INSERT INTO moods (user_id, mood, intensity, notes) VALUES (?, ?, ?, ?)',
      [req.userId, mood, intensity || null, notes || null]
    );

    res.json({ id: result.lastID, user_id: req.userId, mood, intensity, notes, created_at: new Date().toISOString() });
  } catch (err) {
    console.error('Error saving mood:', err);
    res.status(500).json({ error: 'Failed to save mood' });
  }
});

// Get all journal entries for user
router.get('/journal', authMiddleware, async (req, res) => {
  try {
    const entries = await allAsync(
      'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(entries);
  } catch (err) {
    console.error('Error fetching journal:', err);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Save journal entry
router.post('/journal', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await runAsync(
      'INSERT INTO journal_entries (user_id, title, content) VALUES (?, ?, ?)',
      [req.userId, title || '', content]
    );

    res.json({ id: result.lastID, user_id: req.userId, title, content, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  } catch (err) {
    console.error('Error saving journal:', err);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
});

// Update journal entry
router.put('/journal/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    await runAsync(
      'UPDATE journal_entries SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [title || '', content, id, req.userId]
    );

    const entry = await getAsync('SELECT * FROM journal_entries WHERE id = ? AND user_id = ?', [id, req.userId]);
    res.json(entry);
  } catch (err) {
    console.error('Error updating journal:', err);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

export default router;
