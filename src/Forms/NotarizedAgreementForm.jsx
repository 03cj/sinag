import { useEffect, useState } from 'react';

const NotarizedAgreementForm = ({ onClose, onUploaded }) => {
  const [form, setForm] = useState({
    studentName: '',
    guardianName: '',
    course: '',
    hteName: '',
    hteAddress: '',
    authorizedRep: '',
    startDate: '',
    endDate: '',
    hours: '',
  });

  /* =========================
     FETCH AGREEMENT DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log('🔑 Token from storage:', token ? '✅ exists' : '❌ missing');

      try {
        console.log('🔄 Fetching from /api/documents/notarized-agreement-data...');
        const res = await fetch('http://localhost:5000/api/documents/notarized-agreement-data', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('📊 Response status:', res.status, res.statusText);

        if (res.ok) {
          const data = await res.json();
          console.log('✅ Agreement data loaded:', data);
          setForm((prev) => ({
            ...prev,
            studentName: data.studentName || '',
            guardianName: data.guardian || '',
            course: data.program || '',
            hteName: data.hteName || '',
            hteAddress: data.hteAddress || '',
            authorizedRep: data.authorizedRep || '',
            startDate: data.startDate || '',
            hours: data.hours || '',
          }));
          return; // Success, exit early
        }

        console.warn('⚠️ Agreement data error (status ' + res.status + ')');

        // Fallback user info if primary data unavailable
        console.log('🔄 Fallback: Fetching from /api/auth/me...');
        const me = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (me.ok) {
          const user = await me.json();
          console.log('✅ User data loaded (fallback):', user);
          setForm((prev) => ({
            ...prev,
            studentName: prev.studentName || `${user.firstname || ''} ${user.lastname || ''}`.trim(),
            course: prev.course || user.program || '',
          }));
        }
      } catch (err) {
        console.error('❌ Fetch notarized agreement failed:', err);
      }
    };

    fetchData();
  }, []);

  /* =========================
     HOURS → END DATE LOGIC
  ========================= */
  const HOURS_PER_DAY = 8;

  const calculateEndDate = (startDate, hours) => {
    if (!startDate || !hours) return '';

    let remaining = Number(hours);
    let date = new Date(startDate);

    while (remaining > 0) {
      date.setDate(date.getDate() + 1);
      const day = date.getDay();
      if (day !== 0 && day !== 6) remaining -= HOURS_PER_DAY;
    }

    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'hours') {
        updated.endDate = calculateEndDate(prev.startDate, value);
      }
      return updated;
    });
  };

  /* =========================
     SAVE & GENERATE PDF
  ========================= */
  const handleSave = async () => {
    if (!form.guardianName || !form.hours) {
      alert('Please fill guardian name and required hours');
      return;
    }

    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:5000/api/documents/notarized-agreement-save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        guardianName: form.guardianName,
        hours: form.hours,
        endDate: form.endDate,
      }),
    });

    if (!res.ok) {
      alert('Failed to generate agreement');
      return;
    }

    const data = await res.json();
    window.open(`http://localhost:5000${data.fileUrl}`, '_blank');
    if (onUploaded) {
      const filename = data.file || data.filename || data.fileUrl?.split('/').pop();
      onUploaded(filename || null);
    }
    onClose && onClose();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Notarized Internship Agreement</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Student Name</label>
        <input value={form.studentName} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Parent / Guardian Name *</label>
        <input
          name="guardianName"
          value={form.guardianName}
          onChange={handleChange}
          placeholder="Parent / Guardian Name"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Course / Program</label>
        <input value={form.course} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company / HTE Name</label>
        <input value={form.hteName} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company Address</label>
        <input value={form.hteAddress} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Authorized Representative</label>
        <input value={form.authorizedRep} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Required Hours *</label>
        <input
          name="hours"
          value={form.hours}
          onChange={handleChange}
          placeholder="Total Required Hours"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input type="date" value={form.startDate} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input type="date" value={form.endDate} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
          Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 rounded bg-red-900 text-white hover:bg-red-600">
          Save & Preview
        </button>
      </div>
    </div>
  );
};

export default NotarizedAgreementForm;
