import { Building2, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Evaluation = () => {
  const navigate = useNavigate();

  const handleEvaluate = (type) => {
    if (type === 'company') {
      navigate('/pup-sinag/intern/hte-evaluation');
    } else {
      navigate('/pup-sinag/intern/supervisor-evaluation');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-slate-800 p-6">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#800000] tracking-tight">Performance Evaluation</h1>
        <div className="h-1 w-24 bg-[#FFD700] mx-auto mt-3 rounded-full"></div>
        <p className="mt-4 text-gray-500 font-medium">Please select a category to begin your assessment</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-12">
        <EvaluationCard title="Company" icon={<Building2 size={42} />} onClick={() => handleEvaluate('company')} />

        <EvaluationCard
          title="Supervisor"
          icon={<UserCheck size={42} />}
          onClick={() => handleEvaluate('supervisor')}
        />
      </div>
    </div>
  );
};

const EvaluationCard = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    className="group relative w-64 h-72 bg-white rounded-3xl border border-gray-100
               shadow-lg shadow-gray-200/60 transition-all duration-300
               hover:-translate-y-2 hover:shadow-2xl active:scale-95 overflow-hidden"
  >
    {/* Accent Bar */}
    <div className="absolute top-0 w-full h-2 bg-[#800000] group-hover:bg-[#FFD700] transition-colors"></div>

    <div className="flex flex-col items-center justify-center h-full">
      {/* Icon */}
      <div
        className="flex items-center justify-center w-20 h-20 mb-6 rounded-2xl
                   bg-gray-50 text-[#800000]
                   shadow-inner
                   group-hover:bg-[#800000]
                   group-hover:text-white
                   transition-all duration-300"
      >
        {icon}
      </div>

      {/* Title */}
      <span className="text-lg font-bold uppercase tracking-wider text-gray-700 group-hover:text-[#800000]">
        {title}
      </span>

      {/* CTA */}
      <div
        className="mt-5 px-6 py-1.5 rounded-full text-xs font-bold
                   border border-gray-200 text-gray-400
                   group-hover:border-[#FFD700]
                   group-hover:text-[#800000]
                   transition-all duration-300"
      >
        START EVALUATION
      </div>
    </div>
  </button>
);

export default Evaluation;
