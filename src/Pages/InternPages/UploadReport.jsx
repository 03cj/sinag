import { Award, BookOpen, Calendar, Camera, Clock, Send, Sparkles, Target } from 'lucide-react';
import { useRef } from 'react';

const UploadReport = () => {
  const fileInputRef = useRef(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 bg-gray-50 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      {/* LEFT SIDE: METADATA */}
      <div className="lg:col-span-4 bg-gradient-to-b from-slate-100 to-slate-200/50 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            {/* Darkened text-slate-900 for description */}
            <h2 className="text-[#800000] text-2xl font-black tracking-tight mb-1">Daily Log</h2>
            <p className="text-slate-700 text-sm font-medium">Document your progress and growth.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* Changed text-slate-400 to text-slate-800 for labels */}
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <Award size={14} className="mr-2 text-[#800000]" /> Day
                </label>
                <input
                  type="text"
                  placeholder="01"
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none text-lg font-bold text-[#800000] transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <Calendar size={14} className="mr-2 text-[#800000]" /> Date
                </label>
                <input
                  type="date"
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none text-sm font-bold text-slate-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                <Clock size={14} className="mr-2 text-[#800000]" /> Total Hours
              </label>
              <input
                type="text"
                placeholder="e.g. 8 Hours"
                className="w-full bg-white border border-slate-300 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none text-base font-bold text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  {/* Darkened "In" and "Out" labels */}
                  <span className="text-[10px] font-black text-slate-900 uppercase mb-1">In</span>
                  <input
                    type="time"
                    className="w-full h-12 text-center text-lg font-black text-[#800000] bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:bg-white focus:border-[#800000] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-900 uppercase mb-1">Out</span>
                  <input
                    type="time"
                    className="w-full h-12 text-center text-lg font-black text-[#800000] bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:bg-white focus:border-[#800000] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-10 w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/40 hover:bg-[#600000] transform transition hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
          <Send size={18} /> Submit Report
        </button>
      </div>

      {/* RIGHT SIDE: CONTENT */}
      <div className="lg:col-span-8 p-6 md:p-10 lg:p-12 space-y-8 bg-white">
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <div className="p-2.5 bg-[#800000]/5 rounded-xl text-[#800000]">
              <Target size={22} />
            </div>
            {/* Darkened label to text-slate-900 */}
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">Tasks Accomplished</label>
          </div>
          <textarea
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#800000]/5 focus:border-[#800000] focus:bg-white outline-none text-lg font-medium leading-relaxed text-slate-900 placeholder:text-slate-400 min-h-[140px] resize-none transition-all"
            placeholder="Briefly describe what you achieved today..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2 bg-[#800000]/5 rounded-lg text-[#800000]">
                <Sparkles size={18} />
              </div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-900">Skills Enhanced</label>
            </div>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#800000]/5 focus:border-[#800000] focus:bg-white outline-none text-base font-medium text-slate-900 placeholder:text-slate-400 min-h-[120px] resize-none transition-all"
              placeholder="Any new growth or insights?"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2 bg-[#800000]/5 rounded-lg text-[#800000]">
                <BookOpen size={18} />
              </div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-900">Learning Applied</label>
            </div>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#800000]/5 focus:border-[#800000] focus:bg-white outline-none text-base font-medium text-slate-900 placeholder:text-slate-400 min-h-[120px] resize-none transition-all"
              placeholder="Academic subjects used today..."
            />
          </div>
        </div>

        <div className="pt-4">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
          <div
            onClick={() => fileInputRef.current.click()}
            className="group flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#800000] hover:bg-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:text-[#800000] group-hover:border-[#800000]/30 transition-colors">
                <Camera size={22} />
              </div>
              <div>
                {/* Darkened Action Photos text */}
                <p className="text-sm font-black text-slate-900">Action Photos</p>
                <p className="text-xs font-bold text-slate-500">Click to upload visual evidence</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-[#800000] transition-colors pr-2">
                Browse Library
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;
