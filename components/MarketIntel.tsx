import React, { useState, useCallback } from 'react';
import type { Idea, AdaptationSuggestion } from '../types';
import { rescanMarketForAgent } from '../services/geminiService';
import { BrainCircuit, Search } from 'lucide-react';
import Loader from './Loader';
import AdaptationModal from './AdaptationModal';

interface MarketIntelProps {
  agents: Idea[];
}

const MarketIntel: React.FC<MarketIntelProps> = ({ agents }) => {
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AdaptationSuggestion[] | null>(null);

  const handleScan = useCallback(async () => {
    if (selectedAgentIndex === '') return;
    
    const agent = agents[parseInt(selectedAgentIndex, 10)];
    if (!agent) return;

    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      // Active agents (developingIdeas) are filtered to only have one strategy at index 0.
      const result = await rescanMarketForAgent(agent, 0);
      setSuggestions(result.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgentIndex, agents]);

  const handleCloseModal = () => {
    setSuggestions(null);
    setError(null);
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <BrainCircuit size={22} className="mr-3 text-indigo-400" />
        Market Intelligence (Frontal Lobe)
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Run a new market analysis on an active agent to identify pivot opportunities and strategic adaptations based on current trends.
      </p>
      <div className="flex items-center space-x-4 bg-gray-900/50 p-4 rounded-md border border-gray-600">
        <select
          value={selectedAgentIndex}
          onChange={(e) => setSelectedAgentIndex(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
          disabled={agents.length === 0}
        >
          <option value="" disabled>
            {agents.length > 0 ? 'Select an active agent...' : 'No active agents'}
          </option>
          {agents.map((agent, index) => (
            <option key={index} value={index}>
              {agent.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleScan}
          disabled={isLoading || selectedAgentIndex === ''}
          className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader small={true} />
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Scan Market
            </>
          )}
        </button>
      </div>
      {(suggestions || error) && <AdaptationModal suggestions={suggestions} error={error} onClose={handleCloseModal} />}
    </div>
  );
};

export default MarketIntel;
