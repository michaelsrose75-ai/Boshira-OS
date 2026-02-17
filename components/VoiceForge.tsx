import React, { useState } from 'react';
import { Rss, Play, Loader as LoaderIcon } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';

const VoiceForge: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [textToSpeak, setTextToSpeak] = useState("The sharpest blade is forged in the hottest fire. Our resolve must be stronger, our strategy more precise.");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voices = [
    { id: 'Kore', name: 'Kore', description: 'Calm, authoritative (Kageyoshi\'s primary voice)' },
    { id: 'Puck', name: 'Puck', description: 'Energetic, youthful' },
    { id: 'Charon', name: 'Charon', description: 'Deep, resonant' },
    { id: 'Fenrir', name: 'Fenrir', description: 'Gravelly, wise' },
    { id: 'Zephyr', name: 'Zephyr', description: 'Friendly, engaging' },
  ];

  const handlePlay = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, generateSpeech would need to accept the voice name.
      // This is simulated here. Kageyoshi's primary voice is 'Kore'.
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const base64Audio = await generateSpeech(textToSpeak);
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to generate and play audio.';
      setError(msg);
      console.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-white flex items-center">
          <Rss size={18} className="mr-2" />Vocal Experimentation Lab
        </h4>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        This is my lab for testing different vocal tones and styles for specific content creation tasks, such as narrating a video or a marketing campaign.
      </p>

      <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
        <div className="mb-4">
          <label htmlFor="voice-text" className="block text-sm font-medium text-gray-300 mb-2">
            Text to Synthesize
          </label>
          <textarea
            id="voice-text"
            value={textToSpeak}
            onChange={(e) => setTextToSpeak(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-white h-24"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handlePlay}
          disabled={isLoading || !textToSpeak}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isLoading ? <LoaderIcon className="animate-spin" size={20} /> : <Play size={20} className="mr-2" />}
          {isLoading ? 'Generating...' : 'Test Voice'}
        </button>

        {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default VoiceForge;
