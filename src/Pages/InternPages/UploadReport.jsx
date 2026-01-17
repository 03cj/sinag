import { Award, Calendar, Camera, Clock, Send, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const UploadReport = () => {
  const fileInputRef = useRef(null);

  /* =========================
     FORM STATE
  ========================= */
  const [form, setForm] = useState({
    day: '',
    date: '',
    timeIn: '',
    timeOut: '',
    tasks: '',
    skills: '',
    learning: '',
  });

  const [totalHours, setTotalHours] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================
     AUTO CALCULATE TOTAL HOURS
  ========================= */
  useEffect(() => {
    if (!form.timeIn || !form.timeOut) {
      setTotalHours('');
      return;
    }

    const [inH, inM] = form.timeIn.split(':').map(Number);
    const [outH, outM] = form.timeOut.split(':').map(Number);

    let start = inH * 60 + inM;
    let end = outH * 60 + outM;

    // overnight support
    if (end < start) end += 24 * 60;

    setTotalHours(((end - start) / 60).toFixed(2));
  }, [form.timeIn, form.timeOut]);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!form.date || !form.timeIn || !form.timeOut || !form.tasks) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Try different possible token keys
      let token =
        localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('auth_token');

      if (!token) {
        console.log('Available localStorage keys:', Object.keys(localStorage));
        alert('No authentication token found. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Token found:', token.substring(0, 20) + '...'); // Debug log

      const response = await fetch('/api/daily-log', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          log_date: form.date,
          time_in: form.timeIn,
          time_out: form.timeOut,
          tasks_accomplished: form.tasks,
          skills_enhanced: form.skills,
          learning_applied: form.learning,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.message}`);
        console.error('Upload failed:', data);
        setIsSubmitting(false);
        return;
      }

      // Success!
      alert('Daily log saved successfully!');
      console.log('Saved log:', data);

      // Reset form
      setForm({
        day: '',
        date: '',
        timeIn: '',
        timeOut: '',
        tasks: '',
        skills: '',
        learning: '',
      });
      setTotalHours('');
      setIsSubmitting(false);
    } catch (err) {
      alert('Network error: ' + err.message);
      console.error('Fetch error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 bg-gray-50 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      {/* LEFT SIDE */}
      <div className="lg:col-span-4 bg-gradient-to-b from-slate-100 to-slate-200/50 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h2 className="text-[#800000] text-2xl font-black tracking-tight mb-1">Daily Log</h2>
            <p className="text-slate-700 text-sm font-medium">Document your progress and growth.</p>
          </div>

          <div className="space-y-6">
            {/* DAY + DATE */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <Award size={14} className="mr-2 text-[#800000]" /> Day
                </label>
                <input
                  type="text"
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  placeholder="01"
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 shadow-sm text-lg font-bold text-[#800000]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <Calendar size={14} className="mr-2 text-[#800000]" /> Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            {/* TOTAL HOURS */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                <Clock size={14} className="mr-2 text-[#800000]" /> Total Hours
              </label>
              <input
                type="text"
                value={totalHours}
                readOnly
                placeholder="0.00"
                className="w-full bg-white border border-slate-300 rounded-xl p-4 shadow-sm text-base font-bold text-slate-900 text-center"
              />
            </div>

            {/* TIME IN / OUT */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-900 uppercase mb-1">In</span>
                  <input
                    type="time"
                    name="timeIn"
                    value={form.timeIn}
                    onChange={handleChange}
                    className="w-full h-12 text-center text-lg font-black text-[#800000] bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-900 uppercase mb-1">Out</span>
                  <input
                    type="time"
                    name="timeOut"
                    value={form.timeOut}
                    onChange={handleChange}
                    className="w-full h-12 text-center text-lg font-black text-[#800000] bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={!form.timeOut || isSubmitting}
          className="mt-10 w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[#600000] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <Send size={18} /> {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-8 p-6 md:p-10 lg:p-12 space-y-8 bg-white">
        {/* TASKS */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2.5 bg-[#800000]/5 rounded-xl text-[#800000]">
              <Target size={22} />
            </div>
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">Tasks Accomplished</label>
          </div>
          <textarea
            name="tasks"
            value={form.tasks}
            onChange={handleChange}
            className="w-full p-5 bg-slate-50 border rounded-2xl min-h-[140px]"
          />
        </div>

        {/* SKILLS + LEARNING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <textarea
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border rounded-2xl min-h-[120px]"
            placeholder="Skills Enhanced"
          />
          <textarea
            name="learning"
            value={form.learning}
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border rounded-2xl min-h-[120px]"
            placeholder="Learning Applied"
          />
        </div>

        {/* PHOTO UPLOAD */}
        <input type="file" ref={fileInputRef} className="hidden" />
        <div
          onClick={() => fileInputRef.current.click()}
          className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-dashed cursor-pointer"
        >
          <Camera size={22} />
          <span className="text-xs font-black uppercase text-slate-600">Browse Library</span>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;
