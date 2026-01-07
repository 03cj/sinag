import { differenceInDays } from 'date-fns';
import { FileText, Pencil, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import AddNewCompany from './AddNewCompany';
import UpdateMoa from './UpdateMOA';

const HTEC = () => {
  const [HTE, setHTE] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddNewCompanyForm, setShowAddNewCompanyForm] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  /* ================= FETCH HTE ================= */
  useEffect(() => {
    const fetchHTE = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/api/auth/HTE', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setHTE(data);
      } catch (err) {
        console.error('Failed to fetch HTE:', err);
        setError('Failed to load HTE. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHTE();
  }, []);

  /* ================= MOA STATUS ================= */
  const computeMoaStatus = (start, end) => {
    if (!start || !end) {
      return {
        text: 'N/A',
        color: 'text-gray-400',
      };
    }

    const today = new Date();
    const endDate = new Date(end);
    const daysLeft = differenceInDays(endDate, today);

    // 🔴 EXPIRED
    if (daysLeft < 0) {
      return {
        text: 'MOA EXPIRED',
        color: 'text-red-600',
      };
    }

    // 🟡 10 DAYS OR LESS
    if (daysLeft <= 10) {
      return {
        text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
        color: 'text-yellow-600',
      };
    }

    // 🔵 MORE THAN 10 DAYS
    return {
      text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
      color: 'text-blue-600',
    };
  };

  /* ================= DELETE ================= */
  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/HTE/${companyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete HTE');
      }

      setHTE((prev) => prev.filter((c) => c.id !== companyToDelete.id));
      setCompanyToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete HTE.');
    }
  };

  /* ================= FILTER ================= */
  const filteredHTE = HTE.filter((company) => company.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Host Training Establishments</h1>
            <p className="text-gray-600 text-sm">List of HTE with MOA</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddNewCompanyForm(true)}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg"
            >
              Register new HTE
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search HTE name"
                className="pl-4 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-red-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800">
            <tr>
              {['ACTIONS', 'NO.', 'HTE', 'EMAIL', 'SUPERVISOR', 'ADDRESS', 'NATURE', 'MOA VALIDITY', 'MOA'].map(
                (title, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-3 text-xs font-bold text-white uppercase ${
                      idx === 0 ? 'text-center rounded-tl-lg' : idx === 8 ? 'rounded-tr-lg' : ''
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
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  Loading HTE...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredHTE.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No HTE found.
                </td>
              </tr>
            ) : (
              filteredHTE.map((company, index) => {
                const { text, color } = computeMoaStatus(company.moaStart, company.moaEnd);

                return (
                  <tr key={company.id}>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowUpdateConfirm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil size={16} />
                        </button>

                        <button onClick={() => handleDeleteClick(company)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{company.name}</td>
                    <td className="px-6 py-4">{company.email}</td>
                    <td className="px-6 py-4">{company.supervisorName}</td>
                    <td className="px-6 py-4">{company.address}</td>
                    <td className="px-6 py-4">{company.natureOfBusiness}</td>

                    <td className={`px-6 py-4 font-semibold ${color}`}>{text}</td>

                    <td className="px-6 py-4 text-center">
                      {company.moaFile ? (
                        <a
                          href={`http://localhost:5000/uploads/${company.moaFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View MOA"
                          className="inline-flex items-center justify-center"
                        >
                          <FileText size={20} className={color} />
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteConfirm && companyToDelete && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-red-900 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold text-yellow-500 mb-4">Remove HTE</h2>
            <p className="text-white mb-6">
              Are you sure you want to delete <b>{companyToDelete.name}</b>?
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

      {/* ================= UPDATE MOA MODAL ================= */}
      {showUpdateConfirm && selectedCompany && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <UpdateMoa
            company={selectedCompany}
            onCancel={() => setShowUpdateConfirm(false)}
            onUpdateSuccess={(updatedCompany) => {
              setHTE((prev) => prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c)));
              setShowUpdateConfirm(false);
            }}
          />
        </div>
      )}

      {/* ================= ADD HTE MODAL ================= */}
      {showAddNewCompanyForm && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
          <AddNewCompany
            onAddSuccess={(newCompany) => {
              setHTE((prev) => [...prev, newCompany]);
              setShowAddNewCompanyForm(false);
            }}
            onCancel={() => setShowAddNewCompanyForm(false)}
          />
        </div>
      )}
    </>
  );
};

export default HTEC;
