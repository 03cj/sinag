import React, { useState, useEffect } from 'react';
import { formatDistanceStrict, differenceInDays, isBefore } from 'date-fns';
import { Trash2 } from 'lucide-react';
import AddNewCompany from './AddNewCompany'; 
import UpdateMoa from './UpdateMOA';


const CompaniesC = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddNewCompanyForm, setShowAddNewCompanyForm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

// delete from here to removed mock data
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true); 
      setError(null);   

      try {
  
     const mockCompanies = [
  { no: '001', name: 'AAA', email: 'aaa@gmail.com', supervisor: 'Mrs. Cruz', address: '.st.', moa: '.pdf', natureOfBusiness: 'Manufacturing', MOAStart: '2022-01-01', MOAEnd: '2025-01-01' },
  { no: '002', name: 'BBB Corp', email: 'info@bbbcorp.com', supervisor: 'Mr. Smith', address: '123 Main St.', moa: 'bbb_moa.pdf', natureOfBusiness: 'Corporate', MOAStart: '2021-03-01', MOAEnd: '2024-03-01' },
  { no: '003', name: 'XYZ Innovations', email: 'contact@xyz.net', supervisor: 'Ms. Johnson', address: '456 Min. Ave.', moa: 'xyz_agreement.pdf', natureOfBusiness: 'Technology', MOAStart: '2020-05-01', MOAEnd: '2025-05-01' },
  { no: '004', name: 'Global Tech', email: 'support@globaltech.org', supervisor: 'Dr. Lee', address: '789 Lopez Ln.', moa: 'global_tech_moa.pdf', natureOfBusiness: 'IT Services', MOAStart: '2023-07-01', MOAEnd: '2024-07-01' },
  { no: '005', name: 'Creative Hub', email: 'hello@creativehub.com', supervisor: 'Mr. Davis', address: '101 Que. St.', moa: 'creative_moa.pdf', natureOfBusiness: 'Creative Agency', MOAStart: '2022-09-01', MOAEnd: '2024-09-01' },
];

        await new Promise(resolve => setTimeout(resolve, 800));

           const filteredCompanies = mockCompanies.filter(company =>
          searchTerm
            ? company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              company.natureOfBusiness.toLowerCase().includes(searchTerm.toLowerCase())
            : true
        );

        setCompanies(filteredCompanies); // Update state with filtered sample data
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setError("Failed to load companies. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Set loading to false once fetching is complete
      }
      };

     fetchCompanies(); // Call the fetch function
     }, [searchTerm]); // Re-run effect when search term changes
     //delete hanggang dito to remove unng mock data

{/* uncomment for real backend
     useEffect(() => {
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);

    try {
      let apiUrl = '/api/companies'; 

      if (searchTerm) {
        apiUrl += `?q=${encodeURIComponent(searchTerm)}`; // pass search term as query
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setCompanies(data); // ✅ backend supplies the filtered data
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      setError(err.message || "Failed to load companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchCompanies();
}, [searchTerm]);
*/}
    
const computeMoaStatus = (start, end) => {
  if (!start || !end) return { validity: "N/A", warning: "" };

  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();

  const validity = formatDistanceStrict(endDate, startDate);

  const daysLeft = differenceInDays(endDate, today);

  let warning = "";
  if (isBefore(endDate, today)) {
    warning = "MOA expired";
  } else if (daysLeft <= 30) {
    warning = `MOA expiring in ${daysLeft} days`;
  }

  return { validity, warning };
};

  const handleSearchChange = (event) => {setSearchTerm(event.target.value);};
  const handleEditMoa = () => {console.log("Update MOA button clicked!"); };
  const handleAddNewCompany = () => setShowAddNewCompanyForm(true);

  const handleDeleteClick = (company) => {
  setCompanyToDelete(company);
  setShowDeleteConfirm(true);
};

const handleConfirmDelete = () => {
  if (companyToDelete) {
    setCompanies((prev) =>
      prev.filter((c) => c.no !== companyToDelete.no)
    );
  }
  setShowDeleteConfirm(false);
  setCompanyToDelete(null);
};


  return (
    <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
      {/* Header and Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Company</h1>
            <p className="text-gray-600 text-sm">List of companies with MOA</p>
          </div>
          {/* Aligned Buttons and Search Bar */}
          <div className="flex flex-wrap items-center gap-3 justify-end w-full sm:w-auto">
            {/* Action Buttons */}
            <button
              onClick={handleAddNewCompany}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
            >
              Add new Company
            </button>
            {/* Search Input aligned horizontally */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search company name" 
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Table Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider ">
              Actions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider ">
                No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Company name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Supervisor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Nature of Business
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                MOA Validity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider rounded-tr-lg">
              MOA
            </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
            
                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  Loading companies...
                </td>
              </tr>
              
            ) : error ? (
              <tr>
            
                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-red-500">
                  {error}
                </td>
              </tr>

            ) : companies.length === 0 ? (
              <tr>
             
                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No companies found matching your criteria.
                </td>
              </tr>
            ) : (
companies.map((company, index) => (
  <tr key={company.no || index}>
    {/* Delete button column */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
     <button
  onClick={() => handleDeleteClick(company)}
  className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1 rounded-md"
  aria-label={`Delete ${company.name}`}
>
  <Trash2 size={16} />
</button>
    </td>
    
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.name}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.email}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.supervisor}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.address}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.natureOfBusiness}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {(() => {
        const { validity, warning } = computeMoaStatus(company.MOAStart, company.MOAEnd);
        return (
          <>
            {validity}
            {warning && (
              <button
                onClick={() => {
                  setSelectedCompany(company);
                  setShowUpdateConfirm(true); 
                }}
                className={`ml-2 text-xs font-semibold px-2 py-1 rounded transition-colors duration-200 ${
                  warning.includes("expired")
                    ? "bg-red-200 text-red-800 hover:bg-red-300"
                    : "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                }`}
              >
                {warning}
              </button>
            )}
          </>
        );
      })()}
    </td>

    {/* MOA Link */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {company.moa ? (
        <a
          href={company.moa}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {company.moa}
        </a>
      ) : (
        "N/A"
      )}
    </td>
  </tr>
))

            )}
          </tbody>
        </table>

        {showDeleteConfirm && companyToDelete && (
  <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50"> 
    <div className="bg-red-900 rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-lg font-bold text-yellow-500 mb-4">Delete Company</h2>
      <p className="text-white mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold">{companyToDelete.name}</span>?
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


{/* Confirmation Modal */}
{showUpdateConfirm && selectedCompany && (
  <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50"> 
    <div className="bg-red-900 rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-lg font-bold text-yellow-500 mb-4">Update MOA</h2>
      <p className="text-white mb-6">
        Do you want to update MOA for{" "}
        <span className="font-semibold">{selectedCompany.name}</span>?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowUpdateConfirm(false)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
        >
          No
        </button>
        <button
          onClick={() => {
            setShowUpdateConfirm(false); 
            setShowUpdateForm(true);    
          }}
          className="px-4 py-2 bg-yellow-500 hover:bg-red-200 text-black rounded-md"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

{/* Update MOA Modal */}
{showUpdateForm && selectedCompany && (
 <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50"> 
    <UpdateMoa
      company={selectedCompany}
      onCancel={() => setShowUpdateForm(false)}
      onUpdateSuccess={(updatedCompany) => {
        setCompanies((prev) =>
          prev.map((c) => (c.no === updatedCompany.no ? updatedCompany : c))
        );
        setShowUpdateForm(false);
      }}
    />
  </div>
)}
      </div>
      {/* Add New Company Modal */}
      {showAddNewCompanyForm && (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">  
          <AddNewCompany
            onAddSuccess={(newCompany) => {
              setCompanies((prev) => [...prev, newCompany]);
              setShowAddNewCompanyForm(false);
            }}
            onCancel={() => setShowAddNewCompanyForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CompaniesC;