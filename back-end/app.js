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
// HELPER FUNCTION TO SAFELY LOAD ROUTES
// =========================
const loadRoute = (filePath, routeName) => {
  try {
    const route = require(filePath);
    if (!route || typeof route !== 'function') {
      console.warn(`⚠️ WARNING: Route "${routeName}" is not a valid express router. File: ${filePath}`);
      return null;
    }
    return route;
  } catch (err) {
    console.warn(`⚠️ WARNING: Failed to load route "${routeName}". File: ${filePath}. Error: ${err.message}`);
    return null;
  }
};

// =========================
// ROUTES
// =========================
const authRoute = loadRoute('./routes/auth', 'auth');
if (authRoute) app.use('/api/auth', authRoute);

const documentsRoute = loadRoute('./routes/documents', 'documents');
if (documentsRoute) app.use('/api/documents', documentsRoute);

const dashboardRoute = loadRoute('./routes/dashboard', 'dashboard');
if (dashboardRoute) app.use('/api/dashboard', dashboardRoute);

const internEvaluationsRoute = loadRoute('./routes/InternEvaluations', 'InternEvaluations');
if (internEvaluationsRoute) app.use('/api/intern-evaluations', internEvaluationsRoute);

const adviserRoute = loadRoute('./routes/adviser', 'adviser');
if (adviserRoute) app.use('/api/adviser', adviserRoute);

const internInDashboardRoute = loadRoute('./routes/internInDashboardRoutes', 'internInDashboardRoutes');
if (internInDashboardRoute) app.use('/api/auth', internInDashboardRoute);

const internListRoute = loadRoute('./routes/internList', 'internList');
if (internListRoute) app.use('/api/reports', internListRoute);

const hteListRoute = loadRoute('./routes/hteList', 'hteList');
if (hteListRoute) app.use('/api/reports', hteListRoute);

const internAssignedRoute = loadRoute('./routes/internAssignedToHTE', 'internAssignedToHTE');
if (internAssignedRoute) app.use('/api/reports', internAssignedRoute);

const internSubmittedRoute = loadRoute('./routes/internSubmittedDocuments', 'internSubmittedDocuments');
if (internSubmittedRoute) app.use('/api/reports', internSubmittedRoute);

const adviserListRoute = loadRoute('./routes/adviserList', 'adviserList');
if (adviserListRoute) app.use('/api/reports', adviserListRoute);

const internEvalReportRoute = loadRoute('./routes/internEvaluationReport', 'internEvaluationReport');
if (internEvalReportRoute) app.use('/api/reports', internEvalReportRoute);

const forgotPasswordRoute = loadRoute('./routes/forgotPasswordRoutes', 'forgotPasswordRoutes');
if (forgotPasswordRoute) app.use('/api/forgot-password', forgotPasswordRoute);

const hteEvaluationsRoute = loadRoute('./routes/HTEEvaluations', 'HTEEvaluations');
if (hteEvaluationsRoute) app.use('/api/hte-evaluations', hteEvaluationsRoute);

const supervisorEvaluationsRoute = loadRoute('./routes/SupervisorEvaluations', 'SupervisorEvaluations');
if (supervisorEvaluationsRoute) app.use('/api/supervisor-evaluations', supervisorEvaluationsRoute);

// =========================
// DAILY LOG ROUTE (FORCED LOAD)
// =========================
const internDailyLogRoutes = loadRoute(
  path.join(__dirname, 'routes', 'internDailyLogRoutes.js'),
  'internDailyLogRoutes',
);
if (internDailyLogRoutes) app.use('/api', internDailyLogRoutes);

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
