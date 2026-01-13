/* eslint-env node */
require('dotenv').config();
const Sequelize = require('sequelize');

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
// LOAD MODELS
// (NO associations inside model files)
// =========================
const User = require('./models/user');
const Company = require('./models/company');
const Intern = require('./models/interns');
const InternDocuments = require('./models/InternDocuments');

// =========================
// LOAD EVALUATION MODELS (FACTORY STYLE)
// =========================
const InternEvaluation = require('./models/InternEvaluation')(sequelize, Sequelize.DataTypes);
const InternEvaluationItem = require('./models/InternEvaluationItem')(sequelize, Sequelize.DataTypes);

// =========================
// DEFINE ASSOCIATIONS (ONLY HERE)
// =========================

// Intern ↔ User
Intern.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.hasOne(Intern, {
  foreignKey: 'user_id',
});

// Intern ↔ Company (HTE)
Intern.belongsTo(Company, {
  foreignKey: 'company_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Company.hasMany(Intern, {
  foreignKey: 'company_id',
});

// Intern ↔ Documents
Intern.hasOne(InternDocuments, {
  foreignKey: 'intern_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

InternDocuments.belongsTo(Intern, {
  foreignKey: 'intern_id',
});

// InternEvaluation ↔ InternEvaluationItem
InternEvaluation.hasMany(InternEvaluationItem, {
  foreignKey: 'evaluationId',
  onDelete: 'CASCADE',
});

InternEvaluationItem.belongsTo(InternEvaluation, {
  foreignKey: 'evaluationId',
});

// =========================
// LOAD ROUTES
// =========================
const authRoutes = require('./routes/auth');
const documentsRoutes = require('./routes/documents');
const dashboardRoutes = require('./routes/dashboard');
const evaluationRoutes = require('./routes/evaluations');

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
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// =========================
// STATIC FILES
// =========================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      }
    },
  }),
);

// =========================
// ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Forgot Password Routes
app.use('/api/forgot-password', require('./routes/forgotPasswordRoutes'));

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
  .sync({ alter: true }) // DEV MODE: creates missing tables & FKs
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB Sync failed:', err);
    process.exit(1);
  });
