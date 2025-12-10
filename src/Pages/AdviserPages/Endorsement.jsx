// Endorsement.jsx
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import EndorsementLetter from '../../Forms/endorsementLetter';

const Endorsement = ({ intern, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [hrName, setHrName] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [letterData, setLetterData] = useState(null);

  const printRef = useRef();

  const handleGeneratePDF = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);

    const pdfBlob = pdf.output('blob');
    const fileName = `Endorsement_Letter_${intern.firstname}_${intern.lastname}.pdf`;

    const formData = new FormData();
    formData.append('file', pdfBlob, fileName);
    formData.append('uploadedBy', `${intern.firstname} ${intern.lastname}`);

    const response = await fetch('http://localhost:5001/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    response.ok ? alert('🎉 PDF successfully saved to the Library!') : alert('❌ Error saving PDF. Please try again.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!companyName || !companyAddress || !hrName || !position || !startDate) {
      setErrorMessage('⚠ Please fill out all required fields.');
      return;
    }

    setLetterData({
      intern,
      companyDetails: { companyName, companyAddress, position, startDate },
      hrDetails: { hrName },
    });

    setErrorMessage('');
  };

  return (
    <>
      {!letterData ? (
        // FORM MODAL
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Endorsement Letter Setup</h2>

            <p className="text-sm text-gray-600 mb-6">
              Enter the company details to generate an endorsement letter for{' '}
              <span className="font-semibold text-red-700">
                {intern.firstname} {intern.lastname}
              </span>
              .
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Company Name', value: companyName, set: setCompanyName },
                { label: 'Company Address', value: companyAddress, set: setCompanyAddress },
                { label: 'HR / Contact Person', value: hrName, set: setHrName },
                { label: 'Intern Position', value: position, set: setPosition },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-800/50 focus:outline-none"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internship Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-800/50 focus:outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              {errorMessage && (
                <div className="text-red-700 bg-red-100 border border-red-300 rounded-md py-2 px-3 text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-800 text-white font-medium hover:bg-red-700 transition shadow-md"
                >
                  Generate Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // PREVIEW + ACTIONS
        <div className="fixed inset-0 bg-gray-100 overflow-auto z-50 p-6 flex justify-center">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
            <div ref={printRef} className="p-4">
              <EndorsementLetter
                supervisor={letterData.hrDetails.hrName}
                company={letterData.companyDetails}
                students={[`${letterData.intern.firstname} ${letterData.intern.lastname}`]}
                startDate={letterData.companyDetails.startDate}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-700"
                onClick={() => setLetterData(null)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition text-white shadow-md"
                onClick={handleGeneratePDF}
              >
                Save to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Endorsement;
