import React from 'react';
import type { AdaptationSuggestion } from '../types';
import { X, Lightbulb, Bot, User, BrainCircuit, AlertTriangle } from 'lucide-react';

interface AdaptationModalProps {
  suggestions: AdaptationSuggestion[] | null;
  error: string | null;
  onClose: () => void;
}

const AdaptationModal: React.FC<AdaptationModalProps> = ({ suggestions, error, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BrainCircuit className="mr-3 text-indigo-400" />
            AI Adaptation Suggestions
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center" role="alert">
              <AlertTriangle className="h-6 w-6 mr-3 text-red-400" />
              <div>
                <strong className="font-bold">Error:</strong> {error}
              </div>
            </div>
          )}

          {suggestions && (
            <div className="space-y-6">
              <p className="text-gray-300 bg-gray-900/40 p-3 rounded-md border border-gray-700">
                Here are some ways to enhance your business plan using new technologies. You can use the "Edit Idea" feature to incorporate these suggestions into your Launch Blueprint.
              </p>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
                    <Lightbulb size={20} className="mr-3" />
                    {suggestion.technology}
                  </h3>
                  <p className="text-gray-300 mb-4">{suggestion.benefit}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="flex items-center text-md font-semibold text-blue-400 mb-2">
                        <Bot size={18} className="mr-2" />
                        New AI Tasks
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm pl-2">
                        {suggestion.aiTaskChanges.map((task, i) => <li key={i}>{task}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center text-md font-semibold text-green-400 mb-2">
                        <User size={18} className="mr-2" />
                        New User Tasks
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm pl-2">
                        {suggestion.userTaskChanges.map((task, i) => <li key={i}>{task}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdaptationModal;