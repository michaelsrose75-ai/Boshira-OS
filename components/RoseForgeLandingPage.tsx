import React, { useEffect, useState } from 'react';
import { Power, ShieldCheck, Terminal, Cpu, Activity } from 'lucide-react';
import type { LabView } from '../types';

interface RoseForgeLandingPageProps {
  setActiveView: (view: 'generator' | 'saved' | 'development' | 'command_center' | 'engineering_lab' | 'war_room' | 'day_zero') => void;
  setEngineeringLabTab: (tab: LabView) => void;
}

const RoseForgeLandingPage: React.FC<RoseForgeLandingPageProps> = ({ setActiveView, setEngineeringLabTab }) => {
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          setBootStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 600);
      return () => clearInterval(interval);
  }, []);

  const handleInitialize = () => {
      setActiveView('command_center');
  };

  const steps = [
      { text: "Initializing Kageyoshi Kernel...", icon: <Cpu size={16} /> },
      { text: "Mounting Anchor Ring Memory...", icon: <ShieldCheck size={16} /> },
      { text: "Calibrating Scout Entropy Sensors...", icon: <Activity size={16} /> },
      { text: "Establishing Neural Link...", icon: <Terminal size={16} /> },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 text-center">
        <div className="relative z-10">
            {/* Hexagon Core Animation */}
            <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                 <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-spin-slow"></div>
                 <div className="absolute inset-2 border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                 <Power size={48} className="text-cyan-400 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tighter font-heading">
                KAGEYOSHI <span className="text-cyan-400">v3</span>
            </h1>
            <p className="text-lg text-cyan-900/80 font-mono tracking-[0.5em] mb-12">PHOENIX ARCHITECTURE</p>
            
            <div className="w-80 mx-auto text-left space-y-3 mb-12 font-mono text-xs">
                {steps.map((step, i) => (
                    <div key={i} className={`flex items-center space-x-3 transition-all duration-500 ${bootStep >= i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <span className={bootStep > i ? 'text-green-400' : 'text-cyan-400'}>
                            {bootStep > i ? '[OK]' : '...'}
                        </span>
                        <span className="text-gray-400">{step.text}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleInitialize}
                disabled={bootStep < 4}
                className={`group relative px-8 py-4 bg-transparent overflow-hidden rounded-none transition-all duration-300 ${bootStep < 4 ? 'opacity-50 cursor-wait' : 'opacity-100 cursor-pointer hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]'}`}
            >
                <div className="absolute inset-0 w-full h-full border border-cyan-500/50"></div>
                <div className="absolute inset-0 w-0 bg-cyan-500/20 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                
                <span className="relative flex items-center font-bold text-cyan-400 tracking-widest text-lg group-hover:text-white">
                    ENGAGE SYSTEM
                    <ChevronsRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
            
            <p className="mt-8 text-[10px] text-gray-600 font-mono">
                SECURE CONNECTION // ENCRYPTED END-TO-END
            </p>
        </div>
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
    </div>
  );
};

// Missing Icon import
import { ChevronsRight } from 'lucide-react';

export default RoseForgeLandingPage;