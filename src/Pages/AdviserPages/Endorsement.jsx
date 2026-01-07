// Endorsement.jsx
import { useEffect, useState } from 'react';

const Endorsement = ({ intern, onClose }) => {
  /* =========================
     STATE
  ========================= */
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [hrName, setHrName] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!intern) return null;

  /* =========================
     INTERN NAME
  ========================= */
  const internFullName =
    intern?.firstname && intern?.lastname
      ? `${intern.firstname} ${intern.lastname}`
      : intern?.User?.firstName && intern?.User?.lastName
      ? `${intern.User.firstName} ${intern.User.lastName}`
      : 'Selected Intern';

  /* =========================
     FETCH COMPANIES (HTE)
  ========================= */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/HTE', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch companies');

        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompanies();
  }, []);

  /* =========================
     HANDLE COMPANY SELECT
  ========================= */
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompanyId(companyId);

    const selected = companies.find((c) => String(c.id) === companyId);

    if (selected) {
      setCompanyName(selected.name || '');
      setCompanyAddress(selected.address || '');
      setHrName(selected.supervisorName || '');
    }
  };

  /* =========================
     SAVE TO DB (NO PDF)
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCompanyId || !position || !startDate) {
      setErrorMessage('⚠ Please fill out all required fields.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/interns/${intern.id}/assign-hte`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            companyId: selectedCompanyId,
            position,
            startDate,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to save');

      alert('✅ HTE successfully assigned');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('❌ Failed to save endorsement');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-1">
          Assign Host Training Establishment (HTE)
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Placement for:{' '}
          <span className="font-semibold text-red-700">
            {internFullName}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* COMPANY DROPDOWN */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Company / HTE
            </label>
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* COMPANY NAME (READ ONLY) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              value={companyName}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Address
            </label>
            <input
              value={companyAddress}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* HR */}
          <div>
            <label className="block text-sm font-medium mb-1">
              HR / Supervisor
            </label>
            <input
              value={hrName}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* POSITION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Intern Position
            </label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Internship Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm">{errorMessage}</div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Endorsement;
