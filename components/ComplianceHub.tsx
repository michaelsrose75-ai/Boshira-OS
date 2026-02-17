
import React from 'react';
import type { ComplianceChecklistItem } from '../types';
import { Shield, ExternalLink, AlertTriangle, PartyPopper } from 'lucide-react';

interface ComplianceHubProps {
  checklist: ComplianceChecklistItem[];
  onUpdate: (updatedList: ComplianceChecklistItem[]) => void;
  businessStartDate: string | null;
}

const ComplianceHub: React.FC<ComplianceHubProps> = ({ checklist, onUpdate, businessStartDate }) => {
  const handleToggle = (id: string) => {
    const updatedList = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate(updatedList);
  };

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Shield size={22} className="mr-3 text-indigo-400" />
        Business Compliance Hub
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        A guided checklist to help you navigate the essential legal and regulatory steps for launching your business.
      </p>

      {businessStartDate && (
        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/50 mb-6 text-center">
          <h4 className="font-semibold text-lg text-indigo-300 flex items-center justify-center">
            <PartyPopper size={20} className="mr-3"/>
            Business Founded
          </h4>
          <p className="text-gray-200 text-2xl font-mono mt-2">{new Date(businessStartDate).toLocaleString()}</p>
          <p className="text-sm text-indigo-400 mt-1">This marks the moment you executed your first task and your journey began.</p>
        </div>
      )}

      <div className="bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 px-4 py-3 rounded-lg mb-6 flex items-start" role="alert">
        <AlertTriangle className="h-6 w-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
        <div>
          <strong className="font-bold">Important Disclaimer:</strong>
          <p className="text-sm">This is an organizational tool, not legal or financial advice. The information provided is for educational purposes. Always consult with a qualified professional for your specific situation. We link to official government resources for accuracy.</p>
        </div>
      </div>

      <div className="space-y-4">
        {checklist.map(item => (
          <div key={item.id} className={`p-4 rounded-md transition-all ${item.completed ? 'bg-green-900/20 border-green-800/50' : 'bg-gray-900/50 border-gray-600'}`}>
            <div className="flex items-start">
              <input
                type="checkbox"
                id={`compliance-${item.id}`}
                checked={item.completed}
                onChange={() => handleToggle(item.id)}
                className="mt-1 h-5 w-5 rounded bg-gray-700 border-gray-500 text-indigo-500 focus:ring-indigo-600 cursor-pointer"
              />
              <div className="ml-4 flex-grow">
                <label htmlFor={`compliance-${item.id}`} className={`font-semibold text-lg cursor-pointer ${item.completed ? 'text-green-300 line-through' : 'text-white'}`}>
                  {item.text}
                </label>
                <p className={`text-sm mt-1 ${item.completed ? 'text-gray-500' : 'text-gray-400'}`}>
                  {item.description}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Go to Official Resource <ExternalLink size={12} className="ml-1.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceHub;
