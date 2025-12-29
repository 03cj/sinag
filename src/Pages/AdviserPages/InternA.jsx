import { Pencil, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AddIntern from './AddIntern';
import EditIntern from './EditIntern';
import Endorsement from './Endorsement';

/* =========================
   HELPER: GET ADVISER PROGRAM
========================= */
const getAdviserProgramFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.program?.trim().toLowerCase() || null;
  } catch {
    return null;
  }
};

/* =========================
   STATUS DROPDOWN
========================= */
const StatusDropdown = ({ intern, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const color =
    intern.status === 'Approved'
      ? 'bg-green-600'
      : intern.status === 'Disapproved'
      ? 'bg-red-600'
      : 'bg-yellow-500';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`rounded-full px-3 py-1 text-xs font-bold text-white ${color}`}
      >
        {intern.status}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-md z-10">
          {['Pending', 'Approved', 'Disapproved'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setOpen(false);
                onStatusChange(intern.studNo, s);
              }}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================
   INTERN A
========================= */
const InternA = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddInternForm, setShowAddInternForm] = useState(false);
  const [internForEndorsement, setInternForEndorsement] = useState(null);

  /* EDIT */
  const [showEditInternForm, setShowEditInternForm] = useState(false);
  const [internToEdit, setInternToEdit] = useState(null);

  /* DELETE */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [internToDelete, setInternToDelete] = useState(null);

  /* =========================
     FETCH INTERNS
  ========================= */
  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      setError(null);

      try {
        const adviserProgram = getAdviserProgramFromToken();

        const res = await fetch('http://localhost:5000/api/auth/interns', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch interns');
        const data = await res.json();

        const normalized = data
          .filter((i) =>
            adviserProgram
              ? i.User?.program?.toLowerCase() === adviserProgram
              : true
          )
          .filter((i) =>
            searchTerm
              ? `${i.User.firstName} ${i.User.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              : true
          )
          .map((i) => {
            const docs = {};
            i.User?.InternDocs?.forEach((d) => {
              docs[d.docType] = `http://localhost:5000/uploads/${d.filePath}`;
            });

            return {
              id: i.id,
              studNo: i.User.studentId,
              lastname: i.User.lastName,
              firstname: i.User.firstName,
              mi: i.User.mi || '',
              email: i.User.email,
              program: i.User.program,
              goodMoral: docs.goodMoral,
              cor: docs.cor,
              medical: docs.medicalClearance,
              insurance: docs.insurance,
              resume: docs.resume,
              status: i.status,
              remarks: i.remarks,
            };
          });

        setInterns(normalized);
      } catch (err) {
        console.error(err);
        setError('Failed to load intern documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, [searchTerm]);

  /* =========================
     HANDLERS
  ========================= */
  const handleStatusChange = (studNo, status) => {
    if (status === 'Approved') {
      setInternForEndorsement(interns.find((i) => i.studNo === studNo));
    } else {
      setInterns((prev) =>
        prev.map((i) => (i.studNo === studNo ? { ...i, status } : i))
      );
    }
  };

  const handleEditClick = (intern) => {
    setInternToEdit(intern);
    setShowEditInternForm(true);
  };

  const handleDeleteClick = (intern) => {
    setInternToDelete(intern);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!internToDelete) return;

    try {
      // TODO: backend DELETE
      // await fetch(`http://localhost:5000/api/auth/interns/${internToDelete.id}`, {
      //   method: 'DELETE',
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      // });

      setInterns((prev) =>
        prev.filter((i) => i.studNo !== internToDelete.studNo)
      );
      setShowDeleteConfirm(false);
      setInternToDelete(null);
    } catch {
      alert('Failed to delete intern');
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Intern Documents</h1>
            <p className="text-gray-600 text-sm">
              Review intern submission documents
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddInternForm(true)}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg"
            >
              Add Intern
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search intern name"
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800">
            <tr>
              {[
                'Actions',
                'Stud No',
                'Lastname',
                'Firstname',
                'MI',
                'Good Moral',
                'COR',
                'Medical',
                'Insurance',
                'Resume',
                'Status',
              ].map((h, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-xs font-bold text-white uppercase ${
                    i === 0 ? 'text-center rounded-tl-lg' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {loading && (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  Loading interns...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan="11" className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              interns.map((i) => (
                <tr key={i.studNo}>
                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(i)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(i)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4">{i.studNo}</td>
                  <td className="px-6 py-4">{i.lastname}</td>
                  <td className="px-6 py-4">{i.firstname}</td>
                  <td className="px-6 py-4">{i.mi}</td>

                  {['goodMoral', 'cor', 'medical', 'insurance', 'resume'].map(
                    (d) => (
                      <td key={d} className="px-6 py-4">
                        {i[d] ? (
                          <a
                            href={i[d]}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            .pdf
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    )
                  )}

                  <td className="px-6 py-4">
                    <StatusDropdown intern={i} onStatusChange={handleStatusChange} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* EDIT INTERN MODAL */}
      {showEditInternForm && internToEdit && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <EditIntern
            intern={internToEdit}
            onUpdate={(updated) => {
              setInterns((prev) =>
                prev.map((i) => (i.studNo === updated.studNo ? updated : i))
              );
              setShowEditInternForm(false);
              setInternToEdit(null);
            }}
            onCancel={() => {
              setShowEditInternForm(false);
              setInternToEdit(null);
            }}
          />
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && internToDelete && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-red-900 rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Remove Intern
            </h2>
            <p className="text-white mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {internToDelete.firstname} {internToDelete.lastname}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-yellow-500 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD INTERN MODAL */}
      {showAddInternForm && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <AddIntern
            onAddSucess={() => setShowAddInternForm(false)}
            onCancel={() => setShowAddInternForm(false)}
          />
        </div>
      )}

      {/* ENDORSEMENT */}
      {internForEndorsement && (
        <Endorsement
          intern={internForEndorsement}
          onClose={() => setInternForEndorsement(null)}
        />
      )}
    </>
  );
};

export default InternA;
