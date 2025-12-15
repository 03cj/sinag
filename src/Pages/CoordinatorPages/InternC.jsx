import { useEffect, useState } from 'react';

const InternC = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting
  const [sortCriteria, setSortCriteria] = useState('lastname');
  const [sortOrder] = useState('asc');

  const programOptions = ['All', 'BSIT', 'BSBA', 'BSENT', 'BEED', 'IND. ENG.'];
  const statusOptions = ['All', 'Endorsed', 'Pending', 'Accepted'];
  const sortOptions = [
    { label: 'Last Name', value: 'lastname' },
    { label: 'First Name', value: 'firstname' },
    { label: 'Student ID', value: 'studNo' },
  ];

  const [companyOptions, setCompanyOptions] = useState(['All']);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        let apiUrl = 'http://localhost:5000/api/auth/interns'; // full backend URL

        // Append filters & sorting as query params
        const params = new URLSearchParams();
        if (selectedProgram !== 'All') params.append('program', selectedProgram);
        if (selectedCompany !== 'All') params.append('company', selectedCompany);
        if (selectedStatus !== 'All') params.append('status', selectedStatus);
        if (searchTerm) params.append('name', searchTerm);
        params.append('sortBy', sortCriteria);
        params.append('sortOrder', sortOrder);

        if (params.toString()) apiUrl += `?${params.toString()}`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Normalize data & fallback values
        const normalized = data.map((intern) => ({
          studNo: intern.studentId || intern.id || 'N/A',
          lastname: intern.lastName || intern.lastname || 'N/A',
          firstname: intern.firstName || intern.firstname || 'N/A',
          mi: intern.mi || '',
          email: intern.email || 'N/A',
          program: intern.department || intern.program || 'N/A', // department column is program
          adviser: intern.Adviser ? `${intern.Adviser.firstName} ${intern.Adviser.lastName}` : 'Assign Adviser',
          company: intern.Company?.name || 'NA',
          supervisor: intern.Company?.supervisorName || 'NA',
          status: intern.status || 'NA',
        }));

        setInterns(normalized);

        // Populate company options dynamically
        const HTE = Array.from(new Set(normalized.map((i) => i.company))).sort();
        setCompanyOptions(['All', ...HTE]);
      } catch (err) {
        console.error(err);
        setError('Unable to load intern records.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, [selectedProgram, selectedCompany, selectedStatus, searchTerm, sortCriteria, sortOrder]);

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
            {/* Program Filter */}
            <select
              className="px-4 py-2 border rounded-md"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              {programOptions.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'Programs' : p}
                </option>
              ))}
            </select>

            {/* Company Filter */}
            <select
              className="px-4 py-2 border rounded-md"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companyOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'Company name' : c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'Status' : s}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="px-4 py-2 border rounded-md"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort by {o.label}
                </option>
              ))}
            </select>

            {/* Search */}
            <input
              type="text"
              placeholder="Search name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Interns Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800 text-white text-xs uppercase">
            <tr>
              {[
                'Stud No',
                'Lastname',
                'Firstname',
                'MI',
                'Email',
                'Program',
                'Adviser',
                'Company',
                'Supervisor',
                'Status',
              ].map((title) => (
                <th key={title} className="px-6 py-3 text-left font-bold">
                  {title}
                </th>
              ))}
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
            {!loading && !error && interns.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No matching interns found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              interns.map((i, index) => (
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
