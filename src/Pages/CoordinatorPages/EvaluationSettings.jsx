import { useEffect, useState } from 'react';
import api from '../../services/axios';

const EvaluationSettings = () => {
  const [settings, setSettings] = useState({
    internEvaluationActive: false,
    hteEvaluationActive: false,
    supervisorEvaluationActive: false,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/evaluation/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch evaluation settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (type, currentValue) => {
    setUpdating(true);
    try {
      const response = await api.post('/evaluation/settings/toggle', {
        type,
        isActive: !currentValue,
      });
      setSettings(response.data.settings);

      // Show success notification
      alert(`${type.toUpperCase()} evaluation ${!currentValue ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Failed to toggle evaluation:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
      </div>
    );
  }

  const evaluationTypes = [
    {
      key: 'internEvaluationActive',
      type: 'intern',
      label: 'Intern Evaluations',
      description: 'Allow advisers to submit evaluations for interns',
    },
    {
      key: 'hteEvaluationActive',
      type: 'hte',
      label: 'HTE Evaluations',
      description: 'Allow interns to submit Host Training Establishment evaluations',
    },
    {
      key: 'supervisorEvaluationActive',
      type: 'supervisor',
      label: 'Supervisor Evaluations',
      description: 'Allow company supervisors to submit intern evaluations',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-maroon">Evaluation Settings</h2>
          <p className="text-sm text-gray-600 mt-1">Control when evaluations are accepting submissions</p>
        </div>

        <div className="p-6 space-y-6">
          {evaluationTypes.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-maroon transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>

              <button
                onClick={() => handleToggle(item.type, settings[item.key])}
                disabled={updating}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-2 ${
                  settings[item.key] ? 'bg-green-600' : 'bg-gray-300'
                } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings[item.key] ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>

              <div className="ml-4 min-w-[80px] text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    settings[item.key] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {settings[item.key] ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {settings.lastUpdated && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <p className="text-xs text-gray-500">Last updated: {new Date(settings.lastUpdated).toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>When evaluation is inactive, users cannot submit new evaluations</li>
                <li>Users will see a notification indicating evaluations are closed</li>
                <li>Activate evaluations during the appropriate evaluation period</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSettings;
