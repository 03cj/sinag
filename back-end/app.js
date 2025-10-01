/* eslint-env node */
// Server bootstrap for pup-sinag backend (modularized)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  }),
);
app.use(express.json());
app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'dev' : 'tiny'));

// Mount routes
app.use('/api/auth', authRoutes);

// Health
app.get('/', (req, res) => res.json({ message: 'pup-sinag backend running' }));

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({ message: err && err.message ? err.message : 'Server error' });
});

// Sync DB and start
console.log('Starting server and syncing DB...');
// Attempt to authenticate first to get a clear error if DB credentials are wrong
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync DB:', err);
    process.exit(1);
  });
