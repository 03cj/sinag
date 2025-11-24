import { useEffect, useState } from 'react';

// Placeholder data for the list of active interns assigned to this company
const initialCompanyInterns = [
  { studNo: '117', lastName: 'Aquino', firstName: 'Sarah', mi: 'K.', email: 'sarah@mail.net' },
  { studNo: '111', lastName: 'Dela Cruz', firstName: 'Juan', mi: 'S.', email: 'juan@gmail.com' },
  { studNo: '115', lastName: 'Gonzales', firstName: 'Sofia', mi: 'R.', email: 'sofia@company.org' },
  { studNo: '114', lastName: 'Lim', firstName: 'Chen', mi: 'P.', email: 'chen@domain.com' },
  { studNo: '112', lastName: 'Reyes', firstName: 'Maria', mi: 'L.', email: 'maria@example.com' },
  { studNo: '113', lastName: 'Santos', firstName: 'Pedro', mi: 'A.', email: 'pedro@mail.com' },
  { studNo: '116', lastName: 'Tan', firstName: 'Michael', mi: 'J.', email: 'michael@email.com' },
];

const CompanyDashboard = () => {
  // --- State based on the Company Dashboard view ---
  const [companyName, setCompanyName] = useState('Acme Innovations Inc.');
  const [activeInterns, setActiveInterns] = useState(initialCompanyInterns);
  const [moaDetails, setMoaDetails] = useState({
    expiration: 'December 31, 2025',
    status: 'Active',
    moaFile: 'acme_innovations_moa.pdf',
    isMoaUploaded: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect Hook: Used for fetching initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay to fetch actual data
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Action Handlers for MOA Buttons (FIXED: Using window.alert) ---
  const handleViewMoa = () => {
    if (moaDetails.isMoaUploaded) {
      window.alert(`Viewing MOA: ${moaDetails.moaFile}`);
      // In a real app: window.open(`/api/moa/${moaDetails.moaFile}`, '_blank');
    } else {
      window.alert('No MOA has been uploaded yet.');
    }
  };

  const handleUploadMoa = () => {
    window.alert('Simulating MOA upload dialog...');
    // In a real app, this would trigger a file input or a modal for upload
  };

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-xl text-red-800">Loading Company Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-6 lg:p-8">
      {' '}
      {/* Light red/pink background */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. "Hello Company name!" Banner */}
        <div className="bg-red-800 text-white p-6 rounded-lg shadow-xl" style={{ fontSize: '30px' }}>
          <h2 className="text-4xl font-extrabold italic" style={{ color: 'yellow' }}>
            Hello {companyName}!
          </h2>
        </div>

        {/* Main Content: Two Columns */}
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          {/* Left Column (Fixed Width) */}
          <div className="flex flex-col w-full md:w-1/3 space-y-4">
            {/* 2. Active Intern Count Box */}
            <div className="bg-red-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center h-48">
              <h3 className="text-xl font-semibold mb-2">Active Intern</h3>
              <p className="text-7xl font-extrabold">{activeInterns.length}</p>
              <p className="text-sm italic">(Currently active)</p>
            </div>

            {/* 3. MOA Status and Buttons Box */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-gray-800 space-y-4">
              {/* MOA Details */}
              <div className="space-y-2 mb-4 text-lg">
                <p>
                  <span className="font-bold">MOA Expiration:</span> {moaDetails.expiration}
                </p>
                <p>
                  <span className="font-bold">MOA Status:</span> {moaDetails.status}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleViewMoa}
                  className="bg-red-700 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-800 transition-colors shadow-sm"
                >
                  VIEW MOA
                </button>
                <button
                  onClick={handleUploadMoa}
                  className="bg-red-700 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-800 transition-colors shadow-sm"
                >
                  UPLOAD MOA
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interns Table */}
          <div className="flex-1 bg-white rounded-lg shadow-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header (Red) */}
              <thead className="bg-red-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">STUD. NO.</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">LASTNAME</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">FIRSTNAME</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">MI.</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">EMAIL</th>
                </tr>
              </thead>
              {/* Table Body (White) */}
              <tbody className="bg-white divide-y divide-gray-200">
                {activeInterns.map((intern) => (
                  <tr key={intern.studNo} className="hover:bg-red-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{intern.studNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{intern.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{intern.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{intern.mi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                      <a href={`mailto:${intern.email}`}>{intern.email}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
