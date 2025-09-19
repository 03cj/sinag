// Endorsement.jsx
import React, { useState } from 'react';

const Endorsement = ({ intern, onGenerateLetter, onClose }) => {
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [hrName, setHrName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!companyName || !companyAddress || !hrName) {
            alert('Please fill in all company and HR details.');
            return;
        }
        onGenerateLetter({
            intern,
            companyDetails: { companyName, companyAddress },
            hrDetails: { hrName }
        });
        // onClose(); // Decided to keep it open until generation is confirmed in DashboardA
    };

    return (
        
         <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50 ">  
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-red-900"> 
                <h2 className="text-xl font-bold text-gray-800 mb-1">Generate Endorsement Letter for {intern.firstname} {intern.lastname}</h2>
                <p className="text-sm text-gray-600 mb-4 mt-0.5 italic">
                    Please fill in the company and contact details to generate the endorsement letter.
                </p>        
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                        <input
                            type="text"
                            id="companyAddress"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="hrName" className="block text-sm font-medium text-gray-700 mb-1">HR / Contact Person Name</label>
                        <input
                            type="text"
                            id="hrName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                            value={hrName}
                            onChange={(e) => setHrName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Generate Endorsement Letter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Endorsement;