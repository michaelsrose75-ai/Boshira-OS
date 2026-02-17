
import React, { useState, useMemo, useEffect } from 'react';
import type { Idea } from '../types';
import { Hexagon, Activity, Shield, Zap, Cpu, Crosshair, Eye, Terminal, Copy, Layers } from 'lucide-react';

interface HiveDashboardProps {
    agents: Idea[];
    systemStability: number;
    onSelectAgent: (agent: Idea) => void;
    onDirectiveChange: (directive: string) => void;
    maxGpuVram: number;
    onSpawnDrone: (agentId: string) => void;
    swarmMode: boolean;
}

const HiveDashboard: React.FC<HiveDashboardProps> = ({ agents, systemStability, onSelectAgent, onDirectiveChange, maxGpuVram, onSpawnDrone, swarmMode }) => {
    const [hoveredAgent, setHoveredAgent] = useState<Idea | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [directive, setDirective] = useState('');
    const [rotationOffset, setRotationOffset] = useState(0);

    // Auto-rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setRotationOffset(prev => (prev + 0.2) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const agentNodes = useMemo(() => {
        const count = agents.length;
        const radius = 300; // Orbit radius
        return agents.map((agent, index) => {
            const angle = (index / count) * 360 + rotationOffset;
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            // Determine status color
            const strategy = agent.strategies[0];
            const activeTask = strategy.actionPlan.aiTasks.find(t => t.status === 'active' || t.status === 'executing');
            const isOverloaded = strategy.gpuVramUsage > maxGpuVram;
            const isDrone = agent.title.includes('[Drone]');
            
            let statusColor = '#8b5cf6'; // Idle (Violet)
            
            if (strategy.decommissionReason) {
                statusColor = '#ef4444'; // Decommissioned (Red)
            } else if (isOverloaded) {
                statusColor = '#f97316'; // Overloaded (Orange/Warning)
            } else if (activeTask) {
                statusColor = '#10b981'; // Active (Green)
            }
            
            if (isDrone && !isOverloaded && !strategy.decommissionReason) {
                statusColor = '#d8b4fe'; // Drone purple (lighter)
            }

            return {
                ...agent,
                x,
                y,
                statusColor,
                isOverloaded,
                isDrone
            };
        });
    }, [agents, rotationOffset, maxGpuVram]);

    const handleAgentClick = (agent: Idea) => {
        setSelectedAgentId(agent.id === selectedAgentId ? null : agent.id);
        onSelectAgent(agent);
    };

    const selectedAgent = agents.find(a => a.id === selectedAgentId);

    return (
        <div className="relative w-full h-[800px] overflow-hidden bg-black rounded-xl border border-gray-800 shadow-2xl">
            {/* --- BACKGROUND GRID --- */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(50, 50, 50, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 50, 50, 0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>
            
            {/* --- TOP HUD BAR --- */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto w-1/3">
                    <div className="hive-glass-panel p-3 rounded-lg flex items-center space-x-4 mb-2">
                         <Activity className="text-green-400 animate-pulse" size={20} />
                         <div className="flex-grow">
                            <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                                <span>THREAT LEVEL</span>
                                <span>{(100 - systemStability).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500" style={{ width: `${100 - systemStability}%` }}></div>
                            </div>
                         </div>
                    </div>
                    {swarmMode && (
                        <div className="hive-glass-panel p-2 rounded-lg flex items-center space-x-2 mt-2 border-purple-500/50 bg-purple-900/20 animate-fade-in">
                            <Layers className="text-purple-400" size={16} />
                            <span className="text-xs font-bold text-purple-300 tracking-wider">SWARM PROTOCOL: ACTIVE</span>
                        </div>
                    )}
                </div>
                
                <div className="pointer-events-auto w-1/3 flex flex-col items-center">
                     <div className="relative w-full max-w-md">
                         <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                             <Terminal size={16} className="text-indigo-500" />
                         </div>
                         <input 
                            type="text" 
                            value={directive}
                            onChange={(e) => { setDirective(e.target.value); onDirectiveChange(e.target.value); }}
                            placeholder="QUEEN_DIRECTIVE //: TYPE COMMAND..."
                            className="w-full bg-black/60 border border-indigo-500/30 rounded-full py-2 pl-10 pr-4 text-sm font-mono text-indigo-300 placeholder-indigo-500/50 focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all"
                         />
                     </div>
                     <span className="text-[10px] text-indigo-500/50 font-mono mt-1 tracking-[0.2em]">HIVE_MIND_v3.0.1::CONNECTED</span>
                </div>

                <div className="w-1/3 flex justify-end pointer-events-auto">
                    <div className="hive-glass-panel p-2 rounded-lg flex space-x-2">
                         <div className="p-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"><Shield size={18}/></div>
                         <div className="p-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"><Zap size={18}/></div>
                         <div className="p-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"><Eye size={18}/></div>
                    </div>
                </div>
            </div>

            {/* --- MAIN VIEWPORT (ORBITAL) --- */}
            <div className="absolute inset-0 flex items-center justify-center perspective-1000">
                
                {/* CENTRAL CORE (THE QUEEN) */}
                <div className="relative z-10 animate-breathe">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                    <Hexagon size={120} className="text-black fill-black stroke-indigo-500 stroke-[0.5] drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity size={40} className="text-indigo-300 animate-pulse" />
                    </div>
                    {/* Rotating Rings around Core */}
                    <div className="absolute inset-[-20px] border border-indigo-500/30 rounded-full animate-spin-slow pointer-events-none"></div>
                    <div className="absolute inset-[-40px] border border-dashed border-purple-500/20 rounded-full animate-reverse-spin pointer-events-none"></div>
                </div>

                {/* AGENT NODES */}
                {agentNodes.map((agent) => (
                    <div 
                        key={agent.id}
                        className="absolute z-20 cursor-pointer transition-all duration-300 group"
                        style={{ 
                            transform: `translate(${agent.x}px, ${agent.y}px)`,
                        }}
                        onClick={() => handleAgentClick(agent)}
                        onMouseEnter={() => setHoveredAgent(agent)}
                        onMouseLeave={() => setHoveredAgent(null)}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 blur-md opacity-50 transition-opacity group-hover:opacity-100" style={{ backgroundColor: agent.statusColor }}></div>
                            <div 
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-transform group-hover:scale-110 ${agent.isOverloaded ? 'animate-pulse' : ''}`}
                                style={{ borderColor: agent.statusColor }}
                            >
                                {agent.isDrone ? <Copy size={18} style={{ color: agent.statusColor }} /> : <Cpu size={20} style={{ color: agent.statusColor }} />}
                            </div>
                            
                            {/* Hover Label */}
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                                <div className="bg-black/90 border border-white/10 px-3 py-2 rounded text-xs font-mono text-white shadow-lg">
                                    <div className="font-bold">{agent.title}</div>
                                    {agent.isOverloaded && <div className="text-red-400 mt-1 text-[10px]">VRAM OVERLOAD</div>}
                                    {agent.isDrone && <div className="text-purple-300 mt-1 text-[10px]">SWARM DRONE</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {/* --- SIDEBAR: CATEGORIES --- */}
            <div className="absolute left-4 top-32 bottom-32 w-16 flex flex-col space-y-4 pointer-events-auto z-20">
                 {['Scout', 'Forge', 'Ops', 'Mind', 'Guard'].map((cat, i) => (
                     <div key={i} className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-black/40 border border-white/10 hover:border-indigo-500 hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all cursor-pointer">
                         <span className="text-xs font-bold text-gray-500 group-hover:text-indigo-300">{cat[0]}</span>
                         <div className="absolute left-14 bg-black/90 px-2 py-1 rounded border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                             {cat} Protocol
                         </div>
                     </div>
                 ))}
            </div>

            {/* --- DETAIL PANEL (RIGHT) --- */}
            {selectedAgent && (
                <div className="absolute top-24 right-4 bottom-24 w-80 hive-glass-panel rounded-xl p-6 z-30 flex flex-col animate-fade-in">
                    <div className="flex justify-between items-start mb-6">
                         <div>
                             <h3 className="text-xl font-bold text-white font-heading leading-tight">{selectedAgent.title}</h3>
                             <p className="text-xs text-indigo-400 font-mono mt-1">{selectedAgent.strategies[0].specialization || 'GENERALIST_UNIT'}</p>
                         </div>
                         <button onClick={() => setSelectedAgentId(null)} className="text-gray-500 hover:text-white"><Crosshair size={20}/></button>
                    </div>
                    
                    <div className="flex-grow space-y-6 overflow-y-auto">
                         {/* Visualizer Area */}
                         <div className="h-24 w-full bg-black/50 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                             <div className="absolute inset-0 flex space-x-1 items-center justify-center opacity-30">
                                 {[...Array(10)].map((_, i) => (
                                     <div key={i} className="w-1 bg-indigo-500 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                                 ))}
                             </div>
                             <span className="text-xs font-mono text-indigo-300 relative z-10">NEURAL_ACTIVITY_DETECTED</span>
                         </div>
                         
                         {/* Stats Grid */}
                         <div className="grid grid-cols-2 gap-3">
                             <div className="bg-white/5 p-3 rounded border border-white/5">
                                 <p className="text-[10px] text-gray-400 uppercase">Efficiency</p>
                                 <p className="text-lg font-bold text-green-400">{selectedAgent.strategies[0].capitalEfficiency.toFixed(0)}%</p>
                             </div>
                             <div className="bg-white/5 p-3 rounded border border-white/5">
                                 <p className="text-[10px] text-gray-400 uppercase">Load</p>
                                 <p className="text-lg font-bold text-yellow-400">{selectedAgent.strategies[0].cognitiveLoad}%</p>
                             </div>
                         </div>

                         {/* VRAM Monitor */}
                         <div className={`p-3 rounded border ${selectedAgent.strategies[0].gpuVramUsage > maxGpuVram ? 'bg-red-900/20 border-red-500/50' : 'bg-white/5 border-white/5'}`}>
                             <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                                 <span className={selectedAgent.strategies[0].gpuVramUsage > maxGpuVram ? 'text-red-400' : 'text-gray-400'}>VRAM Usage</span>
                                 <span className="text-gray-300">{selectedAgent.strategies[0].gpuVramUsage} MB</span>
                             </div>
                             {selectedAgent.strategies[0].gpuVramUsage > maxGpuVram && <p className="text-xs text-red-200 mt-1">Overload Warning</p>}
                         </div>
                         
                         {/* Current Task */}
                         <div>
                             <p className="text-xs text-gray-500 uppercase mb-2">Current Directive</p>
                             <div className="bg-black/40 p-3 rounded border-l-2 border-indigo-500 text-sm text-gray-300 font-mono">
                                 {selectedAgent.strategies[0].actionPlan.aiTasks.find(t => t.status === 'active')?.text || "AWAITING_COMMAND..."}
                             </div>
                         </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
                        <button onClick={() => onSpawnDrone(selectedAgent.id)} className="w-full btn-primary py-2 text-xs font-bold tracking-wider bg-purple-600 hover:bg-purple-700 border-purple-500">
                            SPAWN SWARM DRONE
                        </button>
                        <button className="w-full btn-primary py-2 text-xs font-bold tracking-wider">
                            ACCESS CONSOLE
                        </button>
                    </div>
                </div>
            )}

            {/* --- BOTTOM DOCK --- */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center space-x-6 pointer-events-auto z-20">
                 <div className="text-xs font-mono text-gray-500">ACTIVE_AGENTS: <span className="text-white">{agents.length}</span></div>
                 <div className="h-4 w-px bg-white/10"></div>
                 <div className="text-xs font-mono text-gray-500">NET_PROFIT: <span className="text-green-400">$12,450</span></div>
            </div>

        </div>
    );
};

export default HiveDashboard;
