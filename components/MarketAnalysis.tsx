import React, { useState, useCallback } from 'react';
import { getMarketAnalysis } from '../services/geminiService';
import type { MarketAnalysisResult } from '../types';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import { Globe, Search, Link as LinkIcon } from 'lucide-react';

interface MarketAnalysisProps {
  ideaTitle: string;
  ideaDescription: string;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ ideaTitle, ideaDescription }) => {
  const [result, setResult] = useState<MarketAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const analysisResult = await getMarketAnalysis(ideaTitle, ideaDescription);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [ideaTitle, ideaDescription]);

  // A simple renderer that adds headings and paragraphs for structure
  const renderAnalysisText = (text: string) => {
    // Handles markdown-style headings (##) and bolded lines as headings.
    return text.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('## ')) {
        return <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{trimmed.substring(3)}</h4>;
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
         return <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{trimmed.substring(2, trimmed.length - 2)}</h4>;
      }
      if (trimmed === '') return null;
      return <p key={index} className="text-gray-300 mb-2 leading-relaxed">{paragraph}</p>;
    });
  };


  return (
    <div className="mt-4 p-6 bg-gray-900/60 rounded-lg border border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
        <Globe size={18} className="mr-3" />
        Market Analysis
      </h4>
      <p className="text-sm text-gray-400 mb-4">
        Leverage Google Search to get real-time market insights for this business idea.
      </p>

      {!result && !isLoading && !error && (
        <button
          onClick={handleGenerateAnalysis}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-colors"
        >
          <Search size={16} className="mr-2" />
          Generate Analysis
        </button>
      )}

      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
            {renderAnalysisText(result.analysisText)}
          </div>

          {result.sources && result.sources.length > 0 && (
            <div>
              <h5 className="text-md font-semibold text-gray-300 mb-2 flex items-center">
                <LinkIcon size={16} className="mr-2" />
                Sources
              </h5>
              <ul className="space-y-1 text-sm list-disc list-inside">
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                      title={source.web.uri}
                    >
                      {source.web.title || source.web.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;
