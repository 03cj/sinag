import { useEffect, useMemo, useState } from 'react';

/* =========================
   GET ADVISER PROGRAM
========================= */
const getAdviserProgramFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    return payload?.program
      ? payload.program.trim().toLowerCase()
      : null;
  } catch (err) {
    console.error('❌ Failed to decode token:', err);
    return null;
  }
};

const InternAinDashboardA = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     ADVISER PROGRAM
  ========================= */
  const adviserProgram = useMemo(
    () => getAdviserProgramFromToken(),
    []
  );

  /* =========================
     SORTING
  ========================= */
  const [sortCriteria, setSortCriteria] = useState('lastname');
  const [sortOrder, setSortOrder] = useState('asc');

  /* =========================
     FETCH INTERNS
  ========================= */
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

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        /* =========================
           FILTER BY PROGRAM
        ========================= */
        const filtered = data.filter((intern) => {
          const internProgram =
            intern.User?.program || intern.program;

          if (!internProgram || !adviserProgram) return false;

          return (
            internProgram.trim().toLowerCase() === adviserProgram
          );
        });

        /* =========================
           NORMALIZE DATA
        ========================= */
        const normalized = filtered.map((intern) => ({
          studNo: intern.User?.studentId ?? 'N/A',
          lastname: intern.User?.lastName ?? 'N/A',
          firstname: intern.User?.firstName ?? 'N/A',
          mi: intern.User?.mi ?? '',
          email: intern.User?.email ?? 'N/A',
          company: intern.Company?.name ?? 'NA',
          supervisor: intern.Company?.supervisorName ?? 'NA',
          status: intern.status ?? 'NA',
        }));

        setInterns(normalized);
      } catch (err) {
        console.error('❌ Failed to fetch interns:', err);
        setError(err.message || 'Failed to load interns.');
      } finally {
        setLoading(false);
      }
    };

    if (!adviserProgram) {
      setError('Unable to determine adviser program.');
      setLoading(false);
      return;
    }

    fetchInterns();
  }, [adviserProgram]);

  /* =========================
     SORTING LOGIC
  ========================= */
  const handleSort = (field) => {
    if (sortCriteria === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCriteria(field);
      setSortOrder('asc');
    }
  };

  const processedInterns = [...interns].sort((a, b) => {
    const valueA = String(a[sortCriteria] ?? '').toLowerCase();
    const valueB = String(b[sortCriteria] ?? '').toLowerCase();

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderArrow = (field) => {
    if (sortCriteria !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="bg-white rounded-lg shadow-md border overflow-hidden">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-red-800 text-white">
          <tr>
            <th onClick={() => handleSort('studNo')} className="px-6 py-3 cursor-pointer">
              Stud. No. {renderArrow('studNo')}
            </th>
            <th onClick={() => handleSort('lastname')} className="px-6 py-3 cursor-pointer">
              Lastname {renderArrow('lastname')}
            </th>
            <th onClick={() => handleSort('firstname')} className="px-6 py-3 cursor-pointer">
              Firstname {renderArrow('firstname')}
            </th>
            <th className="px-6 py-3">MI.</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Company</th>
            <th className="px-6 py-3">Supervisor</th>
            <th className="px-6 py-3">Status</th>
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
                No interns found for your program.
              </td>
            </tr>
          ) : (
            processedInterns.map((i, index) => (
              <tr key={`${i.studNo}-${index}`} className="hover:bg-gray-50">
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

export default InternAinDashboardA;
