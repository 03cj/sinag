import { CheckCircle2, ChevronDown, Clock, Download, Edit3, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from '../../Components/Modal';
import UploadReport from './UploadReport';

const Journal = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH DAILY LOGS
  ========================= */
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5173/api/daily-logs', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch logs:', response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Transform API data to match table structure
      const formattedReports = data.map((log) => ({
        id: log.id,
        dayNo: log.day_no,
        date: log.log_date,
        timeIn: log.time_in,
        timeOut: log.time_out,
        tasksAccomplished: log.tasks_accomplished,
        skillsEnhanced: log.skills_enhanced,
        learningApplied: log.learning_applied,
        supervisorPending: log.supervisor_status === 'Pending',
        supervisorApproved: log.supervisor_status === 'Approved',
        adviserPending: log.adviser_status === 'Pending',
        adviserApproved: log.adviser_status === 'Approved',
        supervisorComment: log.supervisor_comment,
        adviserComment: log.adviser_comment,
      }));

      setReports(formattedReports);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD LOGS ON MOUNT
  ========================= */
  useEffect(() => {
    fetchLogs();
  }, []);

  /* =========================
     HANDLE SUCCESSFUL UPLOAD
  ========================= */
  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchLogs(); // Refresh the table
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* HEADER SECTION */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-[#800000] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-red-900/10 hover:bg-[#600000] transition-all active:scale-95"
        >
          <Upload size={18} />
          Upload
        </button>
      </div>

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)}>
        <UploadReport onUploadSuccess={handleUploadSuccess} />
      </Modal>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#800000] text-white">
              <th className="py-5 px-6 text-sm font-black uppercase tracking-widest border-r border-white/10">
                Day No.
              </th>
              <th className="py-5 px-6 text-sm font-black uppercase tracking-widest border-r border-white/10">Date</th>
              <th className="py-5 px-6 text-sm font-black uppercase tracking-widest border-r border-white/10 text-[11px]">
                Supervisor Approval
              </th>
              <th className="py-5 px-6 text-sm font-black uppercase tracking-widest border-r border-white/10 text-[11px]">
                Adviser Approval
              </th>
              <th className="py-5 px-6 text-sm font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  Loading logs...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6 text-center font-bold text-slate-700 border-r border-slate-50">
                    {report.dayNo}
                  </td>
                  <td className="py-5 px-6 text-center border-r border-slate-50">
                    <div className="flex items-center justify-center gap-2 text-slate-600 font-medium">
                      {report.date}
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center border-r border-slate-50">
                    <div className="flex items-center justify-center gap-3">
                      <Clock size={18} className={report.supervisorPending ? 'text-[#800000]/40' : 'text-slate-300'} />
                      <CheckCircle2
                        size={18}
                        className={report.supervisorApproved ? 'text-yellow-500' : 'text-slate-300'}
                      />
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center border-r border-slate-50">
                    <div className="flex items-center justify-center gap-3">
                      <Clock size={18} className={report.adviserPending ? 'text-[#800000]/40' : 'text-slate-300'} />
                      <CheckCircle2
                        size={18}
                        className={report.adviserApproved ? 'text-yellow-500' : 'text-slate-300'}
                      />
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <div className="flex items-center justify-center gap-4 text-slate-400">
                      <button className="hover:text-[#800000] transition-colors">
                        <Download size={18} />
                      </button>
                      <button className="hover:text-[#800000] transition-colors">
                        <Edit3 size={18} />
                      </button>
                      <button className="hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  No daily logs yet. Click Upload to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Journal;
