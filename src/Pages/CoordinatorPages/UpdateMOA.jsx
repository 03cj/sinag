import { useState } from 'react';

const UpdateHTE = ({ company, onCancel, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: company.name || '',
    email: company.email || '',
    supervisorName: company.supervisorName || '',
    address: company.address || '',
    natureOfBusiness: company.natureOfBusiness || '',
    moaStart: company.moaStart || '',
    moaEnd: company.moaEnd || '',
    moaFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* =========================
     HANDLE CHANGE
     AUTO CAPS (EXCEPT EMAIL)
  ========================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'moaFile') {
      setFormData((prev) => ({ ...prev, moaFile: files[0] }));
      return;
    }

    const uppercaseFields = ['name', 'supervisorName', 'address', 'natureOfBusiness'];

    setFormData((prev) => ({
      ...prev,
      [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value,
    }));
  };

  /* =========================
     SUBMIT UPDATE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.moaStart || !formData.moaEnd) {
      setError('MOA start and end dates are required.');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) payload.append(key, value);
      });

      const res = await fetch(`http://localhost:5000/api/auth/HTE/${company.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update HTE');
      }

      const updatedCompany = await res.json();
      onUpdateSuccess(updatedCompany);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl border border-red-900">
      <h2 className="text-2xl font-bold text-center mb-2">Edit HTE & MOA Details</h2>
      <p className="text-center text-gray-600 mb-6">{company.name}</p>

      {error && <p className="text-red-600 bg-red-100 border p-3 rounded mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">HTE Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Supervisor</label>
            <input
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        {/* ADDRESS & NATURE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Nature of Business</label>
            <input
              name="natureOfBusiness"
              value={formData.natureOfBusiness}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        {/* MOA DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              MOA Start <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="moaStart"
              value={formData.moaStart}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              MOA End <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="moaEnd"
              value={formData.moaEnd}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        {/* MOA FILE */}
        <div>
          <label className="text-sm font-medium">Upload New MOA (PDF)</label>
          <input
            type="file"
            name="moaFile"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty to keep current MOA.</p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2 border rounded-md">
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 bg-red-700 text-white rounded-md ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-900'
            }`}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateHTE;
