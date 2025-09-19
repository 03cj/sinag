import React, { useState } from 'react';

const AddIntern = ({ onAddSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    mi: '',
    id: '', 
    program: '',
    email: '',
    initialPassword: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Changed formData.idNumber to formData.id for validation
    if (!formData.lastname || !formData.firstname || !formData.id || !formData.program || !formData.email || !formData.initialPassword) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Pass the formData directly, which now has 'id'
      onAddSuccess(formData);
      alert('Adviser added successfully!');
    } catch (err) {
      console.error('Add Intern error:', err);
      setError('Failed to add intern. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border border-red-900 ">
      <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">Add New Intern</h2>
      <p className="text-gray-600 text-center mb-4 mt-2 italic">
        Fill in the details below to add a new adviser to the system. All fields marked with an asterisk (<span className="text-red-500">*</span>) are required.
      </p>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-md mb-4 animate-fadeIn">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-black mb-1">
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
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-black mb-1">
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
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="mi" className="block text-sm font-medium text-black mb-1">M.I.</label>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-black mb-1">
              Student ID No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="id" 
              name="id" 
              value={formData.id} 
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-black mb-1">
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
              aria-required="true"
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
              aria-required="true"
            />
          </div>
        </div>
        
        <div>
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
              className="mt-1 block w-full pr-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 italic">
            This password will be temporary and can be changed by the adviser upon first login.
          </p>
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
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add Intern'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIntern;