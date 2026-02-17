import React from 'react';

interface ProficiencyGaugeProps {
  score: number;
}

const ProficiencyGauge: React.FC<ProficiencyGaugeProps> = ({ score }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score > 80 ? 'var(--accent-cyan)' : score > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90" width="70" height="70" viewBox="0 0 70 70">
        <circle
          className="text-gray-700"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="35"
          cy="35"
        />
        <circle
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="35"
          cy="35"
          style={{ color: color, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <span className="absolute text-xl font-bold" style={{ color: color }}>
        {Math.round(score)}
      </span>
    </div>
  );
};

export default ProficiencyGauge;