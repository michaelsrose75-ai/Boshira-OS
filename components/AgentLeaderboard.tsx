import React, { useMemo } from 'react';
import type { Idea } from '../types';
import { Trophy, Star, ArrowUp, ArrowDown } from 'lucide-react';

interface AgentLeaderboardProps {
  agents: Idea[];
}

const AgentLeaderboard: React.FC<AgentLeaderboardProps> = ({ agents }) => {

  const rankedAgents = useMemo(() => {
    return agents.map(agent => {
      const s = agent.strategies[0];
      // Weighted score calculation
      const efficiencyScore = (s.capitalEfficiency / 100) * 0.4; // 40% weight
      const revenueScore = Math.min(1, s.actualRevenue / 5000) * 0.3; // 30% weight (normalized to $5k)
      const proficiencyScore = (s.proficiencyScore / 100) * 0.2; // 20% weight
      const scaleScore = (s.scaleLevel / 5) * 0.1; // 10% weight (normalized to 5 levels)
      
      const overallScore = (efficiencyScore + revenueScore + proficiencyScore + scaleScore) * 100;
      
      return {
        id: agent.id,
        title: agent.title,
        score: overallScore,
        efficiency: s.capitalEfficiency,
        revenue: s.actualRevenue,
        proficiency: s.proficiencyScore,
      };
    }).sort((a, b) => b.score - a.score);
  }, [agents]);

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'border-yellow-400 bg-yellow-900/30';
    if (rank === 1) return 'border-gray-400 bg-gray-700/30';
    if (rank === 2) return 'border-amber-600 bg-amber-900/30';
    return 'border-gray-700 bg-gray-800/30';
  }

  return (
    <div className="space-y-4 animate-fade-in">
        <div className="text-center">
            <h3 className="text-xl font-bold text-white">Agent Performance Leaderboard</h3>
            <p className="text-sm text-gray-400">Ranking agents by overall performance score.</p>
        </div>
        {rankedAgents.length > 0 ? (
             <div className="space-y-3">
                {rankedAgents.map((agent, index) => (
                    <div key={agent.id} className={`p-4 rounded-lg border-2 flex items-center space-x-4 ${getRankColor(index)}`}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/30 font-bold text-2xl text-white">
                            {index < 3 ? <Trophy size={24} className={index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-amber-500'}/> : `#${index + 1}`}
                        </div>
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-white">{agent.title}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                                <span>Cap. Efficiency: <span className="font-semibold text-green-400">{agent.efficiency.toFixed(0)}%</span></span>
                                <span>Revenue: <span className="font-semibold text-white">${agent.revenue.toLocaleString()}</span></span>
                                <span>Proficiency: <span className="font-semibold text-blue-400">{agent.proficiency.toFixed(0)}</span></span>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-gray-400">Score</p>
                             <p className="font-bold text-2xl text-indigo-300">{agent.score.toFixed(1)}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 py-10">No active agents to rank.</p>
        )}
    </div>
  );
};

export default AgentLeaderboard;