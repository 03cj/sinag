import { ArrowLeft, FileText, Send, X } from 'lucide-react'; // ⭐️ ADDED FileText ⭐️
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 🚨 SIMULATED USER CONTEXT HOOK 🚨
// Replace this function with your actual method (Context API, Redux, etc.)
// to securely fetch the logged-in intern's data from the 'user' table.
const useUserContext = () => {
  // This value must be retrieved from the active user's session/state
  const currentUser = {
    studNo: '2021-00123', // Example student number from the 'user' table
    name: 'Jane Doe',
    role: 'intern',
  };
  return { user: currentUser };
};
// ---------------------------------------------------------------------

// Custom Modal Component to replace window.alert() and window.confirm()
const SimpleModal = ({ isVisible, title, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 border-t-4 border-red-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 transition shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Performance Indicators
const performanceIndicators = [
  'Provides comprehensive Internship Plan to student interns (company profile, objectives, job description, knowledge, and competencies, journal/DTR, list of equivalencies, and focal person).',
  'Orients student-interns on the standard rules and regulations, policies, potential projects, and respective work assignments in the HTE.',
  'Commits to let student-interns undergo an internship Program compliant with the requirements of the University - Online Training (web-based) or be subjected to Work-from-Home arrangements as selected by the HTE and under the policies of the University.',
  'Ensures that student-interns are rendering the training hours within the regular working hours.',
  'Provides free relevant instruction, exposure, and training to the student-intern, consistent with its policies, rules, and regulations.',
  'Treats the student-interns in a professional manner, and ensures that the student-interns are not exposed to any form of harassment/unethical practices or tasks and work assignments that are unsafe/risky, or unrelated to the purposes of the Internship Program.',
  'Observes safety measures for the student-interns and ensures quality of training.',
  'Issues Certificate of Completion to the student-interns not later than two weeks after the completion of internship.',
  'Attends application dialogue/exit conference/culminating activity conducted by the College/Branch/Satellite Campuses.',
];

// Rating Scale Legend
const ratingScale = {
  5: 'Fully Compliant (91-100%)',
  4: 'Compliant (76-90%)',
  3: 'Somewhat Compliant (61%-75%)',
  2: 'Moderately Compliant (26-60%)',
  1: 'Fully Not Compliant (0%-10%)',
};

const HTE_Evaluation = () => {
  // ⭐️ FIX: Get the student number from context/state, not URL params ⭐️
  const { user } = useUserContext();
  const studNo = user?.studNo;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'DLX BAGS PHILIPPINES INC', // Pre-fill based on image
    address: 'SFB # 3 LUZON AVENUE FAB, MARIVELES, BATAAN',
    nature: 'TEXTILE, APPAREL AND ACCESORIES',
    ratings: performanceIndicators.map(() => '5'), // Default to 'Fully Compliant'
    remarks: performanceIndicators.map(() => ''),
    // --- NEW FIELDS ADDED ---
    strengths: '',
    improvements: '',
    recommendations: '',
    submittedatabasey: '',
    notedatabasey: '',
    // ------------------------
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    isVisible: false,
    title: '',
    message: '',
  });

  const showMessage = (title, message) => {
    setModal({ isVisible: true, title, message });
  };

  const closeModal = () => {
    setModal({ isVisible: false, title: '', message: '' });
  };

  const handleRatingChange = (index, value) => {
    const newRatings = [...formData.ratings];
    newRatings[index] = value;
    setFormData({ ...formData, ratings: newRatings });
  };

  const handleRemarkChange = (index, value) => {
    const newRemarks = [...formData.remarks];
    newRemarks[index] = value;
    setFormData({ ...formData, remarks: newRemarks });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studNo) {
      showMessage('Error', 'Student number is missing. Cannot submit evaluation.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call for submission
    setTimeout(() => {
      console.log('Form Data Submitted for Student:', studNo, formData);
      showMessage('Submission Successful', `Evaluation form for student ${studNo} submitted successfully!`);
      setIsSubmitting(false);
    }, 1500);
  };

  // Helper function to render radio buttons for a specific indicator
  const renderRatingRadios = (index) => {
    return Object.keys(ratingScale).map((score) => (
      <label key={score} className="inline-flex items-center mx-2 md:mx-0 justify-center w-8 h-8">
        <input
          type="radio"
          name={`rating-${index}`}
          value={score}
          checked={formData.ratings[index] === score}
          onChange={() => handleRatingChange(index, score)}
          className="form-radio h-4 w-4 text-red-700 focus:ring-red-500"
          disabled={isSubmitting}
        />
      </label>
    ));
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-6 lg:p-8">
      {/* Custom Modal */}
      <SimpleModal isVisible={modal.isVisible} title={modal.title} message={modal.message} onClose={closeModal} />

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* Navigation and Header Block */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)} // Go back to the previous page (Dashboard)
            type="button"
            className="flex items-center text-red-700 hover:text-red-900 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          {/* Now uses the studNo from context, which is the correct intern's number */}
          <p className="text-lg font-bold text-gray-700">
            Evaluating Student No: <span className="text-red-700">{studNo || 'N/A'}</span>
          </p>
        </div>

        {/* Header/Title Block */}
        <div className="bg-red-800 text-white p-6 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold italic" style={{ color: 'yellow' }}>
            Evaluation Instrument for Host Training Establishment
          </h2>
          <p className="mt-2 text-sm">Polytechnic University of the Philippines</p>
        </div>

        {/* Company Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-gray-800 space-y-3">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <label className="flex-1 block">
              <span className="font-bold block mb-1">Name of the HTE:</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </label>
            <label className="flex-1 block mt-3 md:mt-0">
              <span className="font-bold block mb-1">Nature of Business:</span>
              <input
                type="text"
                value={formData.nature}
                onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
                disabled={isSubmitting}
              />
            </label>
          </div>
          <label className="block">
            <span className="font-bold block mb-1">Address:</span>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
              disabled={isSubmitting}
            />
          </label>
        </div>

        {/* Legend/Rating Scale Table (Replicated from image) */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-3 text-red-800">Legend:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-red-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-1/4">Descriptive</th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider w-1/4">Numerical</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-1/4">
                    Weighted Mean
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-1/4">
                    Interpretation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {/* Descriptive/Numerical/Interpretation Rows */}
                {Object.entries(ratingScale).map(([score, description], index) => (
                  <tr key={score} className={`${index % 2 === 0 ? 'bg-white' : 'bg-red-50'}`}>
                    <td className="px-6 py-3 font-medium">
                      {score} - {description}
                    </td>
                    <td className="px-6 py-3 text-center">{score}</td>
                    <td className="px-6 py-3">
                      {index === 0 && '4.51 - 5.00'}
                      {index === 1 && '3.51 - 4.50'}
                      {index === 2 && '2.51 - 3.50'}
                      {index === 3 && '1.51 - 2.50'}
                      {index === 4 && '1.00 - 1.50'}
                    </td>
                    <td className="px-6 py-3">
                      {index === 0 && 'Fully Compliant'}
                      {index === 1 && 'Compliant'}
                      {index === 2 && 'Somewhat Compliant'}
                      {index === 3 && 'Moderately Compliant'}
                      {index === 4 && 'Fully Not Compliant'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-x-auto border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header (Red) */}
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider w-1/2">
                  Performance Indicators
                </th>
                <th className="px-2 py-3 text-center text-sm font-bold uppercase tracking-wider w-[15%]">
                  5 | 4 | 3 | 2 | 1
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider w-[35%]">Remarks</th>
              </tr>
            </thead>
            {/* Table Body (White) */}
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceIndicators.map((indicator, index) => (
                <tr key={index} className="hover:bg-red-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700 w-1/2">{indicator}</td>
                  <td className="px-2 py-4 text-center text-sm font-medium w-[15%] flex justify-center space-x-1 md:space-x-0">
                    {renderRatingRadios(index)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 w-[35%]">
                    <input
                      type="text"
                      value={formData.remarks[index]}
                      onChange={(e) => handleRemarkChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                      placeholder="Add remark (optional)"
                      disabled={isSubmitting}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- START OF NEW SECTION (Final Evaluation and Signatures Block) --- */}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 space-y-4">
          <h3 className="text-xl font-bold mb-3 text-red-800">Summary & Recommendations:</h3>

          {/* Strength/s */}
          <label className="block">
            <span className="font-bold block mb-1 text-gray-800">Strength/s:</span>
            <textarea
              rows="4"
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="e.g., The company maintains a proactive and energetic work environment that keeps me motivated and engaged throughout my internship..."
              disabled={isSubmitting}
            ></textarea>
          </label>

          {/* Area/s Needing Improvement */}
          <label className="block">
            <span className="font-bold block mb-1 text-gray-800">Area/s Needing Improvement:</span>
            <textarea
              rows="4"
              value={formData.improvements}
              onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="e.g., Providing their production employees with better facilities which DLX Bags still needs significant improvements..."
              disabled={isSubmitting}
            ></textarea>
          </label>

          {/* Recommendation/s */}
          <label className="block">
            <span className="font-bold block mb-1 text-gray-800">Recommendation/s:</span>
            <textarea
              rows="3"
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="e.g., Continue communication, discuss achievements, support diversity, and prioritize work-life balance to maintain a motivated and productive work environment."
              disabled={isSubmitting}
            ></textarea>
          </label>

          {/* Signatures Block */}
          <div className="flex flex-col md:flex-row justify-between pt-4 space-y-6 md:space-y-0 md:space-x-6">
            {/* Submitted By */}
            <div className="flex-1 border-b border-gray-400 pb-2">
              <label className="block">
                <span className="font-bold block mb-1 text-gray-800">Submitted by:</span>
                <input
                  type="text"
                  value={formData.submittedatabasey}
                  onChange={(e) => setFormData({ ...formData, submittedatabasey: e.target.value })}
                  className="w-full p-1 text-center text-sm border-0 border-b border-gray-300 focus:ring-0 focus:border-red-500"
                  placeholder="[Signature over Full Name of Student Intern]"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            {/* Noted By */}
            <div className="flex-1 border-b border-gray-400 pb-2">
              <label className="block">
                <span className="font-bold block mb-1 text-gray-800">Noted by:</span>
                <input
                  type="text"
                  value={formData.notedatabasey}
                  onChange={(e) => setFormData({ ...formData, notedatabasey: e.target.value })}
                  className="w-full p-1 text-center text-sm border-0 border-b border-gray-300 focus:ring-0 focus:border-red-500"
                  placeholder="[Signature over Full Name of Internship Adviser]"
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>
        </div>
        {/* --- END OF NEW SECTION --- */}

        {/* Submit and Navigation Buttons ⭐️ UPDATED BLOCK ⭐️ */}
        <div className="pt-4 pb-8 space-y-4">
          <button
            type="submit"
            className={`w-full flex justify-center items-center py-3 rounded-lg font-bold text-lg transition-colors shadow-lg ${
              isSubmitting ? 'bg-red-400 text-red-100 cursor-not-allowed' : 'bg-red-700 text-white hover:bg-red-800'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit HTE Evaluation
              </>
            )}
          </button>

          {/* New Self Evaluation Button */}
          <button
            type="button"
            // Navigates to the sibling route 'self-evaluation' within the '/intern' path
            onClick={() => navigate('../self-evaluation')}
            className="w-full flex justify-center items-center py-3 rounded-lg font-bold text-lg transition-colors shadow-lg border-2 border-red-700 text-red-700 bg-white hover:bg-red-50"
          >
            <FileText className="w-5 h-5 mr-2" />
            View Self Evaluation Instrument
          </button>
        </div>
      </form>
    </div>
  );
};

export default HTE_Evaluation;
