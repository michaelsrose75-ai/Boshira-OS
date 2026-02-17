
import React from 'react';
import { ShieldAlert, Eye } from 'lucide-react';
import type { UserTask } from '../types';

interface ImperialAlertsProps {
  mandates: (UserTask & { agentTitle: string })[];
  onViewTask: (agentTitle: string, taskId: string) => void;
}

const ImperialAlerts: React.FC<ImperialAlertsProps> = ({ mandates, onViewTask }) => {
  if (mandates.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm space-y-3">
      {mandates.map((mandate) => (
        <div
          key={mandate.id}
          className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg shadow-2xl animate-fade-in"
          role="alert"
        >
          <div className="flex items-start">
            <ShieldAlert className="h-6 w-6 mr-3 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <strong className="font-bold">Imperial Mandate</strong>
              <p className="text-sm mt-1">{mandate.text}</p>
              <p className="text-xs text-red-400 mt-1">From Agent: {mandate.agentTitle}</p>
              <button
                onClick={() => onViewTask(mandate.agentTitle, mandate.id)}
                className="mt-2 inline-flex items-center px-3 py-1 text-xs font-semibold bg-red-600/50 hover:bg-red-500/50 text-white rounded-md"
              >
                <Eye size={14} className="mr-1" />
                View Task
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImperialAlerts;
