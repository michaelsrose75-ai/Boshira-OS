import React, { useState, useMemo } from 'react';
import { Smartphone, CheckCircle, AlertTriangle, Send, Info, Zap } from 'lucide-react';
import type { PortfolioRules, OverseerLogEntry } from '../types';
import Loader from './Loader';

interface DaimyosPagerProps {
  rules: PortfolioRules;
  onRulesChange: (rules: PortfolioRules) => void;
  onSendTest: (message: string) => Promise<void>;
  log: OverseerLogEntry[];
}

const DaimyosPager: React.FC<DaimyosPagerProps> = ({ rules, onRulesChange, onSendTest, log }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const { isConnected, missingCreds } = useMemo(() => {
        const required = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER', 'YOUR_PHONE_NUMBER'];
        const missing = required.filter(rc => !rules.credentials.some(c => c.service === rc && c.apiKey));
        return {
            isConnected: missing.length === 0,
            missingCreds: missing,
        };
    }, [rules.credentials]);

    const pagerLog = useMemo(() => {
        return log.filter(entry => entry.agentTitle === "Daimyo's Pager");
    }, [log]);

    const handleTest = async () => {
        setIsLoading(true);
        await onSendTest("Kageyoshi Test: Daimyo's Pager Protocol is operational. The Hive can now reach you anywhere.");
        setIsLoading(false);
    };
    
    const handleLiveModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      onRulesChange({ ...rules, daimyoPagerLiveMode: e.target.checked });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white flex items-center">
                    <Smartphone size={18} className="mr-2"/>Daimyo's Pager Protocol
                </h4>
            </div>
            <p className="text-sm text-gray-400 mb-6">
                Bridge the Hive's digital mind to your physical presence. Receive critical alerts (Imperial Mandates) via SMS, no matter where you are.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600 space-y-4">
                    <h5 className="font-bold text-white">Connection Status</h5>
                    {isConnected ? (
                        <div className="flex items-center space-x-3 text-green-400 bg-green-900/30 p-3 rounded-md border border-green-700/50">
                            <CheckCircle size={24} />
                            <div>
                                <p className="font-semibold">Protocol Active</p>
                                <p className="text-xs text-green-300">All credentials found in vault. Ready to send alerts.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3 text-yellow-400 bg-yellow-900/30 p-3 rounded-md border border-yellow-700/50">
                            <AlertTriangle size={24} />
                            <div>
                                <p className="font-semibold">Protocol Inactive</p>
                                <p className="text-xs text-yellow-300">Missing credentials: {missingCreds.join(', ')}</p>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-700 pt-4">
                        <label htmlFor="live-mode-toggle" className="flex items-center justify-between cursor-pointer group">
                             <span className="text-sm font-semibold flex items-center text-white">
                                <Zap size={14} className="mr-2 text-yellow-400"/>
                                Live Mode
                            </span>
                             <label className="custom-toggle">
                                <input type="checkbox" id="live-mode-toggle" checked={rules.daimyoPagerLiveMode} onChange={handleLiveModeToggle} />
                                <span className="slider"></span>
                            </label>
                        </label>
                        <p className="text-xs text-gray-400 mt-2">
                            {rules.daimyoPagerLiveMode 
                                ? <span className="text-yellow-300">Live mode is ON. Real SMS messages will be sent.</span>
                                : "Sandbox mode is ON. Alerts will be logged but not sent via SMS."
                            }
                        </p>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <label className="text-sm font-medium text-gray-300">Test Connection</label>
                        <p className="text-xs text-gray-400 mb-2">Send a test message to your registered phone number. Requires Live Mode.</p>
                        <button
                            onClick={handleTest}
                            disabled={!isConnected || isLoading || !rules.daimyoPagerLiveMode}
                            className="w-full btn-primary flex items-center justify-center text-sm"
                        >
                            {isLoading ? <Loader small /> : <><Send size={14} className="mr-2" />Send Test SMS</>}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                    <h5 className="font-bold text-white mb-4">How It Works</h5>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                        <li>An AI agent (e.g., Tax Guru) generates a critical, high-priority **Imperial Mandate**.</li>
                        <li>The Daimyo's Pager Protocol is triggered automatically.</li>
                        <li>If Live Mode is on, the Hive sends a secure SMS alert to your phone via Twilio.</li>
                        <li>If Live Mode is off, a "Sandbox Mode" message is added to the log instead.</li>
                        <li>(Coming Soon) Reply to the SMS to approve or deny the action remotely.</li>
                    </ol>
                </div>
            </div>

            <div className="mt-6">
                <h5 className="font-semibold text-white mb-3">Recent Pager Activity</h5>
                <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 h-48 overflow-y-auto font-mono text-xs space-y-2">
                    {pagerLog.length > 0 ? pagerLog.map((entry, index) => (
                        <div key={index} className={`flex items-start space-x-2 ${entry.type === 'error' ? 'text-red-400' : entry.type === 'success' ? 'text-green-400' : 'text-cyan-300'}`}>
                            <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                            <span>-</span>
                            <span>{entry.message}</span>
                        </div>
                    )) : <p className="text-center text-sm text-gray-500 py-10">No SMS alerts sent yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default DaimyosPager;