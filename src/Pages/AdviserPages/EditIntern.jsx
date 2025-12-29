import { useState } from 'react';

const EditIntern = ({ intern, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: intern.firstname || intern.firstName || '',
    lastName: intern.lastname || intern.lastName || '',
    mi: intern.mi || '',
    email: intern.email || '',
    studentId: intern.studNo || intern.studentId || '',
    program: intern.program || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* =========================
     HANDLE INPUT CHANGE
     - Uppercase names / program
     - Lowercase email
     - No spaces for student ID
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const upperCaseFields = ['firstName', 'lastName', 'mi', 'program'];

    setFormData((prev) => ({
      ...prev,
      [name]:
        upperCaseFields.includes(name)
          ? value.toUpperCase().replace(/^\s+/, '')
          : name === 'email'
          ? value.toLowerCase().replace(/\s+/g, '')
          : name === 'studentId'
          ? value.replace(/\s+/g, '')
          : value,
    }));
  };

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.studentId) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mi: formData.mi.trim(),
        email: formData.email.trim().toLowerCase(),
        studentId: formData.studentId.trim(),
        program: formData.program.trim(),
      };

      const response = await fetch(
        `http://localhost:5000/api/auth/interns/${intern.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update intern');
      }

      const updatedIntern = await response.json();
      onUpdate(updatedIntern);
    } catch (err) {
      console.error('Edit intern error:', err);
      setError(err.message || 'Failed to update intern.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-red-900">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Edit Intern
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* LAST NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* FIRST NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* MI */}
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

        {/* STUDENT ID */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Student ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* PROGRAM */}
        <div>
          <label className="block text-sm font-medium mb-1">Program</label>
          <input
            type="text"
            name="program"
            value={formData.program}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-red-700 text-white rounded-md ${
              submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-900'
            }`}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditIntern;
