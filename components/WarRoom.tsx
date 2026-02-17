import React, { useMemo, useEffect, useRef } from 'react';
import type { Idea, OverseerLogEntry, PortfolioRules } from '../types';
import { Server, DollarSign, List, Shield, BrainCircuit, BarChart, Users, Flag, Trophy, TrendingUp, Orbit, User as FounderIcon, Repeat, ShoppingCart, HardDrive, ShieldCheck, Monitor, Activity, Check, Loader as LoaderIcon, AlertCircle, Power, Info, Terminal, AlertTriangle } from 'lucide-react';

interface WarRoomProps {
  agents: Idea[];
  log: OverseerLogEntry[];
  rules: PortfolioRules;
  newVentureFund: number;
}

const WarRoom: React.FC<WarRoomProps> = ({ agents, log, rules, newVentureFund }) => {

  const totalPortfolioValue = useMemo(() => {
    return agents.reduce((sum, idea) => sum + idea.strategies[0].actualRevenue, 0) + newVentureFund;
  }, [agents, newVentureFund]);

  const weeklyPnl = useMemo(() => {
     return agents.reduce((sum, idea) => sum + (idea.strategies[0].actualRevenue - idea.strategies[0].actualSpent), 0);
  }, [agents]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [log]);

  const getLogIcon = (type: OverseerLogEntry['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />;
      case 'success': return <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />;
      default: return <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />;
    }
  };

  const getAgentStatus = (agent: Idea) => {
    const activeTask = agent.strategies[0].actionPlan.aiTasks.find(t => ['active', 'executing', 'retrying', 'awaiting_review'].includes(t.status));
    if (activeTask) return { text: activeTask.status.charAt(0).toUpperCase() + activeTask.status.slice(1), icon: <Activity size={14} className="text-accent-cyan" />, color: 'cyan' };
    
    const failedTask = agent.strategies[0].actionPlan.aiTasks.find(t => t.status === 'failed');
    if (failedTask) return { text: 'Halted', icon: <AlertCircle size={14} className="text-accent-red" />, color: 'red' };

    return { text: 'Idle', icon: <Power size={14} className="text-text-secondary" />, color: 'gray' };
  };
  
  const getTaskProgress = (agent: Idea) => {
      const totalTasks = agent.strategies[0].actionPlan.aiTasks.length + agent.strategies[0].actionPlan.userTasks.length;
      if (totalTasks === 0) return 0;
      const completedTasks = agent.strategies[0].actionPlan.aiTasks.filter(t => t.status === 'completed').length + agent.strategies[0].actionPlan.userTasks.filter(t => t.status === 'completed').length;
      return (completedTasks / totalTasks) * 100;
  };

  return (
    <div className="max-w-full mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center"><Monitor className="mr-4 text-accent-cyan"/>The War Room</h2>
        <p className="text-text-secondary max-w-3xl mx-auto">Zero-cost, real-time observability of your entire autonomous fleet. This is your live feed from the front lines of your digital empire.</p>
      </div>

       <div className="sticky top-[70px] z-10 bg-bg-secondary/50 backdrop-blur-lg p-2 rounded-lg border border-border-primary mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center">
                <div className="bg-black/20 p-2 rounded-md">
                    <p className="text-xs text-text-secondary font-semibold">Total Portfolio Value</p>
                    <p className="text-xl font-bold text-white">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                 <div className="bg-black/20 p-2 rounded-md">
                    <p className="text-xs text-text-secondary font-semibold">Weekly PNL</p>
                    <p className={`text-xl font-bold ${weeklyPnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {weeklyPnl >= 0 ? '+' : ''}${weeklyPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                 <div className="bg-black/20 p-2 rounded-md">
                    <p className="text-xs text-text-secondary font-semibold">Hive Treasury (Net Profit)</p>
                    <p className="text-xl font-bold text-accent-purple">${newVentureFund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-black/20 p-2 rounded-md">
                    <p className="text-xs text-text-secondary font-semibold">Kageyoshi's Venture Fund</p>
                    <p className="text-xl font-bold text-accent-cyan">${rules.autonomousVentureFund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Server size={20} className="mr-3"/>Agent Status Grid</h3>
            {agents.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {agents.map(agent => {
                        const status = getAgentStatus(agent);
                        const progress = getTaskProgress(agent);
                        return (
                             <div key={agent.id} className="card-base p-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg text-white mb-2 truncate pr-2">{agent.title}</h4>
                                    <div className={`flex items-center space-x-2 text-xs font-semibold px-2 py-1 rounded-full bg-${status.color}-500/10 text-${status.color}-400 border border-${status.color}-500/20`}>
                                        {status.icon}
                                        <span>{status.text}</span>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-secondary">Cap. Efficiency:</span>
                                        <span className={`font-mono font-semibold ${agent.strategies[0].capitalEfficiency >= 100 ? 'text-accent-green' : 'text-text-primary'}`}>
                                            {agent.strategies[0].capitalEfficiency.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-secondary">Task Progress:</span>
                                        <span className="font-mono font-semibold text-text-primary">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-bg-tertiary rounded-full h-1.5">
                                        <div className="bg-accent-primary h-1.5 rounded-full" style={{width: `${progress}%`}}></div>
                                    </div>
                                </div>
                             </div>
                        );
                    })}
                </div>
            ) : (
                <div className="card-base flex items-center justify-center h-64">
                    <p className="text-text-secondary">No active agents to monitor.</p>
                </div>
            )}
        </div>
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Terminal size={20} className="mr-3"/>Overseer Log Stream</h3>
          <div ref={logContainerRef} className="card-base p-4 h-[600px] overflow-y-auto font-mono text-xs">
              {log.length > 0 ? (
                  <ul className="space-y-3">
                      {log.map((entry, index) => (
                          <li key={index} className="flex items-start space-x-2.5">
                              {getLogIcon(entry.type)}
                              <div>
                                <p className="text-text-secondary"><span className="font-semibold text-white">{entry.agentTitle}:</span> {entry.message}</p>
                                <p className="text-[10px] text-text-secondary/50">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                              </div>
                          </li>
                      ))}
                  </ul>
              ) : ( <div className="flex items-center justify-center h-full text-text-secondary"><p>Log is empty.</p></div> )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarRoom;