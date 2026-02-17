import React, { useMemo, useState, useCallback } from 'react';
import type { Idea, Strategy } from '../types';
import { X, Share2, Copy, CheckCircle2 } from 'lucide-react';

interface ShareModalProps {
  idea: Idea;
  strategy: Strategy;
  selectedStrategyIndex: number;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ idea, strategy, selectedStrategyIndex, onClose }) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { shareSummary, shareUrl } = useMemo(() => {
    const payload = { idea, selectedStrategyIndex };
    const encodedData = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}#share=${encodedData}`;

    const summary = `
AI Agent Blueprint: ${idea.title}
Strategy: ${strategy.strategyName}
-------------------------------------
Description: ${idea.description}
-------------------------------------
Key Financials:
- Total Investment: $${strategy.totalInvestment.toLocaleString()}
- Projected Profit: $${strategy.projectedProfit.toLocaleString()}
- Time to Profit: ${strategy.timeToProfit}
-------------------------------------
View this blueprint: ${url}
    `.trim();

    return { shareSummary: summary, shareUrl: url };
  }, [idea, strategy, selectedStrategyIndex]);

  const handleCopyToClipboard = useCallback((text: string, type: 'summary' | 'link') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'summary') {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10 p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Share2 className="mr-3 text-indigo-400" />
            Share Blueprint
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div>
            <label htmlFor="share-summary" className="block text-sm font-medium text-gray-300 mb-2">
              Blueprint Summary
            </label>
            <div className="relative">
              <textarea
                id="share-summary"
                readOnly
                value={shareSummary}
                className="w-full h-48 bg-gray-900/50 rounded-md p-3 text-gray-300 text-sm font-mono border border-gray-600 focus:ring-0 focus:outline-none"
              />
              <button 
                onClick={() => handleCopyToClipboard(shareSummary, 'summary')}
                className="absolute top-2 right-2 flex items-center px-3 py-1.5 text-xs font-semibold bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                {copiedSummary ? <><CheckCircle2 size={14} className="mr-1 text-green-400"/>Copied!</> : <><Copy size={14} className="mr-1"/>Copy</>}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="share-link" className="block text-sm font-medium text-gray-300 mb-2">
              Shareable Link
            </label>
            <div className="relative">
              <input
                id="share-link"
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-gray-900/50 rounded-md p-3 text-indigo-300 text-sm font-mono border border-gray-600 truncate focus:ring-0 focus:outline-none"
              />
              <button 
                onClick={() => handleCopyToClipboard(shareUrl, 'link')}
                className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
                >
                 {copiedLink ? <><CheckCircle2 size={14} className="mr-1"/>Copied!</> : <><Copy size={14} className="mr-1"/>Copy Link</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
