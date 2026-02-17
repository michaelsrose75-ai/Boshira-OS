
import React from 'react';
import type { Campaign } from '../types';
import { Flag, CheckCircle, Bot, PlusCircle, ArrowRight } from 'lucide-react';

interface CampaignDashboardProps {
  campaign: Campaign;
  onApprove: () => void;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({ campaign, onApprove }) => {
  return (
    <div className={`bg-gray-900/50 p-6 rounded-lg border ${campaign.isApproved ? 'border-green-700/50' : 'border-gray-600'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-white mb-1">{campaign.generatedPlan.campaignName}</h4>
          <p className="text-sm text-gray-400 italic">Mission: "{campaign.mission}"</p>
        </div>
        {campaign.isApproved ? (
          <div className="flex items-center text-sm font-semibold text-green-400 bg-green-900/40 px-3 py-1.5 rounded-full">
            <CheckCircle size={16} className="mr-2" />
            Campaign Approved & Active
          </div>
        ) : (
          <button 
            onClick={onApprove}
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            Approve & Launch Campaign
          </button>
        )}
      </div>

      <div className="space-y-4">
        {campaign.generatedPlan.phases.map((phase, index) => (
          <div key={index} className="bg-gray-800/40 p-4 rounded-md border border-gray-700">
            <h5 className="font-semibold text-indigo-300 flex items-center">
              Phase {index + 1}: {phase.phase}
              <ArrowRight size={14} className="mx-2" />
              <span className="text-sm font-normal text-gray-300">{phase.description}</span>
            </h5>
            <div className="mt-3 pl-4 border-l-2 border-gray-600">
              <ul className="space-y-2">
                {phase.objectives.map((obj, objIndex) => (
                  <li key={objIndex} className="text-sm text-gray-300 flex items-center">
                    {obj.isNewAgent ? 
                      <span title="New Agent Required">
                        <PlusCircle size={14} className="mr-3 text-yellow-400 flex-shrink-0" />
                      </span> :
                      <span title="Existing Agent Task">
                        <Bot size={14} className="mr-3 text-blue-400 flex-shrink-0" />
                      </span>
                    }
                    <span className="font-medium text-white">{obj.agentRole}:</span>
                    <span className="ml-2">{obj.objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignDashboard;