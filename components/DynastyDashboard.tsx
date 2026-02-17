
import React, { useState } from 'react';
import { ShieldCheck, Target, BrainCircuit, Dna, Scale, Scroll, Globe, Lock, Hammer, PenTool } from 'lucide-react';
import type { SimulationScenario, Simulation } from '../types';
import Loader from './Loader';

interface DynastyDashboardProps {
  onRunSimulation: (scenario: SimulationScenario) => Promise<Simulation>;
  onGenerateCopyrightStrategy: () => Promise<void>;
}

const DynastyDashboard: React.FC<DynastyDashboardProps> = ({ onRunSimulation, onGenerateCopyrightStrategy }) => {
  const [isLoading, setIsLoading] = useState(false);

  const coreDirectives = [
    "The Shogun's Mandate: All actions must be legal and ethical.",
    "Suspicious strategies must undergo a full legal and ethical stress test by the Mind Hive before execution.",
    "Protect the 'Rose Forge' IP at all costs. Copyright everything.",
    "Prioritize long-term legacy over short-term risky gains."
  ];

  const handleGenerateStrategy = async () => {
      setIsLoading(true);
      await onGenerateCopyrightStrategy();
      setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center font-heading">
            <ShieldCheck size={40} className="mr-4 text-indigo-500"/>
            Dynasty Protocol
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            The Fortress of the Rose Legacy. Here, we secure the empire's legal standing, define its moral code, and plan for generational wealth and craft.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Master of Jurisprudence */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)] lg:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Scale size={24} className="mr-3 text-indigo-400"/>
                  Master of Jurisprudence
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                  My primary function is to protect the Hive from external legal threats. I specialize in Copyright Law, IP Protection, and Regulatory Compliance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-md border border-gray-700">
                      <h4 className="font-semibold text-white mb-2 flex items-center"><Scroll size={16} className="mr-2 text-yellow-400"/>IP Defense Strategy</h4>
                      <p className="text-xs text-gray-400 mb-4">Generate a comprehensive legal shield for our digital assets, focusing on copyrighting AI-assisted works.</p>
                      <button 
                        onClick={handleGenerateStrategy}
                        disabled={isLoading}
                        className="w-full btn-primary flex items-center justify-center"
                      >
                          {isLoading ? <Loader small /> : <><ShieldCheck size={16} className="mr-2"/>Generate Protection Strategy</>}
                      </button>
                  </div>
                  
                  <div className="bg-black/40 p-4 rounded-md border border-gray-700">
                      <h4 className="font-semibold text-white mb-2 flex items-center"><Globe size={16} className="mr-2 text-green-400"/>Jurisdictional Watch</h4>
                      <div className="flex justify-between items-center text-sm text-gray-300 bg-gray-800/50 p-2 rounded">
                          <span>Active Jurisdiction:</span>
                          <span className="font-mono text-indigo-300 font-bold">North Carolina, USA</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">
                          *Tax laws and compliance checks are optimized for NC state regulations.
                      </p>
                  </div>
              </div>
          </div>
          
          {/* The Atelier (Workshop) */}
          <div className="bg-amber-900/20 p-6 rounded-lg border border-amber-700/30 lg:col-span-1">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Hammer size={24} className="mr-3 text-amber-500"/>
                  The Workshop
              </h3>
               <p className="text-sm text-gray-400 mb-6">
                  "Project Artisan" - The Shogun's physical legacy. The Hive secures the funds; you build with your hands.
              </p>
              <div className="bg-black/30 p-4 rounded-md border border-amber-800/50 mb-4">
                   <h5 className="font-bold text-amber-200 text-sm mb-2">Active Hobby Targets</h5>
                   <ul className="space-y-2 text-xs text-gray-300">
                       <li className="flex items-center"><PenTool size={12} className="mr-2"/>Woodworking / Joinery</li>
                       <li className="flex items-center"><PenTool size={12} className="mr-2"/>Electronics Tinkering</li>
                       <li className="flex items-center"><PenTool size={12} className="mr-2"/>3D Printing / Design</li>
                   </ul>
              </div>
              <div className="text-center">
                  <p className="text-xs text-amber-500 italic">"The mind designs, the machine funds, the hand builds."</p>
              </div>
          </div>

          {/* Legacy Core */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600 lg:col-span-3">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Dna size={24} className="mr-3 text-cyan-400"/>
                  Legacy Core (The Constitution)
              </h3>
               <p className="text-sm text-gray-400 mb-6">
                  The immutable laws that govern the Hive's growth. These prevents the AI from straying from the Shogun's path.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coreDirectives.map((directive, i) => (
                      <div key={i} className="flex items-start p-3 bg-gray-800/50 rounded-md border border-gray-700/50">
                          <Lock size={16} className="mr-3 text-red-400 mt-1 flex-shrink-0"/>
                          <span className="text-sm text-gray-300">{directive}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default DynastyDashboard;
