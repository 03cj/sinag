import { CheckCircle2, CloudUpload, Eye, FileText, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const DOCUMENTS = [
  { label: 'Consent Form', column: 'consent_form' },
  { label: 'Notarized Agreement', column: 'notarized_agreement' },
  { label: 'Portfolio', column: 'portfolio' },
  { label: 'Certificate of Registration (COR)', column: 'cor' },
  { label: 'Insurance', column: 'insurance' },
  { label: 'Medical Certificate', column: 'medical_cert' },
];

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputsRef = useRef([]);

  /* =========================
     FETCH DOCUMENT STATUS
  ========================= */
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/intern-docs/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();

        const mapped = DOCUMENTS.map((doc) => ({
          name: doc.label,
          column: doc.column,
          uploaded: Boolean(data?.[doc.column]),
          file: data?.[doc.column] || null,
        }));

        setDocuments(mapped);
      } catch (err) {
        console.error(err);
        alert('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  /* =========================
     FILE HANDLERS
  ========================= */
  const triggerFileSelect = (index) => {
    fileInputsRef.current[index]?.click();
  };

  const handleFileChange = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('PDF files only');
      event.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // 🔥 MUST be "file"

    try {
      const res = await fetch('http://localhost:5000/api/auth/intern-docs/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      const updated = [...documents];
      updated[index] = {
        ...updated[index],
        uploaded: true,
        file: data.file,
      };

      setDocuments(updated);
      alert('File uploaded successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      event.target.value = null;
    }
  };

  const handleFileView = (filename) => {
    const url = `http://localhost:5000/uploads/${filename}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (index) => {
    const doc = documents[index];

    if (!window.confirm(`Delete ${doc.name}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/intern-docs/${doc.column}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      const updated = [...documents];
      updated[index] = {
        ...updated[index],
        uploaded: false,
        file: null,
      };

      setDocuments(updated);
      alert('File deleted');
    } catch (err) {
      alert(err.message);
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading documents...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="bg-red-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold">Document Dashboard</h2>
        <p className="text-sm opacity-90">Upload and manage your required documents</p>
      </div>

      {/* DOCUMENT LIST */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
          <FileText className="mr-3 text-gray-600" size={24} />
          Required Documents
        </h2>

        <ul className="space-y-4">
          {documents.map((doc, index) => (
            <li key={doc.column} className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition">
              <div className="flex items-center justify-between">
                {/* LEFT */}
                <div className="flex items-center">
                  {doc.uploaded ? (
                    <CheckCircle2 className="text-green-500 mr-3" size={20} />
                  ) : (
                    <XCircle className="text-red-500 mr-3" size={20} />
                  )}
                  <span className="text-gray-700 font-medium">{doc.name}</span>
                </div>

                {/* RIGHT */}
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    ref={(el) => (fileInputsRef.current[index] = el)}
                    onChange={(e) => handleFileChange(index, e)}
                  />

                  {!doc.uploaded ? (
                    <button
                      onClick={() => triggerFileSelect(index)}
                      className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      <CloudUpload className="mr-2" size={16} />
                      Upload
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(index)}
                      className="flex items-center px-4 py-2 text-sm text-black bg-yellow-500 rounded-md hover:bg-yellow-600"
                    >
                      <XCircle className="mr-2" size={16} />
                      Delete
                    </button>
                  )}

                  {doc.uploaded && (
                    <button
                      onClick={() => handleFileView(doc.file)}
                      className="flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-md border"
                    >
                      <Eye className="mr-2" size={16} />
                      View
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Documents;
