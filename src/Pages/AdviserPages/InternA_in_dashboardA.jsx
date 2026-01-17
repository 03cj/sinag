import { CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AdviserReportModal from '../../Components/AdviserReportModal';

/* =========================
   GET ADVISER PROGRAM
========================= */
const getAdviserProgramFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    return payload?.program ? payload.program.trim().toLowerCase() : null;
  } catch (err) {
    console.error('❌ Failed to decode token:', err);
    return null;
  }
};

const InternA_in_dashboardA = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    selectedIntern: null,
  });

  /* =========================
     ADVISER PROGRAM
  ========================= */
  const adviserProgram = useMemo(() => getAdviserProgramFromToken(), []);

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

        console.log('📋 RAW API RESPONSE:', data);
        if (data.length > 0) {
          console.log('📋 FIRST INTERN OBJECT:', data[0]);
          console.log('📋 FIRST INTERN ID:', data[0].id);
        }

        /* =========================
           🔒 SAFETY CHECK (CRITICAL)
        ========================= */
        if (!Array.isArray(data)) {
          console.error('Expected array but got:', data);
          setInterns([]);
          setError('Failed to load interns.');
          setLoading(false);
          return;
        }

        /* =========================
           FILTER BY PROGRAM
        ========================= */
        const filtered = data.filter((intern) => {
          const internProgram = intern.student?.program || intern.program;

          if (!internProgram || !adviserProgram) return false;

          return internProgram.trim().toLowerCase() === adviserProgram;
        });

        console.log('📋 FILTERED INTERNS:', filtered);

        /* =========================
           NORMALIZE DATA - KEEP ID!
        ========================= */
        const normalized = filtered.map((intern) => {
          const normalizedIntern = {
            id: intern.id,
            studNo: intern.student?.studentId ?? 'N/A',
            lastname: intern.student?.lastName ?? 'N/A',
            firstname: intern.student?.firstName ?? 'N/A',
            mi: intern.student?.mi ?? '',
            email: intern.student?.email ?? 'N/A',
            company: intern.company?.name ?? 'N/A',
            companyEmail: intern.company?.email ?? 'N/A',
            supervisor: intern.company?.supervisorName ?? 'N/A',
          };
          console.log('📋 NORMALIZED INTERN:', normalizedIntern);
          return normalizedIntern;
        });

        setInterns(normalized);
      } catch (err) {
        console.error('❌ Failed to fetch interns:', err);
        setError(err.message || 'Failed to load interns.');
        setInterns([]);
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

  const openReportModal = (intern) => {
    console.log('📋 OPENING MODAL WITH INTERN:', intern);
    setReportModal({ isOpen: true, selectedIntern: intern });
  };

  const closeReportModal = () => {
    setReportModal({ isOpen: false, selectedIntern: null });
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <table className="min-w-full border-collapse divide-y divide-gray-300">
          <thead className="bg-red-800 text-white">
            <tr>
              <th onClick={() => handleSort('studNo')} className="px-6 py-3 cursor-pointer text-xs font-bold uppercase">
                Stud No {renderArrow('studNo')}
              </th>
              <th
                onClick={() => handleSort('lastname')}
                className="px-6 py-3 cursor-pointer text-xs font-bold uppercase"
              >
                Lastname {renderArrow('lastname')}
              </th>
              <th
                onClick={() => handleSort('firstname')}
                className="px-6 py-3 cursor-pointer text-xs font-bold uppercase"
              >
                Firstname {renderArrow('firstname')}
              </th>
              <th className="px-6 py-3 text-xs font-bold uppercase">MI</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Company</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Supervisor</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Company Email</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Reports</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  Loading interns...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : processedInterns.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
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
                  <td className="px-6 py-4">{i.companyEmail}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openReportModal(i)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="View reports"
                    >
                      <CheckCircle2 className="h-6 w-6 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADVISER REPORT MODAL */}
      <AdviserReportModal isOpen={reportModal.isOpen} onClose={closeReportModal} intern={reportModal.selectedIntern} />
    </>
  );
};

export default InternA_in_dashboardA;
