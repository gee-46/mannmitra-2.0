import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../auth.js';
import { getAsync, runAsync } from '../database.js';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check if user already exists
    const existing = await getAsync('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(409).json({ error: 'user_exists' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const result = await runAsync(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash]
    );

    const token = generateToken(result.lastID);
    res.json({ id: result.lastID, username, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user
    const user = await getAsync('SELECT id, username, password_hash FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'login_failed' });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'login_failed' });
    }

    const token = generateToken(user.id);
    res.json({ id: user.id, username: user.username, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
