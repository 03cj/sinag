import { differenceInDays } from 'date-fns';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

const HTEA = () => {
  const [HTE, setHTE] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /* =========================
     FETCH HTE DATA
  ========================= */
  useEffect(() => {
    const fetchHTE = async () => {
      setLoading(true);
      setError(null);

      try {
        let apiUrl = 'http://localhost:5000/api/auth/HTE';
        if (searchTerm) {
          apiUrl += `?q=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHTE(data);
      } catch (err) {
        console.error('Failed to fetch HTE:', err);
        setError('Failed to load HTE. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHTE();
  }, [searchTerm]);

  /* =========================
     MOA STATUS COMPUTATION
  ========================= */
  const computeMoaStatus = (start, end) => {
    if (!start || !end) {
      return {
        text: 'N/A',
        color: 'text-gray-400',
      };
    }

    const today = new Date();
    const endDate = new Date(end);
    const daysLeft = differenceInDays(endDate, today);

    // 🔴 EXPIRED
    if (daysLeft < 0) {
      return {
        text: 'MOA EXPIRED',
        color: 'text-red-600',
      };
    }

    // 🟡 10 DAYS OR LESS
    if (daysLeft <= 10) {
      return {
        text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
        color: 'text-yellow-600',
      };
    }

    // 🔵 MORE THAN 10 DAYS
    return {
      text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
      color: 'text-blue-600',
    };
  };

  return (
    <div className="min-h-screen">
      {/* ================= HEADER & SEARCH (MATCHED TO INTERNSA) ================= */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Company</h1>
            <p className="text-gray-600 text-sm">List of HTE with MOA</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search company name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-red-500
                         focus:border-transparent text-sm w-full"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HTE TABLE ================= */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800">
            <tr>
              {[
                'No.',
                'Company Name',
                'Email',
                'Supervisor',
                'Address',
                'Nature of Business',
                'MOA Validity',
                'MOA',
              ].map((title) => (
                <th key={title} className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Loading HTE...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : HTE.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No HTE found.
                </td>
              </tr>
            ) : (
              HTE.map((company, index) => {
                const { text, color } = computeMoaStatus(company.moaStart, company.moaEnd);

                return (
                  <tr key={company.id || index}>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{company.name}</td>
                    <td className="px-6 py-4">{company.email}</td>
                    <td className="px-6 py-4">{company.supervisorName}</td>
                    <td className="px-6 py-4">{company.address}</td>
                    <td className="px-6 py-4">{company.natureOfBusiness}</td>
                    <td className={`px-6 py-4 font-semibold ${color}`}>{text}</td>

                    <td className="px-6 py-4 text-center">
                      {company.moaFile ? (
                        <a
                          href={`http://localhost:5000/uploads/${company.moaFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View MOA"
                          className="inline-flex items-center justify-center"
                        >
                          <FileText size={20} className={color} />
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HTEA;
