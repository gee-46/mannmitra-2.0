import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initializeDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    app.listen(PORT, () => {
      console.log(`\n✓ MannMitra Backend running on http://localhost:${PORT}`);
      console.log(`  API: http://localhost:${PORT}/api`);
      console.log(`  Health: http://localhost:${PORT}/health\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
