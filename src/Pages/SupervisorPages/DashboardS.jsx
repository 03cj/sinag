import { ClipboardList, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Imported useNavigate

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

// Custom Modal Component to replace window.alert()
const SimpleModal = ({ isVisible, title, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 border-t-4 border-red-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 transition shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const CompanyDashboard = () => {
  const navigate = useNavigate(); // <--- 2. Initialized useNavigate
  const [companyName] = useState('Acme Innovations Inc.');
  const [activeInterns] = useState(initialCompanyInterns);
  const [moaDetails] = useState({
    expiration: 'December 31, 2025',
    status: 'Active',
    moaFile: 'acme_innovations_moa.pdf',
    isMoaUploaded: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for controlling the custom modal (Still used for MOA actions)
  const [modal, setModal] = useState({
    isVisible: false,
    title: '',
    message: '',
  });

  // Function to display messages via the custom modal
  const showMessage = (title, message) => {
    setModal({ isVisible: true, title, message });
  };

  // Function to close the modal
  const closeModal = () => {
    setModal({ isVisible: false, title: '', message: '' });
  };

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

  // --- Action Handlers (UPDATED to use custom modal) ---
  const handleViewMoa = () => {
    if (moaDetails.isMoaUploaded) {
      showMessage('MOA Document View', `Simulating viewing MOA: ${moaDetails.moaFile}`);
    } else {
      showMessage('MOA Document View', 'No MOA has been uploaded yet.');
    }
  };

  const handleUploadMoa = () => {
    showMessage('MOA Upload', 'Simulating MOA upload dialog...');
  };

  // --- Action Handler for Evaluation Icon (UPDATED to use navigate) ---
  const handleViewEvaluation = (intern) => {
    // Navigate to the correct full path: /pup-sinag/supervisor/evaluation/117
    navigate(`/pup-sinag/supervisor/evaluation/${intern.studNo}`);
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
      {/* 1. Custom Modal for alerts */}
      <SimpleModal isVisible={modal.isVisible} title={modal.title} message={modal.message} onClose={closeModal} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. "Hello Company name!" Banner */}
        <div className="bg-red-800 text-white p-6 rounded-lg shadow-xl">
          <h2 className="text-4xl font-bold italic text-yellow-400">Hello {companyName}!</h2>
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
              {/* Table Header (Red) - EVALUATION HEADER */}
              <thead className="bg-red-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">STUD. NO.</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">LASTNAME</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">FIRSTNAME</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">MI.</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">EMAIL</th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">EVALUATION</th>
                </tr>
              </thead>
              {/* Table Body (White) - EVALUATION ICON */}
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
                    {/* COLUMN DATA WITH ClipboardList ICON */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleViewEvaluation(intern)} // Triggers navigation
                        className="text-red-600 hover:text-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
                        title={`View evaluation for ${intern.firstName} ${intern.lastName}`}
                      >
                        <ClipboardList className="h-6 w-6 mx-auto" /> {/* ClipboardList Icon from lucide-react */}
                      </button>
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
