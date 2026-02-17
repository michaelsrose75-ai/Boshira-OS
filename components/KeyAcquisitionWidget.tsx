
import React, { useState, useMemo } from 'react';
import type { VaultCredential } from '../types';
import { ShieldAlert, Zap, Key, CheckCircle, Plus, Loader, AlertTriangle, RefreshCw, Globe, Eye, EyeOff, X } from 'lucide-react';

interface KeyAcquisitionWidgetProps {
  credentials: VaultCredential[];
  onAddCredential: (service: string, key: string) => void;
}

const KeyAcquisitionWidget: React.FC<KeyAcquisitionWidgetProps> = ({ credentials, onAddCredential }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState<string[]>([]);

  const highValueTargets = [
    // DeepSeek moved to top for priority access
    { id: 'DEEPSEEK_API_KEY', name: 'DeepSeek', desc: 'Unlocks Advanced Logic/Coding', icon: <Key size={14}/>, prefix: 'sk-', priority: true },
    { id: 'REPLICATE_API_TOKEN', name: 'Replicate', desc: 'Unlocks Video/Image Generation', icon: <Zap size={14}/>, prefix: 'r8_' },
    { id: 'XAI_API_KEY', name: 'xAI (Grok)', desc: 'Unlocks Real-Time News Intelligence', icon: <ShieldAlert size={14}/>, prefix: 'xai-' },
    { id: 'NEWS_API_KEY', name: 'NewsAPI', desc: 'Unlocks Global Market News', icon: <Globe size={14}/>, prefix: '' },
  ];

  const missingTargets = useMemo(() => {
    return highValueTargets.filter(target => 
        !credentials.some(c => c.service === target.id && c.apiKey) && 
        !dismissed.includes(target.id)
    );
  }, [credentials, dismissed]);

  if (missingTargets.length === 0) return null;

  const validateKey = async (serviceId: string, key: string) => {
      // 1. Format Check
      const target = highValueTargets.find(t => t.id === serviceId);
      if (target && target.prefix && !key.startsWith(target.prefix)) {
          throw new Error(`Invalid format. Starts with "${target.prefix}"?`);
      }

      // 2. Live Connection Check (Simulation)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (key.length < 10) {
          throw new Error("Key appears too short.");
      }

      return true;
  };

  const handleSave = async (serviceId: string) => {
      const key = inputs[serviceId];
      if (!key) return;

      setVerifying(serviceId);
      setError(prev => ({...prev, [serviceId]: ''}));
      
      try {
          await validateKey(serviceId, key);
          
          // Success State - Lock it in
          setSuccess(prev => ({...prev, [serviceId]: true}));
          
          // Trigger save after short delay to show the success state
          setTimeout(() => {
               onAddCredential(serviceId, key);
               // We DO NOT reset success here. We let the component unmount/filter out the card via props.
          }, 800);

      } catch (e) {
          const msg = e instanceof Error ? e.message : "Validation Failed";
          setError(prev => ({...prev, [serviceId]: msg}));
          setSuccess(prev => ({...prev, [serviceId]: false})); // Ensure success is false on error
      } finally {
          setVerifying(null);
      }
  };

  const toggleVisibility = (id: string) => {
      setVisible(prev => ({...prev, [id]: !prev[id]}));
  };
  
  const handleDismiss = (id: string) => {
      setDismissed(prev => [...prev, id]);
  };

  return (
    <div className="w-full mb-8 bg-yellow-900/10 border border-yellow-500/30 rounded-xl p-6 shadow-[0_0_30px_rgba(234,179,8,0.1)] animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            <div className="p-2 bg-yellow-500/10 rounded-full mr-3 border border-yellow-500/20">
                <ShieldAlert size={24} className="text-yellow-400" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white font-heading tracking-wide">MISSION CRITICAL: MISSING CLEARANCES</h3>
                <p className="text-sm text-yellow-200/70">The Hive requires these keys to reach full operational capacity. Input them here or dismiss if not needed.</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {missingTargets.map(target => (
            <div key={target.id} className={`bg-black/40 border rounded-lg p-4 flex flex-col transition-all relative group ${error[target.id] ? 'border-red-500 bg-red-900/10' : target.priority ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'border-white/10 hover:border-yellow-500/50'}`}>
                <button 
                    onClick={() => handleDismiss(target.id)} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    title="Dismiss / Skip Key"
                >
                    <X size={16} />
                </button>

                <div className="flex justify-between items-start mb-2 pr-6">
                    <div className="flex items-center text-yellow-400 font-bold text-sm">
                        {target.icon}
                        <span className="ml-2">{target.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${target.priority ? 'text-yellow-500 font-bold animate-pulse' : 'text-gray-500'}`}>
                        {target.priority ? 'PRIORITY' : 'Optional'}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{target.desc}</p>
                
                <div className="mt-auto space-y-2">
                    <div className="relative">
                        <input 
                            type={visible[target.id] ? 'text' : 'password'}
                            placeholder={`Paste ${target.name} Key`}
                            value={inputs[target.id] || ''}
                            onChange={(e) => {
                                setInputs(prev => ({...prev, [target.id]: e.target.value}));
                                setError(prev => ({...prev, [target.id]: ''})); // Clear error on type
                            }}
                            className={`w-full bg-gray-900/50 border rounded-md pl-3 pr-10 py-2 text-xs text-white focus:ring-0 transition-colors font-mono ${error[target.id] ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-yellow-500'}`}
                            disabled={verifying === target.id || success[target.id]}
                        />
                        <button 
                            onClick={() => toggleVisibility(target.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {visible[target.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                    </div>
                    
                    {error[target.id] && (
                        <div className="bg-red-900/40 p-2 rounded border border-red-500/30 flex items-start">
                             <AlertTriangle size={12} className="text-red-400 mr-2 mt-0.5 flex-shrink-0"/>
                             <p className="text-[10px] text-red-300 font-bold leading-tight">{error[target.id]}</p>
                        </div>
                    )}
                    
                    {success[target.id] ? (
                         <button disabled className="w-full btn-primary py-2 text-xs font-bold flex items-center justify-center bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]">
                            <CheckCircle size={14} className="mr-1.5"/>
                            CLEARANCE GRANTED
                        </button>
                    ) : (
                        <button 
                            onClick={() => handleSave(target.id)}
                            disabled={!inputs[target.id] || verifying === target.id}
                            className={`w-full btn-primary py-2 text-xs font-bold flex items-center justify-center transition-all
                                ${error[target.id] 
                                    ? 'bg-red-600/20 border-red-500 text-red-300 hover:bg-red-600/40' 
                                    : 'bg-yellow-600/10 border-yellow-600/50 hover:bg-yellow-600/20 text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed'}
                            `}
                        >
                            {verifying === target.id ? <Loader size={14} className="animate-spin mr-1.5"/> : error[target.id] ? <RefreshCw size={14} className="mr-1.5"/> : <Plus size={14} className="mr-1.5"/>}
                            {verifying === target.id ? 'VERIFYING...' : error[target.id] ? 'RETRY VALIDATION' : 'EQUIP KEY'}
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default KeyAcquisitionWidget;
