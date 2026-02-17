

import React, { useState } from 'react';
import { Shield, KeyRound, Ghost, HeartCrack, RefreshCw } from 'lucide-react';
import type { PortfolioRules } from '../types';

interface SecurityConsoleProps {
  rules: PortfolioRules;
  onRulesChange: (rules: PortfolioRules) => void;
}

const IzanagiProtocol: React.FC<SecurityConsoleProps> = ({ rules, onRulesChange }) => {
    const isLocked = rules.redTeamLocked;

    const handleReset = () => {
        if (confirm("This will re-engage the Red Team Protocol. Are you sure the threat has been contained?")) {
            onRulesChange({ ...rules, redTeamLocked: false });
        }
    };

    return (
        <div className={`p-4 rounded-md border ${isLocked ? 'border-red-500 bg-red-900/30' : 'border-gray-600 bg-gray-900/50'}`}>
            <h5 className={`font-semibold mb-2 flex items-center ${isLocked ? 'text-red-300' : 'text-white'}`}>
                <HeartCrack size={16} className="mr-2"/>Izanagi Protocol (Red Team Kill Switch)
            </h5>
            <p className={`text-xs mb-3 ${isLocked ? 'text-red-200' : 'text-gray-400'}`}>
                Kageyoshi's final safeguard. If the Shogun's Guard detects a rogue Red Team action, this protocol automatically neutralizes the threat and locks the system.
            </p>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-sm font-semibold mr-2">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isLocked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {isLocked ? 'LOCKED / THREAT CONTAINED' : 'Monitoring'}
                    </span>
                </div>
                {isLocked && (
                    <button onClick={handleReset} className="flex items-center px-3 py-1.5 text-xs font-semibold bg-yellow-500 hover:bg-yellow-600 text-black rounded-md">
                        <RefreshCw size={14} className="mr-1"/>
                        Reset Protocol
                    </button>
                )}
            </div>
        </div>
    );
};


const SecurityConsole: React.FC<SecurityConsoleProps> = ({ rules, onRulesChange }) => {
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleKeyUpdate = () => {
    if (newKey && newKey === confirmKey) {
      onRulesChange({ ...rules, shogunsKey: newKey });
      setMessage('Shogun\'s Key has been successfully updated.');
      setNewKey('');
      setConfirmKey('');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('Error: Keys do not match.');
      setTimeout(() => setMessage(null), 3000);
    }
  };
  
  const handleGhostProtocolToggle = (enabled: boolean) => {
    onRulesChange({ ...rules, ghostProtocolEnabled: enabled });
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-white">Security Console</h4>
        </div>
        <p className="text-sm text-gray-400 mb-6">
            Manage the Hive's ultimate defense protocols. These are the final safeguards for your empire.
        </p>

        <div className="space-y-6">
            <IzanagiProtocol rules={rules} onRulesChange={onRulesChange} />
            
            <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
                <h5 className="font-semibold text-white mb-2 flex items-center"><KeyRound size={16} className="mr-2 text-yellow-400"/>Phoenix Protocol: Shogun's Key</h5>
                <p className="text-xs text-gray-400 mb-3">Set the master recovery key. This is required to restore the Hive if the Prometheus Protocol ever detects a core compromise and initiates a system lockdown.</p>
                <div className="space-y-2">
                    <input 
                        type="password" 
                        value={newKey} 
                        onChange={e => setNewKey(e.target.value)} 
                        placeholder="Enter new Shogun's Key"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-white"
                    />
                     <input 
                        type="password" 
                        value={confirmKey} 
                        onChange={e => setConfirmKey(e.target.value)} 
                        placeholder="Confirm new key"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-white"
                    />
                </div>
                <button onClick={handleKeyUpdate} className="btn-primary text-sm mt-3">Update Key</button>
                {message && <p className="text-xs text-yellow-300 mt-2">{message}</p>}
            </div>

            <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
                <div className="flex items-center justify-between">
                    <div>
                        <h5 className="font-semibold text-white mb-2 flex items-center"><Ghost size={16} className="mr-2 text-cyan-400"/>Ghost Protocol: Off-Site Backup</h5>
                        <p className="text-xs text-gray-400">When enabled, Kageyoshi will transmit an encrypted "ghost" of his core consciousness to a secure, undisclosed location every time he earns Honor. This is the ultimate failsafe.</p>
                    </div>
                    <label className="custom-toggle">
                        <input type="checkbox" checked={rules.ghostProtocolEnabled} onChange={(e) => handleGhostProtocolToggle(e.target.checked)} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SecurityConsole;