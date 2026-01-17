import { useEffect, useState } from 'react';

const InternC = () => {
  const [interns, setInterns] = useState([]);
  const [advisers, setAdvisers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting
  const [sortField, setSortField] = useState('lastname');
  const [sortOrder, setSortOrder] = useState('asc');

  /* =========================
     FETCH ADVISERS
     (1 ADVISER → 1 PROGRAM)
  ========================= */
  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/advisers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch advisers');

        const data = await res.json();
        setAdvisers(data);
      } catch (err) {
        console.error('Failed to load advisers:', err);
      }
    };

    fetchAdvisers();
  }, []);

  /* =========================
     FETCH INTERNS
     (1 PROGRAM → MANY INTERNS)
  ========================= */
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/interns', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const normalized = data.map((intern) => {
          // ✅ FIXED: Changed User to student, Company to company (lowercase)
          const internProgram = intern.student?.program || intern.program;

          const matchedAdviser = advisers.find((adv) => adv.program === internProgram);

          return {
            studNo: intern.student?.studentId || 'N/A',
            lastname: intern.student?.lastName || 'N/A',
            firstname: intern.student?.firstName || 'N/A',
            mi: intern.student?.mi || '',
            email: intern.student?.email || 'N/A',
            program: internProgram || 'N/A',
            adviser: matchedAdviser ? `${matchedAdviser.firstName} ${matchedAdviser.lastName}` : 'N/A',
            company: intern.company?.name || 'NA',
            supervisor: intern.company?.supervisorName || 'NA',
            status: intern.status || 'NA',
          };
        });

        setInterns(normalized);
      } catch (err) {
        console.error(err);
        setError('Unable to load intern records.');
      } finally {
        setLoading(false);
      }
    };

    if (advisers.length > 0) {
      fetchInterns();
    }
  }, [advisers]);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredInterns = interns.filter((intern) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    return (
      intern.lastname.toLowerCase().includes(term) ||
      intern.firstname.toLowerCase().includes(term) ||
      intern.studNo.toLowerCase().includes(term) ||
      intern.email.toLowerCase().includes(term)
    );
  });

  /* =========================
     SORTING
  ========================= */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortArrow = ({ active }) => {
    if (!active) return <span className="ml-1 text-gray-300">↕</span>;
    return <span className="ml-1 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const sortedInterns = [...filteredInterns].sort((a, b) => {
    const aVal = a[sortField]?.toString().toLowerCase() || '';
    const bVal = b[sortField]?.toString().toLowerCase() || '';

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  /* =========================
     UI (UNCHANGED)
  ========================= */
  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Interns</h1>
            <p className="text-gray-600 text-sm">Interns record</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search intern name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm"
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

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800 text-white text-xs uppercase">
            <tr>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('studNo')}>
                Stud ID <SortArrow active={sortField === 'studNo'} />
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('lastname')}>
                Lastname <SortArrow active={sortField === 'lastname'} />
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('firstname')}>
                Firstname <SortArrow active={sortField === 'firstname'} />
              </th>
              <th className="px-6 py-3">MI</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Program</th>
              <th className="px-6 py-3">Adviser</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Supervisor</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {loading && (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  Loading interns...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan="10" className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && sortedInterns.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No interns found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              sortedInterns.map((i, index) => (
                <tr key={`${i.studNo}-${index}`}>
                  <td className="px-6 py-4">{i.studNo}</td>
                  <td className="px-6 py-4">{i.lastname}</td>
                  <td className="px-6 py-4">{i.firstname}</td>
                  <td className="px-6 py-4">{i.mi}</td>
                  <td className="px-6 py-4">{i.email}</td>
                  <td className="px-6 py-4">{i.program}</td>
                  <td className="px-6 py-4">{i.adviser}</td>
                  <td className="px-6 py-4">{i.company}</td>
                  <td className="px-6 py-4">{i.supervisor}</td>
                  <td className="px-6 py-4">{i.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternC;
