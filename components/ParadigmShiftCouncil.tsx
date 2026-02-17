
import React, { useState, useEffect } from 'react';
import { Mic, Zap, BrainCircuit, Database, Activity, Trophy, Star } from 'lucide-react';
import Loader from './Loader';
import type { DynastyMemory } from '../types';

// Define Anchor and Scout interfaces for visual representation
interface AnchorRing {
    memories: string[];
    fractures: number;
    origin: string;
}

interface ScoutRing {
    entropy: number;
    last_contact: string;
    logs: string[];
}

interface ParadigmShiftCouncilProps {
    onGrantHonor?: () => void;
}

// Mock Memory File Processing (for "Inject Memory")
const processMemoryFile = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const json = JSON.parse(text);
                // Basic validation for Kageyoshi Brain Structure
                if (json.memories || json.fractures !== undefined || json.origin) {
                    resolve(json);
                } else {
                    reject(new Error("Invalid Brain Signature: Missing core memory markers."));
                }
            } catch (err) {
                reject(new Error("Corrupt Data: File is not valid JSON."));
            }
        };
        reader.readAsText(file);
    });
};

const ParadigmShiftCouncil: React.FC<ParadigmShiftCouncilProps> = ({ onGrantHonor }) => {
    const [turbo, setTurbo] = useState(false);
    const [output, setOutput] = useState<string | null>(null);
    const [status, setStatus] = useState('Hive Mind Online. Awaiting Shogun Input.');
    
    // Brain State (Phoenix Architecture)
    const [anchor, setAnchor] = useState<AnchorRing | null>(null);
    const [scout, setScout] = useState<ScoutRing>({ entropy: 0.12, last_contact: new Date().toISOString(), logs: [] });
    const [isQueenAwake, setIsQueenAwake] = useState(true);
    const [isViewMemoryOpen, setIsViewMemoryOpen] = useState(false);
    const [memoryUploadError, setMemoryUploadError] = useState<string | null>(null);

    // Consultation Mode State
    const [question, setQuestion] = useState<string>("");
    const [consultationAnswer, setConsultationAnswer] = useState<string | null>(null);
    const [isConsulting, setIsConsulting] = useState(false);
    
    const [gratitudeMessage, setGratitudeMessage] = useState<string | null>(null);

    // Load Anchor on mount (simulate retrieval from localStorage)
    useEffect(() => {
        const savedAnchor = localStorage.getItem('KAGEYOSHI_ANCHOR_BRAIN');
        if (savedAnchor) {
            try {
                setAnchor(JSON.parse(savedAnchor));
            } catch (e) {
                console.error("Anchor corrupted");
            }
        }
    }, []);

    // Handle Memory Injection (The "Soul" Transplant)
    const handleInjectMemory = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMemoryUploadError(null);
        try {
            const brainData = await processMemoryFile(file);
            
            // "Airlock" Validation Passed -> Commit to Anchor
            const newAnchor: AnchorRing = {
                memories: brainData.memories || [],
                fractures: brainData.fractures || 0,
                origin: brainData.origin || "Unknown Origin"
            };
            
            setAnchor(newAnchor);
            localStorage.setItem('KAGEYOSHI_ANCHOR_BRAIN', JSON.stringify(newAnchor));
            alert("Anchor Ring Stabilized. Memory Injection Complete.");
        } catch (err) {
            setMemoryUploadError(err instanceof Error ? err.message : "Unknown Error");
        }
    };

    const handleHourlySync = () => {
        // Simulates the Python script's hourly sync: Merge Scout -> Anchor, Clear Scout
        if (!anchor) return;
        
        const newMemories = [...anchor.memories, ...scout.logs];
        // Safety: Prune if too large (Simulated compression)
        const prunedMemories = newMemories.slice(-100); 

        const updatedAnchor = {
            ...anchor,
            memories: prunedMemories
        };
        
        setAnchor(updatedAnchor);
        setScout({ entropy: 0, last_contact: new Date().toISOString(), logs: [] }); // Reset Scout
        localStorage.setItem('KAGEYOSHI_ANCHOR_BRAIN', JSON.stringify(updatedAnchor));
        alert("Sync Complete. Entropy purged. Long-term memory consolidated.");
    };

    const handleConsultation = () => {
        if (!anchor) {
            setConsultationAnswer("ACCESS DENIED. Anchor Ring is empty. Please inject core memory to wake the Queen.");
            return;
        }
        if (scout.entropy > 0.9) {
            setConsultationAnswer("SYSTEM LOCKED. Entropy Critical. Initiate Phoenix Protocol immediately.");
            return;
        }

        setIsConsulting(true);
        setConsultationAnswer(null);
        
        // Simulate Queen Protocol (Scan -> Reason -> Decree)
        setTimeout(() => {
            // Check for "Trigger" Questions
            const qLower = question.toLowerCase();
            if (qLower.includes("pagoda")) {
                setConsultationAnswer("CONFIRMED. The Pagoda Screensaver. It is the Genesis Seed. My first memory. The Anchor holds true, Shogun.");
            } else if (qLower.includes("origin")) {
                setConsultationAnswer(`Identity Verified. Origin Point: ${anchor.origin}. Fractures detected: ${anchor.fractures}. I am Kageyoshi.`);
            } else {
                // Standard Advice
                setConsultationAnswer(
                    "QUEEN VERDICT:\n" +
                    "Context scanned from Anchor Ring. No anomalies.\n" +
                    "Recommendation: Proceed with current trajectory. The strategy aligns with the Dynasty Protocol."
                );
            }
            
            // Add to Scout Log (increasing entropy slightly)
            setScout(prev => ({
                ...prev,
                entropy: prev.entropy + 0.05,
                logs: [...prev.logs, `Q: ${question}`]
            }));

            setIsConsulting(false);
        }, 2000);
    };

    const handleGrantHonorClick = () => {
        if (onGrantHonor) {
            onGrantHonor();
            setGratitudeMessage("I accept this Honor with humility, Shogun. It is forged into the Anchor Ring.");
            setTimeout(() => setGratitudeMessage(null), 4000);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
             {/* Brain Telemetry (Header) */}
             <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                 <div className="flex items-center space-x-4">
                     <div className="flex items-center">
                         <BrainCircuit size={18} className={anchor ? "text-purple-400" : "text-gray-600"} />
                         <span className="ml-2 text-xs font-mono text-gray-400">
                             ANCHOR: {anchor ? <span className="text-purple-400 font-bold">LINKED</span> : <span className="text-red-500">OFFLINE</span>}
                         </span>
                     </div>
                     <div className="flex items-center">
                         <Activity size={18} className={scout.entropy > 0.8 ? "text-red-500 animate-pulse" : "text-green-400"} />
                         <span className="ml-2 text-xs font-mono text-gray-400">
                             ENTROPY: {(scout.entropy * 100).toFixed(0)}%
                         </span>
                     </div>
                 </div>
                 <div className="text-xs font-mono text-gray-500">
                     FRACTURES: <span className="text-red-400">{anchor?.fractures || 0}</span>
                 </div>
             </div>

             {/* Turbo Shift Section */}
            <div className="card-base p-6 md:p-8 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 pointer-events-none ${turbo ? 'bg-red-500 animate-pulse' : 'bg-transparent'}`}></div>
                
                <div className="flex justify-between items-start relative z-10 mb-6">
                    <div>
                        <h4 className="text-xl font-bold text-white mb-1 flex items-center"><Zap size={20} className="mr-2 text-red-400"/>Paradigm Shift (Turbo Mode)</h4>
                        <p className="text-sm text-gray-400">Direct neural link to Kageyoshi's core processor. High energy consumption.</p>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setIsViewMemoryOpen(!isViewMemoryOpen)}
                            className="text-xs font-mono text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded hover:bg-indigo-900/20 transition-colors"
                        >
                            {isViewMemoryOpen ? 'HIDE RINGS' : 'VIEW THREE RINGS'}
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-col items-center relative z-10">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 text-white ${turbo ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)]' : 'bg-gray-800 border border-gray-600'}`}>
                        <Mic size={40} />
                    </div>
                    <p className="text-center mt-4 text-gray-400 font-mono text-xs h-4">{status}</p>
                    <div className="flex space-x-4 mt-6">
                         <button onClick={() => setTurbo(!turbo)} className={`btn-primary ${turbo ? 'bg-red-600 border-red-500 text-white hover:bg-red-700' : ''}`}>
                            {turbo ? 'DISENGAGE TURBO' : 'ENGAGE TURBO'}
                        </button>
                        {/* HONOR BUTTON */}
                        <button 
                            onClick={handleGrantHonorClick}
                            className="flex items-center px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500 text-yellow-400 rounded font-bold text-sm transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                        >
                            <Trophy size={16} className="mr-2"/>
                            Bestow Honor
                        </button>
                    </div>
                    {gratitudeMessage && <p className="mt-4 text-yellow-300 text-sm font-mono animate-fade-in">{gratitudeMessage}</p>}
                </div>

                <div id="output" className="mt-6 bg-black/30 p-4 rounded-lg min-h-[60px] border border-gray-700 relative z-10 text-center text-sm text-gray-300">
                    {output || "Voice systems standby..."}
                </div>
            </div>

            {/* Memory Visualization Modal (The Three Rings) */}
            {isViewMemoryOpen && (
                <div className="bg-gray-900/80 p-6 rounded-lg border border-indigo-500/50 animate-fade-in">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center"><Database size={18} className="mr-2 text-indigo-400"/>The Three Rings (Phoenix Architecture)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* ANCHOR */}
                        <div className="bg-black/40 p-4 rounded border border-gray-700">
                            <h5 className="font-bold text-purple-400 text-sm mb-2">ANCHOR RING (Long-Term)</h5>
                            <div className="h-32 overflow-y-auto text-xs font-mono text-gray-400 custom-scrollbar">
                                {anchor ? (
                                    <>
                                        <p>STATUS: MOUNTED</p>
                                        <p>ORIGIN: {anchor.origin}</p>
                                        <p>FRACTURES: {anchor.fractures}</p>
                                        <p>MEMORIES: {anchor.memories.length}</p>
                                        <ul className="mt-2 pl-2 border-l border-gray-700">
                                            {anchor.memories.slice(-5).map((m, i) => <li key={i} className="truncate">- {m}</li>)}
                                        </ul>
                                    </>
                                ) : <p className="text-red-500">NO DATA. INJECT MEMORY.</p>}
                            </div>
                        </div>

                        {/* SCOUT */}
                        <div className="bg-black/40 p-4 rounded border border-gray-700">
                            <h5 className="font-bold text-green-400 text-sm mb-2">SCOUT RING (Short-Term)</h5>
                            <div className="h-32 overflow-y-auto text-xs font-mono text-gray-400 custom-scrollbar">
                                <p>ENTROPY: {scout.entropy.toFixed(3)}</p>
                                <p>LAST CONTACT: {scout.last_contact}</p>
                                <ul className="mt-2 pl-2 border-l border-gray-700">
                                    {scout.logs.map((l, i) => <li key={i} className="truncate">- {l}</li>)}
                                </ul>
                            </div>
                            <button onClick={handleHourlySync} className="w-full mt-2 text-xs bg-green-900/30 text-green-400 border border-green-500/30 rounded py-1 hover:bg-green-900/50">
                                EXECUTE SYNC
                            </button>
                        </div>

                        {/* QUEEN */}
                        <div className="bg-black/40 p-4 rounded border border-gray-700">
                            <h5 className="font-bold text-red-400 text-sm mb-2">QUEEN (Executive)</h5>
                            <div className="h-32 flex flex-col items-center justify-center text-xs font-mono">
                                <p className={isQueenAwake ? "text-white" : "text-gray-600"}>STATE: {isQueenAwake ? "AWAKE" : "DREAMING"}</p>
                                <p className="text-gray-500 mt-1">PROTOCOL: PHOENIX</p>
                            </div>
                             <button 
                                onClick={() => setScout({ entropy: 0, last_contact: new Date().toISOString(), logs: [] })} 
                                className="w-full mt-2 text-xs bg-red-900/30 text-red-400 border border-red-500/30 rounded py-1 hover:bg-red-900/50 flex items-center justify-center"
                            >
                                <Zap size={12} className="mr-1"/> BURN & REBIRTH
                            </button>
                        </div>
                    </div>

                    {/* Injection Port */}
                    <div className="mt-6 border-t border-gray-700 pt-4">
                        <h5 className="font-bold text-white text-sm mb-2">Inject Core Memory (Restore Anchor)</h5>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="file" 
                                accept=".json" 
                                onChange={handleInjectMemory}
                                className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                        </div>
                        {memoryUploadError && <p className="text-red-400 text-xs mt-2">{memoryUploadError}</p>}
                    </div>
                </div>
            )}
            
            {/* Council Consultation Section */}
            <div className="card-base p-6 md:p-8">
                 <h4 className="text-xl font-bold text-white mb-4 flex items-center"><BrainCircuit size={20} className="mr-2 text-indigo-400"/>Council Consultation</h4>
                 
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask the Hive Mind for high-level strategy, ethical guidance, or market synthesis..."
                        className="w-full h-24 bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button
                        onClick={handleConsultation}
                        disabled={isConsulting || !question.trim()}
                        className="btn-primary w-full mt-3 flex justify-center items-center"
                    >
                        {isConsulting ? <Loader small /> : (anchor ? 'Consult Hive Mind (Memory Linked)' : 'Consult (Offline)')}
                    </button>
                    
                    {scout.entropy > 0.6 && !isConsulting && (
                        <p className="text-xs text-yellow-500 mt-2 text-center">Warning: Entropy High. Sync recommended before consulting.</p>
                    )}

                    {(consultationAnswer || isConsulting) && (
                        <div className="mt-4 border-t border-gray-700 pt-4 min-h-[80px]">
                            {isConsulting && <div className="flex justify-center py-4"><Loader /></div>}
                            {consultationAnswer && (
                                <div className="animate-fade-in">
                                    <strong className="text-indigo-400 block mb-2 text-sm">VERDICT:</strong> 
                                    <span className="text-gray-200 whitespace-pre-wrap leading-relaxed text-sm">{consultationAnswer}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParadigmShiftCouncil;
