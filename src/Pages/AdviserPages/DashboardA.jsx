// src/pages/Dashboard/DashboardA.jsx
import { useEffect, useState } from 'react';
import KPICard from '../../Components/KPICard';
import InternA_ from './InternA_in_dashboardA';

const DashboardA = () => {
  const [kpiData, setKpiData] = useState({
    activeInterns: 'Loading...',
    activePrograms: 'Loading...',
    partnerHTE: 'Loading...',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setKpiData({
        activeInterns: 'Loading...',
        activePrograms: 'Loading...',
        partnerHTE: 'Loading...',
      });

      // Simulate API delay (replace with real API later)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ===== DUMMY DATA (REPLACE WITH API) =====
      setKpiData({
        activeInterns: '100',
        activePrograms: '1',
        partnerHTE: '5',
      });
    };

    fetchDashboardData();
  }, []);

  return (
    <div className=" min-h-screen">
      {/* KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <KPICard
          title="Active Intern"
          value={kpiData.activeInterns}
          description="(Currently active)"
          className="bg-red-800 text-white"
          valueClassName="text-6xl"
          descriptionClassName="text-white"
        />
        <KPICard
          title="Active Program"
          value={kpiData.activePrograms}
          description="Single Program"
          className="bg-red-800 text-white"
          valueClassName="text-6xl"
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

      {/* INTERN TABLE SECTION */}
      <InternA_ />
    </div>
  );
};

export default DashboardA;
