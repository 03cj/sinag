import { useEffect, useState } from 'react';

const ConsentForm = ({ onClose, onUploaded }) => {
  const [form, setForm] = useState({
    studentName: '',
    guardianName: '',
    hours: '',
    startDate: '',
    endDate: '',
    hteName: '',
    hteAddress: '',
    supervisorName: '',
    course: '',
  });

  /* =========================
     FETCH CONSENT DATA
  ========================= */
  useEffect(() => {
    const fetchConsentData = async () => {
      const token = localStorage.getItem('token');
      console.log('🔑 Token from storage:', token ? '✅ exists' : '❌ missing');

      try {
        // Try to get full consent data (requires HTE assignment)
        console.log('🔄 Fetching from /api/auth/consent-data...');
        const res = await fetch('http://localhost:5000/api/auth/consent-data', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('📊 Response status:', res.status, res.statusText);

        if (res.ok) {
          const data = await res.json();
          console.log('✅ Consent data loaded:', data);
          setForm((prev) => ({
            ...prev,
            studentName: data.studentName || '',
            guardianName: data.guardian || '',
            course: data.program || '',
            hteName: data.hteName || '',
            hteAddress: data.hteAddress || '',
            supervisorName: data.supervisorName || '',
            startDate: data.startDate || '',
            hours: data.hours || '',
          }));
          return; // Success, exit early
        } else {
          const err = await res.json();
          console.warn('⚠️ Consent data error (status ' + res.status + '):', err.message);
        }

        // Fallback if HTE not assigned: get basic user data
        console.log('🔄 Fallback: Fetching from /api/auth/me...');
        const me = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (me.ok) {
          const user = await me.json();
          console.log('✅ User data loaded (no HTE yet):', user);
          setForm((prev) => ({
            ...prev,
            studentName: `${user.firstName || user.firstname || ''} ${user.lastName || user.lastname || ''}`.trim(),
            course: user.program || '',
          }));
        }
      } catch (err) {
        console.error('❌ Failed to fetch consent data:', err);
      }
    };

    fetchConsentData();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const HOURS_PER_DAY = 8;

  const calculateEndDate = (startDate, hours) => {
    if (!startDate || !hours) return '';

    let remainingHours = Number(hours);
    let date = new Date(startDate);

    while (remainingHours > 0) {
      date.setDate(date.getDate() + 1);

      const day = date.getDay();
      if (day !== 0 && day !== 6) {
        remainingHours -= HOURS_PER_DAY;
      }
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
  const handleSave = async () => {
    if (!form.guardianName || !form.hours) {
      alert('Please fill guardian name and required hours');
      return;
    }

    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:5000/api/auth/consent-save', {
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
      alert('Failed to save consent form');
      return;
    }

    const data = await res.json();

    window.open(`http://localhost:5000${data.fileUrl}`, '_blank');
    // Update parent list if provided
    if (onUploaded) {
      const filename = data.file || data.filename || data.fileUrl?.split('/').pop();
      onUploaded(filename || null);
    }
    onClose && onClose();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Consent Form Details</h2>

      {/* STUDENT NAME */}
      <div>
        <label className="block text-sm font-medium mb-1">Student Name</label>
        <input name="studentName" value={form.studentName} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      {/* GUARDIAN */}
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

      {/* REQUIRED HOURS */}
      <div>
        <label className="block text-sm font-medium mb-1">Required Hours</label>
        <input
          name="hours"
          value={form.hours}
          onChange={handleChange}
          placeholder="Required Hours"
          className="w-full border p-2 rounded bg-gray-100"
          readOnly
        />
      </div>

      {/* DATES */}
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
        <p className="text-sm text-gray-500 mt-1">Start date is set by the adviser.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      {/* HTE NAME (READ-ONLY) */}
      <div>
        <label className="block text-sm font-medium mb-1">Company / HTE Name</label>
        <input
          value={form.hteName}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Company Name"
        />
      </div>

      {/* SUPERVISOR NAME (READ-ONLY) */}
      <div>
        <label className="block text-sm font-medium mb-1">Supervisor / HR Name</label>
        <input
          value={form.supervisorName}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Supervisor Name"
        />
      </div>

      {/* HTE ADDRESS (READ-ONLY) */}
      <div>
        <label className="block text-sm font-medium mb-1">Company Address</label>
        <input
          value={form.hteAddress}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Company Address"
        />
      </div>

      {/* COURSE */}
      <div>
        <label className="block text-sm font-medium mb-1">Course / Program</label>
        <input value={form.course} readOnly className="w-full border p-2 rounded bg-gray-100" />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
          Cancel
        </button>

        <button type="button" onClick={handleSave} className="px-4 py-2 rounded bg-red-900 text-white hover:bg-red-500">
          Save & Preview
        </button>
      </div>
    </div>
  );
};

export default ConsentForm;
