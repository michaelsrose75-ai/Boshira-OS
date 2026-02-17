import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface SystemStatusProps {
  stability: number;
  lockdown: boolean;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ stability, lockdown }) => {
  const getStabilityColor = () => {
    if (stability < 25) return 'bg-red-500';
    if (stability < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
            <h4 className="text-lg font-semibold text-white mr-4">System Status</h4>
            <div className="w-64 bg-gray-700 rounded-full h-4">
                <div 
                    className={`h-4 rounded-full transition-all duration-500 ${getStabilityColor()}`}
                    style={{width: `${stability}%`}}
                ></div>
            </div>
            <span className="ml-3 font-mono text-white">{stability.toFixed(0)}%</span>
        </div>
        {lockdown && (
            <div className="flex items-center text-red-300 bg-red-900/50 px-4 py-2 rounded-full font-semibold animate-pulse">
                <ShieldAlert size={18} className="mr-2" />
                HIVE LOCKDOWN ACTIVE
            </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;
