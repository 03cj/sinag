import axios from '@/services/axios';
import { ArrowLeft, ClipboardList, UserCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ============================
   DATA BASED ON OFFICIAL PDF
============================ */
const evaluationSections = [
  {
    title: 'I. Mentoring/Coaching',
    indicators: [
      'Orients the students on the company goals, objectives, and policies.',
      'Discusses the duties, responsibilities, and specific tasks related to internship training program outcomes.',
      'Provides clear instructions, tips, and advice on job-related tasks.',
      'Encourages student-intern’s initiative, creativity, and innovativeness in the workplace when necessary.',
      'Gives student-intern the opportunity to raise issues and/or concerns to be addressed.',
      'Reports to the concerned internship adviser the status of the student-intern’s training exposure.',
    ],
  },
  {
    title: 'II. Interpersonal Skills',
    indicators: [
      'Builds an environment of trust and encouragement that allows student interns to foster their ideas and to cooperate.',
      'Encourages the trainee to interact with colleagues.',
      'Builds healthy working relationships with the student-intern to facilitate accomplishment of goals.',
      'Encourages collaboration and communication in the work station.',
    ],
  },
  {
    title: 'III. Work Ethics',
    indicators: [
      'Promotes professional and positive workplace behavior in terms of punctuality and productivity.',
      'Ensures that all interactions are conducted with respect towards every individual.',
      'Accepts responsibility and accountability for decisions and actions taken.',
      'Uses appropriate oral and written communication in the workplace.',
      'Respects inclusivity and diversity in the workplace.',
    ],
  },
  {
    title: 'IV. Support and Assistance on Specific Task',
    indicators: [
      'Provides the necessary resources to do the job successfully.',
      'Sets clear expectations and standard measures for deliverables.',
      'Allows the student-intern to participate in the work that directly correlates to their field of specialization.',
      'Assists the student-intern in the technical and actual aspects of the training.',
      'Assigns a regular schedule for consultation.',
      'Maintains objectivity in evaluating and assessing the student intern.',
      'Provides opportunities for learning and professional growth.',
    ],
  },
  {
    title: 'V. Feedback Mechanism',
    indicators: [
      'Conducts weekly routine feedback on performance and expectations.',
      'Gives constructive and regular descriptive feedback on student-intern’s progress.',
      'Communicates to the internship adviser any concern, query, or issue regarding the internship.',
      'Provides written evaluation of student-intern’s performance to further improve competitiveness.',
      'Gives credit and recognition for a job well-done.',
    ],
  },
];

const ratingLegend = ['5', '4', '3', '2', '1'];

const Supervisor_Evaluation = () => {
  const navigate = useNavigate();
  const [internInfo, setInternInfo] = useState(null);

  const totalIndicators = evaluationSections.reduce((sum, section) => sum + section.indicators.length, 0);

  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('Summer');
  useEffect(() => {
    const fetchInternInfo = async () => {
      try {
        const res = await axios.get('/auth/me');

        setInternInfo(res.data);
      } catch (error) {
        console.error('Failed to load intern info', error);
      }
    };

    fetchInternInfo();
  }, []);

  const [ratings, setRatings] = useState(Array(totalIndicators).fill('5'));
  const [remarks, setRemarks] = useState(Array(totalIndicators).fill(''));
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getIndicatorIndex = (sectionIndex, indicatorIndex) => {
    let index = 0;
    for (let i = 0; i < sectionIndex; i++) {
      index += evaluationSections[i].indicators.length;
    }
    return index + indicatorIndex;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const items = evaluationSections.flatMap((section, sIndex) =>
        section.indicators.map((indicator, iIndex) => {
          const idx = getIndicatorIndex(sIndex, iIndex);
          return {
            section: section.title,
            indicator,
            rating: Number(ratings[idx]),
            remark: remarks[idx],
          };
        }),
      );

      await axios.post('/api/supervisor-evaluations', {
        intern_id: internInfo.intern.id,
        company_id: internInfo.intern.company_id,
        academic_year: academicYear,
        semester,
        comment,
        items,
      });

      alert('Supervisor Evaluation Submitted Successfully!');
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <button type="button" onClick={() => navigate(-1)} className="flex items-center text-red-700 font-semibold">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        {/* Header */}
        <div className="bg-red-800 text-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold italic text-yellow-300">
            Evaluation Instrument for the Training Supervisor
          </h2>
          <p className="mt-2 text-sm">Polytechnic University of the Philippines</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border space-y-2 text-sm">
          <p>
            <strong>Name of the Student:</strong> {internInfo?.intern?.full_name || '—'}
          </p>

          <p>
            <strong>Course/Year and Section:</strong>{' '}
            {internInfo?.intern
              ? `${internInfo.intern.course} ${internInfo.intern.year}-${internInfo.intern.section}`
              : '—'}
          </p>

          <p className="flex items-center gap-2">
            <strong>School Term:</strong>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
              required
            >
              <option value="">Select</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="Summer">Summer</option>
            </select>
          </p>

          <p className="flex items-center gap-2">
            <strong>Academic Year:</strong>
            <input
              type="text"
              placeholder="e.g. 2024–2025"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
              required
            />
          </p>

          <p>
            <strong>Name of the Host Training Establishment (HTE) / Nature of Industry:</strong>{' '}
            {internInfo?.intern?.Company?.name || '—'}
          </p>
        </div>

        {/* =========================
            LEGEND (PDF-ACCURATE)
        ========================= */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Legend
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descriptive */}
            <div className="border border-black p-4">
              <h4 className="font-bold mb-2">Descriptive:</h4>
              <ul className="text-sm space-y-1">
                <li>5 – Strongly Agree</li>
                <li>4 – Agree</li>
                <li>3 – Moderately Agree</li>
                <li>2 – Disagree</li>
                <li>1 – Strongly Disagree</li>
              </ul>
            </div>

            {/* Numerical */}
            <div className="border border-black p-4">
              <h4 className="font-bold mb-2 text-center">Numerical:</h4>
              <table className="w-full text-sm border border-black">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1">WEIGHTED MEAN</th>
                    <th className="border border-black px-2 py-1">INTERPRETATION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">4.21 – 5.00</td>
                    <td className="border px-2 py-1">Strongly Agree</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">3.41 – 4.20</td>
                    <td className="border px-2 py-1">Agree</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">2.61 – 3.40</td>
                    <td className="border px-2 py-1">Moderately Agree</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">1.81 – 2.60</td>
                    <td className="border px-2 py-1">Disagree</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">1.00 – 1.80</td>
                    <td className="border px-2 py-1">Strongly Disagree</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Evaluation Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-x-auto border">
          <table className="min-w-full divide-y">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left w-1/2">Performance Indicators</th>
                <th className="px-6 py-3 text-center w-[15%]">5 4 3 2 1</th>
                <th className="px-6 py-3 text-left w-[35%]">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {evaluationSections.map((section, sIndex) => (
                <React.Fragment key={section.title}>
                  <tr className="bg-red-200">
                    <td colSpan="3" className="px-6 py-2 font-bold text-red-900">
                      {section.title}
                    </td>
                  </tr>

                  {section.indicators.map((indicator, iIndex) => {
                    const idx = getIndicatorIndex(sIndex, iIndex);
                    return (
                      <tr key={idx} className="border-t">
                        <td className="px-6 py-4 text-sm">{indicator}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            {ratingLegend.map((score) => (
                              <input
                                key={score}
                                type="radio"
                                name={`rating-${idx}`}
                                value={score}
                                checked={ratings[idx] === score}
                                onChange={() => {
                                  const r = [...ratings];
                                  r[idx] = score;
                                  setRatings(r);
                                }}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="w-full border p-2 rounded text-sm"
                            value={remarks[idx]}
                            onChange={(e) => {
                              const r = [...remarks];
                              r[idx] = e.target.value;
                              setRemarks(r);
                            }}
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

        {/* Comments & Signature */}
        <div className="bg-white p-6 rounded-lg shadow border space-y-4">
          <h3 className="font-bold text-red-800">Comment/s:</h3>
          <textarea
            rows="4"
            className="w-full border p-2 rounded"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex justify-between pt-4 text-sm">
            <div className="text-center w-1/2">
              <p className="border-b font-bold">________________________</p>
              <p>Full Name of Student-Intern</p>
            </div>
            <div className="text-center w-1/4">
              <p className="border-b font-bold">____________</p>
              <p>Date</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !academicYear || !semester}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          <UserCheck className="inline mr-2" />
          Submit Supervisor Evaluation
        </button>
      </form>
    </div>
  );
};

export default Supervisor_Evaluation;
