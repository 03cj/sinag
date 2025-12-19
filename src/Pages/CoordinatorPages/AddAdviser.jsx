import { useEffect, useState } from 'react';

const AddAdviser = ({ onAddSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    mi: '',
    id: '',
    program: '',
    email: '',
    initialPassword: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* =========================
     HANDLE INPUT CHANGE
     (AUTO-UPPERCASE)
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const uppercaseFields = ['lastname', 'firstname', 'mi', 'program', 'id'];

    setFormData((prev) => ({
      ...prev,
      [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value,
    }));
  };

  /* =========================
     AUTO-GENERATE PASSWORD
     LASTNAME_PROGRAM_YEAR
     (NO LAYOUT CHANGE)
  ========================= */
  useEffect(() => {
    if (formData.lastname && formData.program) {
      const year = new Date().getFullYear();

      const safeLastName = formData.lastname.replace(/\s+/g, '');
      const safeProgram = formData.program.replace(/\s+/g, '');

      setFormData((prev) => ({
        ...prev,
        initialPassword: `${safeLastName}_${safeProgram}_${year}`,
      }));
    }
  }, [formData.lastname, formData.program]);

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.lastname ||
      !formData.firstname ||
      !formData.mi ||
      !formData.id ||
      !formData.program ||
      !formData.email ||
      !formData.initialPassword
    ) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/auth/addAdviser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstname,
          lastName: formData.lastname,
          mi: formData.mi,
          employeeId: formData.id,
          department: formData.program,
          email: formData.email,
          password: formData.initialPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add adviser');
      }

      const newAdviser = await response.json();
      onAddSuccess && onAddSuccess(newAdviser);
      alert('Adviser added successfully!');

      setFormData({
        lastname: '',
        firstname: '',
        mi: '',
        id: '',
        program: '',
        email: '',
        initialPassword: '',
      });
    } catch (err) {
      console.error('Add adviser error:', err);
      setError(err.message || 'Failed to add adviser. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border border-red-900">
      <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">Add New Adviser</h2>
      <p className="text-gray-600 text-center mb-4 mt-2 italic">
        Fill in the details below to add a new adviser to the system. All fields marked with an asterisk (
        <span className="text-red-500">*</span>) are required.
      </p>

      {error && <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-md mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="firstname" className="block text-sm font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="mi" className="block text-sm font-medium mb-1">
              M.I.
            </label>
            <input
              type="text"
              id="mi"
              name="mi"
              value={formData.mi}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
        </div>

        {/* DETAILS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium mb-1">
              ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="program" className="block text-sm font-medium mb-1">
              Program <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
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
        </div>

        {/* PASSWORD (UNCHANGED LAYOUT) */}
        <div>
          <label htmlFor="initialPassword" className="block text-sm font-medium mb-1">
            Initial Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="initialPassword"
              name="initialPassword"
              value={formData.initialPassword}
              onChange={handleChange}
              className="mt-1 block w-full pr-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 italic">
            This password is auto-generated using Last Name, Program, and current year.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-500 rounded-md text-black bg-white hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-2 rounded-md text-white bg-red-700 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out ${
              submitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Adding...' : 'Add Adviser'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdviser;
