
import React, { useState } from 'react';
import type { KeyAsset, Idea, StrategyRefinementResponse, UserTask, OverseerLogEntry } from '../types';
import { Hammer, Sparkles, BrainCircuit, Bot, Save } from 'lucide-react';
import { honeAsset, refineStrategy } from '../services/geminiService';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

interface TheForgeProps {
    assets: KeyAsset[];
    agents: Idea[];
    onUpdateAsset: (asset: KeyAsset) => void;
    onUpdateAgent: (agent: Idea) => void;
    addLogEntry: (agentTitle: string, message: string, type: OverseerLogEntry['type']) => void;
}

const TheForge: React.FC<TheForgeProps> = ({ assets, agents, onUpdateAsset, onUpdateAgent, addLogEntry }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Asset Honing State
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    const [honeResult, setHoneResult] = useState<string | null>(null);
    
    // Strategy Kata State
    const [selectedAgentId, setSelectedAgentId] = useState<string>('');
    const [kataResult, setKataResult] = useState<StrategyRefinementResponse | null>(null);

    const selectedAsset = assets.find(a => a.id === selectedAssetId);
    const selectedAgent = agents.find(a => a.id === selectedAgentId);

    const handleHoneAsset = async () => {
        if (!selectedAsset) return;
        setIsLoading(true);
        setError(null);
        setHoneResult(null);
        try {
            const result = await honeAsset(selectedAsset.content, "Refine and improve this asset for maximum impact.");
            setHoneResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to hone asset.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveHonedAsset = () => {
        if (selectedAsset && honeResult) {
            onUpdateAsset({ ...selectedAsset, content: honeResult });
            setHoneResult(null);
        }
    };
    
    const handlePerformKata = async () => {
        if (!selectedAgent) return;
        setIsLoading(true);
        setError(null);
        setKataResult(null);
        try {
            const result = await refineStrategy(selectedAgent);
            setKataResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to perform kata.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleApplyKata = () => {
        if (selectedAgent && kataResult) {
            const newMandate: UserTask = {
                id: crypto.randomUUID(),
                text: "Imperial Mandate: Apply Strategy Refinements from The Forge",
                status: 'active',
                estimatedTime: 0.5,
                statusDetail: `Apply the following optimizations:\n${kataResult.refinements.map(r => `- ${r.proposedChange}`).join('\n')}`,
                isImperialMandate: true,
            };

            const updatedAgent = { ...selectedAgent };
            const newPlan = { ...updatedAgent.strategies[0].actionPlan, userTasks: [newMandate, ...updatedAgent.strategies[0].actionPlan.userTasks] };
            updatedAgent.strategies[0] = { ...updatedAgent.strategies[0], actionPlan: newPlan };
            
            onUpdateAgent(updatedAgent);
            addLogEntry('The Forge', `New Imperial Mandate issued for ${selectedAgent.title} to apply strategy refinements.`, 'info');
            setKataResult(null);
        }
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white flex items-center">
                    <Hammer size={18} className="mr-2" />The Forge: The Pursuit of Perfection
                </h4>
            </div>
            <p className="text-sm text-gray-400 mb-6">
                This is where the Hive's digital sword is sharpened. Refine assets and optimize strategies to achieve mastery and precision in every action.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Asset Honing */}
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                    <h5 className="font-bold text-white mb-4 flex items-center"><Sparkles size={18} className="mr-2 text-yellow-400" />Asset Honing</h5>
                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedAssetId}
                            onChange={e => setSelectedAssetId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                        >
                            <option value="">Select an asset to sharpen...</option>
                            {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.title}</option>)}
                        </select>
                        <button onClick={handleHoneAsset} disabled={!selectedAssetId || isLoading} className="btn-primary whitespace-nowrap">Hone</button>
                    </div>
                    {isLoading && !kataResult && <div className="mt-4"><Loader /></div>}
                    {error && !kataResult && <div className="mt-4"><ErrorMessage message={error} /></div>}
                    {honeResult && selectedAsset && (
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h6 className="text-sm font-semibold text-gray-400 mb-2">Before</h6>
                                    <pre className="text-xs bg-black/50 p-2 rounded h-48 overflow-auto font-mono whitespace-pre-wrap">{selectedAsset.content}</pre>
                                </div>
                                <div>
                                    <h6 className="text-sm font-semibold text-green-400 mb-2">After</h6>
                                    <pre className="text-xs bg-black/50 p-2 rounded h-48 overflow-auto font-mono whitespace-pre-wrap border border-green-500/50">{honeResult}</pre>
                                </div>
                            </div>
                            <button onClick={handleSaveHonedAsset} className="w-full btn-primary flex items-center justify-center text-sm"><Save size={14} className="mr-2"/>Save Honed Asset</button>
                        </div>
                    )}
                </div>

                {/* Strategy Kata */}
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                    <h5 className="font-bold text-white mb-4 flex items-center"><BrainCircuit size={18} className="mr-2 text-cyan-400" />Strategy 'Kata'</h5>
                     <div className="flex items-center space-x-2">
                        <select
                            value={selectedAgentId}
                            onChange={e => setSelectedAgentId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                        >
                            <option value="">Select an agent to train...</option>
                            {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.title}</option>)}
                        </select>
                        <button onClick={handlePerformKata} disabled={!selectedAgentId || isLoading} className="btn-primary whitespace-nowrap">Perform</button>
                    </div>
                    {isLoading && !honeResult && <div className="mt-4"><Loader /></div>}
                    {error && !honeResult && <div className="mt-4"><ErrorMessage message={error} /></div>}
                    {kataResult && (
                        <div className="mt-4 space-y-3">
                            {kataResult.refinements.map((refinement, index) => (
                                <div key={index} className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                                    <p className="font-semibold text-cyan-300 text-sm">{refinement.proposedChange}</p>
                                    <p className="text-xs text-gray-300 mt-1 italic">Justification: {refinement.justification}</p>
                                </div>
                            ))}
                            <button onClick={handleApplyKata} className="w-full btn-primary flex items-center justify-center text-sm"><Bot size={14} className="mr-2"/>Create Task to Apply</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TheForge;
