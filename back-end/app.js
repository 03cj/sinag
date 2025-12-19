/* eslint-env node */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const sequelize = require('./config/db');

// =========================
// LOAD MODELS (REQUIRED FOR SYNC)
// =========================
const User = require('./models/user');
const Company = require('./models/company');
const Intern = require('./models/interns');
const InternDocs = require('./models/interndocs');

// =========================
// LOAD ROUTES
// =========================
const authRoutes = require('./routes/auth');
const documentsRoutes = require('./routes/documents');
const dashboardRoutes = require('./routes/dashboard');

// =========================
// INIT APP
// =========================
const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// GLOBAL MIDDLEWARES
// =========================
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  }),
);
app.use(express.json());
app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'dev' : 'tiny'));

// =========================
// STATIC FILES
// =========================
// Access uploads via: http://localhost:5000/uploads/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================
// ROUTES (NO authMiddleware HERE)
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// =========================
// HEALTH CHECK
// =========================
app.get('/', (req, res) => {
  res.json({ message: 'pup-sinag backend running' });
});

// =========================
// ERROR HANDLER (LAST)
// =========================
app.use((err, req, res, next) => {
  console.error('❌ SERVER ERROR:', err);
  res.status(err?.status || 500).json({
    message: err?.message || 'Server error',
  });
});

// =========================
// MODEL ASSOCIATIONS
// =========================

// Intern ↔ User
Intern.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
User.hasOne(Intern, {
  foreignKey: 'user_id',
});

// Intern ↔ Company (HTE)
Intern.belongsTo(Company, {
  foreignKey: 'company_id',
  onDelete: 'SET NULL',
});
Company.hasMany(Intern, {
  foreignKey: 'company_id',
});

// InternDocs ↔ User
InternDocs.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
User.hasMany(InternDocs, {
  foreignKey: 'user_id',
});

// =========================
// SYNC DB & START SERVER
// =========================
console.log('🚀 Starting server and syncing DB...');
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync DB:', err);
    process.exit(1);
  });
