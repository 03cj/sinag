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
const HTEEvaluation = require('./models/HTEEvaluation');
const SupervisorEvaluation = require('./models/SupervisorEvaluation')(sequelize, Sequelize.DataTypes);
const SupervisorEvaluationItem = require('./models/SupervisorEvaluationItem')(sequelize, Sequelize.DataTypes);

// =========================
// LOAD EVALUATION MODELS (FACTORY STYLE)
// =========================
const InternEvaluation = require('./models/InternEvaluation')(sequelize, Sequelize.DataTypes);
const InternEvaluationItem = require('./models/InternEvaluationItem')(sequelize, Sequelize.DataTypes);

// =========================
// DEFINE ASSOCIATIONS (ONLY HERE)
// =========================
// SupervisorEvaluation ↔ SupervisorEvaluationItem
SupervisorEvaluation.hasMany(SupervisorEvaluationItem, {
  foreignKey: 'evaluationId',
  onDelete: 'CASCADE',
});

SupervisorEvaluationItem.belongsTo(SupervisorEvaluation, {
  foreignKey: 'evaluationId',
});

// SupervisorEvaluation ↔ Intern
Intern.hasMany(SupervisorEvaluation, {
  foreignKey: 'intern_id',
});

SupervisorEvaluation.belongsTo(Intern, {
  foreignKey: 'intern_id',
});

// SupervisorEvaluation ↔ Company
Company.hasMany(SupervisorEvaluation, {
  foreignKey: 'company_id',
});

SupervisorEvaluation.belongsTo(Company, {
  foreignKey: 'company_id',
});

// SupervisorEvaluation ↔ User (Supervisor)
User.hasMany(SupervisorEvaluation, {
  foreignKey: 'supervisor_id',
});

SupervisorEvaluation.belongsTo(User, {
  foreignKey: 'supervisor_id',
});

// HTEEvaluation ↔ Intern
Intern.hasMany(HTEEvaluation, {
  foreignKey: 'intern_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

HTEEvaluation.belongsTo(Intern, {
  foreignKey: 'intern_id',
});

// HTEEvaluation ↔ Company
Company.hasMany(HTEEvaluation, {
  foreignKey: 'company_id',
});

HTEEvaluation.belongsTo(Company, {
  foreignKey: 'company_id',
});

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
const internEvaluationRoutes = require('./routes/InternEvaluations');

// =========================
// INIT EXPRESS
// =========================
const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// GLOBAL MIDDLEWARES
// =========================
app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:5173', // Vite frontend
    credentials: true, // ✅ REQUIRED
  }),
);

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
app.use('/api/intern-evaluations', internEvaluationRoutes);
app.use('/api/adviser', require('./routes/adviser'));

// Forgot Password Routes
app.use('/api/forgot-password', require('./routes/forgotPasswordRoutes'));

// HTE Evaluations Routes
app.use('/api/hte-evaluations', require('./routes/HTEEvaluations'));

// Supervisor Evaluations Routes
app.use('/api/supervisor-evaluations', require('./routes/SupervisorEvaluations'));

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
