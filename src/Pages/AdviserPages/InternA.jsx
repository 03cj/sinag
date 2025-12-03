import { useEffect, useState } from 'react';

// --- Placeholder for fetching the logged-in user's department ---
// Replace with real logic: context, Redux, or API.
const ADVISER_DEPARTMENT = 'BSIT';

const InternA = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [sortCriteria, setSortCriteria] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('asc');

  const companyOptions = ['All', 'AAA', 'BBB', 'CCC', 'DDD'];
  const statusOptions = ['All', 'Endorsed', 'Pending'];
  const sortOptions = [
    { label: 'Last Name', value: 'lastName' },
    { label: 'First Name', value: 'firstName' },
    { label: 'Student ID', value: 'studentId' },
  ];

  useEffect(() => {
    const fetchInternsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/auth/interns?department=${ADVISER_DEPARTMENT}`, {
          credentials: 'include', // needed for JWT cookies
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawInterns = await response.json();

        // --- Client-side search filter ---
        let filtered = rawInterns.filter((intern) => {
          if (searchTerm) {
            const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
            if (!fullName.includes(searchTerm.toLowerCase())) return false;
          }
          return true;
        });

        // --- Sorting ---
        const sorted = [...filtered].sort((a, b) => {
          let valueA = a[sortCriteria];
          let valueB = b[sortCriteria];

          if (sortCriteria === 'studentId') {
            valueA = parseInt(valueA, 10);
            valueB = parseInt(valueB, 10);
          } else {
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
          }

          if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
          if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        setInterns(sorted);
      } catch (err) {
        console.error('Failed to load interns:', err);
        setError('Failed to load interns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInternsData();
  }, [selectedCompany, selectedStatus, searchTerm, sortCriteria, sortOrder]);

  return (
    <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
      {/* Header & Filters */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Interns</h1>
            <p className="text-gray-600 text-sm">Interns record</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Company Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companyOptions.map((company) => (
                <option key={company} value={company}>
                  {company === 'All' ? 'Company name' : company}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'Status' : status}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Type intern's name"
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Stud. No.</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Lastname</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Firstname</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">MI.</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Supervisor</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Loading interns...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && interns.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No interns found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              interns.map((intern) => (
                <tr key={intern.studentId}>
                  <td className="px-6 py-4 text-sm">{intern.studentId}</td>
                  <td className="px-6 py-4 text-sm">{intern.lastName}</td>
                  <td className="px-6 py-4 text-sm">{intern.firstName}</td>
                  <td className="px-6 py-4 text-sm">N/A</td>
                  <td className="px-6 py-4 text-sm">{intern.email}</td>
                  <td className="px-6 py-4 text-sm">{intern.department}</td>

                  {/* Placeholder fields until backend provides internship records */}
                  <td className="px-6 py-4 text-sm">N/A</td>
                  <td className="px-6 py-4 text-sm">N/A</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternA;
