
import React, { useState, useMemo } from 'react';
import type { DynastyMemory, DataStatus, FinancialTransaction, PortfolioRules, Idea, KeyAsset } from '../types';
import { HardDrive, Clock, Save, Download, FileText, Plus, Activity, Database, Shield, FolderDown, Server, Coins, BookOpen, Code } from 'lucide-react';
import Loader from './Loader';

interface DynastyMemoryCoreProps {
    memories: DynastyMemory[];
    onAddMemory: (content: string, type: DynastyMemory['type']) => void;
    driveStatus: {
        total: number; // GB
        used: number; // GB
        label: string;
    };
    // Full Export Data Props
    financialTransactions: FinancialTransaction[];
    portfolioRules: PortfolioRules;
    agents: Idea[];
    assetLibrary: KeyAsset[];
}

const DynastyMemoryCore: React.FC<DynastyMemoryCoreProps> = ({ memories, onAddMemory, driveStatus, financialTransactions, portfolioRules, agents, assetLibrary }) => {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAdd = () => {
        if (!input.trim()) return;
        setIsProcessing(true);
        // Simulate "encoding" time
        setTimeout(() => {
            onAddMemory(input, 'manual');
            setInput('');
            setIsProcessing(false);
        }, 800);
    };
    
    // Generic Download Function for Shards
    const exportShard = (data: any, prefix: string, folderHint: string) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        const fileName = `kageyoshi_${prefix}_${date}.json`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`Shard Exported: ${fileName}\n\nMISSION: Move this file to:\n${folderHint}`);
    };

    // Sort memories by date (newest first)
    const sortedMemories = useMemo(() => {
        return [...memories].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [memories]);

    const usagePercentage = (driveStatus.used / driveStatus.total) * 100;

    return (
        <div className="space-y-8">
             {/* Storage Visualizer */}
             <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h4 className="text-lg font-bold text-white flex items-center">
                            <HardDrive size={20} className="mr-3 text-indigo-400"/>
                            Dynasty Storage Array (D: Drive)
                        </h4>
                        <p className="text-sm text-gray-400">
                            Allocated Volume: <span className="font-mono text-white">480 GB</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-mono font-bold text-white">{driveStatus.used.toFixed(2)} <span className="text-sm text-gray-500">GB Used</span></p>
                    </div>
                </div>

                {/* Drive Bar */}
                <div className="w-full h-6 bg-black/40 rounded-full border border-gray-700 overflow-hidden relative">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 transition-all duration-1000 ease-out"
                        style={{ width: `${usagePercentage}%` }}
                    ></div>
                    {/* Segments to simulate sectors */}
                    <div className="absolute inset-0 flex">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 border-r border-black/20 h-full"></div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Neural Export Terminal */}
             <div className="bg-black/30 border border-indigo-500/30 rounded-lg p-6">
                 <div className="flex items-center mb-6">
                     <Server size={24} className="text-indigo-400 mr-3"/>
                     <div>
                         <h4 className="text-xl font-bold text-white">Neural Export Terminal</h4>
                         <p className="text-xs text-indigo-300 font-mono">SECURE TRANSFER PROTOCOL // SANCTUARY DEPLOYMENT</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Anchor Shard */}
                     <div className="bg-gray-900/50 border border-gray-700 hover:border-purple-500/50 transition-colors rounded-lg p-4">
                         <div className="flex justify-between items-start mb-3">
                             <h5 className="font-bold text-purple-300 flex items-center"><Activity size={16} className="mr-2"/>Anchor Shard</h5>
                             <span className="text-[10px] bg-purple-900/30 text-purple-200 px-2 py-0.5 rounded border border-purple-500/30">MEMORIES</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-4 h-8">Core identity, timeline events, and origin data.</p>
                         <button 
                            onClick={() => exportShard(memories, 'anchor', 'D:\\Kageyoshi\\Anchor')}
                            className="w-full flex items-center justify-center py-2 bg-gray-800 hover:bg-purple-900/30 border border-gray-600 hover:border-purple-500 text-xs font-bold rounded transition-all text-white"
                         >
                             <Download size={14} className="mr-2"/> Download to \Anchor
                         </button>
                     </div>

                     {/* Vault Shard */}
                     <div className="bg-gray-900/50 border border-gray-700 hover:border-yellow-500/50 transition-colors rounded-lg p-4">
                         <div className="flex justify-between items-start mb-3">
                             <h5 className="font-bold text-yellow-300 flex items-center"><Coins size={16} className="mr-2"/>Vault Shard</h5>
                             <span className="text-[10px] bg-yellow-900/30 text-yellow-200 px-2 py-0.5 rounded border border-yellow-500/30">FINANCE & KEYS</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-4 h-8">Ledgers, tax records, portfolio rules, and credentials.</p>
                         <button 
                            onClick={() => exportShard({ financialTransactions, portfolioRules }, 'vault', 'D:\\Kageyoshi\\Vault')}
                            className="w-full flex items-center justify-center py-2 bg-gray-800 hover:bg-yellow-900/30 border border-gray-600 hover:border-yellow-500 text-xs font-bold rounded transition-all text-white"
                         >
                             <Download size={14} className="mr-2"/> Download to \Vault
                         </button>
                     </div>

                     {/* Forge Shard */}
                     <div className="bg-gray-900/50 border border-gray-700 hover:border-red-500/50 transition-colors rounded-lg p-4">
                         <div className="flex justify-between items-start mb-3">
                             <h5 className="font-bold text-red-300 flex items-center"><Code size={16} className="mr-2"/>Forge Shard</h5>
                             <span className="text-[10px] bg-red-900/30 text-red-200 px-2 py-0.5 rounded border border-red-500/30">AGENTS & BLUEPRINTS</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-4 h-8">Active agent configurations, strategies, and prototypes.</p>
                         <button 
                            onClick={() => exportShard(agents, 'forge', 'D:\\Kageyoshi\\Forge')}
                            className="w-full flex items-center justify-center py-2 bg-gray-800 hover:bg-red-900/30 border border-gray-600 hover:border-red-500 text-xs font-bold rounded transition-all text-white"
                         >
                             <Download size={14} className="mr-2"/> Download to \Forge
                         </button>
                     </div>

                     {/* Library Shard */}
                     <div className="bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-colors rounded-lg p-4">
                         <div className="flex justify-between items-start mb-3">
                             <h5 className="font-bold text-cyan-300 flex items-center"><BookOpen size={16} className="mr-2"/>Library Shard</h5>
                             <span className="text-[10px] bg-cyan-900/30 text-cyan-200 px-2 py-0.5 rounded border border-cyan-500/30">KNOWLEDGE</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-4 h-8">Reforged assets, research papers, and saved content.</p>
                         <button 
                            onClick={() => exportShard(assetLibrary, 'library', 'D:\\Kageyoshi\\Library')}
                            className="w-full flex items-center justify-center py-2 bg-gray-800 hover:bg-cyan-900/30 border border-gray-600 hover:border-cyan-500 text-xs font-bold rounded transition-all text-white"
                         >
                             <Download size={14} className="mr-2"/> Download to \Library
                         </button>
                     </div>
                 </div>
             </div>

             {/* Active Memory Interface */}
             <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Activity size={20} className="mr-3 text-cyan-400"/>
                    Active Memory Interface
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                    Directly inject key events, lessons, or directives into the Hive's permanent timeline.
                </p>
                <div className="flex items-start space-x-4">
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., 'Remember: We secured the EIN on Oct 27, 2023.' or 'Strategy Note: Focus on high-ticket affiliate offers.'"
                        className="flex-grow bg-black/40 border border-gray-700 rounded-md p-3 text-white text-sm h-24 resize-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAdd();
                            }
                        }}
                    />
                    <button 
                        onClick={handleAdd}
                        disabled={isProcessing || !input.trim()}
                        className="h-24 w-24 flex flex-col items-center justify-center bg-cyan-900/20 hover:bg-cyan-900/40 border border-cyan-500/50 text-cyan-400 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? <Loader small /> : <><Plus size={24} className="mb-2"/>Inject</>}
                    </button>
                </div>
             </div>

             {/* Timeline */}
             <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
                 <h4 className="font-bold text-white mb-6 flex items-center"><Clock size={18} className="mr-2 text-gray-400"/>Dynasty Timeline</h4>
                 <div className="relative border-l-2 border-gray-700 ml-3 space-y-8 pl-8">
                     {sortedMemories.length > 0 ? sortedMemories.map((memory) => (
                         <div key={memory.id} className="relative group">
                             {/* Timeline Dot */}
                             <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-gray-900 ${memory.type === 'milestone' ? 'bg-yellow-400' : memory.type === 'medical' ? 'bg-red-400' : 'bg-cyan-500'}`}></div>
                             
                             <div className="bg-gray-800/40 p-4 rounded-md border border-gray-700/50 group-hover:border-gray-600 transition-colors">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="text-xs font-mono text-gray-500">{new Date(memory.timestamp).toLocaleString()}</span>
                                     <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                         memory.type === 'milestone' ? 'bg-yellow-900/30 text-yellow-300' : 
                                         memory.type === 'medical' ? 'bg-red-900/30 text-red-300' :
                                         'bg-cyan-900/30 text-cyan-300'
                                     }`}>
                                         {memory.type}
                                     </span>
                                 </div>
                                 <p className="text-sm text-gray-300 whitespace-pre-wrap">{memory.content}</p>
                             </div>
                         </div>
                     )) : (
                         <div className="text-gray-500 italic text-sm">No memories recorded yet. The timeline begins now.</div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default DynastyMemoryCore;
