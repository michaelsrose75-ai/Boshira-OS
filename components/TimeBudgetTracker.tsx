import React, { useMemo } from 'react';
import type { FounderProfile, Idea } from '../types';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimeBudgetTrackerProps {
  profile: FounderProfile;
  onProfileUpdate: (newProfile: FounderProfile) => void;
  agents: Idea[];
}

const TimeBudgetTracker: React.FC<TimeBudgetTrackerProps> = ({ profile, onProfileUpdate, agents }) => {
  const totalEstimatedTime = useMemo(() => {
    return agents.reduce((total, agent) => {
      const activeUserTasks = agent.strategies[0].actionPlan.userTasks.filter(t => t.status === 'active');
      const agentTime = activeUserTasks.reduce((sum, task) => sum + task.estimatedTime, 0);
      return total + agentTime;
    }, 0);
  }, [agents]);

  const budgetUsage = profile.weeklyTimeBudget > 0 ? (totalEstimatedTime / profile.weeklyTimeBudget) * 100 : 0;
  const isOverBudget = budgetUsage > 100;

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
      <h4 className="font-semibold text-white mb-4 flex items-center"><Clock size={18} className="mr-2"/>Weekly Time Budget</h4>
      <div className="mb-4">
        <label htmlFor="time-budget" className="block text-sm font-medium text-gray-300 mb-2">Your Weekly Time Commitment (Hours)</label>
        <div className="flex items-center space-x-4">
            <input 
                id="time-budget"
                type="range"
                min="1"
                max="60"
                value={profile.weeklyTimeBudget}
                onChange={(e) => onProfileUpdate({...profile, weeklyTimeBudget: Number(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="font-mono text-indigo-300 text-lg w-20 text-center">{profile.weeklyTimeBudget} hrs</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400">Current active user tasks require an estimated <span className="font-bold text-white">{totalEstimatedTime}</span> hours.</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, budgetUsage)}%`}}></div>
        </div>
        {isOverBudget && (
            <div className="mt-3 text-xs text-red-400 flex items-center">
                <AlertTriangle size={14} className="mr-2"/>
                <p>Workload exceeds budget. Consider outsourcing tasks or increasing your time budget.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TimeBudgetTracker;