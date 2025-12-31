import { useEffect, useState } from 'react';

const HomeI = () => {
  // =========================
  // STATE
  // =========================
  const [internData, setInternData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    const fetchInternDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5000/api/dashboard/intern', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch dashboard');
        }

        const data = await res.json();
        setInternData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInternDashboardData();
  }, []);

  // =========================
  // HELPERS
  // =========================
  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600';
      case 'Approved':
        return 'text-green-600';
      case 'Declined':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusMessage = () => {
    if (internData.status === 'Pending') {
      return 'Submit the documents and wait to be checked.';
    }

    if (internData.status === 'Approved') {
      return 'You are all set to go!';
    }

    if (internData.status === 'Declined') {
      return internData.remarks || 'Your application was declined.';
    }

    return '';
  };

  const handleFileView = (fileName) => {
    window.open(`http://localhost:5000/uploads/${fileName}`, '_blank');
  };

  // =========================
  // RENDER GUARDS
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!internData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No dashboard data found</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* WELCOME */}
      <div className="bg-red-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold">Welcome, {internData.firstName}!</h2>
        <h3 className="text-xl italic whitespace-nowrap">
          {internData.fullName} ({internData.studentId})
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* LEFT COLUMN */}
        <div className="flex flex-col w-full md:w-1/3 space-y-4">
          {/* INTERNSHIP DETAILS */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold mb-4">Internship Details</h3>

            {internData.companyDetails ? (
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Company:</span> {internData.companyDetails.companyName}
                </p>
                <p>
                  <span className="font-medium">Supervisor:</span> {internData.companyDetails.supervisor}
                </p>
                <p>
                  <span className="font-medium">Start Date:</span> {internData.companyDetails.startDate}
                </p>
                <p>
                  <span className="font-medium">End Date:</span> {internData.companyDetails.endDate}
                </p>
              </div>
            ) : (
              <p className="italic text-gray-500">No company assigned yet</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN – CURRENT STATUS */}
        <div className="bg-white p-6 rounded-lg shadow-md border flex-1">
          <h4 className="text-lg font-bold mb-2">Current Status</h4>

          {/* STATUS */}
          <p className={`font-semibold text-lg ${getStatusTextColor(internData.status)}`}>{internData.status}</p>

          {/* STATUS MESSAGE */}
          <p className={`mt-1 ${internData.status === 'Declined' ? 'italic text-gray-600' : 'text-gray-600'}`}>
            {getStatusMessage()}
          </p>

          {/* DOCUMENTS */}
          <div className="mt-6">
            <h5 className="font-semibold text-gray-800">Documents Status</h5>

            <ul className="list-disc list-inside mt-2 space-y-2">
              {internData.documents.map((doc, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{doc.name}:</span>{' '}
                  <span className={doc.uploaded ? 'text-green-600' : 'text-red-600'}>
                    {doc.uploaded ? 'Uploaded' : 'Pending'}
                  </span>
                  {doc.uploaded && (
                    <button onClick={() => handleFileView(doc.file)} className="ml-2 text-blue-500 underline">
                      View
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeI;
