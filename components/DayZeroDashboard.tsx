
import React, { useState, useEffect } from 'react';
import type { Idea, PortfolioRules } from '../types';
import { ShieldCheck, Target, Zap, DollarSign, Briefcase, Play, Bot, ShoppingCart, ArrowRight, Skull, Crosshair, ToggleRight, ToggleLeft, Film, BookOpen, Ghost, AlertCircle } from 'lucide-react';
import { generateDayZeroStrategies } from '../services/geminiService';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

interface DayZeroDashboardProps {
  onDeployStrategy: (idea: Idea) => void;
  rules: PortfolioRules;
  savedStrategies: Idea[];
  onStrategiesUpdate: (strategies: Idea[]) => void;
}

const DayZeroDashboard: React.FC<DayZeroDashboardProps> = ({ onDeployStrategy, rules, savedStrategies, onStrategiesUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Defaulting Ruthless Mode to false so user can see the options first as requested
  const [ruthlessMode, setRuthlessMode] = useState(false); 

  const handleSharkScan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await generateDayZeroStrategies();
      
      if (ruthlessMode && results.length > 0) {
          // RUTHLESS MODE: Pick the winner and deploy immediately
          const winner = results.reduce((prev, current) => 
              (prev.strategies[0].projectedProfit > current.strategies[0].projectedProfit) ? prev : current
          );
          
          // Small delay to let the user feel the "Scan" happening
          setTimeout(() => {
              onDeployStrategy(winner);
          }, 1000);
      } else {
          // MANUAL MODE: Save to persisted state
          onStrategiesUpdate(results);
      }

    } catch (e) {
      setError(e instanceof Error ? e.message : "The Shark Scan failed.");
    } finally {
      if (!ruthlessMode) setIsLoading(false);
      // If ruthless, we keep loading true briefly until view switch happens in parent
    }
  };
  
  const getArchetypeIcon = (title: string) => {
      if (title.includes("Showrunner")) return <Film size={32} className="text-red-500" />;
      if (title.includes("Alchemist")) return <BookOpen size={32} className="text-amber-400" />;
      if (title.includes("Ghost")) return <Ghost size={32} className="text-cyan-400" />;
      return <Bot size={32} className="text-gray-400" />;
  }
  
  const getArchetypeColor = (title: string) => {
      if (title.includes("Showrunner")) return 'red';
      if (title.includes("Alchemist")) return 'amber';
      if (title.includes("Ghost")) return 'cyan';
      return 'gray';
  }

  return (
    <div className="animate-fade-in p-4 max-w-7xl mx-auto">
      {/* Mission Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-white mb-4 font-heading tracking-tight">
            DAY <span className="text-red-500">ZERO</span> MOBILIZATION
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            The Entity is formed. The EIN is secured. Now we hunt. 
            <br/>Initialize the <strong className="text-white">Shark Protocol</strong> to identify the "Three Blades"—high-yield, zero-cost entry vectors.
        </p>
      </div>

      {/* Status Checks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg flex items-center justify-center space-x-4">
              <ShieldCheck size={32} className="text-green-400" />
              <div className="text-left">
                  <p className="text-xs text-green-300 font-bold tracking-wider">LEGAL ENTITY</p>
                  <p className="text-lg text-white font-bold">EIN SECURED</p>
              </div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-lg flex items-center justify-center space-x-4">
              <Briefcase size={32} className="text-yellow-400" />
              <div className="text-left">
                  <p className="text-xs text-yellow-300 font-bold tracking-wider">CAPITAL FLOWS</p>
                  <p className="text-lg text-white font-bold">BANK PENDING</p>
              </div>
          </div>
           <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg flex items-center justify-center space-x-4">
              <Skull size={32} className="text-red-400" />
              <div className="text-left">
                  <p className="text-xs text-red-300 font-bold tracking-wider">HUNTING MODE</p>
                  <p className="text-lg text-white font-bold">SHARK ACTIVE</p>
              </div>
          </div>
      </div>

      {/* The Trigger */}
      {savedStrategies.length === 0 && (
          <div className="flex flex-col items-center justify-center mb-12 space-y-6">
              
              {/* Ruthless Toggle */}
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => setRuthlessMode(!ruthlessMode)}
              >
                  {ruthlessMode ? <ToggleRight size={32} className="text-red-500" /> : <ToggleLeft size={32} className="text-gray-500" />}
                  <span className={`text-sm font-bold tracking-widest ${ruthlessMode ? 'text-red-400' : 'text-gray-500'}`}>
                      RUTHLESS AUTONOMY {ruthlessMode ? 'ENGAGED' : 'DISENGAGED'}
                  </span>
              </div>
              <p className="text-xs text-gray-500 max-w-md text-center">
                  {ruthlessMode 
                    ? "PROTOCOL WARNING: The Shark will automatically select and deploy the highest-profit strategy immediately. No manual approval required." 
                    : "Manual Mode: You will review the Three Blades before choosing which to train."}
              </p>

              <button 
                onClick={handleSharkScan}
                disabled={isLoading}
                className="group relative px-12 py-6 bg-transparent overflow-hidden rounded-none transition-all duration-300 hover:scale-105"
              >
                   <div className="absolute inset-0 w-full h-full border-2 border-red-500/50 bg-red-900/10"></div>
                   <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                   <span className="relative flex items-center font-bold text-2xl text-red-100 tracking-widest group-hover:text-white">
                        {isLoading ? <Loader small /> : <><Crosshair size={28} className="mr-3" /> INITIATE SHARK SCAN</>}
                   </span>
              </button>
          </div>
      )}

      {error && <div className="max-w-2xl mx-auto mb-8"><ErrorMessage message={error} /></div>}

      {/* Strategy Cards (Only shown if Ruthless Mode was OFF) */}
      {savedStrategies.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {savedStrategies.map((strategy, index) => {
                  const color = getArchetypeColor(strategy.title);
                  const borderColorClass = `border-${color}-500/50`;
                  const hoverBorderClass = `hover:border-${color}-400`;
                  const bgClass = `bg-${color}-900/20`;
                  const textClass = `text-${color}-400`;
                  const buttonClass = `hover:bg-${color}-600`;

                  return (
                    <div key={index} className={`bg-gray-900/80 border ${borderColorClass} rounded-xl overflow-hidden ${hoverBorderClass} transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group flex flex-col transform hover:-translate-y-2`}>
                        <div className="p-6 border-b border-gray-800 bg-black/40 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 p-2 ${bgClass} rounded-bl-lg`}>
                                <span className={`text-[10px] font-mono font-bold uppercase ${textClass}`}>Predator Class</span>
                            </div>
                            <div className="mb-4 flex justify-center">
                                <div className={`p-4 rounded-full border border-gray-700 bg-black/50`}>
                                    {getArchetypeIcon(strategy.title)}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 text-center">{strategy.title}</h3>
                            <p className="text-sm text-gray-400 text-center">{strategy.description}</p>
                        </div>
                        
                        <div className="p-6 flex-grow space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Est. Revenue</span>
                                <span className="font-mono font-bold text-green-400">${strategy.strategies[0].projectedProfit.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Startup Cost</span>
                                <span className="font-mono font-bold text-white">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Launch Velocity</span>
                                <span className="font-mono font-bold text-yellow-400">Immediate</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-800/50 border-t border-gray-800">
                            <button 
                                onClick={() => onDeployStrategy(strategy)}
                                className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center bg-white text-black ${buttonClass} hover:text-white transition-all uppercase tracking-wider`}
                            >
                                Enter Dojo & Train <ArrowRight size={16} className="ml-2"/>
                            </button>
                        </div>
                    </div>
                  );
              })}
          </div>
      )}

      {savedStrategies.length > 0 && (
          <div className="mt-8 text-center">
              <button 
                onClick={() => onStrategiesUpdate([])} // Clear strategies to re-scan
                className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center mx-auto"
              >
                  <AlertCircle size={14} className="mr-1.5"/>
                  Discard Results & Re-Initialize Scan
              </button>
          </div>
      )}
    </div>
  );
};

export default DayZeroDashboard;
