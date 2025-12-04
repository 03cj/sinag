import React, { useState, useEffect } from 'react';

const InternA = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting states
  const [sortCriteria, setSortCriteria] = useState('lastname');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortOptions = [
    { label: 'Last Name', value: 'lastname' },
    { label: 'First Name', value: 'firstname' },
    { label: 'Student ID', value: 'studNo' },
  ];

  const [companyOptions, setCompanyOptions] = useState(['All']);
  const statusOptions = ['All', 'Endorsed', 'Pending'];

  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/auth/interns', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setInterns(data);

        // Optional: populate company options dynamically
        const companies = Array.from(new Set(data.map(i => i.company))).sort();
        setCompanyOptions(['All', ...companies]);
      } catch (err) {
        console.error('Failed to fetch interns:', err);
        setError(err.message || 'Failed to load interns.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);


  // Apply filtering & sorting client-side
  const processedInterns = interns
    .filter(i => (selectedCompany !== 'All' ? i.company === selectedCompany : true))
    .filter(i => (selectedStatus !== 'All' ? i.status === selectedStatus : true))
    .filter(i => (searchTerm ? `${i.firstname} ${i.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) : true))
    .sort((a, b) => {
      let valueA = a[sortCriteria];
      let valueB = b[sortCriteria];
      if (sortCriteria === 'studNo') {
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

  return (
    <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Interns</h1>
            <p className="text-gray-600 text-sm">Interns record</p>
          </div>
          <div className="flex items-center space-x-3">
            <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} className="px-4 py-2 border rounded-md">
              {companyOptions.map(c => <option key={c} value={c}>{c === 'All' ? 'Company name' : c}</option>)}
            </select>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-4 py-2 border rounded-md">
              {statusOptions.map(s => <option key={s} value={s}>{s === 'All' ? 'Status' : s}</option>)}
            </select>
            <select value={sortCriteria} onChange={e => setSortCriteria(e.target.value)} className="px-4 py-2 border rounded-md">
              {sortOptions.map(o => <option key={o.value} value={o.value}>Sort by {o.label}</option>)}
            </select>
            <input
              type="text"
              placeholder="Type interns name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Interns Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Stud. no.</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Lastname</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Firstname</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">MI.</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Supervisor</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center p-4 text-gray-500">Loading interns...</td></tr>
            ) : error ? (
              <tr><td colSpan="8" className="text-center p-4 text-red-500">{error}</td></tr>
            ) : processedInterns.length === 0 ? (
              <tr><td colSpan="8" className="text-center p-4 text-gray-500">No interns found.</td></tr>
            ) : (
              processedInterns.map(i => (
                <tr key={i.studNo}>
                  <td className="px-6 py-4">{i.studNo}</td>
                  <td className="px-6 py-4">{i.lastname}</td>
                  <td className="px-6 py-4">{i.firstname}</td>
                  <td className="px-6 py-4">{i.mi}</td>
                  <td className="px-6 py-4">{i.email}</td>
                  <td className="px-6 py-4">{i.company}</td>
                  <td className="px-6 py-4">{i.supervisor}</td>
                  <td className="px-6 py-4">{i.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternA;
