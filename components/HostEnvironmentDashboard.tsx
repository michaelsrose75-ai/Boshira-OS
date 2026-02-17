
import React from 'react';
import type { HostEnvironment } from '../types';
import { HardDrive, Cpu, MemoryStick, Cog, Info, Zap, Route, Globe, Shield, Clock, Server, Database, Container, Network, MonitorPlay, BrainCircuit } from 'lucide-react';

interface HostEnvironmentDashboardProps {
  environment: HostEnvironment;
  onUpdate: (env: HostEnvironment) => void;
}

const HostEnvironmentDashboard: React.FC<HostEnvironmentDashboardProps> = ({ environment, onUpdate }) => {
    
  const handleInputChange = (field: keyof HostEnvironment, value: string) => {
    onUpdate({ ...environment, [field]: value });
  };

  const toTitleCase = (str: string) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
          <div>
             <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <HardDrive size={22} className="mr-3 text-indigo-400" />
                Host Environment & Neural Core
            </h3>
            <p className="text-sm text-gray-400">
                The physical and digital substrate of the Hive.
            </p>
          </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {/* ACTIVE NEURAL CORES (FREE/NATIVE) */}
           <div className="bg-indigo-900/20 border border-indigo-500/50 p-4 rounded-lg">
               <h5 className="font-bold text-white mb-3 flex items-center"><BrainCircuit size={18} className="mr-2 text-cyan-400"/>Active Neural Cores</h5>
               <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm bg-black/40 p-2 rounded border border-indigo-500/30">
                       <span className="text-gray-300">Logic Engine</span>
                       <span className="font-mono font-bold text-green-400">Gemini 2.5 Flash</span>
                   </div>
                   <div className="flex justify-between items-center text-sm bg-black/40 p-2 rounded border border-indigo-500/30">
                       <span className="text-gray-300">Info Uplink</span>
                       <span className="font-mono font-bold text-green-400">Google Search Grounding</span>
                   </div>
                   <div className="flex justify-between items-center text-sm bg-black/40 p-2 rounded border border-indigo-500/30">
                       <span className="text-gray-300">Cost Basis</span>
                       <span className="font-mono font-bold text-green-400">$0.00 / Free Tier</span>
                   </div>
               </div>
           </div>

            {/* PHYSICAL HARDWARE */}
           <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
               <h5 className="font-bold text-white mb-3 flex items-center"><Cpu size={18} className="mr-2 text-gray-400"/>RoseWood Hardware</h5>
               <div className="space-y-2">
                   {Object.entries(environment).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 capitalize">{key}</span>
                        <span className={`font-mono ${key === 'gpu' ? 'text-green-300 font-bold' : 'text-gray-300'}`}>{value}</span>
                    </div>
                    ))}
               </div>
           </div>
       </div>

       <div className="bg-black/30 border border-gray-700 p-4 rounded-lg">
            <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-indigo-400" />
                <div>
                    <strong className="font-bold text-indigo-300">System Architect's Note</strong>
                    <p className="text-sm text-gray-400 mt-1">
                        The Hive is currently operating on the <strong>Gemini 2.5</strong> architecture with native <strong>Google Search</strong> integration. You do not need external keys for general intelligence or web research. The additional keys (Replicate, xAI) are strictly optional upgrades for specialized media generation or social listening.
                    </p>
                </div>
            </div>
      </div>
    </div>
  );
};

export default HostEnvironmentDashboard;
