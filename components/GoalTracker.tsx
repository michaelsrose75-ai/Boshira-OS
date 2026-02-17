
import React from 'react';
import { Target, CheckCircle, Repeat } from 'lucide-react';
import type { GoalHistoryEntry } from '../types';

interface GoalTrackerProps {
  currentProfit: number;
  goal: number;
  history: GoalHistoryEntry[];
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ currentProfit, goal, history }) => {
  const progress = Math.min(100, (currentProfit / goal) * 100);
  const lastGoalAchieved = history.length > 0 ? history[history.length - 1] : undefined;

  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-white mb-1 flex items-center">
            <Target size={20} className="mr-3 text-indigo-400" />
            Primary Financial Goal
          </h4>
          <p className="text-sm text-gray-400">Your fleet's main objective is to achieve this weekly profit target.</p>
        </div>
        {lastGoalAchieved && (
            <div className="text-right">
                <p className="text-xs text-green-400 font-semibold flex items-center">
                    <CheckCircle size={14} className="mr-2"/>
                    Last Goal Achieved
                </p>
                <p className="text-sm text-gray-300 font-mono">
                    {formatCurrency(lastGoalAchieved.goalAmount)}/wk on {new Date(lastGoalAchieved.dateAchieved).toLocaleDateString()}
                </p>
            </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-end mb-1">
            <span className="text-2xl font-bold text-green-400">{formatCurrency(currentProfit)} <span className="text-sm font-normal text-gray-400">/ wk</span></span>
            <span className="text-sm font-semibold text-gray-300">Target: {formatCurrency(goal)} / wk</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600">
            <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2" 
                style={{width: `${progress}%`}}
            >
               {progress > 10 && <span className="text-xs font-bold text-white">{progress.toFixed(0)}%</span>}
            </div>
        </div>
      </div>
      
      {progress >= 100 && (
        <div className="mt-4 text-center bg-green-900/30 p-2 rounded-md border border-green-700/50">
            <p className="text-sm font-semibold text-green-300 flex items-center justify-center">
                <Repeat size={14} className="mr-2 animate-spin"/>
                Goal Achieved! Brain is setting a new target and switching to Post-Goal Strategy...
            </p>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;