import { useEffect, useState } from 'react';

const NotarizedAgreementForm = ({ onClose }) => {
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

      try {
        const res = await fetch('http://localhost:5000/api/documents/notarized-agreement-data', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error('Backend response:', text);
          alert('HTE not yet assigned or agreement data unavailable');
          return;
        }

        const data = await res.json();

        setForm({
          studentName: data.studentName || '',
          guardianName: data.guardian || '',
          course: data.program || '',
          hteName: data.hteName || '',
          hteAddress: data.hteAddress || '',
          authorizedRep: data.authorizedRep || '',
          startDate: data.startDate || '',
          endDate: '',
          hours: '',
        });
      } catch (err) {
        console.error('Fetch notarized agreement failed:', err);
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
    onClose && onClose();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Notarized Internship Agreement</h2>

      <input value={form.studentName} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input
        name="guardianName"
        value={form.guardianName}
        onChange={handleChange}
        placeholder="Parent / Guardian Name"
        className="w-full border p-2 rounded"
      />

      <input value={form.course} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input value={form.hteName} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input value={form.hteAddress} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input value={form.authorizedRep} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input
        name="hours"
        value={form.hours}
        onChange={handleChange}
        placeholder="Total Required Hours"
        className="w-full border p-2 rounded"
      />

      <input type="date" value={form.startDate} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input type="date" value={form.endDate} readOnly className="w-full border p-2 rounded bg-gray-100" />

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
