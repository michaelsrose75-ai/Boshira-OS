import React, { useState, useEffect } from 'react';
import type { BrainModel } from '../types';
import { Atom, Zap } from 'lucide-react';

interface AICoreSwapProps {
    currentModel: BrainModel;
    onModelChange: (model: BrainModel) => void;
}

const AICoreSwap: React.FC<AICoreSwapProps> = ({ currentModel, onModelChange }) => {
    const [newModel, setNewModel] = useState(currentModel);

    useEffect(() => {
        setNewModel(currentModel);
    }, [currentModel]);

    const handleSwap = () => {
        if (newModel.trim()) {
            onModelChange(newModel.trim());
        }
    };

    return (
        <div>
            <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                <Atom size={18} className="mr-2" />AI Core Swap
            </h4>
            <p className="text-sm text-gray-400 mb-4">
                Dynamically change the local AI model used by the Paradigm Shift Council. This allows for upgrading the Hive's in-browser "brain".
            </p>
            <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-400">Current Active Core</label>
                    <p className="text-sm font-mono text-indigo-300 bg-gray-800/50 p-2 rounded-md mt-1">{currentModel}</p>
                </div>
                <div>
                    <label htmlFor="new-model-input" className="block text-xs font-medium text-gray-400">New Hugging Face Model Name</label>
                     <div className="flex items-center space-x-2 mt-1">
                        <input
                            id="new-model-input"
                            type="text"
                            value={newModel}
                            onChange={(e) => setNewModel(e.target.value)}
                            placeholder="e.g., Xenova/tiny-llama-1.1b-chat-v1.0-q0f16"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-white"
                        />
                        <button
                            onClick={handleSwap}
                            className="btn-primary whitespace-nowrap"
                        >
                            <Zap size={16} className="mr-2"/>
                            Swap Core
                        </button>
                    </div>
                     <p className="text-xs text-gray-500 mt-2">
                        Find compatible models on the <a href="https://huggingface.co/models?library=transformers.js" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Hugging Face Hub</a>. Look for text-generation models supported by Transformers.js.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AICoreSwap;