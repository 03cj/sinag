import { useState } from 'react';

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'moaFile') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));

      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/auth/addCompany', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to add company');

      const result = await response.json();
      onAddSuccess(result.company);
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
      setError(err.message || 'Failed to add new company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border border-red-900 ">
      <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">Add New HTE</h2>
      <p className="text-gray-600 text-center mb-4 mt-2 italic">
        Fill in the details below to add a new HTE to the system. All fields marked with an asterisk (
        <span className="text-red-500">*</span>) are required.
      </p>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-md mb-4 animate-fadeIn">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Name of HTE <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="supervisorName" className="block text-sm font-medium text-black mb-1">
              Supervisor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="supervisorName"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-black mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="natureOfBusiness" className="block text-sm font-medium text-black mb-1">
              Nature of Business <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="natureOfBusiness"
              name="natureOfBusiness"
              value={formData.natureOfBusiness}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="moaStart" className="block text-sm font-medium text-black mb-1">
                MOA Start <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="moaStart"
                name="moaStart"
                value={formData.moaStart}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="moaEnd" className="block text-sm font-medium text-black mb-1">
                MOA End <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="moaEnd"
                name="moaEnd"
                value={formData.moaEnd}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="moaFile"
              className="bg-white-500 text-black font-bold py-2 px-6 rounded-md shadow-lg border border-red-900 cursor-pointer hover:bg-red-200 transition-colors duration-200 inline-block text-sm"
            >
              <span className="flex items-center">
                Upload MOA (PDF) <span className="ml-1 text-red-300">*</span>
              </span>
            </label>
            <input
              type="file"
              id="moaFile"
              name="moaFile"
              accept="application/pdf"
              onChange={handleChange}
              className="hidden"
            />
            {formData.moaFile && <p className="mt-2 text-sm text-green-600">Selected: {formData.moaFile.name}</p>}
          </div>
        </div>

        {/* Initial Password */}
        <div className="mt-4">
          <label htmlFor="initialPassword" className="block text-sm font-medium text-black mb-1">
            Initial Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="initialPassword"
              name="initialPassword"
              value={formData.initialPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 text-sm text-gray-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-1 italic">This password will be used by the company on first login.</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-500 rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-5 py-2 rounded-md text-white bg-red-700 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add New Company'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewCompany;
