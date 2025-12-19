import { useEffect, useState } from 'react';

const InternA = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SORTING (DEFAULT: LASTNAME)
  const [sortCriteria, setSortCriteria] = useState('lastname');
  const [sortOrder, setSortOrder] = useState('asc');

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
      } catch (err) {
        console.error('Failed to fetch interns:', err);
        setError(err.message || 'Failed to load interns.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);

  // Handle column click
  const handleSort = (field) => {
    if (sortCriteria === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(field);
      setSortOrder('asc');
    }
  };

  // Sort interns
  const processedInterns = [...interns].sort((a, b) => {
    let valueA = a[sortCriteria];
    let valueB = b[sortCriteria];

    if (sortCriteria === 'studNo') {
      valueA = parseInt(valueA, 10);
      valueB = parseInt(valueB, 10);
    } else {
      valueA = String(valueA || '').toLowerCase();
      valueB = String(valueB || '').toLowerCase();
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Arrow indicator
  const renderArrow = (field) => {
    if (sortCriteria !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border overflow-hidden">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-red-800 text-white">
          <tr>
            <th
              onClick={() => handleSort('studNo')}
              className="px-6 py-3 text-left text-xs font-bold uppercase cursor-pointer select-none"
            >
              Stud. No. {renderArrow('studNo')}
            </th>
            <th
              onClick={() => handleSort('lastname')}
              className="px-6 py-3 text-left text-xs font-bold uppercase cursor-pointer select-none"
            >
              Lastname {renderArrow('lastname')}
            </th>
            <th
              onClick={() => handleSort('firstname')}
              className="px-6 py-3 text-left text-xs font-bold uppercase cursor-pointer select-none"
            >
              Firstname {renderArrow('firstname')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase">MI.</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Company</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Supervisor</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                Loading interns...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="8" className="text-center p-4 text-red-500">
                {error}
              </td>
            </tr>
          ) : processedInterns.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                No interns found.
              </td>
            </tr>
          ) : (
            processedInterns.map((i) => (
              <tr key={i.studNo} className="hover:bg-gray-50">
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
  );
};

export default InternA;
