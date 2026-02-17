import React from 'react';
import { DollarSign, Zap, BrainCircuit } from 'lucide-react';
import Loader from './Loader';
import type { PortfolioRules } from '../types';

interface ExecutiveCommandProps {
  onExecute: () => void;
  isLoading: boolean;
  rules: PortfolioRules;
  onRulesChange: (newRules: PortfolioRules) => void;
}

const ExecutiveCommand: React.FC<ExecutiveCommandProps> = ({ onExecute, isLoading, rules, onRulesChange }) => {

  const handleExecute = () => {
    if (confirm("This will deploy a multi-agent portfolio to autonomously generate income via SaaS, reports, and trading. Are you sure you want to proceed?")) {
      onExecute();
    }
  };

  const handleGenesisToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRulesChange({ ...rules, genesisMode: e.target.checked });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-lg border border-indigo-700 text-center mb-8">
      <h3 className="text-2xl font-bold text-white mb-2">Executive Command</h3>
      <p className="text-indigo-200 mb-6">
        Issue high-level commands to your entire autonomous organization.
      </p>
      
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-10 py-4 bg-green-500 hover:bg-green-600 disabled:bg-green-800 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          {isLoading ? (
            <Loader small />
          ) : (
            <>
              <DollarSign className="h-6 w-6 mr-3" />
              MAKE MONEY
            </>
          )}
        </button>

        <label htmlFor="genesis-toggle" className="flex items-center cursor-pointer group">
            <span className={`text-sm font-semibold mr-3 flex items-center transition-colors ${rules.genesisMode ? 'text-yellow-300' : 'text-indigo-200 group-hover:text-white'}`}>
                <BrainCircuit size={16} className="mr-2" />
                Genesis Mode
            </span>
            <div className="relative">
                <input type="checkbox" id="genesis-toggle" className="sr-only" checked={rules.genesisMode} onChange={handleGenesisToggle} />
                <div className={`block w-14 h-8 rounded-full transition ${rules.genesisMode ? 'bg-yellow-500' : 'bg-indigo-800'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${rules.genesisMode ? 'translate-x-6' : ''}`}></div>
            </div>
        </label>
        <p className="text-xs text-indigo-300 max-w-md mx-auto">
            When enabled, "MAKE MONEY" grants the Hive full autonomy to find and launch new ventures without your approval. High risk, high reward.
        </p>

      </div>
    </div>
  );
};

export default ExecutiveCommand;