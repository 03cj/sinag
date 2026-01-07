import { ArrowLeft, BookOpen, ClipboardList, PenTool, Send, UserCheck } from 'lucide-react'; // ⭐️ ADDED Send and UserCheck ⭐️
import { useState } from 'react'; // ⭐️ ADDED useState ⭐️
import { useNavigate } from 'react-router-dom';

// Data object holding the content extracted from the image files (Unchanged)
const selfEvaluationData = {
  submittedatabasey: 'CHERYL S. SAGUN',
  notedatabasey: 'PROF. NOMERIANO C. CANTAN (Internship Adviser)',
  q1: {
    question: 'Has the practicum/filed work experience help you prepare for a job in a computer field? Why or why not?',
    answer:
      'Yes. The practicum experience helped me build a professional network by connecting with industry experts and colleagues. Additionally, it exposed me to current technologies and industry practices, which enhanced my understanding of what is expected in a professional setting. The mentorship and feedatabaseack I received during the practicum were invaluable for my personal and professional growth, helping me identify and work on my areas of improvement. Overall, it boosted my confidence and readiness to face real-world challenges in the computer field.',
  },
  q2: {
    question: 'Which of the subject you have taken were one of the most value during the practicum?',
    answer:
      'Human Resource Management (HRM) was one of the most valuable subjects. Understanding the principles and practices of HRM provided me with essential knowledge and skills for effectively managing personnel in a real-world setting. I learned about recruitment, employee relations, performance management, and other crucial aspects of HRM that directly impacted my ability to navigate workplace dynamics and support organizational goals. Plus, gaining insights into HRM helped me appreciate the significance of nurturing a positive work environment and developing strong relationships with colleagues. This subject truly equipped me with practical tools to address HR challenges confidently during my practicum experience.',
  },
  q3: {
    question: 'What could your company/job supervisor have done to improve your practicum/field work experience?',
    answer:
      'My supervisor made my practicum experience great by creating a clear and supportive workplace. They made sure I knew what to do, trained me hands-on, and encouraged teamwork. They helped me meet people in the field and learn from them. They also suggested workshops to help me grow professionally. Their recognition and support during challenging times boosted my confidence and motivation. Their understanding and flexibility also allowed me to effectively balance my practicum with other commitments, making the experience both enriching and enjoyable.',
  },
  q4: {
    question: 'What you could have done to improve your practicum/filed work experience?',
    answer:
      "Reflecting on my practicum experience, it's evident that setting clearer goals, improving communication with my supervisor, and taking more initiative in seeking tasks could have enhanced my training. Being proactive in seeking feedatabaseack, reflecting on my experiences, and networking with professionals would have furthered my growth. Additionally, better time management could have allowed me to maximize my learning opportunities. Moving forward, prioritizing these aspects will lead to a more rewarding and enriching practicum experience.",
  },
  q5_1: {
    question: '5.1. You felt prepared to do:',
    answer:
      'In my field work, I felt prepared to utilize skills such as active listening and interpersonal communication. These were areas where I had received solid training and felt confident in my abilities to apply them effectively in real-world situations.',
  },
  q5_2: {
    question: '5.2. You felt unprepared to do:',
    answer:
      "Feeling unprepared to handle conflicts means not having the skills or experience to deal with tough situations at work. It's like being thrown into a game without knowing the rules. Maybe I haven't faced many conflicts before, or I'm not sure how to talk things out calmly. Whatever the reason, I can get better at it with practice and by learning from others.",
  },
  q6: {
    question: 'What other courses or learning experience would have helped in the practicum?',
    answer:
      'I realize that courses enhancing communication skills, teamwork, and professional ethics would have significantly improved my experience. Better communication skills, both written and verbal, would have allowed me to interact more effectively with colleagues and supervisors. Additionally, training in teamwork and collaboration would have helped me handle diverse team dynamics and resolve conflicts more smoothly. Lastly, emphasizing professional ethics would have provided a strong foundation for making ethical decisions in the workplace. Overall, focusing on these areas would have enhanced my practicum and prepared me better for future professional goals.',
  },
  q7: {
    question: 'What suggestion can you make to help improve the practicum program?',
    answer:
      'To improve the practicum program, consider exposing students to the latest technologies relevant to their field. By introducing tools and platforms commonly used in the industry, students can gain practical experience that prepares them for their future careers. This hands-on approach not only makes learning more engaging but also ensures students are ready to meet the demands of the job market. Plus, staying updated with the latest tech helps students become adaptable and innovative, qualities that are essential for success in any field.',
  },
};

