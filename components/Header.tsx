
import React, { useState } from 'react';
import { Target, Bot, Bookmark, ChevronsRight, Server, Lock, Trophy, Flag, Eye, User as FounderIcon, BarChart, Users, DollarSign, TrendingUp, Orbit, Shield, Cpu, Zap, Radio, Film, CheckCircle, AlertTriangle, Globe, Database } from 'lucide-react';
import type { PortfolioRules } from '../types';

interface HeaderProps {
  activeView: 'generator' | 'saved' | 'development' | 'command_center' | 'engineering_lab' | 'dynasty' | 'war_room' | 'day_zero';
  setActiveView: (view: 'generator' | 'saved' | 'development' | 'command_center' | 'engineering_lab' | 'dynasty' | 'war_room' | 'day_zero') => void;
  savedIdeasCount: number;
  developingIdeasCount: number;
  portfolioRules: PortfolioRules;
}

const Header: React.FC<HeaderProps> = ({ 
    activeView, 
    setActiveView, 
    savedIdeasCount, 
    developingIdeasCount,
    portfolioRules
}) => {
  const [isModulesOpen, setIsModulesOpen] = useState(false);

  const navButtonClasses = "relative group px-4 py-2 flex items-center justify-center transition-all duration-300";
  
  const getActiveStyle = (isActive: boolean) => isActive 
    ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-indigo-400 after:shadow-[0_0_10px_indigo]" 
    : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]";

  // Check credential status
  const checkCred = (service: string) => portfolioRules.credentials.some(c => c.service === service && c.apiKey);
  
  const modules = [
      { name: 'Gemini 2.5 (Brain)', status: true, icon: <Cpu size={14}/>, id: 'gemini', native: true },
      { name: 'Google Search (Info)', status: true, icon: <Globe size={14}/>, id: 'google_search', native: true },
      { name: 'Visual Cortex (Replicate)', status: checkCred('REPLICATE_API_TOKEN'), icon: <Film size={14}/>, id: 'replicate', native: false },
      { name: 'Intel Feed (xAI)', status: checkCred('XAI_API_KEY'), icon: <Radio size={14}/>, id: 'xai', native: false },
      { name: 'Deep Logic (DeepSeek)', status: checkCred('DEEPSEEK_API_KEY'), icon: <Zap size={14}/>, id: 'deepseek', native: false },
  ];

  // Calculate status based on NATIVE + Optional
  // If native are on, system is 'Online' but maybe 'Partial' if optional are missing
  const allModulesOnline = modules.every(m => m.status);
  const coreOnline = modules.filter(m => m.native).every(m => m.status);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800 shadow-2xl h-24">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: Brand & Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center group cursor-pointer" onClick={() => setActiveView('generator')}>
             <div className="relative w-10 h-10 flex items-center justify-center border border-indigo-500/30 bg-indigo-900/20 rounded-full mr-3 group-hover:border-indigo-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-500">
                <Shield className="w-6 h-6 text-indigo-400" />
             </div>
             <div>
                 <h1 className="text-xl font-bold text-white tracking-widest font-heading leading-none">KAGEYOSHI</h1>
                 <p className="text-[10px] text-indigo-500 font-mono tracking-[0.3em] opacity-70">HIVE MIND v3.0</p>
             </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 border-l border-gray-700 pl-6">
              <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
                  <span className="text-xs font-mono text-green-500 font-bold">SYSTEM ONLINE</span>
              </div>

              {/* Modules Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsModulesOpen(true)}
                onMouseLeave={() => setIsModulesOpen(false)}
              >
                   <div className="flex items-center space-x-2 cursor-help">
                      <div className={`w-2 h-2 rounded-full ${allModulesOnline ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : 'bg-green-500'}`}></div>
                      <span className={`text-xs font-mono font-bold ${allModulesOnline ? 'text-cyan-500' : 'text-gray-400 hover:text-white transition-colors'}`}>MODULES</span>
                   </div>
                   
                   {isModulesOpen && (
                       <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl p-3 z-50 animate-fade-in">
                           <h5 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-700 pb-1">Subsystem Diagnostics</h5>
                           <div className="space-y-2">
                               {modules.map(mod => (
                                   <div key={mod.id} className="flex items-center justify-between text-xs">
                                       <div className="flex items-center text-gray-300">
                                           <span className="mr-2 text-indigo-400">{mod.icon}</span>
                                           {mod.name}
                                       </div>
                                       {mod.status ? (
                                           <span className="flex items-center text-green-400 font-bold">
                                               <CheckCircle size={10} className="mr-1"/> 
                                               {mod.native ? 'NATIVE' : 'ONLINE'}
                                           </span>
                                       ) : (
                                           <span className="flex items-center text-gray-500 font-bold">
                                               <AlertTriangle size={10} className="mr-1"/> OPTIONAL
                                           </span>
                                       )}
                                   </div>
                               ))}
                           </div>
                           {!allModulesOnline && (
                               <div className="mt-3 pt-2 border-t border-gray-700 text-center">
                                   <button 
                                    onClick={() => setActiveView('command_center')}
                                    className="text-[10px] text-cyan-400 hover:text-white underline"
                                   >
                                       Equip Optional Keys
                                   </button>
                               </div>
                           )}
                       </div>
                   )}
              </div>

               <div className="flex items-center space-x-2 border-l border-gray-700 pl-4" title="Kageyoshi Honor (Reputation Score)">
                  <Trophy size={14} className="text-yellow-500" />
                  <span className="text-xs font-mono text-yellow-500 font-bold tracking-wider">HONOR: {portfolioRules.kageyoshiHonor}</span>
               </div>
               
               {/* Persistence Indicator */}
               <div className="flex items-center space-x-2 border-l border-gray-700 pl-4" title="Data is locally persisted">
                  <Database size={14} className="text-blue-400" />
                  <span className="text-xs font-mono text-blue-400 font-bold tracking-wider">MEMORY SECURED</span>
               </div>
          </div>
        </div>
        
        {/* Center: Navigation Deck */}
        <nav className="hidden lg:flex items-center space-x-1 bg-gray-900/50 border border-gray-700/50 rounded-full px-6 py-2">
            <button onClick={() => setActiveView('command_center')} className={`${navButtonClasses} ${getActiveStyle(activeView === 'command_center')}`}>
                <Server size={20} className="mr-2"/>
                <span className="font-bold text-base tracking-wider">COMMAND</span>
            </button>
            <div className="w-px h-6 bg-gray-700 mx-3"></div>
            <button onClick={() => setActiveView('engineering_lab')} className={`${navButtonClasses} ${getActiveStyle(activeView === 'engineering_lab')}`}>
                <Bot size={20} className="mr-2"/>
                <span className="font-bold text-base tracking-wider">ENG. LAB</span>
            </button>
            <div className="w-px h-6 bg-gray-700 mx-3"></div>
            <button onClick={() => setActiveView('dynasty')} className={`${navButtonClasses} ${getActiveStyle(activeView === 'dynasty')}`}>
                <Shield size={20} className="mr-2"/>
                <span className="font-bold text-base tracking-wider">DYNASTY</span>
            </button>
            <div className="w-px h-6 bg-gray-700 mx-3"></div>
             <button onClick={() => setActiveView('development')} className={`${navButtonClasses} ${getActiveStyle(activeView === 'development')}`}>
                <TrendingUp size={20} className="mr-2"/>
                <span className="font-bold text-base tracking-wider">FLEET <span className="ml-1 text-xs opacity-70">[{developingIdeasCount}]</span></span>
            </button>
            <div className="w-px h-6 bg-gray-700 mx-3"></div>
            <button onClick={() => setActiveView('day_zero')} className={`${navButtonClasses} ${getActiveStyle(activeView === 'day_zero')}`}>
                <Flag size={20} className="mr-2"/>
                <span className="font-bold text-base tracking-wider">DAY ZERO</span>
            </button>
        </nav>

        {/* Right: Profile */}
        <div className="flex items-center space-x-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                 <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                     <FounderIcon size={24} className="text-gray-300" />
                 </div>
             </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
