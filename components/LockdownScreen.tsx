import React, { useState } from 'react';
import { ShieldAlert, KeyRound } from 'lucide-react';

interface LockdownScreenProps {
  onRestore: (key: string) => void;
}

const LockdownScreen: React.FC<LockdownScreenProps> = ({ onRestore }) => {
  const [shogunsKey, setShogunsKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRestore(shogunsKey);
  };

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="animate-pulse mb-8">
        <ShieldAlert size={96} className="text-red-500 mx-auto" />
      </div>
      <h1 className="text-5xl font-bold text-red-400 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        HIVE LOCKDOWN ENGAGED
      </h1>
      <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
        The Prometheus Protocol has detected a critical threat to the Hive's core directives. All autonomous functions have been suspended. The system is compromised.
      </p>
      <div className="bg-bg-secondary border border-border-primary p-8 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Phoenix Protocol Resurrection</h2>
        <p className="text-sm text-text-secondary mb-6">
          To restore the Hive to its last known good state, you must provide the Shogun's Key.
        </p>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="password"
              value={shogunsKey}
              onChange={(e) => setShogunsKey(e.target.value)}
              placeholder="Enter Shogun's Key..."
              className="w-full bg-bg-primary border border-border-primary rounded-md pl-10 pr-4 py-3 text-white focus:ring-accent-primary focus:border-accent-primary"
            />
          </div>
          <button type="submit" className="btn-primary py-3">
            Initiate Restore
          </button>
        </form>
      </div>
    </div>
  );
};

export default LockdownScreen;