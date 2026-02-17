import React, { useState } from 'react';
import { DatabaseZap, Bot, Sparkles, Activity, MessageSquare, ShoppingCart } from 'lucide-react';
import Loader from './Loader';

interface AlphaIngestionDashboardProps {
    onBootstrap: (source: string) => Promise<void>;
}

const AlphaIngestionDashboard: React.FC<AlphaIngestionDashboardProps> = ({ onBootstrap }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSource, setSelectedSource] = useState<string | null>(null);

    const handleBootstrap = async (source: string) => {
        setIsLoading(true);
        setSelectedSource(source);
        await onBootstrap(source);
        setIsLoading(false);
        setSelectedSource(null);
    };

    const sources = [
        { id: 'crypto', name: 'Crypto Market Data', icon: <Activity size={20} />, description: 'Real-time on-chain data, token launches, and transaction volumes.' },
        { id: 'social', name: 'Social Media Trends', icon: <MessageSquare size={20} />, description: 'Emerging narratives, viral content patterns, and sentiment analysis.' },
        { id: 'ecommerce', name: 'E-commerce Velocity', icon: <ShoppingCart size={20} />, description: 'Fast-moving products, consumer demand signals, and market gaps.' },
    ];

    return (
        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <DatabaseZap size={22} className="mr-3 text-indigo-400" />
                Alpha Ingestion Protocol
            </h3>
            <p className="text-sm text-gray-400 mb-6">
                Bootstrap the Hive with a high-velocity data stream to give it an initial, unfair market advantage. This simulates a large-scale analysis to find "alpha" and generate hyper-targeted initial blueprints.
            </p>

            <div className="bg-indigo-900/30 border border-indigo-700/50 text-indigo-200 px-4 py-3 rounded-lg mb-6" role="alert">
                <strong className="font-bold">Architect's Note:</strong> This protocol is powered by the infrastructure you designed using <strong className="text-white">Google Pub/Sub</strong> for data streaming and <strong className="text-white">BigQuery</strong> for large-scale analysis.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sources.map(source => (
                    <div key={source.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-600 flex flex-col items-center text-center">
                        <div className="text-indigo-400 mb-3">{source.icon}</div>
                        <h4 className="font-semibold text-white">{source.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 mb-4 flex-grow">{source.description}</p>
                        <button 
                            onClick={() => handleBootstrap(source.name)} 
                            disabled={isLoading}
                            className="w-full btn-primary text-sm mt-auto"
                        >
                            {isLoading && selectedSource === source.name ? <Loader small /> : 'Bootstrap'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlphaIngestionDashboard;