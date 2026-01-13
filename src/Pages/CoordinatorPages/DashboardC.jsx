import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import KPICard from '../../Components/KPICard';

ChartJS.register(ArcElement, Tooltip, Legend);

/* =========================
   3D SHADOW PLUGIN
========================= */
const shadowPlugin = {
  id: 'shadowPlugin',
  beforeDraw(chart) {
    const ctx = chart.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
  },
  afterDraw(chart) {
    chart.ctx.restore();
  },
};

/* =========================
   GRADIENT HELPER
========================= */
const gradient = (ctx, top, bottom) => {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  return g;
};
const abbreviateProgram = (program) => {
  if (!program || program === 'All') return program;

  const ignoreWords = ['OF', 'IN', 'THE', 'AND', 'FOR'];

  return program
    .toUpperCase()
    .replace(/-/g, ' ')
    .split(' ')
    .filter((word) => !ignoreWords.includes(word))
    .map((word) => word[0])
    .join('');
};
const DashboardC = () => {
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [programsFilter, setProgramsFilter] = useState(['All']);

  const [kpiData, setKpiData] = useState({
    activeInterns: 'Loading...',
    activePrograms: 'Loading...',
    partnerHTE: 'Loading...',
  });

  const [programChartData, setProgramChartData] = useState(null);
  const [companyChartData, setCompanyChartData] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [programRes, companyRes, kpiRes, adviserProgramRes] = await Promise.all([
          fetch(`${API_BASE}/api/dashboard/programs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/dashboard/companies`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/dashboard/kpis`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/dashboard/adviser-programs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const programData = await programRes.json();
        const companyData = await companyRes.json();
        const kpis = await kpiRes.json();
        const adviserPrograms = await adviserProgramRes.json();

        /* =========================
   FILTERED PROGRAMS
========================= */
        const filteredPrograms =
          selectedProgram === 'All' ? programData : programData.filter((p) => p.program === selectedProgram);

        const filteredInternTotal = filteredPrograms.reduce((sum, p) => sum + p.count, 0);

        /* =========================
   PROGRAM FILTER LIST
========================= */
        const uniquePrograms = [...new Set(programData.map((p) => p.program))];

        setProgramsFilter(['All', ...uniquePrograms]);

        const totalProgramsCount = programData.length;

        const programPercentages = filteredPrograms.map((p) =>
          filteredInternTotal ? Math.round((p.count / filteredInternTotal) * 100) : 0,
        );

        const totalCompanyCount = companyData.reduce((sum, c) => sum + c.count, 0);

        const companyPercentages = companyData.map((c) =>
          totalCompanyCount ? Math.round((c.count / totalCompanyCount) * 100) : 0,
        );

        /* =========================
           KPI UPDATE (FILTER AWARE)
        ========================= */
        setKpiData({
          activeInterns: selectedProgram === 'All' ? kpis.activeInterns : filteredInternTotal,

          activePrograms: selectedProgram === 'All' ? totalProgramsCount : abbreviateProgram(selectedProgram),

          partnerHTE: kpis.partnerHTE,
        });

        /* =========================
           PROGRAM CHART
        ========================= */
        setProgramChartData({
          labels: filteredPrograms.map((p) => p.program),

          datasets: [
            {
              data: filteredPrograms.map((p) => p.count),
              backgroundColor: (ctx) => {
                const c = ctx.chart.ctx;
                return [
                  gradient(c, '#7A0000', '#3D0000'),
                  gradient(c, '#F5C542', '#B38E00'),
                  gradient(c, '#FFB703', '#E09F00'),
                  gradient(c, '#FFC857', '#E6A400'),
                  gradient(c, '#A80000', '#5C0000'),
                ];
              },
              borderWidth: 0,
              hoverOffset: 18,
            },
          ],
          percentages: programPercentages,
        });

        /* =========================
           COMPANY CHART
        ========================= */
        setCompanyChartData({
          labels: companyData.map((c) => c.company),
          datasets: [
            {
              data: companyData.map((c) => c.count),
              backgroundColor: (ctx) => {
                const cxt = ctx.chart.ctx;
                return [
                  gradient(cxt, '#7A0000', '#3D0000'),
                  gradient(cxt, '#F5C542', '#B38E00'),
                  gradient(cxt, '#FFB703', '#E09F00'),
                  gradient(cxt, '#FFC857', '#E6A400'),
                  gradient(cxt, '#A80000', '#5C0000'),
                ];
              },
              borderWidth: 0,
              hoverOffset: 18,
            },
          ],
          percentages: companyPercentages,
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    loadData();
  }, [selectedProgram]);

  /* =========================
     CHART OPTIONS
  ========================= */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '52%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: { size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed} (${ctx.chart.data.percentages?.[ctx.dataIndex]}%)`,
        },
      },
    },
  };

  return (
    <div className="p-5 md:p-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-5">
        {/* FILTER SIDEBAR */}
        <aside className="bg-white rounded-lg shadow-md p-5 w-full md:w-52 border">
          <div className="bg-red-800 text-white font-bold text-center py-2 mb-4 rounded">Filters</div>

          {programsFilter.map((program) => (
            <div
              key={program}
              onClick={() => setSelectedProgram(program)} // FULL NAME used internally
              className={`py-2 cursor-pointer ${
                selectedProgram === program ? 'font-bold text-red-800' : 'text-gray-600'
              }`}
            >
              {abbreviateProgram(program)}
            </div>
          ))}
        </aside>

        {/* MAIN DASHBOARD */}
        <main className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            <KPICard title="Active Intern" value={kpiData.activeInterns} />
            <KPICard title="Active Programs" value={kpiData.activePrograms} />
            <KPICard title="Partner HTE" value={kpiData.partnerHTE} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-lg shadow-md p-5 border">
              <h3 className="text-center font-semibold mb-4">Number of Interns Per Program</h3>
              <div className="h-64">
                {programChartData && <Pie data={programChartData} options={chartOptions} plugins={[shadowPlugin]} />}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border">
              <h3 className="text-center font-semibold mb-4">Number of Interns Per Company</h3>
              <div className="h-64">
                {companyChartData && <Pie data={companyChartData} options={chartOptions} plugins={[shadowPlugin]} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardC;
