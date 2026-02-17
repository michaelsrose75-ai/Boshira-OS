import React, { useState } from 'react';
import { Book, Zap, BrainCircuit, Bot } from 'lucide-react';
import Loader from './Loader';
import type { Idea, FounderEdictResponse } from '../types';

interface FounderEdictDashboardProps {
  onExecute: (directive: string) => Promise<void>;
  isLoading: boolean;
  report: FounderEdictResponse | null;
  agents: Idea[];
  onInfuse: (agentId: string, knowledge: string) => Promise<void>;
}

const FounderEdictDashboard: React.FC<FounderEdictDashboardProps> = ({ onExecute, isLoading, report, agents, onInfuse }) => {
  const [directive, setDirective] = useState<string>(
    "Synthesize the key concepts from the top 5 viral YouTube videos on machine learning. Also, research and summarize 5 unique or novel AI agent upgrades or architectures recently discussed online."
  );
  const [infusionAgentId, setInfusionAgentId] = useState<string>('');
  const [isInfusing, setIsInfusing] = useState(false);

  const handleInfuseClick = async () => {
    if (infusionAgentId && report) {
      setIsInfusing(true);
      await onInfuse(infusionAgentId, report.summary);
      setIsInfusing(false);
      setInfusionAgentId(''); // Reset selector
    }
  };
  
  const renderKnowledgePacket = (text: string) => {
    return text.split('\n').map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('### ')) return <h5 key={index} className="text-md font-bold text-indigo-300 mt-3 mb-1">{trimmed.substring(4)}</h5>;
        if (trimmed.startsWith('## ')) return <h4 key={index} className="text-lg font-bold text-white mt-4 mb-2">{trimmed.substring(3)}</h4>;
        if (trimmed.startsWith('# ')) return <h3 key={index} className="text-xl font-bold text-white mt-5 mb-3">{trimmed.substring(2)}</h3>;
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) return <li key={index} className="text-gray-300 ml-4 list-disc">{trimmed.substring(2)}</li>;
        if (trimmed === '') return <br key={index} />;
        // Basic bold support
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return <p key={index} className="text-gray-300 mb-2">
            {parts.map((part, i) => part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}
        </p>;
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-white flex items-center"><Book size={18} className="mr-2"/>Founder's Edict Protocol</h4>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Issue a high-level research directive. Kageyoshi will scour the web, synthesize the information into a knowledge packet, and prepare it for infusion into an agent's core programming.
      </p>

      <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
        <label htmlFor="edict-directive" className="block text-sm font-medium text-gray-300 mb-2">Research Directive</label>
        <textarea
          id="edict-directive"
          value={directive}
          onChange={(e) => setDirective(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-white h-24"
          disabled={isLoading}
        />
        <button
          onClick={() => onExecute(directive)}
          disabled={isLoading || !directive}
          className="btn-primary text-sm mt-2 w-full"
        >
          {isLoading ? <Loader small /> : <><Zap size={16} className="mr-2"/>Execute Edict</>}
        </button>
      </div>

      {report && (
        <div className="mt-6 bg-gray-900/50 p-4 rounded-md border border-gray-600 animate-fade-in">
          <h5 className="font-semibold text-white mb-2">Knowledge Packet Synthesized</h5>
          <div className="prose prose-sm prose-invert max-w-none bg-black/20 p-3 rounded-md border border-gray-700 h-64 overflow-y-auto">
            {renderKnowledgePacket(report.summary)}
          </div>

          {report.knowledgeGraphAdditions && report.knowledgeGraphAdditions.length > 0 && (
            <div className="mt-4 border-t border-gray-700 pt-4">
                <h5 className="font-semibold text-white mb-2 flex items-center"><BrainCircuit size={16} className="mr-2"/>New Concepts Stored in Hive Mind</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {report.knowledgeGraphAdditions.map((entry, index) => (
                        <div key={index} className="text-xs p-2 bg-gray-800/50 rounded border border-gray-700">
                            <p className="font-bold text-indigo-300 truncate">{entry.concept}</p>
                            <p className="text-gray-400 truncate mt-1">{entry.definition}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}
          
          <div className="mt-4 border-t border-gray-700 pt-4">
            <h5 className="font-semibold text-white mb-2 flex items-center"><BrainCircuit size={16} className="mr-2"/>Infuse Knowledge</h5>
            <p className="text-xs text-gray-400 mb-2">Select an agent to absorb this new knowledge, increasing its proficiency and potentially unlocking a new specialization.</p>
            <div className="flex items-center space-x-2">
              <select 
                value={infusionAgentId}
                onChange={(e) => setInfusionAgentId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                disabled={isInfusing}
              >
                <option value="">Select agent...</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.title}</option>
                ))}
              </select>
              <button
                onClick={handleInfuseClick}
                disabled={!infusionAgentId || isLoading || isInfusing}
                className="btn-primary text-sm whitespace-nowrap"
              >
                {isInfusing ? <Loader small /> : <><Bot size={16} className="mr-2"/>Infuse</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderEdictDashboard;