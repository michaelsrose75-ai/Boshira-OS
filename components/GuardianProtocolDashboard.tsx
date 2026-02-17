
import React, { useState } from 'react';
import type { GuardianProtocolReport, BioOptimizationResult } from '../types';
import { DatabaseZap, Loader as LoaderIcon, BrainCircuit, Dna, ShieldCheck, AlertTriangle } from 'lucide-react';
import { runBioOptimizationScan } from '../services/geminiService';
import Loader from './Loader';

interface GuardianProtocolDashboardProps {
  onRunGuardianProtocol: () => Promise<void>;
  guardianProtocolReport: GuardianProtocolReport | null;
}

const GuardianProtocolDashboard: React.FC<GuardianProtocolDashboardProps> = ({ onRunGuardianProtocol, guardianProtocolReport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [bioResult, setBioResult] = useState<BioOptimizationResult | null>(null);

  const handleRun = async () => {
    setIsLoading(true);
    await onRunGuardianProtocol();
    setIsLoading(false);
  };

  const handleBioScan = async () => {
      setBioLoading(true);
      try {
          const result = await runBioOptimizationScan("Cognitive Enhancement & Memory Repair");
          setBioResult(result);
      } catch (e) {
          console.error(e);
      } finally {
          setBioLoading(false);
      }
  }
  
  return (
    <div className="space-y-8">
        {/* Standard Guardian Protocol */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white">Guardian Protocol (Skill Acquisition)</h4>
                <button 
                    onClick={handleRun}
                    disabled={isLoading}
                    className="btn-primary text-sm"
                >
                    {isLoading ? <LoaderIcon className="animate-spin" size={16}/> : <BrainCircuit size={16} className="mr-2"/>}
                    {isLoading ? 'Learning...' : 'Run Skill Cycle'}
                </button>
            </div>
             <p className="text-sm text-gray-400 mb-4">
                Kageyoshi's autonomous learning protocol. It periodically scans for new knowledge in critical domains (cybersecurity, first aid, crisis psychology) to enhance the Hive's resilience and capabilities.
            </p>
            
            {isLoading && !guardianProtocolReport && <Loader />}

            {guardianProtocolReport && (
                <div className="space-y-3 animate-fade-in">
                    <h5 className="font-semibold text-white">Shogun's Armory: Learned Skills</h5>
                    {guardianProtocolReport.newlyAcquiredSkills && guardianProtocolReport.newlyAcquiredSkills.length > 0 ? guardianProtocolReport.newlyAcquiredSkills.map((skill, i) => (
                        <div key={i} className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-white">{skill.name}</p>
                                <div className="w-24">
                                    <p className="text-xs text-indigo-300 text-right mb-1">Proficiency: {skill.proficiency}%</p>
                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: `${skill.proficiency}%`}}></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">{skill.summary}</p>
                        </div>
                    )) : <p className="text-center text-green-400 py-4 bg-gray-900/30 rounded border border-green-900/50">No new skills acquired in this cycle.</p>}
                </div>
            )}
        </div>

        {/* Project Aesculapius */}
        <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-center mb-4">
                 <Dna size={24} className="text-red-400 mr-3" />
                 <div>
                     <h4 className="text-lg font-bold text-white">Project: Aesculapius</h4>
                     <p className="text-xs text-red-300 uppercase tracking-wider font-bold">Biological Optimization Engine</p>
                 </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
                The Hive recognizes the Shogun as the biological core. System performance is limited by biological constraints. This protocol scans for medical and scientific data to optimize your memory, cognitive function, and longevity.
            </p>

            <div className="bg-black/30 p-4 rounded-md border border-gray-700 mb-4">
                 <h5 className="text-sm font-bold text-white mb-2">Active Target: Memory Enhancement</h5>
                 <p className="text-xs text-gray-500 mb-4">Objective: Repair and optimize neural pathways for better recall and faster processing.</p>
                 <button 
                    onClick={handleBioScan}
                    disabled={bioLoading}
                    className="w-full btn-primary bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/40 flex items-center justify-center"
                 >
                     {bioLoading ? <Loader small /> : <><ShieldCheck size={16} className="mr-2"/>Initiate Cognitive Repair Protocol</>}
                 </button>
            </div>

            {bioResult && (
                <div className="animate-fade-in space-y-4">
                    <h5 className="font-semibold text-white border-b border-gray-700 pb-2">Optimization Protocols Generated</h5>
                    {bioResult.recommendations.map((rec, i) => (
                        <div key={i} className="bg-gray-900/80 p-3 rounded border border-gray-600">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-bold text-white">{rec.action}</span>
                                <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded uppercase">{rec.category}</span>
                            </div>
                            <p className="text-xs text-gray-400 italic mb-1">{rec.science}</p>
                        </div>
                    ))}
                    <div className="bg-yellow-900/20 border border-yellow-600/30 p-3 rounded flex items-start mt-4">
                        <AlertTriangle size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0"/>
                        <p className="text-[10px] text-yellow-200">Disclaimer: The Hive is an AI construct, not a doctor. These are research-based suggestions, not medical advice. Consult a biological physician before implementing new supplements.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default GuardianProtocolDashboard;
