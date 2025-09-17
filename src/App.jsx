import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './Pages/layout/layout';
import NoPageFound from './Pages/NoPageFound';

import Login from './Components/LogIn';
import SignUp from './Components/SignUp';

import CoordinatorLayout from './Pages/layout/CoordinatorLayout';

import AdviserC from './Pages/CoordinatorPages/AdviserC';
import CompaniesC from './Pages/CoordinatorPages/CompaniesC';
import AddNewCompany from './Pages/CoordinatorPages/AddNewCompany';
import DashboardC from './Pages/CoordinatorPages/DashboardC';
import InternC from './Pages/CoordinatorPages/InternC';
import ReportsC from './Pages/CoordinatorPages/ReportsC';
import ProfileC from './Pages/CoordinatorPages/ProfileC';

import AdviserLayout from './Pages/layout/AdviserLayout';

import AddIntern from './Pages/AdviserPages/AddIntern';
import CompaniesA from './Pages/AdviserPages/CompaniesA';
import DashboardA from './Pages/AdviserPages/DashboardA';
import InternA from './Pages/AdviserPages/InternA';
import ReportsA from './Pages/AdviserPages/ReportsA';
import ProfileA from './Pages/AdviserPages/ProfileA';

import InternLayout from './Pages/layout/InternLayout';

import HomeI from './Pages/InternPages/HomeI';
import Documents from './Pages/InternPages/Documents';
import ProfileI from './Pages/InternPages/ProfileI';

import SupervisorLayout from './Pages/layout/SupervisorLayout';

import DashboardS from './Pages/SupervisorPages/DashboardS';
import EvaluationS from './Pages/SupervisorPages/EvaluationS';
import ProfileS from './Pages/SupervisorPages/ProfileS';

export default function App() {
  return (
    <>
      <Routes>
        <Route path='*' element={<NoPageFound />} />

        <Route path='/pup-sinag' element={<Layout />}>
  
         <Route index element={<Login />} />
          <Route path='sign-up/:role' element={<SignUp />} />

          {/* Coordinator Routes */}
          <Route path="coordinator" element={<CoordinatorLayout />}>
          <Route index element={<DashboardC />} />
            <Route path="dashboard" element={<DashboardC />} />
            <Route path="adviser" element={<AdviserC />} />
            <Route path="interns" element={<InternC />} />
            <Route path="companies" element={<CompaniesC />} />
            <Route path="newcompany" element={<AddNewCompany />} />
            <Route path="reports" element={<ReportsC />} />
            <Route path="profile" element={<ProfileC />} />
          </Route>
           {/* Adviser Routes */}
          <Route path='adviser' element={<AdviserLayout />}>
          <Route index element={<DashboardA />} />
            <Route path="dashboard" element={<DashboardA />} />
            <Route path="interns" element={<InternA />} />
            <Route path="reports" element={<ReportsA />} />
            <Route path="companies" element={<CompaniesA />} />
            <Route path="addIntern" element={<AddIntern />} />
            <Route path="profile" element={<ProfileA />} />
          </Route>

           {/* Intern Routes */}
          <Route path='intern' element={<InternLayout />}>
          <Route index element={<HomeI />} />
            <Route path="home" element={<HomeI />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<ProfileI />} />
          </Route>

           {/* Supervisor Routes */}
           <Route path='supervisor' element={<SupervisorLayout />}>
            <Route path="dashboard" element={<DashboardS />} />
            <Route path="evaluation" element={<EvaluationS />} />
            <Route path="profile" element={<ProfileS />} />
          </Route>

        </Route>
    </Routes>
      
    </>
  );
}