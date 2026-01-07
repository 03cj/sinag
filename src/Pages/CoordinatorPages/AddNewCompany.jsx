import { useEffect, useState } from 'react';

const AddNewCompany = ({ onAddSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    supervisorName: '',
    address: '',
    natureOfBusiness: '',
    moaStart: '',
    moaEnd: '',
    moaFile: null,
    initialPassword: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* =========================
     HANDLE INPUT CHANGE
     AUTO CAPS (EXCEPT EMAIL)
  ========================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // File input
    if (name === 'moaFile') {
      setFormData((prev) => ({ ...prev, moaFile: files[0] }));
      return;
    }

    // Fields to auto-uppercase
    const upperFields = ['name', 'supervisorName', 'address', 'natureOfBusiness'];

    setFormData((prev) => ({
      ...prev,
      [name]: upperFields.includes(name) ? value.toUpperCase() : value,
    }));
  };

  /* =========================
     AUTO-GENERATE PASSWORD
     HTE_NAME_YEAR
  ========================= */
  useEffect(() => {
    if (formData.name) {
      const year = new Date().getFullYear();
      const safeName = formData.name.replace(/\s+/g, '');
      setFormData((prev) => ({
        ...prev,
        initialPassword: `${safeName}_${year}`,
      }));
    }
  }, [formData.name]);

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.supervisorName ||
      !formData.address ||
      !formData.natureOfBusiness ||
      !formData.moaStart ||
      !formData.moaEnd ||
      !formData.moaFile ||
      !formData.initialPassword
    ) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));

      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/auth/addCompany', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add company');
      }

      const company = await res.json();
      onAddSuccess && onAddSuccess(company);
      alert('New Company added successfully!');

      setFormData({
        name: '',
        email: '',
        supervisorName: '',
        address: '',
        natureOfBusiness: '',
        moaStart: '',
        moaEnd: '',
        moaFile: null,
        initialPassword: '',
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add new company.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border border-red-900">
      <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">Add New HTE</h2>

      <p className="text-gray-600 text-center mb-4 mt-2 italic">
        Fill in the details below to add a new HTE to the system. All fields marked with an asterisk (
        <span className="text-red-500">*</span>) are required.
      </p>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name of HTE <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Supervisor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nature of Business <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="natureOfBusiness"
              value={formData.natureOfBusiness}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
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
              <label className="block text-sm font-medium mb-1">
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
            <label
              htmlFor="moaFile"
              className="cursor-pointer font-bold border border-red-900 px-6 py-2 rounded-md inline-block"
            >
              Upload MOA (PDF) <span className="text-red-300">*</span>
            </label>
            <input
              id="moaFile"
              type="file"
              name="moaFile"
              accept="application/pdf"
              onChange={handleChange}
              className="hidden"
            />
            {formData.moaFile && (
              <p className="mt-2 text-sm text-green-600">Selected: {formData.moaFile.name}</p>
            )}
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Initial Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.initialPassword}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-2 text-sm text-gray-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-xs italic text-gray-500 mt-1">
            Auto-generated from HTE name and current year
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border rounded-md"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-2 rounded-md text-white bg-red-700 hover:bg-red-900 ${
              submitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Adding...' : 'Add New Company'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewCompany;
