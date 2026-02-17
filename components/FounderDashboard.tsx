import React from 'react';
import type { FounderProfile, Idea } from '../types';
import { User, Brain, Clock, ListChecks } from 'lucide-react';
import FounderSkills from './FounderSkills';
import TimeBudgetTracker from './TimeBudgetTracker';
import PriorityCommand from './PriorityCommand';

interface FounderDashboardProps {
  profile: FounderProfile;
  onProfileUpdate: (newProfile: FounderProfile) => void;
  agents: Idea[];
}

const FounderDashboard: React.FC<FounderDashboardProps> = ({ profile, onProfileUpdate, agents }) => {
  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <User size={22} className="mr-3 text-indigo-400" />
        Founder's Cockpit (Cerebral Cortex)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Manage your most valuable asset: you. Define your skills and time to allow the brain to act as your Chief of Staff, protecting your focus and optimizing your workflow.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
            <FounderSkills profile={profile} onProfileUpdate={onProfileUpdate} />
            <TimeBudgetTracker profile={profile} onProfileUpdate={onProfileUpdate} agents={agents}/>
        </div>
        <PriorityCommand agents={agents} />
      </div>
    </div>
  );
};

export default FounderDashboard;