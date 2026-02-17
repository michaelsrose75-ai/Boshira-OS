
import React, { useState, useEffect } from 'react';
import type { HunterBotFinding, ArsenalItem } from '../types';
import { Sparkles, Bot, Search, PlusCircle, BrainCircuit, FileText, X, Zap, Database, Film, Image as ImageIcon, Code, ExternalLink, ShieldCheck, RefreshCw, Link, Plus } from 'lucide-react';
import Loader from './Loader';

interface HunterBotDashboardProps {
  findings: HunterBotFinding[];
  onRunScan: (directives: string) => void;
  onSaveFinding: (index: number) => void;
  directives: string;
  onDirectivesChange: (directives: string) => void;
  arsenalItems: ArsenalItem[];
  onAddArsenalItem: (item: ArsenalItem) => void;
}

const HunterBotDashboard: React.FC<HunterBotDashboardProps> = ({ findings, onRunScan, onSaveFinding, directives, onDirectivesChange, arsenalItems, onAddArsenalItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReportIndex, setSelectedReportIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'arsenal'>('arsenal'); 
  const [isUpdatingArsenal, setIsUpdatingArsenal] = useState(false);
  
  // New Resource Input State
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ArsenalItem['category']>('Other');

  // Auto-switch to Scan tab if findings come in
  useEffect(() => {
      if (findings.length > 0 && activeTab !== 'scan') {
          setActiveTab('scan');
      }
  }, [findings.length]);

  const handleScan = async () => {
    setIsLoading(true);
    setActiveTab('scan'); // Force switch on scan start
    await onRunScan(directives);
    setIsLoading(false);
  };
  
  const handleUpdateArsenal = () => {
      setIsUpdatingArsenal(true);
      setTimeout(() => {
          setIsUpdatingArsenal(false);
      }, 1500);
  }

  const handleIngestResource = () => {
      if (!newItemUrl) return;
      
      // Simulate extraction of data from URL
      const name = newItemUrl.replace(/(^\w+:|^)\/\//, '').split('/')[0].replace('www.', '');
      
      const newItem: ArsenalItem = {
          id: crypto.randomUUID(),
          name: name.charAt(0).toUpperCase() + name.slice(1), // Mock Title
          url: newItemUrl,
          category: newItemCategory,
          limit: 'Free Tier (Detected)',
          useCase: 'Manual Ingestion via Scout Uplink',
          reset: 'Unknown'
      };
      
      onAddArsenalItem(newItem);
      setNewItemUrl('');
  };
  
  const renderReportText = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('## ')) {
        return <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{trimmed.substring(3)}</h4>;
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
         return <h5 key={index} className="text-md font-semibold text-indigo-300 mt-3 mb-1">{trimmed.substring(2, trimmed.length - 2)}</h5>;
      }
      if (trimmed.startsWith('- ')) {
        return <li key={index} className="text-gray-300">{trimmed.substring(2)}</li>
      }
      if (trimmed === '') return null;
      return <p key={index} className="text-gray-300 mb-2">{paragraph}</p>;
    }).filter(Boolean);
  };

  const getCategoryIcon = (category: string) => {
      switch (category) {
          case 'Intelligence': return <BrainCircuit size={16}/>;
          case 'Information': return <Zap size={16}/>;
          case 'Video': return <Film size={16}/>;
          case 'Image': return <ImageIcon size={16}/>;
          case 'Audio': return <Zap size={16}/>;
          case 'Infrastructure': return <Database size={16}/>;
          default: return <Code size={16}/>;
      }
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <Sparkles size={22} className="mr-3 text-indigo-400" />
                Hunter Bot (Elite Intelligence)
            </h3>
            <p className="text-sm text-gray-400">
                Your dedicated AI for discovering new business opportunities and mapping free resources.
            </p>
        </div>
        <div className="flex space-x-2 bg-gray-900/50 p-1 rounded-lg">
            <button onClick={() => setActiveTab('arsenal')} className={`px-3 py-1.5 text-xs font-bold rounded-md ${activeTab === 'arsenal' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>Zero-Cost Arsenal</button>
            <button onClick={() => setActiveTab('scan')} className={`px-3 py-1.5 text-xs font-bold rounded-md ${activeTab === 'scan' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Active Scan</button>
        </div>
      </div>

    {activeTab === 'scan' && (
      <>
       <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 mb-4">
        <label htmlFor="hunter-directives" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <BrainCircuit size={16} className="mr-2" />
          Directives (Optional)
        </label>
        <div className="flex items-center space-x-4">
          <textarea
            id="hunter-directives"
            value={directives}
            onChange={(e) => onDirectivesChange(e.target.value)}
            placeholder="e.g., 'Focus on SaaS products for the creator economy using new AI video models...'"
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white text-sm resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleScan}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex-shrink-0 h-full"
          >
            {isLoading ? <Loader small /> : <><Search className="h-5 w-5 mr-2" />Scan</>}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 min-h-[200px]">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Hunter's Discoveries</h4>
        {findings.length > 0 ? (
          <ul className="space-y-2">
            {findings.map((finding, index) => (
              <li 
                key={index} 
                className="bg-gray-800/50 p-3 rounded-md border border-gray-700 flex justify-between items-center hover:border-indigo-600 transition-colors"
              >
                <div>
                    <p className="font-semibold text-indigo-400">{finding.generatedBlueprint.title}</p>
                    <p className="text-xs text-gray-400">{finding.generatedBlueprint.description}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => setSelectedReportIndex(index)}
                      className="flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-md bg-blue-900/50 hover:bg-blue-800/50 border border-blue-700/50"
                      title="View the intelligence report"
                    >
                      <FileText size={16} className="mr-2" />
                      View Report
                    </button>
                    <button
                      onClick={() => onSaveFinding(index)}
                      className="flex items-center text-sm font-semibold text-green-400 hover:text-green-300 transition-colors px-3 py-1.5 rounded-md bg-green-900/50 hover:bg-green-800/50 border border-green-700/50"
                      title="Save this discovery to your blueprints"
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Save Blueprint
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-10 text-center">
            <Bot size={32} className="mb-2"/>
            <p>The Hunter Bot's findings will appear here.</p>
            <p className="text-xs mt-1">Provide directives and run a scan to discover new ventures.</p>
          </div>
        )}
      </div>
      </>
    )}

    {activeTab === 'arsenal' && (
        <div className="animate-fade-in">
            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg mb-4 flex justify-between items-center">
                <div className="flex items-start">
                    <ShieldCheck size={24} className="text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                         <h4 className="text-sm font-bold text-yellow-300 mb-1">TRAINING PROTOCOL ACTIVE: ZERO-COST ONLY</h4>
                        <p className="text-xs text-yellow-200/80">
                             The Hive is strictly prohibited from burning capital. We push free tiers to their absolute limit. 
                             When a tool caps out, we switch or wait. <strong>Do not upgrade until "Go Live" order.</strong>
                        </p>
                    </div>
                </div>
                <button onClick={handleUpdateArsenal} disabled={isUpdatingArsenal} className="flex items-center px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-md text-xs font-bold border border-yellow-500/30 transition-colors">
                    {isUpdatingArsenal ? <Loader small/> : <><RefreshCw size={14} className="mr-2"/>Scan for Updates</>}
                </button>
            </div>
            
            {/* Scout Uplink - Resource Ingestion */}
            <div className="mb-6 bg-green-900/10 border border-green-500/30 p-4 rounded-lg">
                <h5 className="text-sm font-bold text-green-300 mb-3 flex items-center"><Link size={14} className="mr-2"/>Scout Uplink: Ingest New Resource</h5>
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <input 
                        type="text" 
                        value={newItemUrl} 
                        onChange={(e) => setNewItemUrl(e.target.value)}
                        placeholder="Paste URL (e.g., mixkit.co, huggingface.co)"
                        className="flex-grow bg-black/40 border border-green-500/30 rounded-md px-3 py-2 text-white text-sm focus:border-green-400 focus:ring-0"
                    />
                    <select 
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as ArsenalItem['category'])}
                        className="bg-black/40 border border-green-500/30 rounded-md px-3 py-2 text-white text-sm focus:border-green-400"
                    >
                        <option value="Other">Category...</option>
                        <option value="Video">Video</option>
                        <option value="Audio">Audio</option>
                        <option value="Image">Image</option>
                        <option value="Intelligence">Intelligence</option>
                    </select>
                    <button 
                        onClick={handleIngestResource}
                        disabled={!newItemUrl}
                        className="btn-primary bg-green-600 border-green-500 text-white hover:bg-green-700 flex items-center px-4 py-2 text-xs font-bold whitespace-nowrap"
                    >
                        <Plus size={14} className="mr-1.5"/>
                        Ingest
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {arsenalItems.map((tool, i) => (
                    <div key={i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                            <span className="text-[10px] font-mono text-gray-600 bg-black/60 px-1.5 py-0.5 rounded border border-gray-800">Resets: {tool.reset}</span>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-gray-800 rounded-md text-indigo-400 group-hover:text-green-400 transition-colors">{getCategoryIcon(tool.category)}</div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 bg-black/40 px-2 py-1 rounded mt-1 mr-16">{tool.category}</span>
                        </div>
                        <h5 className="font-bold text-white flex items-center truncate pr-2">
                            {tool.name}
                            {tool.url && <ExternalLink size={12} className="ml-2 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => window.open(tool.url, '_blank')} />}
                        </h5>
                        <p className="text-xs text-green-400 font-mono mt-1 mb-2 font-bold">{tool.limit}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{tool.useCase}</p>
                    </div>
                ))}
            </div>
        </div>
    )}

      {selectedReportIndex !== null && findings[selectedReportIndex] && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReportIndex(null)}
        >
          <div 
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-800/80 p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Hunter Bot Intelligence Report</h3>
                <button onClick={() => setSelectedReportIndex(null)} className="p-1 rounded-full hover:bg-gray-700"><X size={24}/></button>
            </div>
            <div className="p-6 overflow-y-auto">
                <div className="prose prose-invert prose-sm max-w-none">
                    {renderReportText(findings[selectedReportIndex].researchReport.text)}
                    <h5 className="text-md font-semibold text-indigo-300 mt-6 mb-2">Sources</h5>
                    <ul className="space-y-1 text-xs">
                        {findings[selectedReportIndex].researchReport.sources.map(source => (
                            <li key={source.id} className="p-2 bg-gray-900/50 rounded-md">
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{source.url}</a>
                                <p className="text-gray-400">Trust: {(source.trust * 100).toFixed(0)}% | Date: {source.date} {source.bias && <span className="text-yellow-400 font-semibold">| Bias: {source.bias}</span>}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HunterBotDashboard;
