import React from 'react';
import type { SimulationResult } from '../types';
import { Lightbulb, TrendingUp, TrendingDown, Check, Users, Shield, FileText } from 'lucide-react';

interface SimulationReportProps {
  result: SimulationResult;
}

const SimulationReport: React.FC<SimulationReportProps> = ({ result }) => {
  const { hiveConsensusPrediction, keyDivergences, hiveNotebookEntry, recommendations, projectedProfitImpact } = result;

  const impactColor = projectedProfitImpact >= 0 ? 'text-green-400' : 'text-red-400';
  const ImpactIcon = projectedProfitImpact >= 0 ? TrendingUp : TrendingDown;
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h5 className="text-lg font-bold text-white mb-2 flex items-center">
            <Users size={18} className="mr-2 text-indigo-400"/>
            Hive Consensus Prediction
        </h5>
        <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
          <p className="text-xl font-semibold text-indigo-300">{hiveConsensusPrediction}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h5 className="text-md font-bold text-white mb-2 flex items-center">
                <Shield size={16} className="mr-2 text-red-400"/>
                Key Divergences & Risks
            </h5>
            <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700 h-full">
                <p className="text-sm text-gray-300 leading-relaxed">{keyDivergences}</p>
            </div>
        </div>
        <div>
            <h5 className="text-md font-bold text-white mb-2 flex items-center">
                <FileText size={16} className="mr-2 text-gray-400"/>
                Hive Notebook Entry
            </h5>
            <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700 h-full">
                <p className="text-sm text-gray-400 font-mono italic">{hiveNotebookEntry}</p>
            </div>
        </div>
      </div>
      
       <div>
        <h5 className="text-lg font-bold text-white mb-2">Projected Financial Impact</h5>
        <div className={`bg-gray-800/50 p-4 rounded-md border border-gray-700 flex items-center justify-center text-center ${impactColor}`}>
          <ImpactIcon size={24} className="mr-3" />
          <p className="text-2xl font-bold">
            {projectedProfitImpact >= 0 ? '+' : ''}{formatCurrency(projectedProfitImpact)}
          </p>
          <p className="text-sm text-gray-400 ml-2">in fleet profit</p>
        </div>
      </div>

      <div>
        <h5 className="text-lg font-bold text-white mb-2 flex items-center">
          <Lightbulb size={18} className="mr-2 text-yellow-400" />
          Strategic Recommendations
        </h5>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start text-gray-300 bg-gray-800/50 p-3 rounded-md border border-gray-700">
              <Check size={16} className="mr-3 mt-1 text-green-400 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SimulationReport;