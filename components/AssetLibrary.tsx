import React, { useState } from 'react';
import type { KeyAsset } from '../types';
import { Library, Bot, FileText, X } from 'lucide-react';

interface AssetLibraryProps {
  assets: KeyAsset[];
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ assets }) => {
  const [selectedAsset, setSelectedAsset] = useState<KeyAsset | null>(null);

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Library size={22} className="mr-3 text-indigo-400" />
        Shared Asset Library (Hippocampus)
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        A repository of high-quality outputs from your agents. Proven assets can be referenced or reused by other agents to improve fleet-wide performance.
      </p>
      <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 min-h-[200px]">
        {assets.length > 0 ? (
          <ul className="space-y-2">
            {assets.map((asset) => (
              <li key={asset.id}>
                <button
                  onClick={() => setSelectedAsset(asset)}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-700/50 transition-colors flex items-center"
                >
                  <FileText size={16} className="mr-3 text-gray-400" />
                  <span className="text-gray-300 font-medium">{asset.title}</span>
                  <span className="text-xs text-gray-500 ml-auto">from: {asset.sourceAgent}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 pt-10">
            <p>Your asset library is empty.</p>
          </div>
        )}
      </div>

      {selectedAsset && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAsset(null)}
        >
          <div 
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700 flex justify-between items-start">
              <div>
                <h4 className="text-xl font-bold text-white">{selectedAsset.title}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  <span className="font-semibold">Source Task:</span> "{selectedAsset.taskText}"
                </p>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-gray-300 bg-gray-900/50 p-4 rounded-md">{selectedAsset.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetLibrary;