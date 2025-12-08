import React, { useState, useEffect } from 'react';
import { formatDistanceStrict, differenceInDays, isBefore } from 'date-fns';

const CompaniesC = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

useEffect(() => {
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      let apiUrl = 'http://localhost:5000/api/auth/companies';
      if (searchTerm) apiUrl += `?q=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      setError("Failed to load companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  fetchCompanies();
}, [searchTerm]);


const computeMoaStatus = (start, end) => {
  if (!start || !end) return { validity: "N/A", warning: "" };
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();
  const validity = formatDistanceStrict(endDate, startDate);
  const daysLeft = differenceInDays(endDate, today);
  let warning = "";
  if (isBefore(endDate, today)) warning = "MOA expired";
  else if (daysLeft <= 30) warning = `MOA expiring in ${daysLeft} days`;
  return { validity, warning };
};


  return (
    <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
      {/* Header & Search */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Company</h1>
          <p className="text-gray-600 text-sm">List of companies with MOA</p>
        </div>

        <input
          type="text"
          placeholder="Search company name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-red-800 text-white text-xs uppercase">
            <tr>
              {['No.', 'Company Name', 'Email', 'Supervisor', 'Address', 'Nature of Business', 'MOA Validity', 'MOA'].map((title) => (
                <th key={title} className="px-6 py-3 text-left font-bold">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
          {loading ? (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading companies...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-red-500">{error}</td>
            </tr>
          ) : companies.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No companies found.</td>
            </tr>
          ) : (
            companies.map((company, index) => {
              const { validity, warning } = computeMoaStatus(company.moaStart, company.moaEnd);
              return (
                <tr key={company.id || index}>
                  {/* Use index + 1 for auto-increment No. */}
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{company.name}</td>
                  <td className="px-6 py-4">{company.email}</td>
                  <td className="px-6 py-4">{company.supervisorName}</td>
                  <td className="px-6 py-4">{company.address}</td>
                  <td className="px-6 py-4">{company.natureOfBusiness}</td>
                  <td className="px-6 py-4">
                    {validity}
                    {warning && (
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                        warning.includes('expired') ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>{warning}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {company.moa ? (
                      <a href={company.moa} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.moa}</a>
                    ) : 'N/A'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompaniesC;