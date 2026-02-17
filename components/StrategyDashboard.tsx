
import React from 'react';
import type { Idea, KeyAsset, PortfolioRules, VaultCredential, HunterBotFinding, ArsenalItem } from '../types';
import { Brain, Lightbulb, Recycle, Zap, Check, X, BookOpen, Repeat, Star } from 'lucide-react';
import PortfolioRulesComponent from './PortfolioRules';
import MarketIntel from './MarketIntel';
import AssetLibrary from './AssetLibrary';
import HunterBotDashboard from './HunterBotDashboard';
import CredentialVault from './CredentialVault';
import EmailProviderSelector from './EmailProviderSelector';

interface CognitiveArchitectureDashboardProps {
  rules: PortfolioRules;
  onUpgradeProposal: (approved: boolean) => void;
}

const CognitiveArchitectureDashboard: React.FC<CognitiveArchitectureDashboardProps> = ({ rules, onUpgradeProposal }) => {
  const { aemlMemory, interactionCount, founderDirectives, upgradeProposal } = rules;
  const interactionsUntilNextCycle = 10 - (interactionCount % 10);

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Brain size={22} className="mr-3 text-indigo-400" />
        Cognitive Architecture
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Oversee the AI's learning processes, memory, and core directives.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AEML */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
          <h4 className="font-semibold text-white mb-3 flex items-center"><BookOpen size={18} className="mr-2"/>Auto-Evolving Memory Layer (AEML)</h4>
          {aemlMemory.length > 0 ? (
            <ul className="space-y-2">
              {aemlMemory.map(insight => (
                <li key={insight.id} className="p-2 bg-gray-800/50 rounded-md border border-gray-700">
                  <p className="text-xs text-gray-300">"{insight.insight}"</p>
                  <p className="text-right text-xs text-indigo-400 font-mono">Score: {insight.score}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500 text-center py-8">Memory bank is empty.</p>}
        </div>

        {/* AUL */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
            <h4 className="font-semibold text-white mb-3 flex items-center"><Repeat size={18} className="mr-2"/>Autonomous Upgrade Loop (AUL)</h4>
            <div className="text-center">
              <p className="text-3xl font-mono font-bold text-indigo-300">{interactionsUntilNextCycle}</p>
              <p className="text-sm text-gray-400">interactions until next self-audit</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${100 - interactionsUntilNextCycle * 10}%` }}></div>
              </div>
            </div>
          </div>

          {upgradeProposal && (
            <div className="bg-yellow-900/30 p-4 rounded-md border border-yellow-700/50 animate-fade-in">
              <h4 className="font-semibold text-yellow-300 mb-2 flex items-center"><Lightbulb size={18} className="mr-2"/>Upgrade Proposal Pending</h4>
              <p className="text-sm text-yellow-200 mb-4">{upgradeProposal.text}</p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => onUpgradeProposal(false)} className="flex items-center px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md"><X size={14} className="mr-1"/>Reject</button>
                <button onClick={() => onUpgradeProposal(true)} className="flex items-center px-3 py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-md"><Check size={14} className="mr-1"/>Approve & Integrate</button>
              </div>
            </div>
          )}
          
          <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
             <h4 className="font-semibold text-white mb-3 flex items-center"><Star size={18} className="mr-2"/>Founder Directives</h4>
             <ul className="space-y-1 text-sm text-gray-400 list-disc list-inside">
                {founderDirectives.map((d, i) => <li key={i}>{d}</li>)}
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

interface StrategyDashboardProps {
  agents: Idea[];
  rules: PortfolioRules;
  onRulesChange: (newRules: PortfolioRules) => void;
  assetLibrary: KeyAsset[];
  hunterBotFindings: HunterBotFinding[];
  onRunHunterBotScan: (directives: string) => void;
  onSaveHunterBotFinding: (index: number) => void;
  hunterBotDirectives: string;
  onHunterBotDirectivesChange: (directives: string) => void;
  onUpgradeProposal: (approved: boolean) => void;
  arsenalItems: ArsenalItem[];
  onAddArsenalItem: (item: ArsenalItem) => void;
}

const StrategyDashboard: React.FC<StrategyDashboardProps> = ({ 
    agents, 
    rules, 
    onRulesChange, 
    assetLibrary,
    hunterBotFindings,
    onRunHunterBotScan,
    onSaveHunterBotFinding,
    hunterBotDirectives,
    onHunterBotDirectivesChange,
    onUpgradeProposal,
    arsenalItems,
    onAddArsenalItem
}) => {
  
  const handleCredentialsUpdate = (newCredentials: VaultCredential[]) => {
      onRulesChange({ ...rules, credentials: newCredentials });
  };

  return (
    <div className="mt-8 space-y-8">
      <PortfolioRulesComponent rules={rules} onRulesChange={onRulesChange} />
      <EmailProviderSelector rules={rules} onRulesChange={onRulesChange} />
      <CognitiveArchitectureDashboard rules={rules} onUpgradeProposal={onUpgradeProposal} />
      <CredentialVault credentials={rules.credentials} onUpdate={handleCredentialsUpdate} />
      <HunterBotDashboard 
        findings={hunterBotFindings}
        onRunScan={onRunHunterBotScan}
        onSaveFinding={onSaveHunterBotFinding}
        directives={hunterBotDirectives}
        onDirectivesChange={onHunterBotDirectivesChange}
        arsenalItems={arsenalItems}
        onAddArsenalItem={onAddArsenalItem}
      />
      <MarketIntel agents={agents} />
      <AssetLibrary assets={assetLibrary} />
    </div>
  );
};

export default StrategyDashboard;
