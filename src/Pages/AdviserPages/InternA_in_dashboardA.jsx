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

/* =========================
   STATUS STYLE (MATCH InternA)
========================= */
const getStatusStyle = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-600 text-white';
    case 'Disapproved':
      return 'bg-red-600 text-white';
    case 'Pending':
    default:
      return 'bg-yellow-500 text-white';
  }
};

const InternA_in_dashboardA = () => {
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
          status: intern.status ?? 'Pending',
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
    <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
      <table className="min-w-full border-collapse divide-y divide-gray-300">
        <thead className="bg-red-800 text-white">
          <tr>
            <th onClick={() => handleSort('studNo')} className="px-6 py-3 cursor-pointer text-xs font-bold uppercase">
              Stud No {renderArrow('studNo')}
            </th>
            <th onClick={() => handleSort('lastname')} className="px-6 py-3 cursor-pointer text-xs font-bold uppercase">
              Lastname {renderArrow('lastname')}
            </th>
            <th onClick={() => handleSort('firstname')} className="px-6 py-3 cursor-pointer text-xs font-bold uppercase">
              Firstname {renderArrow('firstname')}
            </th>
            <th className="px-6 py-3 text-xs font-bold uppercase">MI</th>
            <th className="px-6 py-3 text-xs font-bold uppercase">Email</th>
            <th className="px-6 py-3 text-xs font-bold uppercase">Company</th>
            <th className="px-6 py-3 text-xs font-bold uppercase">Supervisor</th>
            <th className="px-6 py-3 text-xs font-bold uppercase">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-sm">
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Loading interns...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-red-500">
                {error}
              </td>
            </tr>
          ) : processedInterns.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
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
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(i.status)}`}
                  >
                    {i.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InternA_in_dashboardA;
