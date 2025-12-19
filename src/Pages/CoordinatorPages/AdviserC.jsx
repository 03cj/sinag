import { Pencil, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddAdviser from './AddAdviser';
import EditAdviser from './EditAdviser';

const AdviserC = () => {
  const [advisers, setAdvisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddAdviserForm, setShowAddAdviserForm] = useState(false);

  const [showEditAdviserForm, setShowEditAdviserForm] = useState(false);
  const [adviserToEdit, setAdviserToEdit] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adviserToDelete, setAdviserToDelete] = useState(null);

  /* =========================
     FETCH ADVISERS
  ========================= */
  useEffect(() => {
    const fetchAdvisers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/api/auth/advisers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setAdvisers(data);
      } catch (err) {
        console.error('Failed to fetch advisers:', err);
        setError('Failed to load advisers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisers();
  }, []);

  /* =========================
     SEARCH
  ========================= */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdvisers = advisers.filter((adviser) => {
    const first = adviser.firstName?.toLowerCase() || adviser.firstname?.toLowerCase() || '';
    const last = adviser.lastName?.toLowerCase() || adviser.lastname?.toLowerCase() || '';
    return first.includes(searchTerm.toLowerCase()) || last.includes(searchTerm.toLowerCase());
  });

  /* =========================
     EDIT
  ========================= */
  const handleEditClick = (adviser) => {
    setAdviserToEdit(adviser);
    setShowEditAdviserForm(true);
  };

  /* =========================
     DELETE
  ========================= */
  const handleDeleteClick = (adviser) => {
    setAdviserToDelete(adviser);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!adviserToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/advisers/${adviserToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete adviser');
      }

      // Update UI ONLY after backend success
      setAdvisers((prev) => prev.filter((a) => a.id !== adviserToDelete.id));

      setShowDeleteConfirm(false);
      setAdviserToDelete(null);
    } catch (err) {
      console.error('Delete adviser error:', err);
      alert(err.message || 'Failed to delete adviser.');
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Programs Advisers</h1>
            <p className="text-gray-600 text-sm">List of Program Advisers</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end w-full sm:w-auto">
            <button
              onClick={() => setShowAddAdviserForm(true)}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg"
            >
              Register new Adviser
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search Adviser name"
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
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
              {['ACTIONS', 'ID no.', 'Lastname', 'Firstname', 'MI.', 'Email', 'Program', 'Interns'].map(
                (title, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-3 text-xs font-bold text-white uppercase tracking-wider ${
                      idx === 0 ? 'text-center rounded-tl-lg' : idx === 7 ? 'rounded-tr-lg' : ''
                    }`}
                  >
                    {title}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Loading advisers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredAdvisers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No advisers found.
                </td>
              </tr>
            ) : (
              filteredAdvisers.map((adviser) => (
                <tr key={adviser.id}>
                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(adviser)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label="Edit adviser"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(adviser)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete adviser"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">{adviser.employeeId}</td>
                  <td className="px-6 py-4 text-sm">{adviser.lastName}</td>
                  <td className="px-6 py-4 text-sm">{adviser.firstName}</td>
                  <td className="px-6 py-4 text-sm">{adviser.mi}</td>
                  <td className="px-6 py-4 text-sm">{adviser.email}</td>
                  <td className="px-6 py-4 text-sm">{adviser.department}</td>
                  <td className="px-6 py-4 text-sm">{adviser.interns}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && adviserToDelete && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-red-900 rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold text-yellow-500 mb-4">Remove Adviser</h2>
            <p className="text-white mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {adviserToDelete.firstName} {adviserToDelete.lastName}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-yellow-500 rounded-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADVISER MODAL */}
      {showAddAdviserForm && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <AddAdviser
            onAddSuccess={(newAdviser) => {
              setAdvisers((prev) => [...prev, newAdviser]);
              setShowAddAdviserForm(false);
            }}
            onCancel={() => setShowAddAdviserForm(false)}
          />
        </div>
      )}

      {/* EDIT ADVISER MODAL */}
      {showEditAdviserForm && adviserToEdit && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <EditAdviser
            adviser={adviserToEdit}
            onUpdate={(updatedAdviser) => {
              setAdvisers((prev) => prev.map((a) => (a.id === updatedAdviser.id ? updatedAdviser : a)));
              setShowEditAdviserForm(false);
              setAdviserToEdit(null);
            }}
            onCancel={() => {
              setShowEditAdviserForm(false);
              setAdviserToEdit(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default AdviserC;
