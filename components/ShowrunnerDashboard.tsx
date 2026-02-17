
import React, { useState, useEffect } from 'react';
import type { Product, VaultCredential, PortfolioRules } from '../types';
import { Film, Mic, Video, Upload, BarChart2, Play, Zap, Layers, Users, MousePointer, CheckCircle, DollarSign, PieChart, AlertTriangle, Calculator, BrainCircuit, Activity, RefreshCw, Scan, Clock, Lightbulb, Check } from 'lucide-react';
import Loader from './Loader';
import { usePersistentState } from '../utils/statePersistence';

interface ShowrunnerDashboardProps {
    products: Product[];
    onUpdateProduct: (product: Product) => void;
    onGenerateNextVideo: (seriesId: string) => Promise<void>;
    onGenerateVoiceover: (productId: string) => Promise<void>;
    credentials: VaultCredential[];
    portfolioRules: PortfolioRules;
}

const ShowrunnerDashboard: React.FC<ShowrunnerDashboardProps> = ({ 
    products, 
    onUpdateProduct, 
    onGenerateNextVideo, 
    onGenerateVoiceover,
    credentials,
    portfolioRules
}) => {
    const [activeProject, setActiveProject] = useState<string | null>(null);
    const [isGeneratingNext, setIsGeneratingNext] = useState<string | null>(null);
    const [voiceLoading, setVoiceLoading] = useState<string | null>(null);
    
    // Monetization Calculator State
    const [calcRevenue, setCalcRevenue] = useState<number>(1000);
    const [calcType, setCalcType] = useState<'long' | 'short' | 'super'>('long');

    // Training Loop State - PERSISTENT
    const [isTraining, setIsTraining] = usePersistentState<boolean>('showrunner_training_active', true);
    const [viralProficiency, setViralProficiency] = usePersistentState<number>('showrunner_viral_proficiency', 12);
    const [lastTrainingTime, setLastTrainingTime] = usePersistentState<number>('showrunner_last_training_time', Date.now());
    const [offlineGains, setOfflineGains] = useState<number>(0);

    const [trainingStep, setTrainingStep] = useState(0);

    // Filter products that are likely video series or content
    const videoProjects = products.filter(p => p.topic || p.seriesId);

    const titans = [
        { name: "MrBeast", trait: "Hyper-Pacing & Retention", color: "text-pink-500" },
        { name: "MagnatesMedia", trait: "Documentary Storytelling", color: "text-yellow-500" },
        { name: "LEMMiNO", trait: "Atmosphere & Mystery", color: "text-blue-400" },
        { name: "Fern", trait: "Visual Metaphor", color: "text-green-400" },
        { name: "SunnyV2", trait: "Hook Psychology", color: "text-red-500" },
    ];

    // Unlockable Insights based on Proficiency Score
    const learnedPatterns = [
        { score: 15, text: "The 3-Second Hook Rule", source: "MrBeast" },
        { score: 25, text: "Dynamic Audio Ducking", source: "Universal" },
        { score: 35, text: "The 'Open Loop' Narrative", source: "SunnyV2" },
        { score: 50, text: "Kinetic Typography Systems", source: "Fern" },
        { score: 65, text: "Color Grading for mood", source: "LEMMiNO" },
        { score: 80, text: "Algorithmic CTR Optimization", source: "Hive Mind" },
        { score: 95, text: "The 'God Tier' Thumbnail", source: "All Titans" },
    ];

    // Calculate Offline Gains on Mount
    useEffect(() => {
        const now = Date.now();
        const diffMinutes = (now - lastTrainingTime) / 1000 / 60;
        
        if (diffMinutes > 5 && isTraining) { // Only count if gone for more than 5 mins
            // Simulate learning rate: 0.05 points per minute approx
            const gained = Math.min(25, diffMinutes * 0.05); 
            const newScore = Math.min(99.9, viralProficiency + gained);
            
            if (gained > 0.1) {
                setOfflineGains(gained);
                setViralProficiency(newScore);
            }
        }
        setLastTrainingTime(now);
    }, []);

    // Active Training Loop
    useEffect(() => {
        let interval: any;
        if (isTraining) {
            interval = setInterval(() => {
                setTrainingStep(prev => (prev + 1) % titans.length);
                // Live training is slower visually, but persistent updates happen
                setViralProficiency(prev => Math.min(99.9, prev + 0.02));
                setLastTrainingTime(Date.now());
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isTraining, titans.length]);

    const handleGenerateNext = async (seriesId: string) => {
        setIsGeneratingNext(seriesId);
        try {
            await onGenerateNextVideo(seriesId);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingNext(null);
        }
    };

    const handleVoiceover = async (productId: string) => {
        setVoiceLoading(productId);
        try {
            await onGenerateVoiceover(productId);
        } catch (e) {
            console.error(e);
        } finally {
            setVoiceLoading(null);
        }
    };

    // Financial Logic
    const breakdown = React.useMemo(() => {
        let platformFee = 0;
        let creatorShare = 0;
        let taxHold = 0; // Estimated 20% for safe planning

        if (calcType === 'long') {
            platformFee = calcRevenue * 0.45; // YouTube takes 45%
            creatorShare = calcRevenue * 0.55;
        } else if (calcType === 'short') {
            platformFee = calcRevenue * 0.55; // YouTube takes 55% (covers music)
            creatorShare = calcRevenue * 0.45;
        } else {
            platformFee = calcRevenue * 0.30; // Standard 30% for Supers
            creatorShare = calcRevenue * 0.70;
        }

        // Safety Tax Estimate (Self-Employment + Income)
        taxHold = creatorShare * 0.25; 
        const netProfit = creatorShare - taxHold;

        return { platformFee, creatorShare, taxHold, netProfit };
    }, [calcRevenue, calcType]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center font-heading">
                    <Film size={36} className="mr-4 text-red-500" />
                    THE SHOWRUNNER STUDIO
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    The Broadcast Hub. Command your media empire, manage production pipelines, and monitor the financial reality of the platform.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Production Area (Left 2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Training Loop Visualization */}
                    <div className="bg-black/40 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-2">
                             <button 
                                onClick={() => setIsTraining(!isTraining)}
                                className={`flex items-center space-x-2 px-3 py-1 rounded-full border cursor-pointer hover:bg-opacity-80 transition-all ${isTraining ? 'bg-indigo-900/50 border-indigo-500 text-indigo-300' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                             >
                                 <RefreshCw size={12} className={isTraining ? "animate-spin" : ""} />
                                 <span className="text-xs font-bold tracking-wider">{isTraining ? 'TITAN MIMICRY: ACTIVE' : 'TRAINING PAUSED'}</span>
                             </button>
                         </div>
                         
                         <div className="flex items-center mb-4">
                             <BrainCircuit size={24} className="text-indigo-400 mr-3" />
                             <div>
                                 <h3 className="text-lg font-bold text-white">Deep Learning Protocol</h3>
                                 <p className="text-xs text-gray-400">Analyzing top 5 viral creators to synthesize elite production patterns.</p>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                             {/* Left: The Titans */}
                             <div className="space-y-3">
                                 {titans.map((titan, index) => (
                                     <div 
                                        key={titan.name} 
                                        className={`flex justify-between items-center p-2 rounded-md transition-all duration-500 ${index === trainingStep && isTraining ? 'bg-indigo-600/20 border-l-2 border-indigo-400 pl-3' : 'opacity-50'}`}
                                     >
                                         <span className={`text-sm font-semibold ${titan.color}`}>{titan.name}</span>
                                         <span className="text-xs text-gray-400 font-mono">{titan.trait}</span>
                                         {index === trainingStep && isTraining && <Activity size={14} className="text-indigo-400 animate-pulse" />}
                                     </div>
                                 ))}
                             </div>

                             {/* Right: The Gauge & Insights */}
                             <div className="flex flex-col space-y-4">
                                 <div className="text-center bg-gray-900/50 p-4 rounded-lg border border-gray-700 relative">
                                     {offlineGains > 0 && (
                                         <div className="absolute -top-3 -right-3 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                                             +{offlineGains.toFixed(1)}% WHILE AWAY
                                         </div>
                                     )}
                                     <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Viral Proficiency</p>
                                     <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                         <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                                             <circle cx="50" cy="50" r="45" fill="transparent" stroke="#1f2937" strokeWidth="8" />
                                             <circle 
                                                cx="50" cy="50" r="45" fill="transparent" stroke="#6366f1" strokeWidth="8" 
                                                strokeDasharray={283} 
                                                strokeDashoffset={283 - (283 * viralProficiency / 100)}
                                                strokeLinecap="round"
                                                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                                             />
                                         </svg>
                                         <div className="absolute text-3xl font-bold text-white font-mono">{viralProficiency.toFixed(1)}%</div>
                                     </div>
                                     <p className="text-[10px] text-indigo-400 mt-2 animate-pulse">
                                         {isTraining ? "Ingesting Hooks & Pacing Data..." : "Training Paused"}
                                     </p>
                                 </div>
                                 
                                 {/* Unlocked Patterns List */}
                                 <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                     <h5 className="text-xs font-bold text-white mb-2 flex items-center"><Lightbulb size={12} className="mr-1.5 text-yellow-400"/>Learned Neural Synapses</h5>
                                     <div className="h-24 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                                         {learnedPatterns.filter(p => viralProficiency >= p.score).reverse().map((p, i) => (
                                             <div key={i} className="flex items-center justify-between text-[10px] bg-black/30 p-1.5 rounded border border-gray-700">
                                                 <span className="text-gray-300 font-semibold flex items-center"><Check size={10} className="mr-1 text-green-400"/>{p.text}</span>
                                                 <span className="text-gray-500">{p.source}</span>
                                             </div>
                                         ))}
                                         {learnedPatterns.filter(p => viralProficiency >= p.score).length === 0 && (
                                             <p className="text-[10px] text-gray-500 text-center py-2">Training in progress...</p>
                                         )}
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* Funnel Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Audience Reach</p>
                                <p className="text-2xl font-bold text-white flex items-center">
                                    <Users size={20} className="mr-2 text-red-500"/> 12.5K
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-green-400 flex items-center justify-end"><Zap size={10} className="mr-1"/> +15%</span>
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Funnel Clicks</p>
                                <p className="text-2xl font-bold text-white flex items-center">
                                    <MousePointer size={20} className="mr-2 text-blue-400"/> 843
                                </p>
                            </div>
                             <div className="text-right">
                                <span className="text-xs text-green-400 flex items-center justify-end">CTR 6.7%</span>
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Leads Captured</p>
                                <p className="text-2xl font-bold text-white flex items-center">
                                    <CheckCircle size={20} className="mr-2 text-green-400"/> 128
                                </p>
                            </div>
                             <div className="text-right">
                                <span className="text-xs text-indigo-400 font-mono">Pipeline Value: $12k</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Series Grid */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Layers size={20} className="mr-2 text-red-500"/> Production Pipeline
                            </h3>
                        </div>

                        {videoProjects.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {videoProjects.map(project => (
                                    <div key={project.id} className={`bg-gray-800/50 rounded-xl border transition-all duration-300 ${activeProject === project.id ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-gray-700 hover:border-gray-600'}`}>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-[10px] font-bold uppercase tracking-wider border border-red-900/50">Video Project</span>
                                                        <span className="text-xs text-gray-500 font-mono">{project.id.slice(0, 8)}</span>
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white">{project.topic}</h4>
                                                </div>
                                                <button 
                                                    onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
                                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    {activeProject === project.id ? 'Close Studio' : 'Open Studio'}
                                                </button>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-900 rounded-full h-2 mb-4 overflow-hidden">
                                                <div 
                                                    className="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full" 
                                                    style={{ width: `${project.voiceoverAudio_base64 ? '75%' : project.fullScript ? '50%' : '25%'}` }}
                                                ></div>
                                            </div>

                                            {/* Studio Controls */}
                                            {activeProject === project.id && (
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in border-t border-gray-700 pt-6">
                                                    
                                                    {/* Scripting */}
                                                    <div className="lg:col-span-1 space-y-4">
                                                        <div className="bg-black/30 p-4 rounded-lg border border-gray-700 h-full">
                                                            <h5 className="text-sm font-bold text-gray-300 mb-2 flex items-center"><Video size={14} className="mr-2"/>Visual Script</h5>
                                                            <div className="text-xs text-gray-400 font-mono whitespace-pre-wrap h-48 overflow-y-auto bg-gray-900/50 p-2 rounded">
                                                                {project.fullScript || "No script generated yet."}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Assets */}
                                                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                                                            <div>
                                                                <h5 className="text-sm font-bold text-white mb-2 flex items-center"><Mic size={14} className="mr-2 text-indigo-400"/>Voice Synthesis</h5>
                                                                <p className="text-xs text-gray-400 mb-4">Model: <strong>Gemini 2.5 Flash TTS (Kore)</strong></p>
                                                            </div>
                                                            {project.voiceoverAudio_base64 ? (
                                                                <div className="bg-green-900/20 border border-green-500/30 p-2 rounded text-center">
                                                                    <p className="text-green-400 text-xs font-bold flex items-center justify-center"><CheckCircle size={12} className="mr-1"/> Audio Ready</p>
                                                                </div>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleVoiceover(project.id)}
                                                                    disabled={!!voiceLoading}
                                                                    className="w-full btn-primary py-2 text-xs flex items-center justify-center"
                                                                >
                                                                    {voiceLoading === project.id ? <Loader small/> : <><Play size={14} className="mr-2"/> Generate Voiceover</>}
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                                                             <div>
                                                                <h5 className="text-sm font-bold text-white mb-2 flex items-center"><Film size={14} className="mr-2 text-purple-400"/>Visual Assets</h5>
                                                                <p className="text-xs text-gray-400 mb-4">Engine: <strong>Replicate / Flux</strong></p>
                                                            </div>
                                                            <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center border border-gray-500">
                                                                <Upload size={14} className="mr-2"/> Send to Video Forge
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-900/30 rounded-xl border border-dashed border-gray-700">
                                <Film size={48} className="mx-auto text-gray-600 mb-4" />
                                <p className="text-gray-400">No active productions.</p>
                                <p className="text-xs text-gray-500 mt-1">Launch a "Showrunner" agent to begin.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Monetization Forensics */}
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-600 shadow-lg">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                            <Calculator size={20} className="mr-2 text-green-400" />
                            Monetization Forensics
                        </h4>
                        <p className="text-xs text-gray-400 mb-4">
                            Calculate the <strong>Real Net Profit</strong> after Platform Fees and Taxes. Do not be surprised by the split.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Est. Gross Revenue</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input 
                                        type="number" 
                                        value={calcRevenue}
                                        onChange={(e) => setCalcRevenue(Math.max(0, Number(e.target.value)))}
                                        className="w-full bg-black/30 border border-gray-600 rounded-md pl-6 pr-3 py-2 text-white font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex bg-black/30 p-1 rounded-md border border-gray-700">
                                <button onClick={() => setCalcType('long')} className={`flex-1 text-xs py-1.5 rounded font-bold transition-colors ${calcType === 'long' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Long Form</button>
                                <button onClick={() => setCalcType('short')} className={`flex-1 text-xs py-1.5 rounded font-bold transition-colors ${calcType === 'short' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Shorts</button>
                                <button onClick={() => setCalcType('super')} className={`flex-1 text-xs py-1.5 rounded font-bold transition-colors ${calcType === 'super' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Supers</button>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Platform Cut ({calcType === 'long' ? '45%' : calcType === 'short' ? '55%' : '30%'})</span>
                                    <span className="text-red-400 font-mono">-${breakdown.platformFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Creator Share</span>
                                    <span className="text-white font-mono">${breakdown.creatorShare.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Est. Tax Hold (25%)</span>
                                    <span className="text-yellow-400 font-mono">-${breakdown.taxHold.toFixed(2)}</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center">
                                    <span className="font-bold text-white">REAL NET PROFIT</span>
                                    <span className="font-bold text-green-400 font-mono text-lg">${breakdown.netProfit.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                     </div>

                     <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/30">
                        <h5 className="font-bold text-yellow-300 mb-2 flex items-center"><AlertTriangle size={16} className="mr-2"/>The AdSense Trap</h5>
                        <p className="text-xs text-yellow-200/80 leading-relaxed mb-3">
                            <strong>CRITICAL:</strong> If you do not submit US Tax Info (W-9 with your EIN) to Google AdSense immediately upon monetization, Google is legally required to withhold <strong>24% of your TOTAL WORLDWIDE REVENUE</strong>, not just US revenue.
                        </p>
                        <div className="bg-black/30 p-2 rounded border border-yellow-500/20 text-center">
                            <p className="text-[10px] text-gray-400">ACTION ITEM</p>
                            <p className="text-xs font-bold text-white">SUBMIT EIN TO ADSENSE</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ShowrunnerDashboard;
