/* eslint-env node */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// =========================
// DATABASE
// =========================
const sequelize = require('./config/database');

// =========================
// LOAD MODELS FIRST (REQUIRED)
// =========================
const User = require('./models/user');
const Company = require('./models/company');
const Intern = require('./models/interns');
const InternDocs = require('./models/interndocs');

// =========================
// DEFINE ASSOCIATIONS (🔥 CRITICAL 🔥)
// =========================

// Intern ↔ User
Intern.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
  constraints: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.hasOne(Intern, {
  foreignKey: 'user_id',
  constraints: true,
});

// Intern ↔ Company (HTE)
Intern.belongsTo(Company, {
  foreignKey: {
    name: 'company_id',
    allowNull: true,
  },
  constraints: true,
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Company.hasMany(Intern, {
  foreignKey: 'company_id',
  constraints: true,
});

// InternDocs ↔ User
InternDocs.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
  constraints: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.hasMany(InternDocs, {
  foreignKey: 'user_id',
  constraints: true,
});

// =========================
// LOAD ROUTES
// =========================
const authRoutes = require('./routes/auth');
const documentsRoutes = require('./routes/documents');
const dashboardRoutes = require('./routes/dashboard');

// =========================
// INIT EXPRESS
// =========================
const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// GLOBAL MIDDLEWARES
// =========================
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// =========================
// STATIC FILES
// =========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================
// ROUTES
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
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// =========================
// SYNC DATABASE & START SERVER
// =========================
console.log('🚀 Starting backend and syncing database...');

sequelize
  .sync() // ❗ Safe for dev | use migrations in prod
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB Sync failed:', err);
    process.exit(1);
  });
