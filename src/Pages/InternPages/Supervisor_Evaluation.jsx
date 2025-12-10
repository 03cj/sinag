import { ArrowLeft, ClipboardList, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Data structure based on the Supervisor Evaluation Instrument
const evaluationSections = [
  {
    title: 'A. Mentoring/Coaching',
    indicators: [
      'Orients and coaches students on the company goals, objectives, and policies.',
      'Discusses the duties, responsibilities, and specific tasks.',
      'Provides clear instructions, tips, and advice on job-related tasks.',
      'Encourages student-intern’s initiative, creativity, and resourcefulness in the workplace when necessary.',
      'Gives student-intern the opportunity to raise issues and/or concerns to be determined adviser the status of the student-intern’s training exposure.',
    ],
  },
  {
    title: 'B. Interpersonal Skills',
    indicators: [
      'Builds an environment of trust and encouragement that allows student interns to foster their desire to learn.',
      'Fosters opportunities for student interns to interact with colleagues that help them gain knowledge and skills.',
      'Builds healthy working relationships with the student-intern to facilitate accomplishment of goals.',
      'Encourages collaboration and communication in the workplace.',
    ],
  },
  {
    title: 'C. Work Ethics',
    indicators: ['Promotes professional and cooperative workplace behavior in terms of punctuality and productivity.'],
  },
  {
    title: 'IV. Support and Assistance on Specific Task',
    indicators: [
      'Provides the necessary resources to do the job.',
      'Successively sets expectations and standard measures for deliverables.',
      'Orients the student-intern to participate in the work that directly assists the student-intern in goal realization and actual job placement.',
      'Assists a regular schedule for consultation.',
      'Maintains objectivity in evaluating and assessing the growth.',
      'Provides opportunities for learning and professional growth.',
    ],
  },
  {
    title: 'V. Feedback Mechanism',
    indicators: [
      'Conducts weekly/routine feedback on performance.',
      'Gives constructive and regular descriptive feedback concerning student intern’s progress.',
      'Consults with the internship adviser on any concern, query, or issue regarding the student-intern’s documentation/evaluation of student-intern.',
      'Provides written evaluation of the student intern.',
      'Gives credit and recognition for a job well done.',
    ],
  },
];

const ratingLegend = {
  5: 'Strongly Agree',
  4: 'Agree',
  3: 'Moderately Agree',
  2: 'Disagree',
  1: 'Strongly Disagree',
};

const Supervisor_Evaluation = () => {
  const navigate = useNavigate();
  // Initialize state for all ratings and remarks
  const initialRatings = evaluationSections.flatMap(
    (section) => section.indicators.map(() => '5'), // Default to 'Strongly Agree'
  );
  const initialRemarks = evaluationSections.flatMap((section) => section.indicators.map(() => ''));

  const [ratings, setRatings] = useState(initialRatings);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [comment, setComment] = useState(
    'It is truly grateful for the experience and for having such an inspiring mentor.',
  ); // Pre-filled based on image
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to find the index of the indicator across all sections
  const getIndicatorIndex = (sectionIndex, indicatorIndex) => {
    let totalIndex = 0;
    for (let i = 0; i < sectionIndex; i++) {
      totalIndex += evaluationSections[i].indicators.length;
    }
    return totalIndex + indicatorIndex;
  };

  const handleRatingChange = (sectionIndex, indicatorIndex, value) => {
    const overallIndex = getIndicatorIndex(sectionIndex, indicatorIndex);
    const newRatings = [...ratings];
    newRatings[overallIndex] = value;
    setRatings(newRatings);
  };

  const handleRemarkChange = (sectionIndex, indicatorIndex, value) => {
    const overallIndex = getIndicatorIndex(sectionIndex, indicatorIndex);
    const newRemarks = [...remarks];
    newRemarks[overallIndex] = value;
    setRemarks(newRemarks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ⭐️ You would replace this setTimeout with your actual API call ⭐️
    setTimeout(() => {
      console.log('Supervisor Evaluation Data:', { ratings, remarks, comment });
      alert('Supervisor Evaluation Submitted Successfully!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* Navigation and Header Block */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="flex items-center text-red-700 hover:text-red-900 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Self Evaluation
          </button>
        </div>

        {/* Header/Title Block */}
        <div className="bg-red-800 text-white p-6 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold italic" style={{ color: 'yellow' }}>
            Evaluation Instrument for the Training Supervisor
          </h2>
          <p className="mt-2 text-sm">Polytechnic University of the Philippines</p>
          <p className="mt-1 text-xs italic">Student Name: CHERYL S. SAGUN</p>
        </div>

        {/* Legend/Rating Scale */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-3 text-red-800 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Rating Legend
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 text-sm">
              <thead className="bg-red-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-center w-1/5">Numerical</th>
                  <th className="px-6 py-3 text-left w-2/5">Descriptive</th>
                  <th className="px-6 py-3 text-left w-2/5">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(ratingLegend).map(([score, description]) => (
                  <tr key={score} className="bg-white hover:bg-red-50">
                    <td className="px-6 py-2 text-center font-bold">{score}</td>
                    <td className="px-6 py-2">{description}</td>
                    <td className="px-6 py-2">
                      {score === '5' && 'Strongly Agree'}
                      {score === '4' && 'Agree'}
                      {score === '3' && 'Moderately Agree'}
                      {score === '2' && 'Disagree'}
                      {score === '1' && 'Strongly Disagree'}
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
            {/* Table Header */}
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider w-1/2">
                  Performance Indicators
                </th>
                <th className="px-2 py-3 text-center text-sm font-bold uppercase tracking-wider w-[15%]">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider w-[35%]">Remarks</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {evaluationSections.map((section, sectionIndex) => (
                <React.Fragment key={section.title}>
                  <tr className="bg-red-200">
                    <td colSpan="3" className="px-6 py-2 text-md font-extrabold text-red-900">
                      {section.title}
                    </td>
                  </tr>
                  {section.indicators.map((indicator, indicatorIndex) => {
                    const overallIndex = getIndicatorIndex(sectionIndex, indicatorIndex);
                    return (
                      <tr key={indicatorIndex} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-700 w-1/2">{indicator}</td>
                        <td className="px-2 py-4 text-center text-sm font-medium w-[15%]">
                          <div className="flex justify-center space-x-2">
                            {Object.keys(ratingLegend).map((score) => (
                              <label key={score} className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`rating-${overallIndex}`}
                                  value={score}
                                  checked={ratings[overallIndex] === score}
                                  onChange={(e) => handleRatingChange(sectionIndex, indicatorIndex, e.target.value)}
                                  className="form-radio h-4 w-4 text-red-700 focus:ring-red-500"
                                  disabled={isSubmitting}
                                />
                                <span className="text-xs ml-1">{score}</span>
                              </label>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 w-[35%]">
                          <input
                            type="text"
                            value={remarks[overallIndex]}
                            onChange={(e) => handleRemarkChange(sectionIndex, indicatorIndex, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                            placeholder="Add remark (optional)"
                            disabled={isSubmitting}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comments/Signatures Block */}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 space-y-4">
          <h3 className="text-xl font-bold mb-3 text-red-800">Comment/s:</h3>

          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
            placeholder="Enter your comments here..."
            disabled={isSubmitting}
          ></textarea>

          {/* Signature and Date */}
          <div className="flex flex-col md:flex-row justify-between pt-4 space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex-1 text-center">
              <p className="text-lg font-bold border-b border-gray-800 pb-1 text-gray-800">CHERYL S. SAGUN</p>
              <p className="text-sm text-gray-600 mt-1">Signature Over Full Name of Student Intern</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-lg font-bold border-b border-gray-800 pb-1 text-gray-800">JUNE 10, 2024</p>
              <p className="text-sm text-gray-600 mt-1">Date</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8">
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
                <UserCheck className="w-5 h-5 mr-2" />
                Submit Supervisor Evaluation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Supervisor_Evaluation;
