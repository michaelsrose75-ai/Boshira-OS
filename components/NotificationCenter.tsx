
import React, { useState, useMemo } from 'react';
import { Bell, AlertTriangle, Zap, Key, User, ChevronRight, X } from 'lucide-react';
import type { Idea, PortfolioRules, VaultCredential, MetamorphosisProposal, UserTask } from '../types';

interface NotificationCenterProps {
    agents: Idea[];
    rules: PortfolioRules;
    onNavigate: (view: any, subView?: any) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ agents, rules, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    // 1. Check for Missing High-Value Credentials
    const missingKeys = useMemo(() => {
        const critical = [
            { id: 'REPLICATE_API_TOKEN', name: 'Replicate (Vision/Video)' },
            { id: 'XAI_API_KEY', name: 'xAI (Real-time Intel)' },
            { id: 'DEEPSEEK_API_KEY', name: 'DeepSeek (Logic)' }
        ];
        return critical.filter(k => !rules.credentials.some(c => c.service === k.id && c.apiKey));
    }, [rules.credentials]);

    // 2. Check for Pending Upgrades
    const pendingUpgrade = rules.metamorphosisProposal;

    // 3. Check for User Tasks (Imperial Mandates)
    const userTasks = useMemo(() => {
        return agents.flatMap(a => 
            a.strategies[0].actionPlan.userTasks
                .filter(t => t.status === 'active')
                .map(t => ({ ...t, agentTitle: a.title }))
        );
    }, [agents]);

    const totalAlerts = missingKeys.length + (pendingUpgrade ? 1 : 0) + userTasks.length;
    const hasCritical = missingKeys.length > 0;

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button 
                onClick={toggleOpen}
                className={`relative p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
                <Bell size={20} className={hasCritical ? 'animate-pulse text-red-400' : ''} />
                {totalAlerts > 0 && (
                    <span className={`absolute top-0 right-0 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full border border-black ${hasCritical ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white'}`}>
                        {totalAlerts}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-fade-in">
                        <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-black/40">
                            <h4 className="font-bold text-white text-sm flex items-center">
                                <Zap size={14} className="mr-2 text-indigo-400" />
                                Neural Link Notifications
                            </h4>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {totalAlerts === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p className="text-sm">All systems nominal.</p>
                                    <p className="text-xs mt-1">No pending alerts.</p>
                                </div>
                            ) : (
                                <div className="p-2 space-y-2">
                                    {/* Missing Keys */}
                                    {missingKeys.map((key, i) => (
                                        <div key={`key-${i}`} className="bg-red-900/20 border border-red-500/30 rounded-md p-3 flex items-start hover:bg-red-900/30 transition-colors cursor-pointer group"
                                            onClick={() => { onNavigate('strategy'); setIsOpen(false); }}
                                        >
                                            <div className="p-2 bg-red-500/10 rounded-full mr-3 flex-shrink-0">
                                                <Key size={16} className="text-red-400" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs font-bold text-red-300 uppercase tracking-wider mb-0.5">Missing Clearance</p>
                                                <p className="text-sm text-gray-200">Acquire & Input <span className="font-semibold text-white">{key.name}</span> Key.</p>
                                                <p className="text-[10px] text-red-400/70 mt-1 group-hover:text-red-300 flex items-center">Go to Credential Vault <ChevronRight size={10}/></p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pending Upgrade */}
                                    {pendingUpgrade && (
                                        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-md p-3 flex items-start hover:bg-indigo-900/30 transition-colors cursor-pointer group"
                                            onClick={() => { onNavigate('engineering_lab', 'metamorphosis_bay'); setIsOpen(false); }}
                                        >
                                            <div className="p-2 bg-indigo-500/10 rounded-full mr-3 flex-shrink-0">
                                                <Zap size={16} className="text-indigo-400" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-0.5">Evolution Ready</p>
                                                <p className="text-sm text-gray-200">Proposal: "{pendingUpgrade.title}"</p>
                                                <p className="text-[10px] text-indigo-400/70 mt-1 group-hover:text-indigo-300 flex items-center">Review in Metamorphosis Bay <ChevronRight size={10}/></p>
                                            </div>
                                        </div>
                                    )}

                                    {/* User Tasks */}
                                    {userTasks.map((task, i) => (
                                        <div key={`task-${i}`} className="bg-gray-800/50 border border-gray-600 rounded-md p-3 flex items-start hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                             onClick={() => { onNavigate('development'); setIsOpen(false); }}
                                        >
                                            <div className="p-2 bg-gray-700 rounded-full mr-3 flex-shrink-0">
                                                <User size={16} className="text-green-400" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-0.5">Attention Required</p>
                                                <p className="text-sm text-gray-200 line-clamp-2">{task.text}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 group-hover:text-gray-300">Agent: {task.agentTitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {totalAlerts > 0 && (
                            <div className="bg-black/50 p-2 text-center border-t border-gray-700">
                                <span className="text-[10px] text-gray-500 font-mono uppercase">Neural Link Online</span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
