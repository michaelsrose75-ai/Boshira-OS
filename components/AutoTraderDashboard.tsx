import React from 'react';
import type { AutoTraderState } from '../types';
import { Repeat, PlayCircle, DollarSign, Activity, BarChart, AlertTriangle } from 'lucide-react';

interface AutoTraderDashboardProps {
  state: AutoTraderState;
  onDeploy: () => void;
}

const AutoTraderDashboard: React.FC<AutoTraderDashboardProps> = ({ state, onDeploy }) => {
  const { isActive, portfolio, activeTrades, winRate, totalPnl, log } = state;

  const formatCurrency = (value: number, symbol: string) => `${value.toFixed(2)} ${symbol}`;

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
            <Repeat size={22} className="mr-3 text-indigo-400" />
            Auto-Trader Deployment Hub
          </h3>
          <p className="text-sm text-gray-400">
            Deploy and monitor your autonomous on-chain trading agent.
          </p>
        </div>
        {!isActive && (
          <button
            onClick={onDeploy}
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg"
          >
            <PlayCircle className="h-5 w-5 mr-2" />
            Deploy Auto-Trader
          </button>
        )}
      </div>

      <div className="bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 px-4 py-3 rounded-lg mb-6 flex items-start" role="alert">
        <AlertTriangle className="h-6 w-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
        <div>
          <strong className="font-bold">Simulation Mode Active</strong>
          <p className="text-sm">
            This is a high-fidelity simulation of the auto-trading logic. It does not execute real trades or require a private key. This allows you to test and verify the agent's strategy in a completely safe, sandboxed environment before risking real capital.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Log */}
        <div className="lg:col-span-2">
          <h4 className="font-semibold text-white mb-3">Live Trade Log</h4>
          <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 h-96 overflow-y-auto font-mono text-xs">
            {log.map((entry, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                <span className={`flex-shrink-0 ${
                  entry.type === 'success' ? 'text-green-400' :
                  entry.type === 'error' ? 'text-red-400' :
                  entry.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'
                }`}>{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right: Dashboard */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <h4 className="font-semibold text-white mb-3 flex items-center"><DollarSign size={16} className="mr-2"/>Portfolio</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Simulated Balance:</span>
                <span className="font-mono font-semibold text-indigo-300">{formatCurrency(portfolio.SOL, 'SOL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Total PNL:</span>
                <span className={`font-mono font-semibold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPnl.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Win Rate:</span>
                <span className="font-mono font-semibold text-white">{(winRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <h4 className="font-semibold text-white mb-3 flex items-center"><Activity size={16} className="mr-2"/>Active Trades</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeTrades.filter(t => t.status === 'active').map(trade => (
                <div key={trade.id} className="text-xs p-2 bg-gray-800/50 rounded">
                  <p className="font-bold text-white">{trade.token}</p>
                  <p className="text-gray-400">Entry: {formatCurrency(trade.entry, 'USD')} | Size: {formatCurrency(trade.size, 'SOL')}</p>
                </div>
              ))}
              {activeTrades.filter(t => t.status === 'active').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No active positions.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTraderDashboard;