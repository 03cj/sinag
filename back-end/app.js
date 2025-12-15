/* eslint-env node */
// Server bootstrap for pup-sinag backend (modularized)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const documentsRoutes = require('./routes/documents');

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

// ⭐ SERVE UPLOADED FILES PUBLICLY
// This allows you to access PDFs via http://localhost:5000/uploads/library/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'pup-sinag backend running' }));

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err?.status || 500).json({
    message: err?.message || 'Server error',
  });
});

// Sync DB and start server
console.log('Starting server and syncing DB...');
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
