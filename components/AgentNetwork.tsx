import React from 'react';
import type { Idea } from '../types';
import { Users, Bot, Star } from 'lucide-react';
import ProficiencyGauge from './ProficiencyGauge';

interface AgentNetworkProps {
  agents: Idea[];
}

const AgentNetwork: React.FC<AgentNetworkProps> = ({ agents }) => {
  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Users size={22} className="mr-3 text-indigo-400" />
        Inter-Agent Collaboration Network (Corpus Callosum)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        An overview of your fleet's collective capabilities. The brain can outsource tasks between agents, leveraging specialists to increase efficiency.
      </p>

      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => {
            const strategy = agent.strategies[0];
            return (
              <div key={index} className="bg-gray-900/50 p-5 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white truncate pr-4">{agent.title}</h4>
                  {strategy.isMasterAgent && (
                    <div className="flex items-center text-xs font-semibold text-yellow-400 bg-yellow-900/40 px-2 py-1 rounded-full flex-shrink-0">
                      <Star size={12} className="mr-1.5" />
                      Master Agent
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <ProficiencyGauge score={strategy.proficiencyScore} />
                    </div>
                    <div className="flex-grow">
                        <div className="mb-2">
                            <p className="text-xs text-gray-400">Specialization</p>
                            <p className="font-semibold text-indigo-300">{strategy.specialization || 'Generalist'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Capital Efficiency</p>
                            <p className="font-semibold text-green-300">{strategy.capitalEfficiency.toFixed(0)}% ROI</p>
                        </div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>No active agents to form a network.</p>
        </div>
      )}
    </div>
  );
};

export default AgentNetwork;