import jsPDF from 'jspdf';
import { AlertCircle, CheckCircle2, Clock, Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const SupervisorReportModal = ({ isOpen, onClose, intern }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    if (isOpen && intern) {
      fetchInternReports();
    }
  }, [isOpen, intern]);

  const fetchInternReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      const internId = intern?.id || intern?.intern_id;

      if (!internId) {
        setError('Invalid intern ID');
        console.error('Missing intern ID. Intern object:', intern);
        return;
      }

      const apiUrl = `${API_BASE_URL}/api/company/daily-logs/${internId}`;
      console.log('🔗 Fetching from:', apiUrl);

      const response = await fetch(apiUrl, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched reports:', data);

        const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.log_date) - new Date(a.log_date)) : [];
        setReports(sorted);
      } else {
        const errorData = await response.text();
        setError(`Failed to fetch reports: ${response.status}`);
        console.error('❌ Failed response:', response.status, errorData);
      }
    } catch (error) {
      setError(`Error fetching reports: ${error.message}`);
      console.error('❌ Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reportId, status) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/daily-logs/${reportId}/supervisor-approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supervisor_status: status,
          supervisor_comment: `Approved by Supervisor on ${new Date().toLocaleDateString()}`,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedLog = await response.json();
        setReports(reports.map((r) => (r.id === reportId ? updatedLog.log : r)));
        console.log('✅ Report approved successfully');
      } else {
        console.error('❌ Error approving report:', response.status);
        setError('Failed to approve report');
      }
    } catch (error) {
      console.error('❌ Error approving report:', error);
      setError('Error approving report');
    }
  };

  const generatePDF = (report) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 10;

      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('DAILY REPORT OF ACTIVITIES', pageWidth / 2, yPosition, {
        align: 'center',
      });

      yPosition += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Student Info
      doc.text(`Student: ${intern.firstName} ${intern.lastName}`, 10, yPosition);
      yPosition += 7;
      doc.text(`Student No.: ${intern.studentId}`, 10, yPosition);
      yPosition += 7;
      doc.text(`Date: ${report.log_date}`, 10, yPosition);
      yPosition += 7;
      doc.text(`Day No.: ${report.day_no}`, 10, yPosition);

      yPosition += 12;
      doc.setFont('helvetica', 'bold');
      doc.text('Time Report:', 10, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(`Time In: ${report.time_in}`, 15, yPosition);
      yPosition += 5;
      doc.text(`Time Out: ${report.time_out}`, 15, yPosition);
      yPosition += 5;
      doc.text(`Total Hours: ${report.total_hours} hours`, 15, yPosition);

      yPosition += 12;
      doc.setFont('helvetica', 'bold');
      doc.text('Tasks Accomplished:', 10, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const taskLines = doc.splitTextToSize(report.tasks_accomplished, pageWidth - 20);
      doc.text(taskLines, 10, yPosition);
      yPosition += taskLines.length * 5 + 5;

      if (report.skills_enhanced) {
        doc.setFont('helvetica', 'bold');
        doc.text('Skills Enhanced:', 10, yPosition);
        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        const skillLines = doc.splitTextToSize(report.skills_enhanced, pageWidth - 20);
        doc.text(skillLines, 10, yPosition);
        yPosition += skillLines.length * 5 + 5;
      }

      if (report.learning_applied) {
        doc.setFont('helvetica', 'bold');
        doc.text('Learning Applied:', 10, yPosition);
        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        const learningLines = doc.splitTextToSize(report.learning_applied, pageWidth - 20);
        doc.text(learningLines, 10, yPosition);
      }

      // Footer
      yPosition = pageHeight - 15;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });

      doc.save(`Daily_Report_Day_${report.day_no}_${intern.studentId}.pdf`);
      console.log('✅ PDF generated successfully');
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-red-700 to-red-900 text-white px-8 py-6 flex justify-between items-center border-b border-red-800">
          <div>
            <h2 className="text-2xl font-bold">
              {intern?.firstName || 'Unknown'} {intern?.lastName || 'Student'}
            </h2>
            <p className="text-red-100 text-sm mt-1">
              Daily Activity Reports · Student ID: {intern?.studentId || 'N/A'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-600 rounded-full p-2 transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-500" />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <AlertCircle size={48} className="text-gray-300" />
              <p className="text-gray-500 text-lg">No reports submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 bg-white hover:bg-gray-50"
                >
                  {/* REPORT HEADER */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900">
                        Day {report.day_no} -{' '}
                        {new Date(report.log_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </h3>
                      <div className="flex gap-6 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {report.time_in} - {report.time_out}
                        </span>
                        <span className="font-bold text-[#800000]">{report.total_hours} hrs</span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 flex-wrap justify-end">
                      {/* APPROVAL STATUS */}
                      <div className="flex items-center gap-2">
                        {report.supervisor_status === 'Pending' ? (
                          <>
                            <span className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200">
                              ⏳ PENDING
                            </span>
                            <button
                              onClick={() => handleApprove(report.id, 'Approved')}
                              className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-xs font-bold shadow-sm hover:shadow-md"
                            >
                              <CheckCircle2 size={16} />
                              Approve
                            </button>
                          </>
                        ) : report.supervisor_status === 'Approved' ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                            <CheckCircle2 size={16} /> APPROVED
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1">
                            ✕ REJECTED
                          </span>
                        )}
                      </div>

                      {/* PDF DOWNLOAD BUTTON */}
                      <button
                        onClick={() => generatePDF(report)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-200 text-xs font-bold shadow-sm hover:shadow-md"
                      >
                        <Download size={16} />
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-gray-200 my-5"></div>

                  {/* REPORT DETAILS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT COLUMN - TEXT DETAILS */}
                    <div className="space-y-4">
                      {/* Tasks Accomplished */}
                      <div>
                        <label className="font-bold text-gray-800 text-sm block mb-2">Tasks Accomplished:</label>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
                          {report.tasks_accomplished || 'No tasks recorded'}
                        </p>
                      </div>

                      {/* Skills Enhanced */}
                      {report.skills_enhanced && (
                        <div>
                          <label className="font-bold text-gray-800 text-sm block mb-2">Skills Enhanced:</label>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
                            {report.skills_enhanced}
                          </p>
                        </div>
                      )}

                      {/* Learning Applied */}
                      {report.learning_applied && (
                        <div>
                          <label className="font-bold text-gray-800 text-sm block mb-2">Learning Applied:</label>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">
                            {report.learning_applied}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN - PHOTO */}
                    <div className="flex flex-col">
                      <label className="font-bold text-gray-800 text-sm mb-3">Uploaded Photo:</label>
                      {report.photo_path ? (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-3">
                          <img
                            src={`${API_BASE_URL}/uploads/${report.photo_path}`}
                            alt={`Day ${report.day_no} photo`}
                            className="w-full h-auto rounded border border-gray-100 shadow-sm max-h-64 object-contain"
                            onLoad={() => console.log('✅ Image loaded successfully:', report.photo_path)}
                            onError={(e) => {
                              console.error('❌ Image load failed');
                              console.error('   Photo path:', report.photo_path);
                              console.error('   URL attempted:', e.target.src);
                              e.target.src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
                          <AlertCircle size={32} className="text-gray-400 mb-2" />
                          <p className="text-gray-500 text-sm">No photo uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SUPERVISOR COMMENT */}
                  {report.supervisor_comment && (
                    <div className="mt-5 pt-5 border-t border-gray-200">
                      <label className="font-bold text-gray-800 text-sm block mb-2">Supervisor Comment:</label>
                      <p className="text-gray-700 text-sm bg-blue-50 p-3 rounded border border-blue-200">
                        {report.supervisor_comment}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorReportModal;
