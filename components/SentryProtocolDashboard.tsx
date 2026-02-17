
import React, { useState } from 'react';
import type { SentryProtocolReport, EliteBlueprint } from '../types';
import { BrainCircuit, Rocket, Loader as LoaderIcon, AlertTriangle, Info } from 'lucide-react';
import Loader from './Loader';

interface SentryProtocolDashboardProps {
  onInitiateSentryProtocol: () => Promise<void>;
  sentryProtocolReport: SentryProtocolReport | null;
  onInstantiateBlueprint: (blueprint: EliteBlueprint) => void;
}

const SentryProtocolDashboard: React.FC<SentryProtocolDashboardProps> = ({ onInitiateSentryProtocol, sentryProtocolReport, onInstantiateBlueprint }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitiate = async () => {
    setIsLoading(true);
    setError(null);
    try {
        await onInitiateSentryProtocol();
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Protocol failed to execute.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-white">Sentry Protocol (Fleet Audit & Genetics)</h4>
            <button 
                onClick={handleInitiate} 
                disabled={isLoading}
                className="btn-primary text-sm flex items-center"
            >
                {isLoading ? <LoaderIcon className="animate-spin mr-2" size={16}/> : <BrainCircuit size={16} className="mr-2"/>}
                {isLoading ? 'Scanning Fleet...' : 'Initiate Protocol'}
            </button>
        </div>
        <p className="text-sm text-gray-400 mb-4">Audits fleet performance, decommissions underperformers (if enabled), and uses genetic algorithms on top agents to breed new, elite blueprints.</p>
        
        {isLoading && !sentryProtocolReport && <div className="py-10"><Loader /></div>}

        {error && (
            <div className="bg-red-900/30 border border-red-600 text-red-200 p-4 rounded-lg flex items-start mb-4">
                <AlertTriangle size={20} className="mr-3 flex-shrink-0 mt-0.5"/>
                <div>
                    <h5 className="font-bold">Protocol Failure</h5>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )}

        {sentryProtocolReport && !isLoading && (
            <div className="space-y-4 animate-fade-in">
                 {sentryProtocolReport.newBlueprints.length === 0 && sentryProtocolReport.decommissionCandidates.length === 0 && (
                     <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center text-gray-400">
                         <Info size={24} className="mx-auto mb-2 text-indigo-400"/>
                         <p>Sentry Protocol executed successfully but generated no new data.</p>
                         <p className="text-xs mt-1">Ensure you have active agents with financial data for the genetic algorithm to work.</p>
                     </div>
                 )}

                {sentryProtocolReport.newBlueprints.length > 0 && (
                    <div>
                        <h5 className="font-semibold text-white mb-2">New Elite Blueprints</h5>
                        {sentryProtocolReport.newBlueprints.map((bp, i) => (
                            <div key={i} className="bg-gray-900/50 p-3 rounded-md border border-gray-600 mt-2">
                                <p className="font-bold text-indigo-300">{bp.title} <span className="text-xs font-normal text-gray-400">(Specialization: {bp.specialization})</span></p>
                                <p className="text-xs text-gray-400">Parents: {bp.parentage?.join(', ')}</p>
                                <button onClick={() => onInstantiateBlueprint(bp)} className="text-xs btn-primary mt-2"><Rocket size={14} className="mr-1"/>Instantiate</button>
                            </div>
                        ))}
                    </div>
                )}
                
                {sentryProtocolReport.decommissionCandidates.length > 0 && (
                    <div>
                        <h5 className="font-semibold text-white mb-2">Decommission Candidates</h5>
                        {sentryProtocolReport.decommissionCandidates.map((c, i) => (
                            <div key={i} className="bg-red-900/20 p-2 rounded-md border border-red-700/50 mt-2">
                                <p className="text-red-300">{c.title} <span className="text-xs text-red-400">({c.reason})</span></p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default SentryProtocolDashboard;
