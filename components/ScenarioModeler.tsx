import React, { useState } from 'react';
import type { Simulation, SimulationScenario } from '../types';
import { Orbit, Brain, Sparkles, AlertTriangle } from 'lucide-react';
import Loader from './Loader';
import SimulationReport from './SimulationReport';

interface ScenarioModelerProps {
  simulations: Simulation[];
  onRunSimulation: (scenario: SimulationScenario) => Promise<Simulation>;
}

const ScenarioModeler: React.FC<ScenarioModelerProps> = ({ simulations, onRunSimulation }) => {
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);

  const handleRun = async () => {
    if (!scenarioDescription) return;
    setIsLoading(true);
    setError(null);
    try {
      const newSim = await onRunSimulation({ description: scenarioDescription });
      setSelectedSimulation(newSim);
      setScenarioDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run simulation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Orbit size={22} className="mr-3 text-indigo-400" />
        Predictive Simulation Engine (Occipital Lobe)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Imagine the future. Define "what-if" scenarios to test your strategies, anticipate market shifts, and receive AI-powered foresight reports.
      </p>

      <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 mb-8">
        <label htmlFor="scenario-input" className="block text-sm font-medium text-gray-300 mb-2">
          Define "What-If" Scenario
        </label>
        <div className="flex items-center space-x-4">
          <textarea
            id="scenario-input"
            value={scenarioDescription}
            onChange={(e) => setScenarioDescription(e.target.value)}
            placeholder="e.g., 'Simulate a market downturn where all agent revenues drop by 30% for 6 months.'"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 resize-none h-16"
            disabled={isLoading}
          />
          <button
            onClick={handleRun}
            disabled={isLoading || !scenarioDescription}
            className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex-shrink-0 h-16"
          >
            {isLoading ? <Loader small /> : <><Sparkles className="h-5 w-5 mr-2" />Run Simulation</>}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2 flex items-center"><AlertTriangle size={12} className="mr-1"/>{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <h4 className="font-semibold text-white mb-3">Simulation History</h4>
             <div className="bg-gray-900/50 p-3 rounded-md border border-gray-600 max-h-96 overflow-y-auto">
                {simulations.length > 0 ? (
                    <ul className="space-y-1">
                        {simulations.map(sim => (
                            <li key={sim.id}>
                                <button 
                                onClick={() => setSelectedSimulation(sim)}
                                className={`w-full text-left p-2 rounded-md transition-colors ${selectedSimulation?.id === sim.id ? 'bg-indigo-600/30' : 'hover:bg-gray-700/50'}`}>
                                    <p className="text-sm text-gray-300 truncate">{sim.scenario.description}</p>
                                    <p className="text-xs text-gray-500">{new Date(sim.timestamp).toLocaleString()}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-10">No simulations run yet.</p>
                )}
             </div>
        </div>
        <div className="md:col-span-2">
            <h4 className="font-semibold text-white mb-3">Foresight Report</h4>
            <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 min-h-[384px]">
                {selectedSimulation ? (
                    selectedSimulation.result ? (
                        <SimulationReport result={selectedSimulation.result} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Loader />
                            <p className="mt-4">Simulation in progress...</p>
                        </div>
                    )
                ) : (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                        <Brain size={32} className="mb-2"/>
                        <p>Select a past simulation or run a new one to view its foresight report.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioModeler;