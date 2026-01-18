import { ClipboardList, FileText, Notebook, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupervisorReportModal from '../../Components/SupervisorReportModal';

/* =========================
   SIMPLE MODAL (UNCHANGED)
========================= */
const SimpleModal = ({ isVisible, title, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border-t-4 border-red-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-600">
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   COMPANY DASHBOARD
========================= */
const CompanyDashboard = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [activeInterns, setActiveInterns] = useState([]);
  const [moaDetails, setMoaDetails] = useState({
    expiration: '',
    status: '',
    moaFile: null,
    supervisorName: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({
    isVisible: false,
    title: '',
    message: '',
  });

  const [reportModal, setReportModal] = useState({
    isVisible: false,
    intern: null,
  });

  const showMessage = (title, message) => {
    setModal({ isVisible: true, title, message });
  };

  const closeModal = () => {
    setModal({ isVisible: false, title: '', message: '' });
  };

  const handleViewDailyLogs = (intern) => {
    setReportModal({ isVisible: true, intern });
  };

  const closeReportModal = () => {
    setReportModal({ isVisible: false, intern: null });
  };

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');

        /* 1️⃣ COMPANY PROFILE */
        const companyRes = await fetch('http://localhost:5000/api/auth/company/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!companyRes.ok) throw new Error('Failed to load company');

        const company = await companyRes.json();

        setCompanyName(company.name);

        setMoaDetails({
          expiration: company.moaEnd || 'N/A',
          status: company.moaEnd && new Date(company.moaEnd) < new Date() ? 'Expired' : 'Active',
          moaFile: company.moaFile || null,
          supervisorName: company.supervisorName || 'N/A',
        });

        /* 2️⃣ INTERN LIST */
        const internRes = await fetch('http://localhost:5000/api/auth/company/interns', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!internRes.ok) throw new Error('Failed to load interns');

        const interns = await internRes.json();
        setActiveInterns(interns);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     INTERN EVALUATION
  ========================= */
  const handleViewEvaluation = (intern) => {
    navigate(`/pup-sinag/supervisor/evaluation/${intern.studentId}`);
  };

  /* =========================
     LOADING / ERROR
  ========================= */
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
      <SimpleModal isVisible={modal.isVisible} title={modal.title} message={modal.message} onClose={closeModal} />
      <SupervisorReportModal isOpen={reportModal.isVisible} onClose={closeReportModal} intern={reportModal.intern} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-red-800 text-white p-6 rounded-lg shadow-xl">
          <h2 className="text-4xl font-bold italic text-yellow-400">Hello {companyName}!</h2>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          {/* LEFT COLUMN */}
          <div className="flex flex-col w-full md:w-1/3 space-y-4">
            <div className="bg-red-800 text-white p-6 rounded-lg shadow-md text-center h-48 flex flex-col justify-center">
              <h3 className="text-xl font-semibold">Active Intern</h3>
              <p className="text-7xl font-extrabold">{activeInterns.length}</p>
              <p className="text-sm italic">(Currently active)</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
              <div className="text-lg space-y-2">
                <p>
                  <span className="font-bold">MOA Expiration:</span> {moaDetails.expiration}
                </p>

                <p>
                  <span className="font-bold">Supervisor:</span> {moaDetails.supervisorName}
                </p>

                <p>
                  <span className="font-bold">MOA Status:</span> {moaDetails.status}
                </p>
              </div>

              {moaDetails.moaFile ? (
                <a
                  href={`http://localhost:5000/uploads/${moaDetails.moaFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-red-700 text-white py-3 rounded-md font-semibold hover:bg-red-800"
                >
                  <FileText className="h-5 w-5" />
                  VIEW MOA
                </a>
              ) : (
                <button
                  onClick={() => showMessage('MOA Document', 'No MOA has been uploaded yet.')}
                  className="w-full bg-gray-300 text-gray-600 py-3 rounded-md font-semibold cursor-not-allowed"
                >
                  NO MOA AVAILABLE
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 bg-white rounded-lg shadow-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-800 text-white">
                <tr>
                  {['STUD. NO.', 'LASTNAME', 'FIRSTNAME', 'MI.', 'EMAIL', 'DAILY LOGS', 'EVALUATION'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {activeInterns.map((intern) => (
                  <tr key={intern.studentId} className="hover:bg-red-50">
                    <td className="px-6 py-4">{intern.studentId}</td>
                    <td className="px-6 py-4">{intern.lastName}</td>
                    <td className="px-6 py-4">{intern.firstName}</td>
                    <td className="px-6 py-4">{intern.mi}</td>
                    <td className="px-6 py-4 text-blue-600 hover:underline">
                      <a href={`mailto:${intern.email}`}>{intern.email}</a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDailyLogs(intern)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Daily Logs"
                      >
                        <Notebook className="h-6 w-6 mx-auto" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleViewEvaluation(intern)} className="text-red-600 hover:text-red-900">
                        <ClipboardList className="h-6 w-6 mx-auto" />
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
