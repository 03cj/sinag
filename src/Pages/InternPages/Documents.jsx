import React, { useState, useEffect } from 'react';
import { FileText, CloudUpload, Eye, CheckCircle2, XCircle } from 'lucide-react';

const Documents = () => {
  // --- Placeholder Data ---
  const [internData, setInternData] = useState({
    profileCompleted: true,
    documentsPending: true,
    awaitingApproval: false,
    internshipOngoing: false,
    documents: [
      { name: 'Medical Certificate', uploaded: false, file: null, remarks: 'Please ensure the certificate is signed by a licensed physician.' },
      { name: 'Resume / CV', uploaded: true, file: 'resume_cv.pdf', remarks: 'Your OJT Coordinator approved your resume.' },
      { name: 'Insurance', uploaded: false, file: null, remarks: 'Kindly upload your insurance policy before the internship start date.' },
    ],
  });

  // --- Functions (Add your actual logic here) ---
  const handleFileUpload = (documentName) => {
    alert(`Initiating file upload for: ${documentName}`);
    // In a real app, this would trigger a file input dialog and API call to upload the file.
    // After a successful upload, you would update the state.
    // Example: setInternData(prevState => ...);
  };

  const handleFileView = (fileName) => {
    alert(`Viewing file: ${fileName}`);
    // In a real app, this would open a modal or new tab to display the document.
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
         <div className="bg-red-800 text-white p-6 rounded-lg shadow-md">
        {/* Header Section */}
           <h2 className="text-3xl font-bold">Document Dashboard</h2>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
            <FileText className="mr-3 text-gray-600" size={24} />
            Required Documents
          </h2>
          <ul className="space-y-4">
            {internData.documents.map((doc, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  {/* Document Name and Status Icon */}
                  <div className="flex items-center">
                    {doc.uploaded ? (
                      <CheckCircle2 className="text-green-500 mr-3" size={20} />
                    ) : (
                      <XCircle className="text-red-500 mr-3" size={20} />
                    )}
                    <span className="text-gray-700 font-medium">{doc.name}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {doc.uploaded && doc.file && (
                      <button
                        onClick={() => handleFileView(doc.file)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="mr-2" size={16} /> View
                      </button>
                    )}
                    {!doc.uploaded && (
                      <button
                        onClick={() => handleFileUpload(doc.name)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-md transition-colors"
                      >
                        <CloudUpload className="mr-2" size={16} /> Upload
                      </button>
                    )}
                  </div>
                </div>

                {/* Remarks Section */}
                {doc.remarks && (
                  <p className="text-sm text-gray-500 mt-3 pl-7 italic">
                    <span className="font-semibold">Remarks:</span> {doc.remarks}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documents;