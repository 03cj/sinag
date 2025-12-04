import React, { useState, useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import EndorsementLetter from "../../Forms/endorsementLetter";

const Endorsement = ({ intern, onClose }) => {
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [hrName, setHrName] = useState('');
    const [position, setPosition] = useState('');
    const [startDate, setStartDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [letterData, setLetterData] = useState(null);
    
    // useRef to point to the component you want to print
    const componentRef = useRef();
    
    // useReactToPrint hook for handling the print/PDF dialog
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Endorsement_Letter_${intern.firstname}_${intern.lastname}`,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if all required fields are filled
        if (!companyName || !companyAddress || !hrName || !position || !startDate) {
            setErrorMessage('Please fill in all company, HR, position, and start date details.');
            return;
        }
        setErrorMessage('');
        setLetterData({
            intern,
            companyDetails: { companyName, companyAddress, position, startDate },
            hrDetails: { hrName }
        });
    };

    return (
        <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-red-900">
                {!letterData ? (
                    // The form to collect data
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Generate Endorsement Letter for {intern.firstname} {intern.lastname}</h2>
                        <p className="text-sm text-gray-600 mb-4 mt-0.5 italic">
                            Please fill in the company and contact details to generate the endorsement letter.
                        </p>
                        <form onSubmit={handleSubmit}>
                            {/* Form inputs... (same as before) */}
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

                            <div className="mb-4">
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <input
                                    type="text"
                                    id="position"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Date to Start</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                    {errorMessage}
                                </div>
                            )}
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
                    </>
                ) : (
                    // The letter preview and print button
                    <div className="p-4">
                        <EndorsementLetter
                            ref={componentRef}
                            supervisor={letterData.hrDetails.hrName}
                            company={{
                                position: letterData.companyDetails.position,
                                name: letterData.companyDetails.companyName,
                                address: letterData.companyDetails.companyAddress,
                            }}
                            students={[`${letterData.intern.firstname} ${letterData.intern.lastname}`]}
                            startDate={letterData.companyDetails.startDate}
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setLetterData(null)} // Go back to the form
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Print/Save as PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Endorsement;