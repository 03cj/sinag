import { CheckCircle2, CloudUpload, Eye, FileText, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';

const Documents = () => {
  // --- Placeholder Data reflecting Initial/Retrieved States ---
  const [internData, setInternData] = useState({
    profileCompleted: true,
    documentsPending: true,
    awaitingApproval: false,
    internshipOngoing: false,
    documents: [
      {
        name: 'Medical Certificate',
        uploaded: false,
        file: null,
        // Initial Instruction (pre-upload/pre-DB record)
        remarks: 'Initial Instruction: Ensure the certificate is signed by a licensed physician.',
      },
      {
        name: 'Resume / CV',
        uploaded: true, // SIMULATED: Retrieved from DB as uploaded and approved
        file: 'resume_cv.pdf',
        // SIMULATED: Retrieved Advisor Comment
        remarks: '✅ Retrieved Advisor Comment: Approved! Your OJT Coordinator confirmed the format and content.',
      },
      {
        name: 'Insurance',
        uploaded: true, // SIMULATED: Retrieved from DB as uploaded but still pending review
        file: 'insurance_policy.pdf',
        // SIMULATED: Retrieved System Status
        remarks: '🕒 System Status: Uploaded. Awaiting review by the Internship Office.',
      },
      {
        name: 'Certificate of Registration (COR)',
        uploaded: false,
        file: null,
        // Initial Instruction
        remarks:
          'Initial Instruction: Please upload the latest Certificate of Registration (COR) for the current semester.',
      },
      {
        name: 'Good Moral Certificate',
        uploaded: false,
        file: null,
        // Initial Instruction
        remarks: 'Initial Instruction: Obtain the certificate from your College Dean or Student Affairs Office.',
      },
    ],
  });

  const fileInputRefs = useRef({});

  // --- Functions ---

  const handleFileUpload = (documentName) => {
    // Triggers click on the hidden file input linked by the documentName
    const inputElement = fileInputRefs.current[documentName];
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleFileChange = (e, documentName) => {
    const file = e.target.files[0];
    if (file) {
      window.alert(
        `File selected for ${documentName}: ${file.name}. Simulating successful submission and status change to PENDING.`,
      );

      // Updates state to 'uploaded: true' and sets the remark to 'Awaiting Review' status.
      setInternData((prevData) => ({
        ...prevData,
        documents: prevData.documents.map((doc) =>
          doc.name === documentName
            ? {
                ...doc,
                uploaded: true,
                file: file.name,
                // System Status remark: This is what would be immediately updated/retrieved after a successful upload API call.
                remarks: `🕒 System Status: Document submitted (${file.name}). Awaiting review by advisor (DB retrieve next).`,
              }
            : doc,
        ),
      }));
    }
    // Clear the input value to allow re-selecting the same file
    e.target.value = '';
  };

  const handleFileView = (documentName, fileName, isUploaded) => {
    if (isUploaded && fileName) {
      alert(`✅ Viewing uploaded document: ${fileName}`);
    } else {
      alert(`❌ Document not uploaded: ${documentName}. This button would typically show a placeholder or template.`);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-red-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold">Document Dashboard</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
            <FileText className="mr-3 text-gray-600" size={24} />
            Required Documents
          </h2>
          <ul className="space-y-4">
            {internData.documents.map((doc, index) => (
              <li
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
              >
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
                    {/* View Button (Always visible with conditional styling) */}
                    <button
                      onClick={() => handleFileView(doc.name, doc.file, doc.uploaded)}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        doc.uploaded
                          ? 'text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100' // Active style
                          : 'text-gray-500 bg-gray-200 border border-gray-300 hover:bg-gray-300' // Inactive style
                      }`}
                    >
                      <Eye className="mr-2" size={16} /> View
                    </button>

                    {/* Upload Button (always visible) */}
                    <button
                      onClick={() => handleFileUpload(doc.name)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-md transition-colors"
                    >
                      <CloudUpload className="mr-2" size={16} /> Upload
                    </button>

                    {/* Hidden File Input for actual file selection */}
                    <input
                      type="file"
                      // Correctly links the hidden input to the ref object using the document name as the key
                      ref={(el) => (fileInputRefs.current[doc.name] = el)}
                      onChange={(e) => handleFileChange(e, doc.name)}
                      accept="application/pdf"
                      className="hidden"
                    />
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
