import React, { useState } from 'react';
import type { Campaign, Idea } from '../types';
import { Flag, Brain, Bot, PlusCircle } from 'lucide-react';
import { generateStrategicCampaign } from '../services/geminiService';
import Loader from './Loader';
import CampaignDashboard from './CampaignDashboard';

interface CampaignPlannerProps {
  campaigns: Campaign[];
  onCampaignUpdate: (campaigns: Campaign[]) => void;
  existingAgents: Idea[];
}

const CampaignPlanner: React.FC<CampaignPlannerProps> = ({ campaigns, onCampaignUpdate, existingAgents }) => {
  const [mission, setMission] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCampaign = async () => {
    if (!mission) return;
    setIsLoading(true);
    setError(null);
    try {
      const agentCapabilities = existingAgents.map(a => ({
        title: a.title,
        specialization: a.strategies[0].specialization,
      }));
      const plan = await generateStrategicCampaign(mission, agentCapabilities);
      const newCampaign: Campaign = {
        id: new Date().toISOString(),
        mission,
        generatedPlan: plan,
        isApproved: false,
      };
      onCampaignUpdate([newCampaign, ...campaigns]);
      setMission('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate campaign.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveCampaign = (campaignId: string) => {
    // This would trigger the brain in App.tsx to start launching the new agents
    // For now, we just mark it as approved.
    const updatedCampaigns = campaigns.map(c => c.id === campaignId ? { ...c, isApproved: true } : c);
    onCampaignUpdate(updatedCampaigns);
  };

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Flag size={22} className="mr-3 text-indigo-400" />
        Strategic Campaign Planner (Prefrontal Cortex)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Define high-level missions for your fleet. The brain will decompose your goal into a multi-agent campaign plan.
      </p>
      
      <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 mb-8">
        <label htmlFor="mission-input" className="block text-sm font-medium text-gray-300 mb-2">
          Define New Mission
        </label>
        <div className="flex items-center space-x-4">
          <input
            id="mission-input"
            type="text"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="e.g., 'Dominate the AI-powered copywriting niche for startups'"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateCampaign}
            disabled={isLoading || !mission}
            className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex-shrink-0"
          >
            {isLoading ? <Loader small /> : <><Brain className="h-5 w-5 mr-2" />Generate Plan</>}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>
      
      <div className="space-y-6">
        {campaigns.length > 0 ? (
          campaigns.map(campaign => (
            <CampaignDashboard key={campaign.id} campaign={campaign} onApprove={() => handleApproveCampaign(campaign.id)} />
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>No active campaigns. Define a mission to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignPlanner;