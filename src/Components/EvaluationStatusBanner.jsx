import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';

const EvaluationStatusBanner = ({ type }) => {
  const [isActive, setIsActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/evaluation/settings');
        const settings = response.data;

        switch (type) {
          case 'intern':
            setIsActive(settings.internEvaluationActive);
            break;
          case 'hte':
            setIsActive(settings.hteEvaluationActive);
            break;
          case 'supervisor':
            setIsActive(settings.supervisorEvaluationActive);
            break;
          default:
            setIsActive(false);
        }
      } catch (error) {
        console.error('Failed to fetch evaluation status:', error);
        setIsActive(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [type]);

  useEffect(() => {
    // Show modal when evaluation is inactive
    if (!loading && (isActive === false || isActive === null)) {
      setShowModal(true);
    }
  }, [loading, isActive]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  // Modal for inactive/error status
  if (showModal && (isActive === null || !isActive)) {
    const getEvaluationType = () => {
      switch (type) {
        case 'intern':
          return 'Intern Evaluation';
        case 'hte':
          return 'HTE Evaluation';
        case 'supervisor':
          return 'Supervisor Evaluation';
        default:
          return 'Evaluation';
      }
    };

    // Add a unique class to the modal for detection
    return (
      <>
        {/* Backdrop - Full screen blur */}
        <div className="fixed inset-0 z-[100] bg-red-900/40 backdrop-blur-lg sinag-eval-modal" />
        {/* Modal Container */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col">
            {/* Decorative Top Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-red-900 via-red-800 to-red-900 flex-shrink-0" />
            {/* HEADER */}
            <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white px-8 py-6 flex justify-between items-center shadow-lg flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold">{isActive === null ? 'CONNECTION ISSUE' : 'EVALUATION CLOSED'}</h2>
                <p className="text-red-100 text-base mt-1">{getEvaluationType()}</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:bg-red-600 rounded-full p-2 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* CONTENT */}
            <div className="overflow-y-auto flex-1 px-8 py-6">
              {/* Status Message */}
              <div
                className={`border-l-4 p-4 mb-6 rounded flex items-start gap-3 ${isActive === null ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500'}`}
              >
                {isActive === null ? (
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-yellow-500" />
                ) : (
                  <XCircle size={20} className="flex-shrink-0 mt-0.5 text-red-500" />
                )}
                <div className={`text-base ${isActive === null ? 'text-yellow-700' : 'text-red-700'}`}>
                  {isActive === null ? (
                    <>
                      <strong>Unable to verify evaluation status.</strong>
                      <p className="mt-1">
                        We couldn't connect to the server to check if evaluations are currently open. This might be due
                        to network issues or server maintenance.
                      </p>
                    </>
                  ) : (
                    <>
                      <strong>This evaluation is currently closed.</strong>
                      <p className="mt-1">
                        The coordinator has temporarily disabled submissions for this evaluation. Please check back
                        later or contact your coordinator.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* What to do section */}
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  What should you do?
                </h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  {isActive === null ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>Check your internet connection and try again</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>Refresh the page to retry the connection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>Contact the coordinator if this issue persists</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>Contact your coordinator for more information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>Check back later when evaluations are reopened</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>You will be notified when submissions are accepted</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className={`flex-1 px-5 py-3 font-semibold rounded-lg transition-colors text-white ${
                    isActive === null ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Retry
                </button>
              </div>
            </div>{' '}
            {/* Close CONTENT div */}
          </div>{' '}
          {/* Close Modal Container inner div */}
        </div>{' '}
        {/* Close Modal Container */}
      </>
    );
  }

  // Success banner when active
  if (isActive) {
    return (
      <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-800">Evaluations are open</p>
          <p className="text-sm text-green-700 mt-1">You can submit evaluations during this period.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default EvaluationStatusBanner;
