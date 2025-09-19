// src/components/Dashboard.jsx (or DashboardC.jsx based on your file structure)
import React, { useState, useEffect } from 'react';
import KPICard from '../../Components/KPICard';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components - IMPORTANT for charts to render
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardC = () => {
    const [kpiData, setKpiData] = useState({
        activeInterns: 'Loading...',
        activePrograms: 'Loading...',
        partnerCompanies: 'Loading...',
    });

   
    const [programChartData, setProgramChartData] = useState(null); 
    const [companyChartData, setCompanyChartData] = useState(null); 
    const [selectedProgram, setSelectedProgram] = useState('All'); 
    const programsFilter = ['All', 'BSBA', 'BSIT', 'BSENT', 'BEED', 'BSIE'];

    // 2. useEffect HOOK FOR DATA FETCHING
    // The useEffect hook will now re-run when 'selectedProgram' changes
    useEffect(() => {
        const fetchData = async () => {
            // Reset to loading state while fetching new data
            setKpiData({
                activeInterns: 'Loading...',
                activePrograms: 'Loading...',
                partnerCompanies: 'Loading...',
            });
            setProgramChartData(null); // Reset chart data
            setCompanyChartData(null); // Reset chart data

            // --- START DUMMY DATA IMPLEMENTATION ---

            // Simulate API call with a delay (optional)
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

            // Define your DUMMY DATA for charts
            const dummyProgramChartData = [
                { program: "BSBA", count: 60, percentage: 60 },
                { program: "BEED", count: 14, percentage: 14 },
                { program: "BSENT", count: 14, percentage: 14 },
                { program: "BSIE", count: 4, percentage: 4 }, // Updated from IND. ENG.
                { program: "BSIT", count: 8, percentage: 8 }
            ];

            const dummyCompanyChartData = [
                { company: "EEE", count: 20, percentage: 19.9 },
                { company: "AAA", count: 15, percentage: 15.9 },
                { company: "DDD", count: 25, percentage: 23.3 },
                { company: "CCC", count: 10, percentage: 9.7 },
                { company: "BBB", count: 20, percentage: 13.9 }
            ];

            // --- Filter dummy data based on selectedProgram and derive KPIs ---
            let internsForProgram = [];
            let activeProgramsCount = 0;
            let totalPartnerCompanies = 10; // This can remain static if not filtered by program

            if (selectedProgram === 'All') {
                internsForProgram = dummyProgramChartData;
                activeProgramsCount = dummyProgramChartData.length; // Count all programs
            } else {
                internsForProgram = dummyProgramChartData.filter(
                    item => item.program === selectedProgram
                );
                activeProgramsCount = internsForProgram.length > 0 ? 1 : 0; // If a specific program is selected and exists, count as 1 active program
            }

            // Calculate total active interns based on filtered data
            const totalActiveInterns = internsForProgram.reduce((sum, item) => sum + item.count, 0);

            // Update the state with the DERIVED dummy data
            setKpiData({
                activeInterns: String(totalActiveInterns),
                activePrograms: String(activeProgramsCount),
                partnerCompanies: String(totalPartnerCompanies),
            });

            // Prepare and update program chart data
            const programLabels = internsForProgram.map(item => item.program);
            const programValues = internsForProgram.map(item => item.count);
            const programPercentages = internsForProgram.map(item => item.percentage);

            setProgramChartData({
                labels: programLabels,
                datasets: [
                    {
                        data: programValues,
                        backgroundColor: [
                            '#A80000', // Dark Red (for BSBA - 60%)
                            '#0080FF', // Blue (for BEED - 14%)
                            '#E0E5B8', // Light Yellow (for BSENT - 14%)
                            '#008000', // Green (for BSIE - 4%)
                            '#000000', // Black (for BSIT - 8%)
                            // Add more colors if you have more programs
                        ],
                        borderColor: [
                            'white', 'white', 'white', 'white', 'white',
                        ],
                        borderWidth: 1,
                    },
                ],
                percentages: programPercentages // Store percentages for legend/tooltip
            });

            // Prepare and update company chart data (this remains static regardless of program filter for this dummy example)
            const companyLabels = dummyCompanyChartData.map(item => item.company);
            const companyValues = dummyCompanyChartData.map(item => item.count);
            const companyPercentages = dummyCompanyChartData.map(item => item.percentage);

            setCompanyChartData({
                labels: companyLabels,
                datasets: [
                    {
                        data: companyValues,
                        backgroundColor: [
                            '#FF0000', '#FFFF00', '#F5DEB3', '#C0C0C0', '#ADD8E6',
                        ],
                        borderColor: [
                            'white', 'white', 'white', 'white', 'white',
                        ],
                        borderWidth: 1,
                    },
                ],
                percentages: companyPercentages
            });

            // --- END DUMMY DATA IMPLEMENTATION ---


            // --- FUTURE DATABASE INTEGRATION POINT (Commented Out) ---
            /*
            // In the future, you would replace the dummy data above with actual API calls.
            // Example using a hypothetical API endpoint:
            try {
                let apiUrl = '/api/dashboard-data'; // Adjust this to your actual API base URL
                if (selectedProgram !== 'All') {
                    apiUrl = `/api/dashboard-data?program=${encodeURIComponent(selectedProgram)}`;
                }

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Process the fetched 'data' to update your states:
                setKpiData({
                    activeInterns: data.totalActiveInterns,
                    activePrograms: data.totalActivePrograms,
                    partnerCompanies: data.totalPartnerCompanies,
                });

                // For program chart:
                // const fetchedProgramChartData = data.internsPerProgram;
                // const programLabels = fetchedProgramChartData.map(item => item.program);
                // const programValues = fetchedProgramChartData.map(item => item.count);
                // const programPercentages = fetchedProgramChartData.map(item => item.percentage);
                // setProgramChartData({ labels: programLabels, datasets: [{ data: programValues, ... }], percentages: programPercentages });

                // For company chart:
                // const fetchedCompanyChartData = data.internsPerCompany;
                // const companyLabels = fetchedCompanyChartData.map(item => item.company);
                // const companyValues = fetchedCompanyChartData.map(item => item.count);
                // const companyPercentages = fetchedCompanyChartData.map(item => item.percentage);
                // setCompanyChartData({ labels: companyLabels, datasets: [{ data: companyValues, ... }], percentages: companyPercentages });

            } catch (error) {
                console.error("Failed to fetch dashboard data from API:", error);
                // Set error states or display a message to the user
                setKpiData({
                    activeInterns: 'Error',
                    activePrograms: 'Error',
                    partnerCompanies: 'Error',
                });
                setProgramChartData(null);
                setCompanyChartData(null);
            }
            */
            // --- END FUTURE DATABASE INTEGRATION POINT ---
        };

        fetchData();
    }, [selectedProgram]);

    // NEW HANDLER: Function to update the selected program
    const handleProgramClick = (program) => {
        setSelectedProgram(program);
    };

    // Chart options (common for both pie charts)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    boxWidth: 10,
                    font: {
                        size: 10,
                    },
                    generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            const currentChartPercentages = chart.canvas.id === 'program-pie-chart' ? programChartData?.percentages : companyChartData?.percentages;

                            return data.labels.map((label, i) => {
                                const meta = chart.getDatasetMeta(0);
                                const percentage = currentChartPercentages ? currentChartPercentages[i] : null;
                                return {
                                    text: `${label} ${percentage !== null ? `(${percentage}%)` : ''}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].borderColor[i],
                                    lineWidth: data.datasets[0].borderWidth,
                                    hidden: meta.data[i].hidden,
                                    index: i,
                                };
                            });
                        }
                        return [];
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed;
                        }
                        const chartId = context.chart.canvas.id;
                        if (chartId === 'program-pie-chart' && programChartData && programChartData.percentages && context.dataIndex !== undefined) {
                           label += ` (${programChartData.percentages[context.dataIndex]}%)`;
                        } else if (chartId === 'company-pie-chart' && companyChartData && companyChartData.percentages && context.dataIndex !== undefined) {
                            label += ` (${companyChartData.percentages[context.dataIndex]}%)`;
                        }
                        return label;
                    }
                }
            }
        },
    };


    return (
        <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
            <div className="text-gray-600 text-sm mb-5 flex items-center">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span> Dashboard &gt;
                <span className="ml-1 font-semibold">{selectedProgram === 'All' ? '' : selectedProgram}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
                {/* Filters Sidebar */}
                <aside className="bg-white rounded-lg shadow-md p-5 w-full md:w-52 flex-shrink-0 border border-gray-300">
                    <div className="bg-red-800 text-white font-bold text-center py-2 px-4 -mx-5 -mt-5 mb-5 rounded-t-lg">
                        Filters
                    </div>
                    <ul className="list-none p-0 m-0 text-sm">
                        <li className="py-2 text-gray-700 font-semibold">Programs</li>
                        {programsFilter.map((program, index) => (
                            <li
                                key={index}
                                className={`py-2 text-gray-600 hover:text-black cursor-pointer transition-colors duration-200 ${selectedProgram === program ? 'font-bold text-cyan-700' : ''}`}
                                onClick={() => handleProgramClick(program)} // Attach click handler
                            >
                                {program}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Dashboard Area - KPI Grid and Charts */}
                <main className="flex-grow">
                    {/* KPI Grid - Adjusted to 3 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                        <KPICard
                            title="Active Intern"
                            value={kpiData.activeInterns}
                            description="(Currently active)"
                            className="bg-red-800 text-white"
                            valueClassName="text-6xl"
                            descriptionClassName="text-white"
                        />
                        <KPICard
                            title="Active Programs"
                            value={kpiData.activePrograms}
                            description="Ready for interns"
                            className="bg-red-800 text-white"
                            valueClassName="text-6xl"
                            descriptionClassName="text-white"
                        />
                        <KPICard
                            title="Partner Companies"
                            value={kpiData.partnerCompanies}
                            description="Active Partnership"
                            className="bg-red-800 text-white"
                            valueClassName="text-6xl"
                            descriptionClassName="text-white"
                        />
                    </div>

                    {/* Chart Section - Remains the same, 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Number of Interns Per Programs Chart */}
                        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-300">
                            <h3 className="text-lg font-semibold text-center mb-4">Number of Interns Per Programs</h3>
                            <div className="relative h-64 w-full">
                                {programChartData ? (
                                    <Pie data={programChartData} options={chartOptions} id="program-pie-chart" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">Loading chart...</div>
                                )}
                            </div>
                        </div>

                        {/* Number of Interns Per Company Chart */}
                        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-300">
                            <h3 className="text-lg font-semibold text-center mb-4">Number of Interns Per Company</h3>
                            <div className="relative h-64 w-full">
                                {companyChartData ? (
                                    <Pie data={companyChartData} options={chartOptions} id="company-pie-chart" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">Loading chart...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardC;