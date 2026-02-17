import React, { useState, useMemo } from 'react';
import type { Idea, FinancialTransaction } from '../types';
import { BarChart2, TrendingUp, DollarSign, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import AgentLeaderboard from './AgentLeaderboard'; // New import

interface PerformanceAnalyticsProps {
  agents: Idea[];
  financialTransactions: FinancialTransaction[];
}

type TimeRange = 'monthly' | 'quarterly' | 'annually';
type AnalyticsTab = 'historical' | 'leaderboard';

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ agents, financialTransactions }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('leaderboard');

  const analyticsData = useMemo(() => {
    // ... (existing analytics logic)
    return { chartData: [], prospectus: '', totalProfit: 0, momGrowth: 0, mostProfitableSource: '' };
  }, [financialTransactions, timeRange]);
  
  const handleGenerateProspectus = () => {
    // ... (existing prospectus logic)
  };

  const renderHistorical = () => (
    <div className="space-y-8">
      {/* ... (existing historical chart components) ... */}
    </div>
  );

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center"><BarChart2 size={22} className="mr-3 text-indigo-400"/>Performance & Analytics</h3>
          <p className="text-sm text-gray-400">Analyze agent performance, track financials, and generate reports.</p>
        </div>
        {activeTab === 'historical' && (
          <button onClick={handleGenerateProspectus} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md">Generate Prospectus</button>
        )}
      </div>
      
       <div className="flex items-center space-x-1 bg-gray-900/50 p-1 rounded-lg mb-6 max-w-sm">
         <button onClick={() => setActiveTab('historical')} className={`flex-1 text-center py-1.5 text-sm font-medium rounded-md flex items-center justify-center ${activeTab === 'historical' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><TrendingUp size={14} className="mr-2"/>Historical</button>
         <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 text-center py-1.5 text-sm font-medium rounded-md flex items-center justify-center ${activeTab === 'leaderboard' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><Trophy size={14} className="mr-2"/>Leaderboard</button>
      </div>
      
      {activeTab === 'historical' && (financialTransactions.length > 0 ? (
        renderHistorical()
      ) : (
        <div className="text-center py-16 text-gray-500">
            <p>No financial data available. Complete tasks to generate performance metrics.</p>
        </div>
      ))}

      {activeTab === 'leaderboard' && <AgentLeaderboard agents={agents} />}
    </div>
  );
};

export default PerformanceAnalytics;