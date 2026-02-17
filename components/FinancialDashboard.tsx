
import React, { useState, useMemo } from 'react';
import type { Idea, PortfolioRules, FinancialTransaction, TaxGuruReport, CfoReport, AutoTraderState } from '../types';
import { DollarSign, FileText, Info, Bot, Repeat, BrainCircuit, Shield, TrendingDown, Calendar, Target, Zap } from 'lucide-react';
import GoalTracker from './GoalTracker';
import TaxHub from './TaxHub';
import FinancialCrewDashboard from './FinancialCrewDashboard';

interface FinancialDashboardProps {
  agents: Idea[];
  rules: PortfolioRules;
  wizardBotBudget: number;
  newVentureFund: number;
  transactions: FinancialTransaction[];
  taxGuruReport: TaxGuruReport | null;
  onRunTaxGuru: () => void;
  cfoReport: CfoReport | null;
  onRunCfoAnalysis: () => void;
  autoTraderState: AutoTraderState;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ agents, rules, wizardBotBudget, newVentureFund, transactions, taxGuruReport, onRunTaxGuru, cfoReport, onRunCfoAnalysis, autoTraderState }) => {
  const [activeTab, setActiveTab] = useState<'crew' | 'summary' | 'tax' | 'debt'>('summary');
  
  // Debt State
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

  const financials = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyTransactions = transactions.filter(tx => new Date(tx.timestamp) > oneWeekAgo);

    const incomeThisWeek = weeklyTransactions
      .filter(tx => tx.type === 'revenue')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const incomeBySource = {
      SaaS: weeklyTransactions.filter(tx => tx.source === 'SaaS' && tx.type === 'revenue').reduce((sum, tx) => sum + tx.amount, 0),
      Reports: weeklyTransactions.filter(tx => tx.source === 'Reports' && tx.type === 'revenue').reduce((sum, tx) => sum + tx.amount, 0),
      Trading: weeklyTransactions.filter(tx => tx.source === 'Trading' && tx.type === 'revenue').reduce((sum, tx) => sum + tx.amount, 0),
    };
    
    return { incomeThisWeek, incomeBySource };
  }, [transactions]);

  // Debt Calculation
  const debtFreedomDate = useMemo(() => {
      if (totalDebt <= 0 || monthlyContribution <= 0) return null;
      const months = Math.ceil(totalDebt / monthlyContribution);
      const date = new Date();
      date.setMonth(date.getMonth() + months);
      return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }, [totalDebt, monthlyContribution]);


  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderSummary = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-gray-300">Income This Week</h4>
          <p className="text-6xl font-bold text-green-400 my-2">{formatCurrency(financials.incomeThisWeek)}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 flex items-center"><Bot size={14} className="mr-2" /> SaaS Income</h3>
                <p className="text-3xl font-bold text-green-400">{formatCurrency(financials.incomeBySource.SaaS)}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 flex items-center"><FileText size={14} className="mr-2" /> Report Sales</h3>
                <p className="text-3xl font-bold text-green-400">{formatCurrency(financials.incomeBySource.Reports)}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 flex items-center"><Repeat size={14} className="mr-2" /> Trading PNL</h3>
                <p className="text-3xl font-bold text-green-400">{formatCurrency(financials.incomeBySource.Trading)}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-700/50">
                <h3 className="text-sm font-medium text-gray-400 flex items-center"><BrainCircuit size={14} className="mr-2" /> Kageyoshi's Fund</h3>
                <p className="text-3xl font-bold text-cyan-400">{formatCurrency(rules.autonomousVentureFund)}</p>
            </div>
        </div>
        <GoalTracker currentProfit={financials.incomeThisWeek} goal={rules.financialGoal} history={rules.goalHistory}/>
        <p className="text-xs text-gray-500 text-center">* Financial data is simulated based on task completions and portfolio commands.</p>
    </div>
  );

  const renderDebtDestroyer = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
                  <Shield size={24} className="mr-3 text-red-500"/>
                  DEBT ANNIHILATION PROTOCOL
              </h3>
              <p className="text-sm text-gray-400 max-w-xl mx-auto">
                  "We do not manage debt. We destroy it." - Kageyoshi.
                  <br/>Enter your numbers. I will calculate the path to total liberation.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                  <h4 className="font-semibold text-white mb-4">Input Liabilities</h4>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Total Debt Balance</label>
                          <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <input 
                                type="number" 
                                value={totalDebt}
                                onChange={e => setTotalDebt(Number(e.target.value))}
                                className="w-full bg-black/40 border border-gray-700 rounded px-4 py-2 pl-8 text-white font-mono focus:border-red-500 transition-colors"
                                placeholder="0.00"
                              />
                          </div>
                      </div>
                       <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Monthly Paydown Budget</label>
                          <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <input 
                                type="number" 
                                value={monthlyContribution}
                                onChange={e => setMonthlyContribution(Number(e.target.value))}
                                className="w-full bg-black/40 border border-gray-700 rounded px-4 py-2 pl-8 text-white font-mono focus:border-green-500 transition-colors"
                                placeholder="0.00"
                              />
                          </div>
                          <p className="text-xs text-green-400 mt-1 flex items-center">
                              <Zap size={10} className="mr-1"/> Active Income from Hive: {formatCurrency(financials.incomeThisWeek)}/wk
                          </p>
                      </div>
                  </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600 flex flex-col justify-center items-center text-center">
                  {debtFreedomDate ? (
                      <>
                        <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Projected Freedom Date</h4>
                        <div className="text-4xl font-bold text-green-400 mb-2 flex items-center">
                            <Calendar size={32} className="mr-3 text-white"/>
                            {debtFreedomDate}
                        </div>
                        <p className="text-xs text-gray-500">
                            If we maintain this trajectory, the shackles break on this day.
                        </p>
                        <div className="w-full bg-gray-700 h-4 rounded-full mt-6 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-500 opacity-50"></div>
                             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white tracking-widest">
                                 TARGET LOCKED
                             </div>
                        </div>
                      </>
                  ) : (
                      <div className="text-gray-500">
                          <Target size={48} className="mx-auto mb-2 opacity-50"/>
                          <p>Enter your debt data to calculate the strike solution.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">CFO Financial Command</h3>
          <p className="text-sm text-gray-400">
            Live financial performance and debt annihilation strategies.
          </p>
        </div>
         <div className="flex items-center space-x-1 bg-gray-900/50 p-1 rounded-lg">
             <button onClick={() => setActiveTab('summary')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${activeTab === 'summary' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                <Info size={14} className="mr-2"/>Summary
            </button>
            <button onClick={() => setActiveTab('debt')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${activeTab === 'debt' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                <TrendingDown size={14} className="mr-2"/>Debt Destroyer
            </button>
            <button onClick={() => setActiveTab('crew')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${activeTab === 'crew' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                <BrainCircuit size={14} className="mr-2"/>Financial Crew
            </button>
            <button onClick={() => setActiveTab('tax')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${activeTab === 'tax' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                <FileText size={14} className="mr-2"/>Tax Hub
            </button>
        </div>
      </div>

      {activeTab === 'summary' && renderSummary()}
      {activeTab === 'debt' && renderDebtDestroyer()}
      {activeTab === 'crew' && (
        <FinancialCrewDashboard 
          taxGuruReport={taxGuruReport}
          onRunTaxGuru={onRunTaxGuru}
          cfoReport={cfoReport}
          onRunCfoAnalysis={onRunCfoAnalysis}
          autoTraderState={autoTraderState}
        />
      )}
      {activeTab === 'tax' && <TaxHub transactions={transactions} taxGuruReport={taxGuruReport} onRunTaxGuru={onRunTaxGuru} />}
    </div>
  );
};

export default FinancialDashboard;
