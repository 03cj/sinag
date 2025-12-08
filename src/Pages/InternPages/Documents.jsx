import React, { useState, useEffect, useRef } from 'react';
import { FileText, CloudUpload, Eye, CheckCircle2, XCircle } from 'lucide-react';

const Documents = ({ userId }) => {
  const [documents, setDocuments] = useState([
    { name: 'Medical Certificate', uploaded: false, file: null, remarks: 'Please ensure the certificate is signed by a licensed physician.' },
    { name: 'Resume / CV', uploaded: false, file: null, remarks: 'Upload your latest resume.' },
    { name: 'Insurance', uploaded: false, file: null, remarks: 'Kindly upload your insurance policy before the internship start date.' },
    { name: 'Certificate of Registration (COR)', uploaded: false, file: null, remarks: 'Upload your latest COR from PUP.' },
    { name: 'Good Moral Certificate', uploaded: false, file: null, remarks: 'Upload your Good Moral certificate issued by the school.' }
  ]);

  const fileInputsRef = useRef([]);

  useEffect(() => {
    // Fetch uploaded files for this user
    fetch(`http://localhost:5000/api/auth/${userId}/docs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const updated = [...documents];
        data.forEach(doc => {
          const idx = updated.findIndex(d => d.name === doc.docType);
          if (idx !== -1) {
            updated[idx].uploaded = true;
            updated[idx].file = doc.filePath;
          }
        });
        setDocuments(updated);
      })
      .catch(console.error);
  }, [userId]);

  const triggerFileSelect = (index) => fileInputsRef.current[index].click();

  const handleFileChange = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") return alert("Upload PDF only");

    const formData = new FormData();
    formData.append('document', file);
    formData.append('docType', documents[index].name);

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${userId}/docs`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      const updatedDocs = [...documents];
      updatedDocs[index].uploaded = true;
      updatedDocs[index].file = data.filename;
      setDocuments(updatedDocs);
      alert(`Uploaded: ${file.name}`);
    } catch (err) { alert(err.message); }
  };

  const handleFileView = (file) => {
    window.open(`http://localhost:5000/uploads/${file}`, '_blank');
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-red-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold">Document Dashboard</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
            <FileText className="mr-3 text-gray-600" size={24} /> Required Documents
          </h2>
          <ul className="space-y-4">
            {documents.map((doc, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {doc.uploaded ? <CheckCircle2 className="text-green-500 mr-3" size={20} /> : <XCircle className="text-red-500 mr-3" size={20} />}
                    <span className="text-gray-700 font-medium">{doc.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    {!doc.uploaded ? (
                      <>
                        <input type="file" accept="application/pdf" style={{ display:'none' }} ref={el => fileInputsRef.current[index]=el} onChange={(e)=>handleFileChange(index,e)} />
                        <button onClick={()=>triggerFileSelect(index)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-md transition-colors">
                          <CloudUpload className="mr-2" size={16}/> Upload
                        </button>
                      </>
                    ) : (
                      <button onClick={()=>handleFileView(doc.file)} className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                        <Eye className="mr-2" size={16}/> View
                      </button>
                    )}
                  </div>
                </div>
                {doc.remarks && <p className="text-sm text-gray-500 mt-3 pl-7 italic"><span className="font-semibold">Remarks:</span> {doc.remarks}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documents;