// Helper component for rendering a single Q&A block (Unchanged)
const QuestionAnswerBlock = ({ data }) => (
  <div className="border-l-4 border-red-700 pl-4 py-3 bg-red-50 rounded-r-lg shadow-sm">
    <h4 className="text-lg font-semibold text-gray-800 flex items-start mb-2">
      <ClipboardList className="w-5 h-5 mr-2 mt-1 text-red-700 flex-shrink-0" />
      {data.question}
    </h4>
    <p className="text-gray-700 italic ml-7 whitespace-pre-wrap">{data.answer}</p>
  </div>
);

const SelfEvaluation = () => {
  const { q1, q2, q3, q4, q5_1, q5_2, q6, q7, submittedatabasey, notedatabasey } = selfEvaluationData;
  const navigate = useNavigate();

  const allQuestions = [q1, q2, q3, q4, q5_1, q5_2, q6, q7];

  // ⭐️ NEW STATE for submission handling ⭐️
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⭐️ NEW FUNCTION for simulated submission ⭐️
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call to mark the self-evaluation as completed/submitted
    setTimeout(() => {
      console.log('Self Evaluation completed and marked as submitted.');
      alert('Self Evaluation form submitted successfully!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Back Button (Unchanged) */}
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="flex items-center text-red-700 hover:text-red-900 font-semibold transition"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to HTE Evaluation
        </button>

        {/* Header Block (Unchanged) */}
        <header className="text-center p-6 bg-red-800 text-white rounded-xl shadow-2xl">
          <p className="text-sm">Republic of the Philippines</p>
          <h1 className="text-3xl font-extrabold tracking-wide">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</h1>
          <h2 className="text-xl font-semibold mt-1">SELF EVALUATION INSTRUMENT</h2>
          <p className="mt-2 text-sm italic">Mariveles, Bataan Campus</p>
        </header>

        {/* Instructions (Unchanged) */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="font-bold text-red-700 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Intern's Self-Assessment:
          </p>
          <p className="text-sm text-gray-600 ml-7">Answers provided by the student intern are displayed below.</p>
        </div>

        {/* Evaluation Questions (Unchanged) */}
        <section className="space-y-6">
          {allQuestions.map((q, index) => (
            <QuestionAnswerBlock key={index} data={q} />
          ))}
        </section>

        {/* Signature Block (Unchanged) */}
        <section className="pt-8 space-y-6">
          <h3 className="text-xl font-bold text-red-800 border-b pb-2 flex items-center">
            <PenTool className="w-5 h-5 mr-2" />
            Confirmation
          </h3>
          <div className="flex flex-col md:flex-row justify-between pt-4 space-y-6 md:space-y-0 md:space-x-12">
            {/* Submitted By */}
            <div className="flex-1 text-center">
              <p className="text-lg font-bold border-b border-gray-800 pb-1 text-gray-800">{submittedatabasey}</p>
              <p className="text-sm text-gray-600 mt-1">Signature over Full Name of Student Intern</p>
            </div>

            {/* Noted By */}
            <div className="flex-1 text-center">
              <p className="text-lg font-bold border-b border-gray-800 pb-1 text-gray-800">{notedatabasey}</p>
              <p className="text-sm text-gray-600 mt-1">Signature over Full Name of Internship Adviser</p>
            </div>
          </div>
        </section>

        {/* ⭐️ NEW ACTION BUTTONS BLOCK ⭐️ */}
        <section className="pt-8 pb-12 space-y-4">
          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full flex justify-center items-center py-3 rounded-lg font-bold text-lg transition-colors shadow-lg ${
              isSubmitting ? 'bg-red-400 text-red-100 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Self Evaluation
              </>
            )}
          </button>

          {/* Evaluate Supervisor Button */}
          <button
            type="button"
            // Navigates to the sibling route 'supervisor-evaluation'
            // Assumes the current path is /intern/self-evaluation and the target is /intern/supervisor-evaluation
            onClick={() => navigate('../supervisor-evaluation')}
            className="w-full flex justify-center items-center py-3 rounded-lg font-bold text-lg transition-colors shadow-lg border-2 border-red-700 text-red-700 bg-white hover:bg-red-50"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Proceed to Evaluate Supervisor
          </button>
        </section>
      </div>
    </div>
  );
};

export default SelfEvaluation;
