import { Award, BookOpen, Calendar, Camera, Clock, Send, Sparkles, Target } from 'lucide-react';
import { useRef } from 'react';

const DailyReportSimple = () => {
  const fileInputRef = useRef(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      {/* LEFT SIDE: METADATA */}
      <div className="lg:col-span-4 bg-slate-50/50 p-8 lg:p-10 border-r border-slate-100 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h2 className="text-[#800000] text-2xl font-black tracking-tight mb-1">Daily Log</h2>
            <p className="text-slate-500 text-sm">Document your progress and growth.</p>
          </div>

          <div className="space-y-6">
            {/* Day & Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Award size={14} className="mr-2 text-[#800000]" /> Day
                </label>
                <input
                  type="text"
                  placeholder="01"
                  className="w-full bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#800000]/20 outline-none text-lg font-bold text-[#800000]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Calendar size={14} className="mr-2 text-[#800000]" /> Date
                </label>
                <input
                  type="date"
                  className="w-full bg-white border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#800000]/20 outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Hours Accumulated */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Clock size={14} className="mr-2 text-[#800000]" /> Total Hours
              </label>
              <input
                type="text"
                placeholder="e.g. 8 Hours"
                className="w-full bg-white border-none rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#800000]/20 outline-none text-base font-semibold"
              />
            </div>

            {/* Time Log Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">In</span>
                  <input
                    type="time"
                    className="text-xl font-black text-[#800000] bg-transparent border-none p-0 focus:ring-0 w-full text-center"
                  />
                </div>
                <div className="h-8 w-[1px] bg-slate-100"></div>
                <div className="text-center flex-1">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Out</span>
                  <input
                    type="time"
                    className="text-xl font-black text-[#800000] bg-transparent border-none p-0 focus:ring-0 w-full text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-8 w-full bg-[#800000] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-red-900/20 hover:bg-[#600000] transform transition hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
          <Send size={18} /> Submit Report
        </button>
      </div>

      {/* RIGHT SIDE: CONTENT */}
      <div className="lg:col-span-8 p-8 lg:p-12 space-y-10">
        {/* Task Accomplished */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
            <div className="p-2 bg-[#800000]/5 rounded-lg text-[#800000]">
              <Target size={20} />
            </div>
            <label className="text-sm font-black uppercase tracking-widest text-slate-700">Tasks Accomplished</label>
          </div>
          <textarea
            className="w-full p-0 bg-transparent border-none focus:ring-0 text-lg leading-relaxed placeholder:text-slate-300 min-h-[120px] resize-none"
            placeholder="Briefly describe what you achieved today..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
              <div className="p-2 bg-[#800000]/5 rounded-lg text-[#800000]">
                <Sparkles size={18} />
              </div>
              <label className="text-sm font-black uppercase tracking-widest text-slate-700">Skills Enhanced</label>
            </div>
            <textarea
              className="w-full p-0 bg-transparent border-none focus:ring-0 text-base leading-relaxed placeholder:text-slate-300 min-h-[100px] resize-none"
              placeholder="Any new growth or insights?"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
              <div className="p-2 bg-[#800000]/5 rounded-lg text-[#800000]">
                <BookOpen size={18} />
              </div>
              <label className="text-sm font-black uppercase tracking-widest text-slate-700">Learning Applied</label>
            </div>
            <textarea
              className="w-full p-0 bg-transparent border-none focus:ring-0 text-base leading-relaxed placeholder:text-slate-300 min-h-[100px] resize-none"
              placeholder="Academic subjects used today..."
            />
          </div>
        </div>

        {/* COMPACT UPLOAD AREA */}
        <div className="pt-6">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
          <div
            onClick={() => fileInputRef.current.click()}
            className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#800000] hover:bg-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-[#800000] transition-colors">
                <Camera size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Action Photos</p>
                <p className="text-xs text-slate-400">Click to upload visual evidence</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-[#800000] transition-colors pr-2">
              Browse Library
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReportSimple;
