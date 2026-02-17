import React from 'react';
import type { Strategy } from '../types';
import { Zap, TrendingUp, Shield, Gauge, Rocket } from 'lucide-react';

interface StrategySelectorProps {
  strategies: Strategy[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const strategyIcons = {
  'Bootstrapper': <Shield size={24} className="text-blue-400" />,
  'Growth Hacker': <Rocket size={24} className="text-green-400" />,
  'Premium Brand': <Gauge size={24} className="text-purple-400" />,
};

const StrategySelector: React.FC<StrategySelectorProps> = ({ strategies, selectedIndex, onSelect }) => {
  return (
    <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white flex items-center"><Zap className="mr-3 text-indigo-400"/> Profit Velocity Dashboard</h3>
        <p className="text-sm text-gray-400 mb-4">Select a strategy to see how it impacts your entire business blueprint in real-time. Choose the path that best fits your goals.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategies.map((strategy, index) => {
            const isSelected = selectedIndex === index;
            const ringColor = strategy.strategyName === 'Bootstrapper' ? 'ring-blue-500' : strategy.strategyName === 'Growth Hacker' ? 'ring-green-500' : 'ring-purple-500';
            
            return (
            <button
                key={strategy.strategyName}
                onClick={() => onSelect(index)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 focus:outline-none ${isSelected ? `bg-gray-700/50 border-transparent ${ringColor} ring-2` : 'bg-gray-800/60 border-gray-700 hover:border-gray-600 hover:bg-gray-700/30'}`}
            >
                <div className="flex items-center mb-3">
                {strategyIcons[strategy.strategyName]}
                <h4 className="text-lg font-bold text-white ml-3">{strategy.strategyName}</h4>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Investment:</span>
                        <span className="font-mono text-red-400">${strategy.totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Profit (Yr 1):</span>
                        <span className="font-mono text-green-400">${strategy.projectedProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Time to Profit:</span>
                        <span className="font-mono text-yellow-400">{strategy.timeToProfit}</span>
                    </div>
                </div>
            </button>
            );
        })}
        </div>
    </div>
  );
};

export default StrategySelector;
