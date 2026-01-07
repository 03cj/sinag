import { useEffect, useState } from 'react';

const EditIntern = ({ intern, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    mi: '',
    id: '',
    program: '',
    email: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     LOAD INTERN DATA
  ========================= */
  useEffect(() => {
    if (!intern) return;

    setFormData({
      lastname: intern.lastname || '',
      firstname: intern.firstname || '',
      mi: intern.mi || '',
      id: intern.studNo || '',
      program: intern.program || '',
      email: intern.email || '',
    });
  }, [intern]);

  /* =========================
     HANDLE INPUT
     - SAME RULES AS ADD INTERN
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Email stays normal
    if (name === 'email') {
      setFormData((prev) => ({ ...prev, email: value }));
      return;
    }

    // Student ID → CAPS
    if (name === 'id') {
      setFormData((prev) => ({ ...prev, id: value.toUpperCase() }));
      return;
    }

    // Others → CAPS
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  /* =========================
     SUBMIT UPDATE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.lastname ||
      !formData.firstname ||
      !formData.id ||
      !formData.email
    ) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `http://localhost:5000/api/auth/interns/${intern.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstname,
            lastName: formData.lastname,
            mi: formData.mi,
            studentId: formData.id,
            email: formData.email,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update intern');
      }

      const updated = await res.json();

      onUpdate({
        ...intern,
        ...updated,
        lastname: updated.lastName,
        firstname: updated.firstName,
        studNo: updated.studentId,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update intern.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-8x4 mx-auto border border-red-900">
      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">
        Edit Intern
      </h2>

      <p className="text-gray-600 text-center mb-4 mt-2 italic">
        Update the intern details below. Fields marked with an asterisk (
        <span className="text-red-500">*</span>) are required.
      </p>

      {/* ERROR */}
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
              Program
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
            disabled={submitting}
            className={`px-5 py-2 rounded-md text-white bg-red-700 hover:bg-red-900 ${
              submitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Updating…' : 'Update Intern'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditIntern;
