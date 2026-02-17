
import React from 'react';
import type { PortfolioRules, ReinvestmentStrategy } from '../types';
import { ShieldCheck, Zap, Brain, TrendingUp, Filter, Leaf, Activity, HardDrive, DollarSign, Hexagon } from 'lucide-react';

interface PortfolioRulesProps {
  rules: PortfolioRules;
  onRulesChange: (newRules: PortfolioRules) => void;
}

const PortfolioRules: React.FC<PortfolioRulesProps> = ({ rules, onRulesChange }) => {

  const handleRuleChange = (field: keyof PortfolioRules, value: any) => {
      onRulesChange({ ...rules, [field]: value });
  };

  const strategyOptions: { value: ReinvestmentStrategy; label: string }[] = [
      { value: 'dynamic_roi', label: 'Dynamic ROI Optimization' },
      { value: 'scale_winners', label: 'Scale Top Performers' },
      { value: 'launch_new', label: 'Launch New Ventures' },
      { value: 'balanced', label: 'Balanced Approach' },
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Brain size={22} className="mr-3 text-indigo-400" />
        Portfolio Rules (Reaper Protocol)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Define the core logic, goals, and protocols for your entire agent fleet.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Reaper Pruning Rules */}
         <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 md:col-span-2 lg:col-span-3">
             <h4 className="font-semibold text-white mb-4">Reaper Pruning Directives</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <label htmlFor="min-efficiency" className="block text-sm font-medium text-gray-300 mb-1">Min. Capital Efficiency</label>
                    <div className="flex items-center space-x-2">
                        <input id="min-efficiency" type="range" min="0" max="100" value={rules.minCapitalEfficiency} onChange={(e) => handleRuleChange('minCapitalEfficiency', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                        <span className="font-mono text-green-300 text-sm w-12 text-center">{rules.minCapitalEfficiency}%</span>
                    </div>
                </div>
                 <div>
                    <label htmlFor="max-idle" className="block text-sm font-medium text-gray-300 mb-1">Max Idle Time (Sim-Days)</label>
                    <div className="flex items-center space-x-2">
                        <input id="max-idle" type="range" min="5" max="90" value={rules.maxIdleTime} onChange={(e) => handleRuleChange('maxIdleTime', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                        <span className="font-mono text-yellow-300 text-sm w-12 text-center">{rules.maxIdleTime}</span>
                    </div>
                </div>
                 <div>
                    <label htmlFor="max-cog-load" className="block text-sm font-medium text-gray-300 mb-1">Max Cognitive Load</label>
                    <div className="flex items-center space-x-2">
                        <input id="max-cog-load" type="range" min="50" max="100" value={rules.maxCognitiveLoad} onChange={(e) => handleRuleChange('maxCognitiveLoad', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                        <span className="font-mono text-orange-300 text-sm w-12 text-center">{rules.maxCognitiveLoad}</span>
                    </div>
                </div>
                 <div>
                    <label htmlFor="max-vram" className="block text-sm font-medium text-gray-300 mb-1">Max GPU VRAM (MB)</label>
                    <div className="flex items-center space-x-2">
                        <input id="max-vram" type="range" min="256" max="4096" step="128" value={rules.maxGpuVram} onChange={(e) => handleRuleChange('maxGpuVram', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                        <span className="font-mono text-purple-300 text-sm w-16 text-center">{rules.maxGpuVram}</span>
                    </div>
                </div>
             </div>
        </div>


        {/* Financial Goal */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <label htmlFor="financial-goal" className="block text-sm font-medium text-gray-300 mb-2">Primary Financial Goal (Weekly Profit)</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                <input
                    type="number"
                    id="financial-goal"
                    value={rules.financialGoal}
                    onChange={(e) => handleRuleChange('financialGoal', Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md pl-7 pr-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    step="100"
                />
            </div>
            <p className="text-xs text-gray-500 mt-2">The weekly profit target the brain will work to achieve.</p>
        </div>
        
        {/* Reinvestment Strategy */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <label htmlFor="reinvest-strategy" className="block text-sm font-medium text-gray-300 mb-2">Reinvestment Strategy (Pre-Goal)</label>
            <select
                id="reinvest-strategy"
                value={rules.reinvestmentStrategy}
                onChange={(e) => handleRuleChange('reinvestmentStrategy', e.target.value as ReinvestmentStrategy)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
                {strategyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-2">How the brain should use profits before the primary goal is met.</p>
        </div>
        
        {/* Post-Goal Reinvestment Strategy */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <label htmlFor="post-goal-strategy" className="block text-sm font-medium text-gray-300 mb-2">Reinvestment Strategy (Post-Goal)</label>
            <select
                id="post-goal-strategy"
                value={rules.postGoalReinvestmentStrategy}
                onChange={(e) => handleRuleChange('postGoalReinvestmentStrategy', e.target.value as ReinvestmentStrategy)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
                {strategyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-2">Strategy after achieving the goal. Defaults to diversification.</p>
        </div>

        {/* De-Risking Threshold */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <label htmlFor="derisk-threshold" className="block text-sm font-medium text-gray-300 mb-2">De-Risking Threshold</label>
            <div className="flex items-center space-x-4">
                <input id="derisk-threshold" type="range" min="0" max="100" value={rules.deRiskingThreshold} onChange={(e) => handleRuleChange('deRiskingThreshold', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                <span className="font-mono text-red-300 text-lg w-20 text-center">{rules.deRiskingThreshold}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Disables autonomous mode if an agent's Efficiency Score falls below this.</p>
        </div>

        {/* Master Agent Threshold */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <label htmlFor="master-threshold" className="block text-sm font-medium text-gray-300 mb-2">Master Agent Threshold</label>
            <div className="flex items-center space-x-4">
                <input id="master-threshold" type="range" min="50" max="100" value={rules.masterAgentThreshold} onChange={(e) => handleRuleChange('masterAgentThreshold', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                <span className="font-mono text-yellow-300 text-lg w-20 text-center">{rules.masterAgentThreshold}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Proficiency score required to be eligible for Master Agent promotion.</p>
        </div>
        
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <label htmlFor="venture-fund-allocation" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <DollarSign size={14} className="mr-2 text-cyan-400" />
                Kageyoshi's Venture Fund Allocation
            </label>
            <div className="flex items-center space-x-4">
                <input id="venture-fund-allocation" type="range" min="0" max="25" value={rules.autonomousVentureAllocationRate} onChange={(e) => handleRuleChange('autonomousVentureAllocationRate', parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                <span className="font-mono text-cyan-300 text-lg w-20 text-center">{rules.autonomousVentureAllocationRate}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Percentage of all revenue allocated to Kageyoshi's autonomous fund.</p>
        </div>

        {/* Frugality Protocol */}
         <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 flex flex-col justify-between">
            <label htmlFor="frugality-toggle" className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-300 flex items-center">
                  <Leaf size={16} className="mr-2 text-green-400" />
                  Frugality Protocol
                </span>
                <div className="relative">
                    <input type="checkbox" id="frugality-toggle" className="sr-only" checked={rules.frugalityMode} onChange={(e) => handleRuleChange('frugalityMode', e.target.checked)} />
                    <div className={`block w-12 h-6 rounded-full transition ${rules.frugalityMode ? 'bg-green-600' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${rules.frugalityMode ? 'translate-x-6' : ''}`}></div>
                </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">When enabled, the AI searches for free alternatives before executing a budgeted task.</p>
        </div>

        {/* Swarm Mode (Low Energy) */}
         <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 flex flex-col justify-between">
            <label htmlFor="swarm-toggle" className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-300 flex items-center">
                  <Hexagon size={16} className="mr-2 text-purple-400" />
                  Swarm Tactics (Low Energy)
                </span>
                <div className="relative">
                    <input type="checkbox" id="swarm-toggle" className="sr-only" checked={rules.swarmMode} onChange={(e) => handleRuleChange('swarmMode', e.target.checked)} />
                    <div className={`block w-12 h-6 rounded-full transition ${rules.swarmMode ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${rules.swarmMode ? 'translate-x-6' : ''}`}></div>
                </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">Optimizes runtime for minimal resource usage (50% VRAM), allowing deployment of multiple lightweight Drone agents.</p>
        </div>

        {/* Autonomous Pruning */}
         <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 flex flex-col justify-between">
            <label htmlFor="pruning-toggle" className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-300 flex items-center">
                  <Zap size={16} className="mr-2 text-red-400" />
                  Autonomous Pruning
                </span>
                <div className="relative">
                    <input type="checkbox" id="pruning-toggle" className="sr-only" checked={rules.autonomousPruning} onChange={(e) => handleRuleChange('autonomousPruning', e.target.checked)} />
                    <div className={`block w-12 h-6 rounded-full transition ${rules.autonomousPruning ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${rules.autonomousPruning ? 'translate-x-6' : ''}`}></div>
                </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">When enabled, the Sentry Protocol will automatically decommission underperforming agents.</p>
        </div>

      </div>
    </div>
  );
};

export default PortfolioRules;
