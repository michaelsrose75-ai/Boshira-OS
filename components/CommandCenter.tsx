
import React, { useState } from 'react';
import type { Idea, OverseerLogEntry, PortfolioRules, KeyAsset, WishlistItem, FinancialTransaction, Campaign, ComplianceChecklistItem, Simulation, SimulationScenario, FounderProfile, VaultCredential, HunterBotFinding, AutoTraderState, Product, TaxGuruReport, HostEnvironment, CfoReport, ProductBlueprint, ArsenalItem } from '../types';
import AgentControlCard from './AgentControlCard';
import { Server, DollarSign, List, Shield, BrainCircuit, BarChart, Users, Flag, Trophy, TrendingUp, Orbit, User as FounderIcon, Repeat, ShoppingCart, HardDrive, ShieldCheck, Gem, Grid, Hexagon, Film } from 'lucide-react';
import FinancialDashboard from './FinancialDashboard';
import StrategyDashboard from './StrategyDashboard';
import WishlistDashboard from './WishlistDashboard';
import PerformanceAnalytics from './PerformanceAnalytics';
import AgentNetwork from './AgentNetwork';
import CampaignPlanner from './CampaignPlanner';
import FinancialForecasting from './FinancialForecasting';
import ComplianceHub from './ComplianceHub';
import ScenarioModeler from './ScenarioModeler';
import FounderDashboard from './FounderDashboard';
import AutoTraderDashboard from './AutoTraderDashboard';
import ProductLaunchpad from './ProductLaunchpad';
import ExecutiveCommand from './ExecutiveCommand';
import SystemStatus from './SystemStatus';
import HostEnvironmentDashboard from './HostEnvironmentDashboard';
import DynastyDashboard from './DynastyDashboard';
import AlphaIngestionDashboard from './AlphaIngestionDashboard';
import HiveDashboard from './HiveDashboard';
import KeyAcquisitionWidget from './KeyAcquisitionWidget';
import ShowrunnerDashboard from './ShowrunnerDashboard';

interface CommandCenterProps {
  agents: Idea[];
  onUpdateAgent: (updatedIdea: Idea) => void;
  log: OverseerLogEntry[];
  addLogEntry: (agentTitle: string, message: string, type: OverseerLogEntry['type']) => void;
  rules: PortfolioRules;
  onRulesChange: (newRules: PortfolioRules) => void;
  assetLibrary: KeyAsset[];
  hunterBotBudget: number;
  hunterBotFindings: HunterBotFinding[];
  onRunHunterBotScan: (directives: string) => void;
  onSaveHunterBotFinding: (index: number) => void;
  wishlistItems: WishlistItem[];
  onWishlistUpdate: (items: WishlistItem[]) => void;
  financialTransactions: FinancialTransaction[];
  newVentureFund: number;
  campaigns: Campaign[];
  onCampaignUpdate: (campaigns: Campaign[]) => void;
  savedBlueprints: Idea[];
  complianceChecklist: ComplianceChecklistItem[];
  onComplianceUpdate: (checklist: ComplianceChecklistItem[]) => void;
  simulations: Simulation[];
  onRunSimulation: (scenario: SimulationScenario) => Promise<Simulation>;
  businessStartDate: string | null;
  founderProfile: FounderProfile;
  onFounderProfileUpdate: (profile: FounderProfile) => void;
  hunterBotDirectives: string;
  onHunterBotDirectivesChange: (directives: string) => void;
  onUpgradeProposal: (approved: boolean) => void;
  autoTraderState: AutoTraderState;
  onDeployAutoTrader: () => void;
  products: Product[];
  productBlueprints: ProductBlueprint[];
  onLaunchNewProduct: (blueprintId: string) => void;
  onUpdateProduct: (product: Product) => void;
  onExecuteExecutiveCommand: (command: 'make_money') => void;
  isExecutiveCommandLoading: boolean;
  onSimulateGumroadSale: (productName: string, price: number) => void;
  taxGuruReport: TaxGuruReport | null;
  onRunTaxGuru: () => void;
  cfoReport: CfoReport | null;
  onRunCfoAnalysis: () => void;
  systemStability: number;
  hiveLockdown: boolean;
  hostEnvironment: HostEnvironment;
  onHostEnvironmentUpdate: (env: HostEnvironment) => void;
  handleBootstrapWithMarketData: (source: string) => Promise<void>;
  onGenerateCopyrightStrategy: () => Promise<void>;
  onGenerateNextVideo: (seriesId: string) => Promise<void>;
  onGenerateVoiceover: (productId: string) => Promise<void>;
  onSpawnDrone: (agentId: string) => void;
  arsenalItems: ArsenalItem[];
  onAddArsenalItem: (item: ArsenalItem) => void;
}

type CommandView = 'hive_visualizer' | 'showrunner' | 'grid_overview' | 'host' | 'financials' | 'forecasting' | 'analytics' | 'network' | 'campaigns' | 'simulations' | 'wishlist' | 'strategy' | 'compliance' | 'founder' | 'autotrader' | 'products' | 'legacy' | 'data_ingestion';

const CommandCenter: React.FC<CommandCenterProps> = (props) => {
  const [activeTab, setActiveTab] = useState<CommandView>('hive_visualizer');

  const getLogIcon = (type: OverseerLogEntry['type']) => {
    switch (type) {
      case 'error': return <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 mt-1"></div>;
      case 'success': return <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>;
      case 'warning': return <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0 mt-1"></div>;
      default: return <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>;
    }
  };
  
  const TabButton: React.FC<{ view: CommandView, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => {
    const isActive = activeTab === view;
    return (
      <button 
        onClick={() => setActiveTab(view)}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${isActive ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
      >
        {icon}
        {label}
      </button>
    )
  };

  const handleHiveDirective = (directive: string) => {
      console.log("Hive Directive:", directive);
  }

  const handleAddCredential = (service: string, key: string) => {
      const newCreds = [...props.rules.credentials];
      // Check if exists, update or add
      const index = newCreds.findIndex(c => c.service === service);
      if (index >= 0) {
          newCreds[index] = { ...newCreds[index], apiKey: key };
      } else {
          newCreds.push({ service, apiKey: key, availableCredits: 0, lowCreditThreshold: 100 });
      }
      props.onRulesChange({ ...props.rules, credentials: newCreds });
      props.addLogEntry('Security Vault', `${service} key securely equipped.`, 'success');
  };

  const renderGridOverview = () => (
    <div className="space-y-8">
      <SystemStatus stability={props.systemStability} lockdown={props.hiveLockdown} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {props.agents.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {props.agents.map((agent) => (
                          <AgentControlCard 
                              key={agent.id}
                              agent={agent}
                              onUpdate={props.onUpdateAgent}
                              rules={props.rules}
                              onSpawnDrone={props.onSpawnDrone}
                          />
                      ))}
                  </div>
            ) : ( <div className="text-center py-20 bg-gray-800/50 rounded-lg border border-gray-700"><p className="text-text-secondary">No active agents.</p></div> )}
          </div>
          <div className="lg:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center"><List size={20} className="mr-3"/>Overseer Log</h3>
              <div className="card-base p-4 h-[600px] overflow-y-auto">
                  {props.log.length > 0 ? (
                      <ul className="space-y-3">
                          {props.log.map((entry, index) => (
                              <li key={index} className="flex items-start space-x-3 text-sm">
                                  {getLogIcon(entry.type)}
                                  <div><p className="text-text-primary"><span className="font-semibold text-white">{entry.agentTitle}:</span> {entry.message}</p><p className="text-xs text-text-secondary">{new Date(entry.timestamp).toLocaleTimeString()}</p></div>
                              </li>
                          ))}
                      </ul>
                  ) : ( <div className="text-center py-20 text-text-secondary"><p>Log is empty.</p></div> )}
              </div>
          </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center"><Server size={32} className="mr-4 text-accent-cyan"/>Agent Command Center</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">The strategic "brain" of your operation. Oversee, manage, and optimize your entire fleet of autonomous agents.</p>
      </div>

       <div className="overflow-x-auto pb-2">
        <div className="flex items-center space-x-2 bg-black/20 p-1 rounded-lg border border-border-primary max-w-max mx-auto">
            <TabButton view="hive_visualizer" label="HIVE VISUALIZER" icon={<Hexagon size={16} className="mr-2 text-purple-400"/>} />
            <TabButton view="showrunner" label="SHOWRUNNER" icon={<Film size={16} className="mr-2 text-red-500"/>} />
            <TabButton view="grid_overview" label="Grid Grid" icon={<Grid size={16} className="mr-2"/>} />
            <TabButton view="autotrader" label="Auto-Trader" icon={<Repeat size={16} className="mr-2"/>} />
            <TabButton view="products" label="Products" icon={<ShoppingCart size={16} className="mr-2"/>} />
            <TabButton view="founder" label="Founder" icon={<FounderIcon size={16} className="mr-2"/>} />
            <TabButton view="financials" label="Financials" icon={<DollarSign size={16} className="mr-2"/>} />
            <TabButton view="legacy" label="Dynasty" icon={<ShieldCheck size={16} className="mr-2"/>} />
            <TabButton view="analytics" label="Analytics" icon={<BarChart size={16} className="mr-2"/>} />
            <TabButton view="strategy" label="Strategy" icon={<BrainCircuit size={16} className="mr-2"/>} />
            <TabButton view="host" label="Host" icon={<HardDrive size={16} className="mr-2"/>} />
        </div>
      </div>
      
      {/* HIGH VISIBILITY KEY LOADER */}
      <KeyAcquisitionWidget 
        credentials={props.rules.credentials} 
        onAddCredential={handleAddCredential}
      />

      <div>
        {activeTab === 'hive_visualizer' && (
             <div className="space-y-6">
                 <ExecutiveCommand 
                    onExecute={() => props.onExecuteExecutiveCommand('make_money')} 
                    isLoading={props.isExecutiveCommandLoading}
                    rules={props.rules}
                    onRulesChange={props.onRulesChange}
                />
                <HiveDashboard 
                    agents={props.agents} 
                    systemStability={props.systemStability} 
                    onSelectAgent={() => {}} 
                    onDirectiveChange={handleHiveDirective}
                    maxGpuVram={props.rules.maxGpuVram}
                    onSpawnDrone={props.onSpawnDrone}
                    swarmMode={props.rules.swarmMode}
                />
             </div>
        )}
        {activeTab === 'showrunner' && (
            <ShowrunnerDashboard 
                products={props.products}
                onUpdateProduct={props.onUpdateProduct}
                onGenerateNextVideo={props.onGenerateNextVideo}
                onGenerateVoiceover={props.onGenerateVoiceover}
                credentials={props.rules.credentials}
                portfolioRules={props.rules}
            />
        )}
        {activeTab === 'grid_overview' && renderGridOverview()}
        {activeTab === 'host' && <HostEnvironmentDashboard environment={props.hostEnvironment} onUpdate={props.onHostEnvironmentUpdate} />}
        {activeTab === 'autotrader' && <AutoTraderDashboard state={props.autoTraderState} onDeploy={props.onDeployAutoTrader} />}
        {activeTab === 'products' && <ProductLaunchpad products={props.products} productBlueprints={props.productBlueprints} onLaunch={props.onLaunchNewProduct} onUpdateProduct={props.onUpdateProduct} addLogEntry={props.addLogEntry} credentials={props.rules.credentials} portfolioRules={props.rules} onSimulateGumroadSale={props.onSimulateGumroadSale} onGenerateNextVideo={props.onGenerateNextVideo} onGenerateVoiceover={props.onGenerateVoiceover} />}
        {activeTab === 'founder' && <FounderDashboard profile={props.founderProfile} onProfileUpdate={props.onFounderProfileUpdate} agents={props.agents} />}
        {activeTab === 'financials' && <FinancialDashboard agents={props.agents} rules={props.rules} wizardBotBudget={props.hunterBotBudget} newVentureFund={props.newVentureFund} transactions={props.financialTransactions} taxGuruReport={props.taxGuruReport} onRunTaxGuru={props.onRunTaxGuru} cfoReport={props.cfoReport} onRunCfoAnalysis={props.onRunCfoAnalysis} autoTraderState={props.autoTraderState} />}
        {activeTab === 'legacy' && <DynastyDashboard onRunSimulation={props.onRunSimulation} onGenerateCopyrightStrategy={props.onGenerateCopyrightStrategy} />}
        {activeTab === 'analytics' && <PerformanceAnalytics agents={props.agents} financialTransactions={props.financialTransactions} />}
        {activeTab === 'strategy' && (
            <StrategyDashboard 
                agents={props.agents}
                rules={props.rules}
                onRulesChange={props.onRulesChange}
                assetLibrary={props.assetLibrary}
                hunterBotFindings={props.hunterBotFindings}
                onRunHunterBotScan={props.onRunHunterBotScan}
                onSaveHunterBotFinding={props.onSaveHunterBotFinding}
                hunterBotDirectives={props.hunterBotDirectives}
                onHunterBotDirectivesChange={props.onHunterBotDirectivesChange}
                onUpgradeProposal={props.onUpgradeProposal}
                arsenalItems={props.arsenalItems}
                onAddArsenalItem={props.onAddArsenalItem}
            />
        )}
        {activeTab === 'compliance' && <ComplianceHub checklist={props.complianceChecklist} onUpdate={props.onComplianceUpdate} businessStartDate={props.businessStartDate} />}
        {activeTab === 'simulations' && <ScenarioModeler simulations={props.simulations} onRunSimulation={props.onRunSimulation} />}
        {activeTab === 'wishlist' && <WishlistDashboard items={props.wishlistItems} onUpdate={props.onWishlistUpdate} weeklyProfit={0} />}
        {activeTab === 'forecasting' && <FinancialForecasting agents={props.agents} />}
        {activeTab === 'network' && <AgentNetwork agents={props.agents} />}
        {activeTab === 'campaigns' && <CampaignPlanner campaigns={props.campaigns} onCampaignUpdate={props.onCampaignUpdate} existingAgents={props.agents} />}
        {activeTab === 'data_ingestion' && <AlphaIngestionDashboard onBootstrap={props.handleBootstrapWithMarketData} />}
      </div>
    </div>
  );
};
export default CommandCenter;
