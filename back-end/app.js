/* eslint-env node */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// =========================
// LOAD DATABASE + MODELS
// =========================
const db = require('./models');
const { sequelize } = db;

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
    credentials: true,
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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/intern-evaluations', require('./routes/InternEvaluations'));
app.use('/api/adviser', require('./routes/adviser'));

app.use('/api/reports', require('./routes/internList'));
app.use('/api/reports', require('./routes/hteList'));
app.use('/api/reports', require('./routes/internAssignedToHTE'));
app.use('/api/reports', require('./routes/internSubmittedDocuments'));
app.use('/api/reports', require('./routes/adviserList'));
app.use('/api/reports', require('./routes/internEvaluationReport'));

app.use('/api/forgot-password', require('./routes/forgotPasswordRoutes'));
app.use('/api/hte-evaluations', require('./routes/HTEEvaluations'));
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
// START SERVER
// =========================
console.log('🚀 Starting backend...');

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync(); // no alter, no force
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  });
