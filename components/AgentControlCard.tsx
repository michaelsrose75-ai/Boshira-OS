
import React, { useMemo } from 'react';
import type { Idea, Strategy, PortfolioRules } from '../types';
import { BarChart2, DollarSign, Activity, AlertCircle, CheckCircle, User, Eye, Power, Zap, Bot, Star, BrainCircuit, HardDrive, AlertTriangle, Copy, RefreshCw, Loader2 } from 'lucide-react';
import ProficiencyGauge from './ProficiencyGauge';

interface AgentControlCardProps {
    agent: Idea;
    onUpdate: (updatedAgent: Idea) => void;
    rules: PortfolioRules;
    onSpawnDrone: (agentId: string) => void;
}

const AgentControlCard: React.FC<AgentControlCardProps> = ({ agent, onUpdate, rules, onSpawnDrone }) => {
    const strategy = agent.strategies[0];
    const actionPlan = strategy.actionPlan;
    
    const { status, currentTask } = useMemo(() => {
        let taskText: {text: string, icon: React.ReactNode} | null = null;
        
        // Default: Idle
        let currentStatus = { 
            text: 'Idle', 
            icon: <Power size={14} />, 
            badgeClass: 'bg-gray-800 text-gray-400 border-gray-700',
            cardBorderClass: 'border-transparent hover:border-gray-700'
        };
        
        const activeAiTask = actionPlan.aiTasks.find(t => ['active', 'executing', 'retrying', 'awaiting_review'].includes(t.status));
        
        if (activeAiTask) {
             taskText = { text: activeAiTask.text, icon: <Bot size={14} className="text-blue-400 flex-shrink-0" /> };
             
             if (activeAiTask.status === 'active' || activeAiTask.status === 'executing') {
                 // Check for training context
                 if (activeAiTask.text.toLowerCase().includes('train') || activeAiTask.text.toLowerCase().includes('learn')) {
                      currentStatus = { 
                         text: 'Training', 
                         icon: <BrainCircuit size={14} className="animate-pulse" />, 
                         badgeClass: 'bg-indigo-900/40 text-indigo-300 border-indigo-500/30',
                         cardBorderClass: 'border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                     };
                 } else {
                     currentStatus = { 
                         text: 'Active', 
                         icon: <Activity size={14} className="animate-pulse" />, 
                         badgeClass: 'bg-cyan-900/40 text-cyan-300 border-cyan-500/30',
                         cardBorderClass: 'border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                     };
                 }
             } else if (activeAiTask.status === 'retrying') {
                 currentStatus = { 
                     text: 'Retrying', 
                     icon: <RefreshCw size={14} className="animate-spin" />, 
                     badgeClass: 'bg-orange-900/40 text-orange-300 border-orange-500/30',
                     cardBorderClass: 'border-orange-500/30'
                 };
             } else if (activeAiTask.status === 'awaiting_review') {
                 currentStatus = { 
                     text: 'Review', 
                     icon: <Eye size={14} />, 
                     badgeClass: 'bg-yellow-900/40 text-yellow-300 border-yellow-500/30',
                     cardBorderClass: 'border-yellow-500/30'
                 };
             }
        } else {
            const activeUserTask = actionPlan.userTasks.find(t => t.status === 'active');
            if (activeUserTask) {
                taskText = { text: activeUserTask.text, icon: <User size={14} className="text-green-400 flex-shrink-0" />};
                currentStatus = { 
                    text: 'Awaiting User', 
                    icon: <User size={14} />, 
                    badgeClass: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30',
                    cardBorderClass: 'border-emerald-500/30'
                };
            }
        }
        
        const failedTask = actionPlan.aiTasks.find(t => t.status === 'failed');
        if (failedTask) {
            currentStatus = { 
                text: 'Error', 
                icon: <AlertCircle size={14} />, 
                badgeClass: 'bg-red-900/40 text-red-300 border-red-500/30',
                cardBorderClass: 'border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
            };
        }

        return { status: currentStatus, currentTask: taskText };
    }, [actionPlan]);

    const isEligibleForMaster = strategy.proficiencyScore >= rules.masterAgentThreshold;
    const isVramOverload = strategy.gpuVramUsage > rules.maxGpuVram;

    const handleUpdateStrategyFlag = (key: 'isMasterAgent' | 'enhancedAutonomy', value: boolean) => {
        // Prevent enabling autonomy if VRAM is overloaded
        if (key === 'enhancedAutonomy' && isVramOverload && value === true) {
            return;
        }
        const updatedStrategy: Strategy = { ...strategy, [key]: value };
        const updatedAgent: Idea = { ...agent, strategies: [updatedStrategy] };
        onUpdate(updatedAgent);
    };

    const containerClasses = `card-base p-5 flex flex-col justify-between h-full transition-all duration-300 border ${isVramOverload ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-900/10' : status.cardBorderClass}`;

    return (
        <div className={containerClasses}>
            <div>
                {isVramOverload && (
                    <div className="mb-3 bg-red-600 text-white px-3 py-1 rounded-md text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse">
                        <AlertTriangle size={14} className="mr-2" />
                        VRAM LIMIT EXCEEDED
                    </div>
                )}

                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-white mb-2 flex items-center truncate pr-2">
                        {agent.title}
                    </h4>
                    {strategy.isMasterAgent ? (
                         <div className={`flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20`}>
                            <Star size={14} className="fill-yellow-300" />
                            <span>Master</span>
                        </div>
                    ) : (
                        <div className={`flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-full border ${status.badgeClass}`}>
                            {status.icon}
                            <span>{status.text}</span>
                        </div>
                    )}
                </div>
                
                 <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                    <div>
                        <ProficiencyGauge score={strategy.proficiencyScore} />
                        <p className="text-xs text-text-secondary mt-1">Proficiency</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-accent-green">
                            {strategy.capitalEfficiency > 0 ? `${strategy.capitalEfficiency.toFixed(0)}%` : 'N/A'}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">Cap. Efficiency</p>
                    </div>
                     <div>
                        <p className={`text-2xl font-bold ${isVramOverload ? 'text-red-500 animate-pulse' : 'text-accent-purple'}`} title={`Simulated VRAM usage: ${strategy.gpuVramUsage} MB / Limit: ${rules.maxGpuVram} MB`}>
                            <HardDrive size={24} className="mx-auto" />
                            <span className="text-base">{strategy.gpuVramUsage} <span className="text-xs">MB</span></span>
                        </p>
                        <p className={`text-xs mt-1 ${isVramOverload ? 'text-red-400 font-bold' : 'text-text-secondary'}`}>
                            {isVramOverload ? 'OVERLOAD' : 'VRAM Load'}
                        </p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-accent-cyan truncate pt-2" title={strategy.specialization || 'Generalist'}>
                            {strategy.specialization || 'N/A'}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">Specialization</p>
                    </div>
                 </div>
            </div>
            
            <div className="mt-6 text-center space-y-4">
                 <div className="flex items-center justify-center space-x-4">
                    <label 
                        htmlFor={`autonomy-toggle-${agent.id}`} 
                        className={`flex items-center justify-center cursor-pointer group ${isVramOverload ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isVramOverload ? "Autonomy restricted due to VRAM overload" : "Enable Enhanced Autonomy"}
                    >
                        <span className={`text-sm font-semibold mr-3 flex items-center ${strategy.enhancedAutonomy ? 'text-accent-cyan' : 'text-text-secondary group-hover:text-text-primary'}`}>
                            <BrainCircuit size={14} className="mr-2" />
                            {isVramOverload ? 'Restricted' : 'Autonomy'}
                        </span>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                id={`autonomy-toggle-${agent.id}`} 
                                className="sr-only"
                                checked={strategy.enhancedAutonomy} 
                                onChange={(e) => handleUpdateStrategyFlag('enhancedAutonomy', e.target.checked)} 
                                disabled={isVramOverload}
                            />
                            <div className={`block w-10 h-6 rounded-full transition ${strategy.enhancedAutonomy ? 'bg-cyan-600' : 'bg-gray-600'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${strategy.enhancedAutonomy ? 'translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                    
                     <button 
                        onClick={() => onSpawnDrone(agent.id)}
                        className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${rules.swarmMode ? 'text-purple-300 bg-purple-900/30 border-purple-500/50 hover:bg-purple-800/50' : 'text-gray-500 border-gray-700 bg-gray-800/50 hover:bg-gray-800'}`}
                        title={rules.swarmMode ? "Spawn a lightweight drone clone (Low Energy)" : "Enable Swarm Mode in Rules to spawn drones."}
                    >
                        <Copy size={12} className="mr-1.5"/>
                        Spawn Drone
                    </button>
                 </div>
                 
                {isVramOverload && <p className="text-xs text-red-400 font-mono">Hardware Limit Exceeded. Scale down or upgrade GPU.</p>}
                
                {isEligibleForMaster && !isVramOverload && (
                    <label htmlFor={`master-toggle-${agent.id}`} className="flex items-center justify-center cursor-pointer group">
                         <span className={`text-sm font-semibold mr-3 flex items-center ${strategy.isMasterAgent ? 'text-accent-yellow' : 'text-text-secondary group-hover:text-text-primary'}`}>
                            <Star size={14} className="mr-2" />
                            Master Agent Mode
                        </span>
                        <div className="relative">
                            <input type="checkbox" id={`master-toggle-${agent.id}`} className="sr-only" checked={strategy.isMasterAgent} onChange={(e) => handleUpdateStrategyFlag('isMasterAgent', e.target.checked)} />
                            <div className={`block w-10 h-6 rounded-full transition ${strategy.isMasterAgent ? 'bg-yellow-600' : 'bg-gray-600'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${strategy.isMasterAgent ? 'translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                )}
                 <p className="text-xs text-text-secondary pt-2 border-t border-border-primary">Go to 'Active Agents' for detailed view and manual controls.</p>
            </div>
        </div>
    );
};

export default AgentControlCard;
