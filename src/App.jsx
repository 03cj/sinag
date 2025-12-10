import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';

import Login from './Components/LogIn';
import SignUp from './Components/SignUp';
import Layout from './Pages/layout/layout';
import NoPageFound from './Pages/NoPageFound';

import AdviserLayout from './Pages/layout/AdviserLayout';
import CoordinatorLayout from './Pages/layout/CoordinatorLayout';
import InternLayout from './Pages/layout/InternLayout';
import SupervisorLayout from './Pages/layout/SupervisorLayout';

import AddNewCompany from './Pages/CoordinatorPages/AddNewCompany';
import AdviserC from './Pages/CoordinatorPages/AdviserC';
import CompaniesC from './Pages/CoordinatorPages/CompaniesC';
import DashboardC from './Pages/CoordinatorPages/DashboardC';
import InternC from './Pages/CoordinatorPages/InternC';
import ProfileC from './Pages/CoordinatorPages/ProfileC';
import ReportsC from './Pages/CoordinatorPages/ReportsC';

import AddIntern from './Pages/AdviserPages/AddIntern';
import CompaniesA from './Pages/AdviserPages/CompaniesA';
import DashboardA from './Pages/AdviserPages/DashboardA';
import InternA from './Pages/AdviserPages/InternA';
import ProfileA from './Pages/AdviserPages/ProfileA';
import ReportsA from './Pages/AdviserPages/ReportsA';

import HomeI from './Pages/InternPages/HomeI';
import HTE_Evaluation from './Pages/InternPages/HTE_Evaluation';
import ProfileI from './Pages/InternPages/ProfileI';
import SelfEvaluation from './Pages/InternPages/Self_Evaluation';
import SupervisorEvaluation from './Pages/InternPages/Supervisor_Evaluation';

import DashboardS from './Pages/SupervisorPages/DashboardS';
import EvaluationS from './Pages/SupervisorPages/EvaluationS';
import ProfileS from './Pages/SupervisorPages/ProfileS';

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<NoPageFound />} />

      <Route path="/pup-sinag" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />

        {/* COORDINATOR ROUTES */}
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
          <Route path="companies" element={<CompaniesC />} />
          <Route path="newcompany" element={<AddNewCompany />} />
          <Route path="reports" element={<ReportsC />} />
          <Route path="profile" element={<ProfileC />} />
        </Route>

        {/* ADVISER ROUTES */}
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
          <Route path="reports" element={<ReportsA />} />
          <Route path="companies" element={<CompaniesA />} />
          <Route path="addIntern" element={<AddIntern />} />
          <Route path="library" element={<ReportsA />} />
          <Route path="profile" element={<ProfileA />} />
        </Route>

        {/* INTERN ROUTES */}
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
          {/* } <Route path="documents" element={<Documents />} /> */}
          <Route path="profile" element={<ProfileI />} />
          <Route path="evaluation" element={<HTE_Evaluation />} />
          <Route path="self-evaluation" element={<SelfEvaluation />} />
          <Route path="supervisor-evaluation" element={<SupervisorEvaluation />} />
        </Route>

        {/* SUPERVISOR ROUTES */}
        <Route path="supervisor" element={<ProtectedRoute allowedRoles={['supervisor']} />}>
          <Route element={<SupervisorLayout />}>
            <Route index element={<DashboardS />} />
            <Route path="dashboard" element={<DashboardS />} />
            <Route path="evaluation/:studNo" element={<EvaluationS />} />
            <Route path="profile" element={<ProfileS />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
