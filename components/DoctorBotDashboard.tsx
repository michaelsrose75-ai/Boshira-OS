
import React, { useState } from 'react';
import type { DoctorBotReport, Idea, WarGameReport } from '../types';
import { HeartPulse, Loader as LoaderIcon, AlertTriangle, CheckCircle, Swords, TrendingUp, ShieldAlert, ListChecks } from 'lucide-react';
import Loader from './Loader';

interface DoctorBotDashboardProps {
  onRunDoctorBotProtocol: () => Promise<void>;
  doctorBotReport: DoctorBotReport | null;
  agents: Idea[];
  onRunWarGame: (agentId: string) => void;
  warGameReport: WarGameReport | null;
}

const DoctorBotDashboard: React.FC<DoctorBotDashboardProps> = ({ onRunDoctorBotProtocol, doctorBotReport, agents, onRunWarGame, warGameReport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warGameAgentId, setWarGameAgentId] = useState<string>('');

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);
    try {
        await onRunDoctorBotProtocol();
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Diagnostics failed.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleWarGame = () => {
    if (warGameAgentId) {
        onRunWarGame(warGameAgentId);
    }
  };

  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h4 className="text-lg font-bold text-white">Doctor Bot (Fleet Diagnostics)</h4>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                 <select 
                    value={warGameAgentId} 
                    onChange={(e) => setWarGameAgentId(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white text-xs rounded p-2 focus:ring-1 focus:ring-indigo-500 w-full sm:w-auto"
                >
                    <option value="">Select Agent for War Game...</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>

                <button 
                    onClick={handleWarGame}
                    disabled={!warGameAgentId}
                    className="btn-primary text-sm flex items-center bg-red-900/30 border-red-500/50 text-red-300 hover:bg-red-800/50 w-full sm:w-auto justify-center"
                >
                    <Swords size={16} className="mr-2"/>
                    Run War Game Simulation
                </button>

                <button 
                    onClick={handleRun} 
                    disabled={isLoading}
                    className="btn-primary text-sm flex items-center w-full sm:w-auto justify-center"
                >
                    {isLoading ? <LoaderIcon className="animate-spin mr-2" size={16}/> : <HeartPulse size={16} className="mr-2"/>}
                    {isLoading ? 'Diagnosing...' : 'Run Diagnostics'}
                </button>
            </div>
        </div>
            <p className="text-sm text-gray-400 mb-4">Performs a health check on all active agents, identifying strategic weaknesses and recommending treatments.</p>
            
            {isLoading && !doctorBotReport && <div className="py-10"><Loader /></div>}

            {error && (
                <div className="bg-red-900/30 border border-red-600 text-red-200 p-4 rounded-lg flex items-start mb-4">
                    <AlertTriangle size={20} className="mr-3 flex-shrink-0 mt-0.5"/>
                    <div>
                        <h5 className="font-bold">Diagnostic Failure</h5>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {warGameReport && (
                <div className="bg-gray-900/50 p-6 rounded-lg border border-red-500/30 mb-6 animate-fade-in">
                    <h5 className="font-bold text-white mb-4 flex items-center"><Swords size={18} className="mr-2 text-red-400"/>War Game Results</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-black/30 p-3 rounded border border-gray-700">
                            <p className="text-xs text-gray-400 uppercase">Simulated Profit</p>
                            <p className={`text-xl font-bold ${warGameReport.simulatedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${warGameReport.simulatedProfit.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h6 className="font-semibold text-red-300 text-sm mb-2 flex items-center"><ShieldAlert size={14} className="mr-2"/>Potential Failures</h6>
                            <ul className="space-y-1">
                                {warGameReport.potentialFailures.map((fail, i) => (
                                    <li key={i} className="text-xs text-gray-300 bg-red-900/20 p-2 rounded border border-red-900/50">{fail}</li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h6 className="font-semibold text-green-300 text-sm mb-2 flex items-center"><ListChecks size={14} className="mr-2"/>Strategic Recommendations</h6>
                            <ul className="space-y-1">
                                {warGameReport.recommendations.map((rec, i) => (
                                    <li key={i} className="text-xs text-gray-300 bg-green-900/20 p-2 rounded border border-green-900/50">{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {doctorBotReport && !isLoading && (
                <div className="space-y-2 animate-fade-in">
                    {doctorBotReport.diagnostics.length > 0 ? doctorBotReport.diagnostics.map((d, i) => (
                    <div key={i} className={`p-3 rounded-md border-l-4 bg-gray-900/50 ${d.urgency === 'high' ? 'border-red-500' : d.urgency === 'medium' ? 'border-yellow-500' : 'border-blue-500'}`}>
                        <div className="flex justify-between">
                            <p className="font-semibold text-white">{d.agentTitle}</p>
                            <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${d.urgency === 'high' ? 'bg-red-900 text-red-300' : d.urgency === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'}`}>
                                {d.urgency} Priority
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1"><strong className="text-gray-400">Diagnosis:</strong> {d.diagnosis}</p>
                        <p className="text-sm text-gray-300 mt-1"><strong className="text-gray-400">Rx:</strong> {d.recommendedTreatment}</p>
                    </div>
                    )) : (
                        <div className="text-center bg-green-900/20 border border-green-600/50 p-6 rounded-lg">
                            <CheckCircle size={32} className="text-green-500 mx-auto mb-2"/>
                            <p className="text-green-400 font-bold">All Systems Nominal</p>
                            <p className="text-sm text-green-300/80">No critical issues detected in active fleet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
  );
};

export default DoctorBotDashboard;
