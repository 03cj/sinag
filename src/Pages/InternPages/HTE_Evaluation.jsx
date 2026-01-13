import { ArrowLeft, FileText, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ======================
   SIMULATED USER CONTEXT
====================== */
const useUserContext = () => {
  const currentUser = {
    studNo: '2021-00123',
    name: 'Jane Doe',
    role: 'intern',
  };
  return { user: currentUser };
};

/* ======================
   SIMPLE MODAL
====================== */
const SimpleModal = ({ isVisible, title, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border-t-4 border-red-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================
   PERFORMANCE INDICATORS
   (PDF-EXACT)
====================== */
const performanceIndicators = [
  'Provides comprehensive Internship Plan to student-interns (company profile, objectives, job description, knowledge, and competencies, journal/DTR, list of equivalencies, and focal person)',
  'Orients student-interns on the standard rules and regulations, policies, potential projects, and respective work assignments in the HTE',
  'Commits to let student-interns undergo an Internship Program consistent with the requirements of the University: Online Training (web-based) or be subjected to Work-from-Home arrangements as delegated by the HTE and under the policies of the University',
  'Ensures that student-interns are rendering the training hours within the regular working hours',
  'Provides free relevant instruction, exposure, and training to the student-intern, consistent with its policies, rules, and regulations',
  'Treats the student-interns in a professional manner, and ensures that the student-interns are not exposed to any form of harassment/unethical practices or tasks and work assignments that are unreasonably risky, dangerous, or unrelated to the purposes of the Internship Program',
  'Observes safety measures for the student-interns and ensures quality of training',
  'Issues Certificate of Completion to the student-interns not later than two weeks after the completion of internship',
  'Attends appreciation dialogue/exit conference/culminating activity conducted by the College/Branch/Satellite Campuses',
];

const ratingScale = [5, 4, 3, 2, 1];

const HTE_Evaluation = () => {
  const { user } = useUserContext();
  const studNo = user?.studNo;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    nature: '',
    ratings: performanceIndicators.map(() => '5'),
    remarks: performanceIndicators.map(() => ''),
    strengths: '',
    improvements: '',
    recommendations: '',
    submittedBy: '',
    notedBy: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isVisible: false, title: '', message: '' });

  const showMessage = (title, message) => setModal({ isVisible: true, title, message });

  const closeModal = () => setModal({ isVisible: false, title: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studNo) {
      showMessage('Error', 'Student number is missing.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      console.log('HTE Evaluation Submitted:', { studNo, formData });
      showMessage('Success', 'HTE Evaluation submitted successfully.');
      setIsSubmitting(false);
    }, 1500);
  };

  const renderRatingRadios = (index) =>
    ratingScale.map((score) => (
      <label key={score} className="inline-flex items-center justify-center w-8 h-8">
        <input
          type="radio"
          name={`rating-${index}`}
          value={score}
          checked={formData.ratings[index] === String(score)}
          onChange={() => {
            const ratings = [...formData.ratings];
            ratings[index] = String(score);
            setFormData({ ...formData, ratings });
          }}
          className="form-radio h-4 w-4 text-red-700"
          disabled={isSubmitting}
        />
      </label>
    ));

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-6 lg:p-8">
      <SimpleModal {...modal} onClose={closeModal} />

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex justify-between items-center">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center text-red-700 font-semibold">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <p className="font-bold">
            Evaluating Student No: <span className="text-red-700">{studNo}</span>
          </p>
        </div>

        {/* Title */}
        <div className="bg-red-800 text-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-extrabold italic text-yellow-300">
            Evaluation Instrument for Host Training Establishment
          </h2>
          <p className="text-sm mt-1">Polytechnic University of the Philippines</p>
        </div>

        {/* Company Info */}
        <div className="bg-white p-6 rounded-lg shadow space-y-3">
          <input
            placeholder="Name of HTE"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            placeholder="Nature of Business"
            value={formData.nature}
            onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* =========================
    LEGEND SECTION (OFFICIAL)
========================= */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-red-800 mb-4">Legend:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT: DESCRIPTIVE */}
            <div className="border border-gray-400 p-4">
              <h4 className="font-bold mb-2 text-gray-800">Descriptive:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>5 – Fully Compliant (91%–100%)</li>
                <li>4 – Compliant (66%–90%)</li>
                <li>3 – Somewhat Compliant (41%–65%)</li>
                <li>2 – Not Compliant (11%–40%)</li>
                <li>1 – Fully Not Compliant (0%–10%)</li>
              </ul>
            </div>

            {/* RIGHT: NUMERICAL */}
            <div className="border border-gray-400 p-4">
              <h4 className="font-bold mb-2 text-gray-800">Numerical:</h4>

              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-left">Weighted Mean</th>
                    <th className="border px-2 py-1 text-left">Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">4.51 – 5.00</td>
                    <td className="border px-2 py-1">Full Compliant</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">3.51 – 4.50</td>
                    <td className="border px-2 py-1">Compliant</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">2.51 – 3.50</td>
                    <td className="border px-2 py-1">Somewhat Compliant</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">1.51 – 2.50</td>
                    <td className="border px-2 py-1">Not Compliant</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">1.00 – 1.50</td>
                    <td className="border px-2 py-1">Fully Not Compliant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Evaluation Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left w-1/2">Performance Indicators</th>
                <th className="px-6 py-3 text-center w-1/6">5 4 3 2 1</th>
                <th className="px-6 py-3 text-left w-1/3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {performanceIndicators.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="px-6 py-4 text-sm">{item}</td>
                  <td className="px-6 py-4 flex justify-center">{renderRatingRadios(i)}</td>
                  <td className="px-6 py-4">
                    <input
                      className="w-full border p-2 rounded text-sm"
                      value={formData.remarks[i]}
                      onChange={(e) => {
                        const remarks = [...formData.remarks];
                        remarks[i] = e.target.value;
                        setFormData({ ...formData, remarks });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <textarea
            placeholder="Strength/s"
            className="w-full border p-2 rounded"
            rows={4}
            value={formData.strengths}
            onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
          />
          <textarea
            placeholder="Area/s Needing Improvement"
            className="w-full border p-2 rounded"
            rows={4}
            value={formData.improvements}
            onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
          />
          <textarea
            placeholder="Recommendation/s"
            className="w-full border p-2 rounded"
            rows={3}
            value={formData.recommendations}
            onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
          />

          <input
            placeholder="Submitted by (Student Intern)"
            className="w-full border-b p-2 text-center"
            value={formData.submittedBy}
            onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
          />
          <input
            placeholder="Noted by (Internship Adviser)"
            className="w-full border-b p-2 text-center"
            value={formData.notedBy}
            onChange={(e) => setFormData({ ...formData, notedBy: e.target.value })}
          />
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-3 rounded-lg font-bold"
          disabled={isSubmitting}
        >
          <Send className="inline mr-2" /> Submit HTE Evaluation
        </button>

        <button
          type="button"
          onClick={() => navigate('../self-evaluation')}
          className="w-full border-2 border-red-700 text-red-700 py-3 rounded-lg font-bold"
        >
          <FileText className="inline mr-2" /> View Self Evaluation Instrument
        </button>
      </form>
    </div>
  );
};

export default HTE_Evaluation;
