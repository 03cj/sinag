import { useEffect, useState } from 'react';

const AddAdviser = ({ onAddSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    mi: '',
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

    const uppercaseFields = ['lastname', 'firstname', 'mi', 'program'];

    setFormData((prev) => ({
      ...prev,
      [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value,
    }));
  };

  /* =========================
     AUTO-GENERATE PASSWORD
     LASTNAME_PROGRAM_YEAR
  ========================= */
  useEffect(() => {
    if (formData.lastname) {
      const year = new Date().getFullYear();

      const safeLastName = formData.lastname.replace(/\s+/g, '').toUpperCase();

      setFormData((prev) => ({
        ...prev,
        initialPassword: `${safeLastName}_${year}`,
      }));
    }
  }, [formData.lastname]);

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.lastname ||
      !formData.firstname ||
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
          program: formData.program,
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
            <label className="block text-sm font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">M.I.</label>
            <input
              type="text"
              name="mi"
              value={formData.mi}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* DETAILS ROW (ID REMOVED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Program <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />

            {/* Instruction */}
            <p className="mt-1 text-sm text-gray-500">
              Please enter the complete program name (e.g., <em>Bachelor of Science in Information Technology</em>). Do
              not use abbreviations (e.g., BSIT, IT).
            </p>
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
              className="w-full pr-20 px-4 py-2 border rounded-md bg-gray-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Default password format: <strong>LASTNAME_CURRENTYEAR</strong>
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} className="px-5 py-2 border rounded-md" disabled={submitting}>
            Cancel
          </button>

          <button type="submit" disabled={submitting} className="px-5 py-2 bg-red-700 text-white rounded-md">
            {submitting ? 'Adding...' : 'Add Adviser'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdviser;
