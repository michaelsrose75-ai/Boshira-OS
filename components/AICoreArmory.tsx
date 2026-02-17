import React, { useState, useEffect } from 'react';
import type { BrainModel, LocalAICores } from '../types';
import { Atom, Zap, Brain, Eye, Volume2 } from 'lucide-react';

interface AICoreArmoryProps {
    cores: LocalAICores;
    onCoreChange: (coreType: keyof LocalAICores, modelName: BrainModel) => void;
}

const AICoreArmory: React.FC<AICoreArmoryProps> = ({ cores, onCoreChange }) => {
    const [textModel, setTextModel] = useState(cores.text);
    const [visionModel, setVisionModel] = useState(cores.vision);
    const [audioModel, setAudioModel] = useState(cores.audio);

    useEffect(() => {
        setTextModel(cores.text);
        setVisionModel(cores.vision);
        setAudioModel(cores.audio);
    }, [cores]);

    const handleSwap = (coreType: keyof LocalAICores) => {
        let modelToSwap = '';
        if (coreType === 'text') modelToSwap = textModel;
        else if (coreType === 'vision') modelToSwap = visionModel;
        else if (coreType === 'audio') modelToSwap = audioModel;

        if (modelToSwap.trim()) {
            onCoreChange(coreType, modelToSwap.trim());
        }
    };
    
    const CoreInput: React.FC<{
        title: string;
        icon: React.ReactNode;
        model: string;
        setModel: (val: string) => void;
        onSwap: () => void;
        recommendation: string;
        specializedUpgrade?: { name: string, description: string };
    }> = ({ title, icon, model, setModel, onSwap, recommendation, specializedUpgrade }) => (
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <h5 className="font-bold text-white mb-3 flex items-center">{icon}{title}</h5>
            <div>
                <label htmlFor={`${title}-model-input`} className="block text-xs font-medium text-gray-400">Hugging Face Model Name (Transformers.js)</label>
                <div className="flex items-center space-x-2 mt-1">
                    <input
                        id={`${title}-model-input`}
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-white font-mono text-sm"
                    />
                    <button onClick={onSwap} className="btn-primary whitespace-nowrap text-sm">
                        <Zap size={14} className="mr-2"/>Swap Core
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Recommended Upgrade: <code onClick={() => setModel(recommendation)} className="font-semibold text-indigo-400 hover:underline cursor-pointer">{recommendation}</code>
                </p>
                {specializedUpgrade && (
                     <p className="text-xs text-gray-500 mt-1">
                        Specialized TF.js Core: <code className="font-semibold text-cyan-400">{specializedUpgrade.name}</code> ({specializedUpgrade.description})
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                <Atom size={18} className="mr-2" />AI Core Armory
            </h4>
            <p className="text-sm text-gray-400 mb-4">
                Manage and upgrade the Hive's local, in-browser "digital organs." Swap models from Hugging Face or view specialized cores from other hubs.
            </p>
            <div className="space-y-4">
                <CoreInput 
                    title="Brain (Text Generation)"
                    icon={<Brain size={16} className="mr-2"/>}
                    model={textModel}
                    setModel={setTextModel}
                    onSwap={() => handleSwap('text')}
                    recommendation="Xenova/tiny-llama-1.1b-chat-v1.0-q0f16"
                />
                <CoreInput 
                    title="Eyes (Image Understanding)"
                    icon={<Eye size={16} className="mr-2"/>}
                    model={visionModel}
                    setModel={setVisionModel}
                    onSwap={() => handleSwap('vision')}
                    recommendation="Xenova/vit-gpt2-image-captioning"
                    specializedUpgrade={{ name: 'coco-ssd (TensorFlow.js)', description: 'for Object Detection' }}
                />
                <CoreInput 
                    title="Voice (Text-to-Speech)"
                    icon={<Volume2 size={16} className="mr-2"/>}
                    model={audioModel}
                    setModel={setAudioModel}
                    onSwap={() => handleSwap('audio')}
                    recommendation="Xenova/speecht5_tts"
                />
            </div>
        </div>
    );
};

export default AICoreArmory;