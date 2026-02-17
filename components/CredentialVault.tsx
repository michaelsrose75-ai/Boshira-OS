
import React, { useState, useMemo, useRef } from 'react';
import type { VaultCredential } from '../types';
import { KeyRound, Plus, Trash2, Eye, EyeOff, AlertTriangle, Info, Zap, Film, BrainCircuit, Radio, Layers, Lock, Unlock, Download, Upload, ShieldCheck, Globe } from 'lucide-react';

interface CredentialVaultProps {
  credentials: VaultCredential[];
  onUpdate: (credentials: VaultCredential[]) => void;
}

const CredentialVault: React.FC<CredentialVaultProps> = ({ credentials, onUpdate }) => {
  const [newService, setNewService] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
  const [deleteCandidate, setDeleteCandidate] = useState<VaultCredential | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Sacred Protocol State
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (newService && newApiKey) {
      onUpdate([...credentials, { service: newService.trim(), apiKey: newApiKey.trim(), availableCredits: 0, lowCreditThreshold: 100 }]);
      setNewService('');
      setNewApiKey('');
    }
  };

  const handleUpdate = (index: number, field: keyof VaultCredential, value: string | number) => {
    const newCredentials = [...credentials];
    (newCredentials[index] as any)[field] = value;
    onUpdate(newCredentials);
  };
  
  const handleDelete = () => {
    if (deleteCandidate && deleteConfirmText === deleteCandidate.service) {
      onUpdate(credentials.filter(c => c.service !== deleteCandidate.service));
      setDeleteCandidate(null);
      setDeleteConfirmText('');
    }
  };

  const toggleVisibility = (service: string) => {
    setVisibleKeys(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  // --- SACRED BACKUP PROTOCOL ---
  const handleForgeBackup = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(credentials, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `kageyoshi_sacred_keys_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const importedCreds = JSON.parse(e.target?.result as string);
              if (Array.isArray(importedCreds)) {
                  onUpdate(importedCreds);
                  alert("Sacred Keys Restored Successfully.");
              } else {
                  throw new Error("Invalid Key File");
              }
          } catch (err) {
              alert("Failed to restore keys. The file may be corrupt.");
          }
      };
      reader.readAsText(file);
  };

  const recommendedKeys = [
      { id: 'REPLICATE_API_TOKEN', name: 'Replicate', icon: <Film size={14}/>, desc: 'Unlocks Real Video/Image Gen' },
      { id: 'XAI_API_KEY', name: 'xAI (Grok)', icon: <Radio size={14}/>, desc: 'Real-time News Analysis' },
      { id: 'DEEPSEEK_API_KEY', name: 'DeepSeek', icon: <BrainCircuit size={14}/>, desc: 'Advanced Logic/Coding' },
      { id: 'ELEVENLABS_API_KEY', name: 'ElevenLabs', icon: <Zap size={14}/>, desc: 'Premium Voice Synthesis' },
      { id: 'NEWS_API_KEY', name: 'News API', icon: <Globe size={14}/>, desc: 'Global Headlines & Trends' },
  ];

  const missingKeys = useMemo(() => {
      return recommendedKeys.filter(k => !credentials.some(c => c.service === k.id));
  }, [credentials]);

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 relative overflow-hidden">
      {/* Sacred Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <ShieldCheck size={22} className="mr-3 text-yellow-400" />
                Sacred Credential Vault
            </h3>
            <p className="text-sm text-gray-400">
                The keys to the Hive's power. Protected by the Sacred Protocol.
            </p>
        </div>
        <div className="flex items-center space-x-2">
             <button 
                onClick={() => setIsVaultLocked(!isVaultLocked)}
                className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${isVaultLocked ? 'bg-green-900/30 border-green-500/50 text-green-400' : 'bg-red-900/30 border-red-500/50 text-red-400 animate-pulse'}`}
            >
                {isVaultLocked ? <Lock size={14} className="mr-1.5"/> : <Unlock size={14} className="mr-1.5"/>}
                {isVaultLocked ? 'VAULT LOCKED' : 'UNLOCKED (EDIT MODE)'}
            </button>
        </div>
      </div>

      {/* Backup/Restore Controls */}
      <div className="bg-black/40 p-4 rounded-lg border border-yellow-500/20 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center text-yellow-200/80 text-sm">
              <Info size={16} className="mr-2 text-yellow-400"/>
              <span>Prevent Key Loss: Forge a backup file and save it to your D: Drive.</span>
          </div>
          <div className="flex space-x-2">
              <button onClick={handleForgeBackup} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md shadow-lg">
                  <Download size={14} className="mr-2"/> Forge Backup Key
              </button>
              <input type="file" ref={fileInputRef} onChange={handleRestoreBackup} className="hidden" accept=".json" />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-md border border-gray-500">
                  <Upload size={14} className="mr-2"/> Restore from Key
              </button>
          </div>
      </div>
      
      {/* Quick Add Recommended */}
      {missingKeys.length > 0 && !isVaultLocked && (
          <div className="mb-6 animate-fade-in">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center"><Layers size={16} className="mr-2 text-cyan-400"/>Missing High-Value Clearances</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {missingKeys.map(key => (
                      <button 
                        key={key.id} 
                        onClick={() => setNewService(key.id)}
                        className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-indigo-900/30 border border-gray-700 hover:border-indigo-500/50 rounded-md transition-all group"
                      >
                          <div className="text-left">
                              <div className="flex items-center text-indigo-300 font-semibold text-xs mb-1">
                                  {key.icon} <span className="ml-2">{key.name}</span>
                              </div>
                              <div className="text-[10px] text-gray-500 group-hover:text-gray-400">{key.desc}</div>
                          </div>
                          <Plus size={16} className="text-gray-600 group-hover:text-indigo-400"/>
                      </button>
                  ))}
              </div>
          </div>
      )}

      <div className="space-y-4">
        {credentials.map((cred, index) => (
          <div key={index} className={`bg-gray-900/50 p-4 rounded-md border ${isVaultLocked ? 'border-gray-700' : 'border-yellow-500/30'}`}>
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-lg text-indigo-300 flex items-center">
                  <KeyRound size={16} className="mr-2 text-indigo-500"/>
                  {cred.service}
              </h4>
              {!isVaultLocked && (
                  <button onClick={() => setDeleteCandidate(cred)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
              )}
            </div>
            <div className="mt-2 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-400">API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    type={visibleKeys.includes(cred.service) ? 'text' : 'password'}
                    value={cred.apiKey}
                    readOnly
                    disabled={isVaultLocked}
                    className={`w-full bg-gray-800 rounded-md px-3 py-1.5 text-white font-mono ${isVaultLocked ? 'border-transparent cursor-not-allowed opacity-70' : 'border border-gray-600'}`}
                  />
                  <button onClick={() => toggleVisibility(cred.service)} className="p-2 text-gray-400 hover:text-white">
                    {visibleKeys.includes(cred.service) ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {!isVaultLocked && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label htmlFor={`credits-${index}`} className="text-xs font-medium text-gray-400 flex items-center">
                        Available Credits
                        <span title="Update this from your service dashboard (e.g., Serper). The AI uses this for the Dynamic Frugality Protocol.">
                        <Info size={12} className="ml-1 text-gray-500"/>
                        </span>
                    </label>
                    <input
                        type="number"
                        id={`credits-${index}`}
                        value={cred.availableCredits || 0}
                        onChange={(e) => handleUpdate(index, 'availableCredits', Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-white"
                    />
                    </div>
                    <div>
                    <label htmlFor={`threshold-${index}`} className="text-xs font-medium text-gray-400 flex items-center">
                        Low Credit Threshold
                        <span title="If available credits fall below this number, the AI will automatically enable frugal mode for this service.">
                        <Info size={12} className="ml-1 text-gray-500"/>
                        </span>
                    </label>
                    <input
                        type="number"
                        id={`threshold-${index}`}
                        value={cred.lowCreditThreshold || 100}
                        onChange={(e) => handleUpdate(index, 'lowCreditThreshold', Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-white"
                    />
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isVaultLocked && (
        <div className="mt-6 border-t border-gray-700 pt-6 animate-fade-in">
            <h4 className="font-semibold text-white mb-3">Add New Credential</h4>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-3">
            <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Service Name (e.g., REPLICATE_API_TOKEN)"
                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
            />
            <input
                type="text"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="Paste API Key Here"
                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
            />
            <button onClick={handleAdd} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center px-6 font-bold transition-colors shadow-lg shadow-indigo-900/20">
                <Plus size={20} className="mr-2" />
                Save Key
            </button>
            </div>
        </div>
      )}
      
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setDeleteCandidate(null)}>
            <div className="bg-gray-800 border border-red-700 rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg text-red-300 flex items-center"><AlertTriangle className="mr-2"/>Confirm Deletion</h3>
                <p className="text-sm text-gray-300 mt-2 mb-4">
                    This action is irreversible and will permanently delete the API key for <strong className="text-white">{deleteCandidate.service}</strong>. This may cause agents relying on this service to fail.
                </p>
                <label htmlFor="delete-confirm" className="text-xs font-medium text-gray-400">
                    To confirm, please type "<span className="font-bold text-red-400">{deleteCandidate.service}</span>" below:
                </label>
                <input
                    type="text"
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md mt-1 px-3 py-2 text-white"
                />
                <div className="mt-4 flex justify-end space-x-3">
                    <button onClick={() => setDeleteCandidate(null)} className="px-4 py-2 text-sm font-semibold bg-gray-600 hover:bg-gray-500 rounded-md">Cancel</button>
                    <button onClick={handleDelete} disabled={deleteConfirmText !== deleteCandidate.service} className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed rounded-md">Delete Forever</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default CredentialVault;
