import React, { useState } from 'react';
import type { TaxGuruReport, CfoReport, AutoTraderState } from '../types';
import { BrainCircuit, Lightbulb, Repeat, Shield, Brain } from 'lucide-react';
import Loader from './Loader';

interface FinancialCrewDashboardProps {
  taxGuruReport: TaxGuruReport | null;
  onRunTaxGuru: () => void;
  cfoReport: CfoReport | null;
  onRunCfoAnalysis: () => void;
  autoTraderState: AutoTraderState;
}

const FinancialCrewDashboard: React.FC<FinancialCrewDashboardProps> = ({ taxGuruReport, onRunTaxGuru, cfoReport, onRunCfoAnalysis, autoTraderState }) => {
    const [isCfoLoading, setIsCfoLoading] = useState(false);
    const [isTaxLoading, setIsTaxLoading] = useState(false);

    const handleRunCfo = async () => {
        setIsCfoLoading(true);
        await onRunCfoAnalysis();
        setIsCfoLoading(false);
    };

    const handleRunTax = async () => {
        setIsTaxLoading(true);
        await onRunTaxGuru();
        setIsTaxLoading(false);
    };

    const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
      switch(impact) {
          case 'high': return 'border-green-500';
          case 'medium': return 'border-yellow-500';
          case 'low': return 'border-blue-500';
          default: return 'border-gray-500';
      }
    }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Michael’s Financial Hive</h2>
            <p className="text-sm text-gray-400">Your elite team of AI financial operatives.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

             {/* CFO Module */}
            <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h5 className="font-bold text-white mb-1 flex items-center"><Brain size={18} className="mr-2 text-indigo-400" /> CFO: Ray Dalio (Macro Strategist)</h5>
                        <p className="text-xs text-gray-400">Provides high-level strategic oversight and capital allocation advice.</p>
                    </div>
                     <button onClick={handleRunCfo} disabled={isCfoLoading} className="btn-primary text-sm whitespace-nowrap"><BrainCircuit size={14} className="mr-2"/>Run Analysis</button>
                </div>
                {isCfoLoading ? <Loader /> : cfoReport ? (
                    <div className="space-y-4">
                        <div>
                            <h6 className="font-semibold text-gray-300 text-sm mb-2">Executive Summary</h6>
                            <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-md border border-gray-700 whitespace-pre-wrap">{cfoReport.executiveSummary}</p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-300 text-sm mb-2">Strategic Recommendations</h6>
                            <div className="space-y-2">
                            {cfoReport.recommendations.map((rec, index) => (
                                <div key={index} className={`p-2 bg-gray-800/50 rounded-md border-l-4 ${rec.priority === 'high' ? 'border-red-500' : rec.priority === 'medium' ? 'border-yellow-500' : 'border-blue-500'}`}>
                                <h6 className="font-semibold text-white text-sm">{rec.title}</h6>
                                <p className="text-xs text-gray-300 mt-1">{rec.rationale}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                ) : <p className="text-center text-sm text-gray-500 py-8">Run analysis to get strategic recommendations from your AI CFO.</p>}
            </div>
            
            {/* Tax Guru */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h5 className="font-bold text-white mb-1 flex items-center"><Shield size={18} className="mr-2 text-green-400" /> Tax Guru: Nassim Taleb (Risk & Optimization)</h5>
                        <p className="text-xs text-gray-400">Minimizes tax liability and manages financial risk.</p>
                    </div>
                    <button onClick={handleRunTax} disabled={isTaxLoading} className="btn-primary text-sm whitespace-nowrap"><BrainCircuit size={14} className="mr-2"/>Run Analysis</button>
                </div>
                 {isTaxLoading ? <Loader /> : taxGuruReport ? (
                     <div>
                        <h6 className="font-semibold text-gray-300 text-sm mb-2">Optimization Strategies</h6>
                        <div className="space-y-2">
                        {taxGuruReport.strategies.map((strategy, index) => (
                            <div key={index} className={`p-2 bg-gray-800/50 rounded-md border-l-4 ${getImpactColor(strategy.impact)}`}>
                                <h6 className="font-semibold text-white text-sm">{strategy.title}</h6>
                                <p className="text-xs text-gray-300 mt-1">{strategy.description}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                ) : <p className="text-center text-sm text-gray-500 py-8">Run analysis to get tax optimization strategies.</p>}
            </div>

            {/* Auto-Trader */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                <h5 className="font-bold text-white mb-4 flex items-center"><Repeat size={18} className="mr-2 text-cyan-400" /> Auto-Trader: James Simons (Quant Alpha)</h5>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-semibold ${autoTraderState.isActive ? 'text-green-400' : 'text-gray-500'}`}>{autoTraderState.isActive ? 'Active' : 'Idle'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Total PNL:</span>
                        <span className={`font-mono font-semibold ${autoTraderState.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{autoTraderState.totalPnl.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="font-mono font-semibold text-white">{(autoTraderState.winRate * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FinancialCrewDashboard;