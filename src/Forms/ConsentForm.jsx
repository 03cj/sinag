import { useEffect, useState } from 'react';

const ConsentForm = ({ onClose }) => {
  const [form, setForm] = useState({
    studentName: '',
    guardianName: '',
    hours: '',
    startDate: '',
    endDate: '',
    hteName: '',
    hteAddress: '',
    course: '',
  });

  /* =========================
     FETCH CONSENT DATA
  ========================= */
  useEffect(() => {
    const fetchConsentData = async () => {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/auth/consent-data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        studentName: data.studentName || '',
        guardianName: data.guardian || '',
        course: data.program || '',
        hteName: data.hteName || '',
        hteAddress: data.hteAddress || '',
        startDate: data.startDate || '',
      }));
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
    onClose && onClose();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Consent Form Details</h2>

      {/* STUDENT NAME */}
      <input name="studentName" value={form.studentName} readOnly className="w-full border p-2 rounded bg-gray-100" />

      {/* GUARDIAN */}
      <input
        name="guardianName"
        value={form.guardianName}
        onChange={handleChange}
        placeholder="Parent / Guardian Name"
        className="w-full border p-2 rounded"
      />

      {/* REQUIRED HOURS */}
      <input
        name="hours"
        value={form.hours}
        onChange={handleChange}
        placeholder="Required Hours"
        className="w-full border p-2 rounded"
      />

      {/* DATES */}
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        readOnly
        className="w-full border p-2 rounded bg-gray-100"
      />

      <p className="text-sm text-gray-500">Start date is set by the adviser.</p>

      <input
        type="date"
        name="endDate"
        value={form.endDate}
        readOnly
        className="w-full border p-2 rounded bg-gray-100"
      />

      {/* HTE NAME (READ-ONLY) */}
      <input value={form.hteName} readOnly className="w-full border p-2 rounded bg-gray-100" />

      {/* HTE ADDRESS (READ-ONLY) */}
      <input value={form.hteAddress} readOnly className="w-full border p-2 rounded bg-gray-100" />

      {/* COURSE */}
      <input value={form.course} readOnly className="w-full border p-2 rounded bg-gray-100" />

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
