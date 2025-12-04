// src/components/KPICard.js
import React from 'react';

const KPICard = ({ title, value, description, className = '' }) => {
  return (
    <div className={`bg-red-800 text-white rounded-lg p-5 text-center flex flex-col justify-center items-center min-h-[120px] shadow-md ${className}`}>
      <div className="text-base font-bold mb-1">{title}</div>
      <div className="text-5xl font-extrabold leading-none mb-1">{value}</div>
      {description && <div className="text-sm opacity-80">{description}</div>}
    </div>
  );
};

export default KPICard;