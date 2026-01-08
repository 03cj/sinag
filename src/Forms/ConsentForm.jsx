import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsentForm = () => {
  const navigate = useNavigate(); // ✅ MUST be inside component

  const [form, setForm] = useState({
    studentName: '',
    guardianName: '',
    hours: '',
    startDate: '',
    endDate: '',
    hteName: '',
    hteAddress: '',
    course: '',
    city: '',
  });

  /* =========================
     FETCH USER DATA
  ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        studentName: `${data.user.firstName} ${data.user.lastName}`,
        guardianName: data.user.guardian || '',
        course: data.user.program || '',
      }));
    };

    fetchUser();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Consent Form Details</h2>

      {/* Auto-filled */}
      <input name="studentName" value={form.studentName} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input
        name="guardianName"
        value={form.guardianName}
        onChange={handleChange}
        placeholder="Guardian Name"
        className="w-full border p-2 rounded"
      />

      {/* Manual inputs */}
      <input
        name="hours"
        value={form.hours}
        onChange={handleChange}
        placeholder="Required Hours"
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="hteName"
        value={form.hteName}
        onChange={handleChange}
        placeholder="HTE Name"
        className="w-full border p-2 rounded"
      />

      <input
        name="hteAddress"
        value={form.hteAddress}
        onChange={handleChange}
        placeholder="HTE Address"
        className="w-full border p-2 rounded"
      />

      <input name="course" value={form.course} readOnly className="w-full border p-2 rounded bg-gray-100" />

      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        className="w-full border p-2 rounded"
      />

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 pt-4">
        <button onClick={() => navigate('../documents')} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
          Back to Documents
        </button>

        {/* PDF button will go here later */}
      </div>
    </div>
  );
};

export default ConsentForm;
