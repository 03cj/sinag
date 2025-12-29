// src/pages/Dashboard/DashboardA.jsx
import { useEffect, useState } from 'react';
import KPICard from '../../Components/KPICard';
import InternA_ from './InternA_in_dashboardA';

/* =========================
   HELPER: GET ADVISER PROGRAM
========================= */
const getAdviserProgram = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.program || payload.department || null;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

const DashboardA = () => {
  const adviserProgram = getAdviserProgram();

  const [kpiData, setKpiData] = useState({
    activeInterns: 'Loading...',
    activePrograms: 'Loading...',
    partnerHTE: 'Loading...',
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        /* =========================
           FETCH INTERN COUNTS
        ========================= */
        const [internRes, hteRes] = await Promise.all([
          fetch(`${API_BASE}/api/dashboard/programs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/dashboard/kpis`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const programData = await internRes.json();
        const kpis = await hteRes.json();

        /* =========================
           FILTER BY ADVISER PROGRAM
        ========================= */
        const adviserProgramData = programData.find(
          (p) => p.program === adviserProgram
        );

        const activeInterns = adviserProgramData
          ? adviserProgramData.count
          : 0;

        /* =========================
           KPI UPDATE
        ========================= */
        setKpiData({
          activeInterns,
          activePrograms: adviserProgram || 'N/A',
          partnerHTE: kpis.partnerHTE,
        });
      } catch (err) {
        console.error('Failed to load adviser dashboard:', err);
        setKpiData({
          activeInterns: 0,
          activePrograms: adviserProgram || 'N/A',
          partnerHTE: 0,
        });
      }
    };

    fetchDashboardData();
  }, [adviserProgram]);

  return (
    <div className="min-h-screen">
      {/* KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <KPICard
          title="Active Intern"
          value={kpiData.activeInterns}
          description="(Same program as adviser)"
          className="bg-red-800 text-white"
          valueClassName="text-6xl"
          descriptionClassName="text-white"
        />

        <KPICard
          title="Active Program"
          value={kpiData.activePrograms}
          description="Assigned Program"
          className="bg-red-800 text-white"
          valueClassName="text-4xl"
          descriptionClassName="text-white"
        />

        <KPICard
          title="Partner HTE"
          value={kpiData.partnerHTE}
          description="Active Partnership"
          className="bg-red-800 text-white"
          valueClassName="text-6xl"
          descriptionClassName="text-white"
        />
      </div>

      {/* INTERN TABLE */}
      <InternA_ />
    </div>
  );
};

export default DashboardA;
