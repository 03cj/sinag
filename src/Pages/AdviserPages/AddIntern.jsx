import { useEffect, useState } from 'react';

const AddIntern = ({ onAddSuccess, onCancel }) => {
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
     FETCH ADVISER PROGRAM
  ========================= */
  useEffect(() => {
    const fetchAdviserProgram = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const user = await res.json();

if (user.role?.toLowerCase() !== 'adviser') {
          setError('Only advisers can add interns.');
          return;
        }

        if (!user.program) {
          setError('Your adviser account has no program assigned.');
          return;
        }

        setFormData((prev) => ({
          ...prev,
          program: user.program,
        }));
      } catch (err) {
        console.error(err);
        setError('Failed to load adviser program.');
      }
    };

    fetchAdviserProgram();
  }, []);

  /* =========================
     AUTO-GENERATE PASSWORD
     WHEN PROGRAM LOADS
  ========================= */
  useEffect(() => {
    if (formData.id && formData.program) {
      setFormData((prev) => ({
        ...prev,
        initialPassword: `${prev.id}_${prev.program}`,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.program]);

  /* =========================
     HANDLE INPUT
     - AUTO CAPS
     - AUTO PASSWORD = ID_PROGRAM
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Email stays as-is
    if (name === 'email') {
      setFormData((prev) => ({
        ...prev,
        email: value,
      }));
      return;
    }

    // Student ID → CAPS + AUTO PASSWORD
    if (name === 'id') {
      const idValue = value.toUpperCase();
      setFormData((prev) => ({
        ...prev,
        id: idValue,
        initialPassword: prev.program
          ? `${idValue}_${prev.program}`
          : prev.initialPassword,
      }));
      return;
    }

    // Password can be edited manually
    if (name === 'initialPassword') {
      setFormData((prev) => ({
        ...prev,
        initialPassword: value,
      }));
      return;
    }

    // All other inputs → CAPS
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.lastname ||
      !formData.firstname ||
      !formData.id ||
      !formData.email ||
      !formData.initialPassword ||
      !formData.program
    ) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/addIntern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstname,
          lastName: formData.lastname,
          mi: formData.mi,
          studentId: formData.id,
          program: formData.program,
          email: formData.email,
          initialPassword: formData.initialPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add intern');
      }

      const newIntern = await response.json();
      onAddSuccess && onAddSuccess(newIntern);
      alert('Intern added successfully!');

      // Reset form but keep program
      setFormData((prev) => ({
        lastname: '',
        firstname: '',
        mi: '',
        id: '',
        program: prev.program,
        email: '',
        initialPassword: '',
      }));
    } catch (err) {
      console.error('Add intern error:', err);
      setError(err.message || 'Failed to add intern. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border border-red-900">
      <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">
        Add New Intern
      </h2>

      <p className="text-gray-600 text-center mb-4 mt-2 italic">
        Fill in the details below to add a new intern to the system. All fields marked with an asterisk (
        <span className="text-red-500">*</span>) are required.
      </p>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* --- First Row: Name Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              M.I.
            </label>
            <input
              type="text"
              name="mi"
              value={formData.mi}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
        </div>

        {/* --- Second Row: ID, Program, Email --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Student ID No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Program (Inherited from Adviser) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 sm:text-sm font-semibold">
              {formData.program}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* --- Password Field --- */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Initial Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="initialPassword"
              value={formData.initialPassword}
              onChange={handleChange}
              className="mt-1 block w-full pr-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-500 rounded-md bg-white"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`px-5 py-2 rounded-md text-white bg-red-700 hover:bg-red-900 ${
              submitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            {submitting ? 'Adding…' : 'Add Intern'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIntern;
