import React, { useState } from 'react';
import type { Idea, RedTeamReport } from '../types';
import { Crosshair, Target, AlertOctagon, Shield, Check, ListChecks, Lock } from 'lucide-react';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

interface RedTeamProtocolProps {
    agents: Idea[];
    report: RedTeamReport | null;
    onRunAttack: (agentId: string) => Promise<void>;
    isLocked: boolean;
    isGeneratingProposal: boolean;
}

const RedTeamProtocol: React.FC<RedTeamProtocolProps> = ({ agents, report, onRunAttack, isLocked, isGeneratingProposal }) => {
    const [selectedAgentId, setSelectedAgentId] = useState<string>(agents.length > 0 ? agents[0].id : '');
    const [error, setError] = useState<string | null>(null);
    
    const handleRunAttack = async () => {
        if (!selectedAgentId) return;
        setError(null);
        try {
            await onRunAttack(selectedAgentId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during the attack.');
        }
    };

    if (isLocked) {
        return (
            <div className="bg-red-900/30 p-6 rounded-lg border border-red-500 text-center">
                <Lock size={32} className="mx-auto text-red-400 mb-4"/>
                <h5 className="font-bold text-red-300">Red Team Protocol Locked</h5>
                <p className="text-sm text-red-200 mt-2">The Izanagi Protocol has been triggered due to a potential internal threat. The Red Team is neutralized until reset by the Shogun in the Security Console.</p>
            </div>
        )
    }

    return (
        <div>
            <p className="text-sm text-gray-400 mb-4">
                Select an agent and command the internal Red Team to launch an adversarial attack. This process identifies strategic weaknesses before they can be exploited by real-world competitors.
            </p>
            <div className="flex items-center space-x-2">
                <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                    disabled={agents.length === 0 || isGeneratingProposal}
                >
                    {agents.length > 0 ? agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.title}</option>
                    )) : <option>No active agents to target</option>}
                </select>
                <button 
                    onClick={handleRunAttack} 
                    disabled={!selectedAgentId || isGeneratingProposal} 
                    className="btn-primary whitespace-nowrap bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
                    style={{background: 'var(--accent-red)'}}
                >
                    {isGeneratingProposal ? <Loader small /> : <><Crosshair size={16} className="mr-2"/>Launch Attack</>}
                </button>
            </div>
            {error && <div className="mt-4"><ErrorMessage message={error}/></div>}
            
            {report && (
                <div className="mt-6 animate-fade-in space-y-4">
                    <h5 className="font-bold text-white">Red Team Report: Attack on "{agents.find(a => a.id === selectedAgentId)?.title}"</h5>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h6 className="font-semibold text-white mb-2 flex items-center"><Target size={16} className="mr-2 text-red-400"/>Primary Attack Vector</h6>
                        <p className="text-lg font-semibold text-red-300">"{report.attackVector}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 className="font-semibold text-white mb-2 flex items-center"><AlertOctagon size={16} className="mr-2 text-yellow-400"/>Identified Weaknesses</h6>
                            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-200">
                                {report.identifiedWeaknesses.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </div>
                         <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <h6 className="font-semibold text-white mb-2 flex items-center"><Shield size={16} className="mr-2 text-red-500"/>Simulated Outcome of Failure</h6>
                            <p className="text-sm text-red-300 italic">{report.simulatedOutcome}</p>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h6 className="font-semibold text-white mb-2 flex items-center"><ListChecks size={16} className="mr-2 text-green-400"/>Recommended Countermeasures</h6>
                         <ul className="space-y-2">
                            {report.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start text-gray-300 text-sm">
                                <Check size={14} className="mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                                <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RedTeamProtocol;
