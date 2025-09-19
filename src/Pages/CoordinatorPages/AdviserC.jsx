import React, { useState, useEffect } from 'react';
import { Trash2, Search } from 'lucide-react';
import AddAdviser from './AddAdviser'; 

const AdviserC = () => {
  const [advisers, setAdvisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddAdviserForm, setShowAddAdviserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adviserToDelete, setAdviserToDelete] = useState(null);

const handleDeleteClick = (adviser) => {
    setAdviserToDelete(adviser); // Set the adviser to be deleted
    setShowDeleteConfirm(true); // Show the confirmation modal
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchAdvisers = async () => {
      setLoading(true);
      setError(null);

      try {
        // 👇 PART TO REPLACE FOR DATABASE CONNECTION:
 // Replace the entire mock data and setTimeout with a real API call.
 // For example:
// const response = await fetch('/api/advisers'); 
// MOCK DATA FOR DEMO PURPOSES
        const response = await new Promise(resolve =>
          setTimeout(() => {
            const mockAdvisers = [
              { id: '111', lastname: 'Dela Cruz', firstname: 'Juan', mi: 'S.', program: 'BSIT', email: 'juan.delacruz@gmail.com' },
              { id: '112', lastname: 'Reyes', firstname: 'Maria', mi: 'L.', program: 'BSBA', email: 'maria.reyes@gmail.com' },
              { id: '113', lastname: 'Santos', firstname: 'Pedro', mi: 'A.', program: 'BSENT', email: 'pedro.santos@gmail.com' },
              { id: '114', lastname: 'Cruz', firstname: 'Ana', mi: 'M.', program: 'BEED', email: 'ana.cruz@gmail.com' },
              { id: '115', lastname: 'Garcia', firstname: 'Jose', mi: 'P.', program: 'IND. ENG.', email: 'jose.garcia@gmail.com' },
            ];
            resolve({ ok: true, json: () => Promise.resolve(mockAdvisers) });
          }, 1000)
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setAdvisers(data);
      } catch (err) {
        console.error("Failed to fetch advisers:", err);
        setError("Failed to load advisers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // The empty dependency array ensures this effect runs only once on mount
    fetchAdvisers(); 
  }, []); 

  const handleAddNewAdviser = (newAdviser) => {
     setAdvisers(prev => [...prev, newAdviser]);
    setShowAddAdviserForm(false);
    };

const handleConfirmDelete = () => {
  if (adviserToDelete) {
    // Corrected: Filter the main 'advisers' array
    setAdvisers(prevAdvisers => prevAdvisers.filter(adviser => adviser.id !== adviserToDelete.id));
    console.log(`Adviser ${adviserToDelete.id} removed (simulated).`);
    setShowDeleteConfirm(false);
    setAdviserToDelete(null); // Reset the state
  }
};

  // 1. Filter the advisers list based on the search term
  const filteredAdvisers = advisers.filter(adviser =>
    adviser.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adviser.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Programs Advisers</h1>
            <p className="text-gray-600 text-sm">List of Program Advisers</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end w-full sm:w-auto">
            <button
              onClick={() => setShowAddAdviserForm(true)}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Add new Adviser
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Adviser name"
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800">
            <tr>
              {['ID no.', 'Lastname', 'Firstname', 'MI.', 'Email', 'Program', 'Interns', 'REMOVE'].map((title, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider ${
                    idx === 0 ? 'rounded-tl-lg' : idx === 7 ? 'text-center rounded-tr-lg' : ''
                  }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading advisers...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : filteredAdvisers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No advisers found.</td>
              </tr>
            ) : (
              filteredAdvisers.map(adviser => (
                <tr key={adviser.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{adviser.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{adviser.lastname}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{adviser.firstname}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{adviser.mi}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{adviser.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{adviser.program}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{adviser.interns}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <button
                      onClick={() => handleDeleteClick(adviser)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      aria-label={`Remove adviser ${adviser.firstname} ${adviser.lastname}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

             {showDeleteConfirm && adviserToDelete && (
  <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50"> 
    <div className="bg-red-900 rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-lg font-bold text-yellow-500 mb-4">Remove Adviser</h2>
      <p className="text-white mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold">{adviserToDelete.firstname}{" "}{adviserToDelete.lastname}</span>?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 bg-yellow-500 hover:bg-red-200 text-black rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      {/* Add Adviser Modal */}
      {showAddAdviserForm && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">  
          <AddAdviser
            onAddSuccess={(newAdviser) => {
              setAdvisers(prev => [...prev, newAdviser]);
              setShowAddAdviserForm(false);
            }}
            onCancel={() => setShowAddAdviserForm(false)}
          />
        </div>
      )}
    </>
  );
};

export default AdviserC;