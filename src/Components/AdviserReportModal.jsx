import jsPDF from 'jspdf';
import { AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const AdviserReportModal = ({ isOpen, onClose, intern }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && intern) {
      fetchInternReports();
    }
  }, [isOpen, intern]);

  const fetchInternReports = async () => {
    setLoading(true);
    try {
      // Fetch using studentId (which is the intern_id in daily logs)
      const response = await fetch(`http://localhost:5000/api/intern/daily-log/${intern.studNo}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Sort by day_no in descending order (newest first)
        const sorted = data.sort((a, b) => b.day_no - a.day_no);
        setReports(sorted);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reportId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/intern/daily-log/${reportId}/adviser-approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adviser_status: status,
          adviser_comment: `Approved by Adviser on ${new Date().toLocaleDateString()}`,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        // Update local state
        setReports(reports.map((r) => (r.id === reportId ? { ...r, adviser_status: status } : r)));
      }
    } catch (error) {
      console.error('Error approving report:', error);
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
      doc.text(`Student: ${intern.firstname} ${intern.lastname}`, 10, yPosition);
      yPosition += 7;
      doc.text(`Student No.: ${intern.studNo}`, 10, yPosition);
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

      doc.save(`Daily_Report_Day_${report.day_no}_${intern.studNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-[#800000] text-white p-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-2xl font-bold">
              {intern.firstname} {intern.lastname}
            </h2>
            <p className="text-sm text-red-100">Student ID: {intern.studNo}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-red-700 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center gap-3">
              <AlertCircle size={32} className="text-gray-400" />
              <p className="text-gray-600">No reports submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        Day {report.day_no} - {report.log_date}
                      </h3>
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {report.time_in} - {report.time_out}
                        </span>
                        <span className="font-bold text-[#800000]">{report.total_hours} hrs</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* APPROVAL STATUS DISPLAY */}
                      <div className="flex items-center gap-2">
                        {report.adviser_status === 'Pending' ? (
                          <>
                            <span className="bg-amber-300 text-amber-900 px-4 py-1 rounded-full text-xs font-bold">
                              ⏳ PENDING
                            </span>
                            <button
                              onClick={() => handleApprove(report.id, 'Approved')}
                              className="flex items-center gap-2 px-4 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-xs font-bold"
                            >
                              <CheckCircle2 size={14} />
                              Approve
                            </button>
                          </>
                        ) : (
                          <span className="bg-sky-300 text-sky-900 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 size={14} /> APPROVED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* REPORT DETAILS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 border-t border-slate-100 pt-4">
                    {/* LEFT COLUMN - TEXT DETAILS */}
                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-slate-900 text-sm">Tasks Accomplished:</label>
                        <p className="text-slate-700 text-sm mt-1">{report.tasks_accomplished}</p>
                      </div>

                      {report.skills_enhanced && (
                        <div>
                          <label className="font-bold text-slate-900 text-sm">Skills Enhanced:</label>
                          <p className="text-slate-700 text-sm mt-1">{report.skills_enhanced}</p>
                        </div>
                      )}

                      {report.learning_applied && (
                        <div>
                          <label className="font-bold text-slate-900 text-sm">Learning Applied:</label>
                          <p className="text-slate-700 text-sm mt-1">{report.learning_applied}</p>
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN - PHOTO */}
                    {report.photo_path && (
                      <div className="flex flex-col items-center justify-center">
                        <label className="font-bold text-slate-900 text-sm mb-3">Uploaded Photo:</label>
                        <img
                          src={`http://localhost:5000/${report.photo_path}`}
                          alt="Report photo"
                          className="w-full h-auto rounded-lg border border-slate-200 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdviserReportModal;
