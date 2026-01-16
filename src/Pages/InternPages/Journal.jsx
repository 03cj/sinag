import { CheckCircle2, ChevronDown, Clock, Download, Edit3, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import Modal from '../../Components/Modal';
import UploadReport from './UploadReport';

const Journal = ({ reports = [] }) => {
  const [showUpload, setShowUpload] = useState(false);

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
        <UploadReport />
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
            {reports.length > 0
              ? reports.map((report, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
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
                        <Clock
                          size={18}
                          className={report.supervisorPending ? 'text-[#800000]/40' : 'text-slate-300'}
                        />
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
              : /* EMPTY STATES - Purely for structural reference */
                [1, 2, 3].map((_, i) => (
                  <tr key={i} className="h-16">
                    <td className="border-r border-slate-50"></td>
                    <td className="border-r border-slate-50"></td>
                    <td className="border-r border-slate-50"></td>
                    <td className="border-r border-slate-50"></td>
                    <td></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Journal;
