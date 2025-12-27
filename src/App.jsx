import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';

/* =========================
   PUBLIC PAGES (NO HEADER)
========================= */
import Login from './Components/LogIn';
import SignUp from './Components/SignUp';
import NoPageFound from './Pages/NoPageFound';

/* =========================
   MAIN LAYOUT (WITH HEADER)
========================= */
import Layout from './Pages/layout/Layout';

/* =========================
   ROLE LAYOUTS
========================= */
import AdviserLayout from './Pages/layout/AdviserLayout';
import CoordinatorLayout from './Pages/layout/CoordinatorLayout';
import InternLayout from './Pages/layout/InternLayout';
import SupervisorLayout from './Pages/layout/SupervisorLayout';

/* =========================
   SUPER ADMIN
========================= */
import AddCoordinator from './Pages/AddCoordinator';

/* =========================
   COORDINATOR PAGES
========================= */
import AddNewCompany from './Pages/CoordinatorPages/AddNewCompany';
import AdviserC from './Pages/CoordinatorPages/AdviserC';
import DashboardC from './Pages/CoordinatorPages/DashboardC';
import HTEC from './Pages/CoordinatorPages/HTEC';
import InternC from './Pages/CoordinatorPages/InternC';
import ProfileC from './Pages/CoordinatorPages/ProfileC';
import ReportsC from './Pages/CoordinatorPages/ReportsC';

/* =========================
   ADVISER PAGES
========================= */
import AddIntern from './Pages/AdviserPages/AddIntern';
import DashboardA from './Pages/AdviserPages/DashboardA';
import HTEA from './Pages/AdviserPages/HTEA';
import InternA from './Pages/AdviserPages/InternA';
import ProfileA from './Pages/AdviserPages/ProfileA';
import ReportsA from './Pages/AdviserPages/ReportsA';

/* =========================
   INTERN PAGES
========================= */
import Documents from './Pages/InternPages/Documents';
import HomeI from './Pages/InternPages/HomeI';
import HTE_Evaluation from './Pages/InternPages/HTE_Evaluation';
import ProfileI from './Pages/InternPages/ProfileI';
import SelfEvaluation from './Pages/InternPages/Self_Evaluation';
import SupervisorEvaluation from './Pages/InternPages/Supervisor_Evaluation';

/* =========================
   SUPERVISOR PAGES
========================= */
import DashboardS from './Pages/SupervisorPages/DashboardS';
import EvaluationS from './Pages/SupervisorPages/EvaluationS';
import ProfileS from './Pages/SupervisorPages/ProfileS';

export default function App() {
  return (
    <Routes>
      {/* =====================================
          PUBLIC ROUTES (NO HEADER)
      ===================================== */}
      <Route path="/" element={<Login />} />
      <Route path="/pup-sinag" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* =====================================
          SUPER ADMIN (NO MAIN LAYOUT)
      ===================================== */}
      <Route
        path="/pup-sinag/superadmin"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <AddCoordinator />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED ROUTES (WITH HEADER)
      ===================================== */}
      <Route path="/pup-sinag" element={<Layout />}>
        {/* ---------- COORDINATOR ---------- */}
        <Route
          path="coordinator"
          element={
            <ProtectedRoute allowedRoles={['coordinator']}>
              <CoordinatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardC />} />
          <Route path="dashboard" element={<DashboardC />} />
          <Route path="adviser" element={<AdviserC />} />
          <Route path="interns" element={<InternC />} />
          <Route path="HTE" element={<HTEC />} />
          <Route path="newcompany" element={<AddNewCompany />} />
          <Route path="reports" element={<ReportsC />} />
          <Route path="profile" element={<ProfileC />} />
        </Route>

        {/* ---------- ADVISER ---------- */}
        <Route
          path="adviser"
          element={
            <ProtectedRoute allowedRoles={['adviser']}>
              <AdviserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardA />} />
          <Route path="dashboard" element={<DashboardA />} />
          <Route path="interns" element={<InternA />} />
          <Route path="HTE" element={<HTEA />} />
          <Route path="addIntern" element={<AddIntern />} />
          <Route path="reports" element={<ReportsA />} />
          <Route path="profile" element={<ProfileA />} />
        </Route>

        {/* ---------- INTERN ---------- */}
        <Route
          path="intern"
          element={
            <ProtectedRoute allowedRoles={['intern']}>
              <InternLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeI />} />
          <Route path="home" element={<HomeI />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<ProfileI />} />
          <Route path="evaluation" element={<HTE_Evaluation />} />
          <Route path="self-evaluation" element={<SelfEvaluation />} />
          <Route path="supervisor-evaluation" element={<SupervisorEvaluation />} />
        </Route>

        {/* ---------- SUPERVISOR ---------- */}
        <Route
          path="supervisor"
          element={
            <ProtectedRoute allowedRoles={['supervisor']}>
              <SupervisorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardS />} />
          <Route path="dashboard" element={<DashboardS />} />
          <Route path="evaluation/:studNo" element={<EvaluationS />} />
          <Route path="profile" element={<ProfileS />} />
        </Route>
      </Route>

      {/* =====================================
          404 (MUST BE LAST)
      ===================================== */}
      <Route path="*" element={<NoPageFound />} />
    </Routes>
  );
}
