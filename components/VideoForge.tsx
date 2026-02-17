import React, { useState } from 'react';
import { Film, Zap, Sparkles } from 'lucide-react';
import { generateVideo } from '../services/geminiService';
import Loader from './Loader';
import type { VaultCredential } from '../types';

interface VideoForgeProps {
    credentials: VaultCredential[];
}

const VideoForge: React.FC<VideoForgeProps> = ({ credentials }) => {
    const [prompt, setPrompt] = useState('A hyper-realistic forged iron rose dripping lava, 8k, dark fantasy, cinematic lighting');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const replicateApiKey = credentials.find(c => c.service === 'REPLICATE_API_TOKEN')?.apiKey;

    const handleForgeVideo = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        try {
            // In a real app, we'd pass the Replicate API key.
            const result = await generateVideo(prompt, replicateApiKey);
            setVideoUrl(result.videoUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to forge video.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white flex items-center">
                    <Film size={18} className="mr-2" />Video Forge
                </h4>
            </div>
            <p className="text-sm text-gray-400 mb-6">
                Forge video scenes from text prompts. This is the crucible for creating dynamic visual assets for the YouTube Automation protocol and marketing campaigns.
            </p>
             {!replicateApiKey && (
                <div className="bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 p-3 rounded-lg mb-4 text-sm">
                    <strong>Warning:</strong> REPLICATE_API_TOKEN not found in your Credential Vault. Video generation is in mock mode. Add your key in the Strategy dashboard to use a real video generation service.
                </div>
            )}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                <div className="mb-4">
                    <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                        Visual Prompt
                    </label>
                    <textarea
                        id="video-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-white h-24"
                        disabled={isLoading}
                        placeholder="e.g., A close-up of a glowing molten steel rose being hammered on an anvil, sparks flying..."
                    />
                </div>
                <button
                    onClick={handleForgeVideo}
                    disabled={isLoading || !prompt}
                    className="w-full btn-primary flex items-center justify-center"
                >
                    {isLoading ? <Loader small /> : <><Sparkles size={16} className="mr-2"/>Forge Video</>}
                </button>
            </div>

            {(isLoading || videoUrl || error) && (
                 <div className="mt-6 bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                    <h5 className="font-semibold text-white mb-4">Forged Asset</h5>
                    <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center border border-gray-700">
                        {isLoading && <Loader />}
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        {videoUrl && (
                            <video src={videoUrl} controls autoPlay muted loop className="w-full h-full rounded-md">
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoForge;
