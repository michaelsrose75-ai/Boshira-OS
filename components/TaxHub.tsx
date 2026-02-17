
import React, { useState } from 'react';
import type { FinancialTransaction, TaxGuruReport } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Download, BrainCircuit, Lightbulb, AlertTriangle, Activity, Shield, MapPin } from 'lucide-react';
import Loader from './Loader';

interface TaxHubProps {
  transactions: FinancialTransaction[];
  taxGuruReport: TaxGuruReport | null;
  onRunTaxGuru: () => void;
}

const AuditRiskGauge: React.FC<{ score: number }> = ({ score }) => {
    const getRiskColor = () => {
        if (score > 75) return 'text-red-500';
        if (score > 50) return 'text-yellow-500';
        return 'text-green-500';
    };
    const getRiskLabel = () => {
        if (score > 75) return 'High';
        if (score > 50) return 'Medium';
        return 'Low';
    }

    const colorClass = getRiskColor();
    const label = getRiskLabel();
    const rotation = (score / 100) * 180 - 90;

    return (
        <div className="relative w-40 h-20 overflow-hidden mx-auto">
            <div className={`absolute w-full h-full rounded-t-full border-t-8 border-r-8 border-b-8 border-gray-700 transform rotate-[-90deg]`}></div>
            <div 
                className={`absolute w-full h-full rounded-t-full border-t-8 border-r-8 border-b-8 ${colorClass.replace('text-', 'border-')} transform transition-transform duration-500`}
                style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)', transform: `rotate(${rotation}deg)`}}
            ></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                 <div className={`text-2xl font-bold ${colorClass}`}>{score}</div>
                 <div className="text-xs font-semibold text-gray-300">{label} Risk</div>
            </div>
        </div>
    );
};


const TaxHub: React.FC<TaxHubProps> = ({ transactions, taxGuruReport, onRunTaxGuru }) => {
  const [isLoading, setIsLoading] = useState(false);

  const summary = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'revenue') {
        acc.totalRevenue += tx.amount;
      } else {
        acc.totalExpenses += tx.amount;
      }
      return acc;
    },
    { totalRevenue: 0, totalExpenses: 0 }
  );

  const netProfit = summary.totalRevenue - summary.totalExpenses;

  const handleRunAnalysis = async () => {
      setIsLoading(true);
      await onRunTaxGuru();
      setIsLoading(false);
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
      switch(impact) {
          case 'high': return 'border-green-500';
          case 'medium': return 'border-yellow-500';
          case 'low': return 'border-blue-500';
          default: return 'border-gray-500';
      }
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                    <BrainCircuit size={20} className="mr-3 text-indigo-400"/>
                    Tax Guru AI
                </h4>
                <div className="flex items-center text-xs text-gray-400">
                    <MapPin size={12} className="mr-1 text-red-400"/>
                    Jurisdiction: <span className="text-white font-semibold ml-1">North Carolina, USA</span>
                </div>
            </div>
            <button 
                onClick={handleRunAnalysis}
                disabled={isLoading || transactions.length === 0}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
                {isLoading ? <Loader small /> : 'Run Tax Analysis'}
            </button>
        </div>
        
        {taxGuruReport && !isLoading && (
            <div className="animate-fade-in space-y-6">
                <div className="bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 p-3 rounded-lg flex items-start" role="alert">
                    <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{taxGuruReport.disclaimer}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Capital Gains Analysis */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                        <h5 className="font-bold text-white mb-4 flex items-center"><Activity size={18} className="mr-2" />Capital Gains Analysis</h5>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">Est. Short-Term Gains:</span>
                                <span className="font-mono font-semibold text-red-400">{formatCurrency(taxGuruReport.estimatedShortTermGains)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">Est. Long-Term Gains:</span>
                                <span className="font-mono font-semibold text-green-400">{formatCurrency(taxGuruReport.estimatedLongTermGains)}</span>
                            </div>
                            <div className="border-t border-gray-700 pt-4 text-center">
                                <h6 className="text-sm font-semibold text-gray-300 mb-2 flex items-center justify-center"><Shield size={14} className="mr-2"/>Simulated Audit Risk</h6>
                                <AuditRiskGauge score={taxGuruReport.auditRiskScore} />
                            </div>
                        </div>
                    </div>
                    {/* Optimization Strategies */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                         <h5 className="font-bold text-white mb-4 flex items-center"><Lightbulb size={18} className="mr-2" />Optimization Strategies</h5>
                         <div className="space-y-3">
                            {taxGuruReport.strategies.map((strategy, index) => (
                                <div key={index} className={`p-3 bg-gray-800/50 rounded-md border-l-4 ${getImpactColor(strategy.impact)}`}>
                                    <h6 className="font-semibold text-white">{strategy.title}</h6>
                                    <p className="text-xs text-gray-300 mt-1">{strategy.description}</p>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* Ledger Summary */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
            <h4 className="text-lg font-bold text-white mb-4">Financial Ledger Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                    <h5 className="text-sm font-medium text-gray-400">Gross Revenue</h5>
                    <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(summary.totalRevenue)}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                    <h5 className="text-sm font-medium text-gray-400">Total Expenses</h5>
                    <p className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(summary.totalExpenses)}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                    <h5 className="text-sm font-medium text-gray-400">Net Profit</h5>
                    <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(netProfit)}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TaxHub;
