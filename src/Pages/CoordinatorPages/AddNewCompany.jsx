import React, { useState } from 'react';

const AddNewCompany = ({ onAddSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    NameofCompanies: '',
    Email: '',
    Supervisor: '',
    Address: '', 
    NatureofBusiness: '',
    MOAStart: '',
    MOAEnd: '', 
    MOAFile: null,
   
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const {name, value, files} = e.target;
      if (name === "MOAFile") {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }else {
        setFormData(prev =>({
          ...prev,
          [name]: value
        }));
      }
    };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Changed formData.idNumber to formData.id for validation
    if (!formData.NameofCompanies || !formData.Email || !formData.Supervisor || !formData.Address || !formData.NatureofBusiness || !formData.MOAStart || !formData.MOAEnd || !formData.MOAFile) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
const formDataToSend = new FormData();
Object.keys(formData).forEach(key => {
  formDataToSend.append(key, formData[key]);
});

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Pass the formData directly, which now has 'id'
      onAddSuccess(formData);
      alert('New Company added successfully!');
    } catch (err) {
      console.error('Add new company error:', err);
      setError('Failed to add new company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border border-red-900 ">
      <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">Add New Company</h2>
      <p className="text-gray-600 text-center mb-4 mt-2 italic">
        Fill in the details below to add a new company to the system. All fields marked with an asterisk (<span className="text-red-500">*</span>) are required.
      </p>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-md mb-4 animate-fadeIn">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="NameofCompanies" className="block text-sm font-medium text-black mb-1">
              Name of Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="NameofCompanies"
              name="NameofCompanies"
              value={formData.NameofCompanies}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-black mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="Supervisor" className="block text-sm font-medium text-black mb-1">
              Supervisor<span className ="text-red-500">*</span>
              </label>
            <input
              type="text"
              id="Supervisor"
              name="Supervisor"
              value={formData.Supervisor}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="Address" className="block text-sm font-medium text-black mb-1">
             Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="Address" 
              name="Address" 
              value={formData.Address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="NatureofBusiness" className="block text-sm font-medium text-black mb-1">
              Nature of Business <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="NatureofBusiness"
              name="NatureofBusiness"
              value={formData.NatureofBusiness}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="MOAStart" className="block text-sm font-medium text-black mb-1">
              MOA Start <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="MOAStart"
              name="MOAStart"
              value={formData.MOAStart}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>

            <div>
            <label htmlFor="MOAEnd" className="block text-sm font-medium text-black mb-1">
              MOA End <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="MOAEnd"
              name="MOAEnd"
              value={formData.MOAEnd}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
              aria-required="true"
            />
          </div>
          </div>

          <div>
  <label
    htmlFor="MOAFile"
    className="bg-white-500 text-black font-bold py-2 px-6 rounded-md shadow-lg border border-red-900 cursor-pointer hover:bg-red-200 transition-colors duration-200 inline-block text-sm"
  >
    <span className="flex items-center">
      Upload MOA (PDF)
      <span className="ml-1 text-red-300">*</span>
    </span>
  </label>
  <input
    type="file"
    id="MOAFile"
    name="MOAFile"
    accept="application/pdf"
    onChange={handleChange}
    required
    aria-required="true"
    className="hidden" 
  />
  {formData.MOAFile && (
    <p className="mt-2 text-sm text-green-600">
      Selected: {formData.MOAFile.name}
    </p>
  )}
</div>
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
              'Add New Company'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewCompany;