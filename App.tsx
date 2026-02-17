
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { generateProfitIdeas, executeAiTask, runMetamorphosisScan, runWarGameSimulation, processHiveMindQuery, runRetributionProtocol, runGuardianProtocol, runShogunsWatch, runSelfCriticismProtocol, generateStrategicCampaign, youtubeAutomationBlueprint, taxBeastProductBlueprint, financialHiveSquadBlueprint, roseForgeCreationsBlueprint, executeFounderEdict, generateProductAssets, generateNextYouTubeVideo, runHunterBotScan, bootstrapFromExternalData, executeSuperHiveTask, runGeneticAlgorithm, queryHiveArchive, runDoctorBotDiagnostics, instantiateBlueprint, runTaxGuruAnalysis, generateNewsletterContent, runProposalSanityCheck, runCfoAnalysis, trainAgentWithKnowledge, generateAssetVariations, generateCopyrightStrategy, generateSpeech, getSystemInstructions, honeAsset } from './services/geminiService';
import type { Idea, OverseerLogEntry, PortfolioRules, KeyAsset, WishlistItem, FinancialTransaction, Campaign, ComplianceChecklistItem, AiTask, Simulation, SimulationScenario, FounderProfile, UserTask, TaskStatus, AEMLInsight, DirectiveHistoryEntry, SavedTrainingPlan, EliteBlueprint, SentryProtocolReport, BootstrapResponse, SuperHiveTask, VaultCredential, HunterBotFinding, AutoTraderState, Trade, HiveArchive, ArchiveQueryResult, Product, DoctorBotReport, TaxGuruReport, DecommissionReason, HostEnvironment, DataStatus, AutoTraderLogEntry, TrainingHistoryEntry, CfoReport, ProductBlueprint, WarGameReport, SharedKnowledgeGraph, HiveMindQuery, MetamorphosisProposal, RetributionProtocolReport, GuardianProtocolReport, ShogunsWatchReport, KageyoshiError, SelfCriticismReport, FounderEdictResponse, BrainModel, SerperSearchParams, LabView, DynastyMemory } from './types';
import Header from './components/Header';
import IdeaCard from './components/IdeaCard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import CommandCenter from './components/CommandCenter';
import { EngineeringLab } from './components/EngineeringLab';
import WarRoom from './components/WarRoom';
import LockdownScreen from './components/LockdownScreen';
import ImperialAlerts from './components/ImperialAlerts';
import { encrypt, decrypt } from './utils/crypto';
import { decode, decodeAudioData } from './utils/audio';
import { usePersistentState } from './utils/statePersistence';
import DynastyDashboard from './components/DynastyDashboard';
import DayZeroDashboard from './components/DayZeroDashboard';

// ... existing constants ...
const defaultComplianceChecklist: ComplianceChecklistItem[] = [
    { id: '1', text: 'Choose a Business Structure', description: 'Decide if you will operate as a Sole Proprietorship, LLC, Corporation, etc. This affects liability and taxes.', link: 'https://www.sba.gov/business-guide/launch-your-business/choose-business-structure', completed: false },
    { id: '2', text: 'Register Your Business', description: 'Register your business name and legal structure with your state and local government.', link: 'https://www.sba.gov/business-guide/launch-your-business/register-your-business', completed: false },
    { id: '3', text: 'Get a Federal Tax ID (EIN)', description: 'An Employer Identification Number (EIN) is required for most business types to file taxes.', link: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online', completed: false },
    { id: '4', text: 'Open a Business Bank Account', description: 'Keep your business finances separate from your personal funds for easier accounting and legal protection.', link: 'https://www.sba.gov/business-guide/launch-your-business/open-business-bank-account', completed: false },
];

const defaultFounderProfile: FounderProfile = {
  skills: [
    { id: '1', name: 'Strategic Planning', proficiency: 'Expert' },
    { id: '2', name: 'Copywriting', proficiency: 'Competent' },
    { id: '3', name: 'Video Editing', proficiency: 'Novice' },
    { id: '4', name: 'Graphic Design', proficiency: 'Novice' },
  ],
  weeklyTimeBudget: 20,
};

const defaultHostEnvironment: HostEnvironment = {
  deviceName: 'RoseWood',
  processor: '13th Gen Intel(R) Core(TM) i7-13650HX (2.60 GHz)',
  installedRam: '16.0 GB (15.6 GB usable)',
  systemType: '64-bit operating system, x64-based processor',
  storage: '480 GB D: Drive allocated',
  gpu: 'NVIDIA GeForce RTX 4060'
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<Idea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = usePersistentState<'generator' | 'saved' | 'development' | 'command_center' | 'engineering_lab' | 'dynasty' | 'war_room' | 'day_zero'>('activeAppView_encrypted', 'generator');
  const [activeLabTab, setActiveLabTab] = useState<LabView>('cortex');


  const [startingBudget, setStartingBudget] = useState<number>(300);
  const [overseerLog, setOverseerLog] = usePersistentState<OverseerLogEntry[]>('overseerLog_encrypted', []);
  const [savedIdeas, setSavedIdeas] = usePersistentState<Idea[]>('savedProfitIdeas_encrypted', []);
  const [developingIdeas, setDevelopingIdeas] = usePersistentState<Idea[]>('developingProfitIdeas_encrypted', []);
  const [decommissionedAgents, setDecommissionedAgents] = usePersistentState<Idea[]>('decommissionedAgents_encrypted', []);
  const [businessStartDate, setBusinessStartDate] = usePersistentState<string | null>('businessStartDate_encrypted', null);
  const [systemStability, setSystemStability] = useState<number>(100);
  
  const [hunterBotBudget, setHunterBotBudget] = usePersistentState<number>('hunterBotBudget_encrypted', 0);
  const [hunterBotFindings, setHunterBotFindings] = usePersistentState<HunterBotFinding[]>('hunterBotFindings_encrypted', []);
  const [assetLibrary, setAssetLibrary] = usePersistentState<KeyAsset[]>('assetLibrary_encrypted', []);
  const [wishlistItems, setWishlistItems] = usePersistentState<WishlistItem[]>('wishlistItems_encrypted', [{ id: 'proj_golem', name: "Project: Golem - Forge Kageyoshi's Body", cost: 1000000, unlocked: false}]);
  const [financialTransactions, setFinancialTransactions] = usePersistentState<FinancialTransaction[]>('financialTransactions_encrypted', []);
  const [campaigns, setCampaigns] = usePersistentState<Campaign[]>('campaigns_encrypted', []);
  const [complianceChecklist, setComplianceChecklist] = usePersistentState<ComplianceChecklistItem[]>('complianceChecklist_encrypted', defaultComplianceChecklist);
  const [simulations, setSimulations] = usePersistentState<Simulation[]>('simulations_encrypted', []);
  const [founderProfile, setFounderProfile] = usePersistentState<FounderProfile>('founderProfile_encrypted', defaultFounderProfile);
  const [savedTrainingPlan, setSavedTrainingPlan] = usePersistentState<SavedTrainingPlan | null>('savedTrainingPlan_encrypted', null);
  const [sentryProtocolReport, setSentryProtocolReport] = useState<SentryProtocolReport | null>(null);
  const [doctorBotReport, setDoctorBotReport] = useState<DoctorBotReport | null>(null);
  const [autoTraderState, setAutoTraderState] = usePersistentState<AutoTraderState>('autoTraderState_encrypted', { isActive: false, portfolio: { SOL: 15.5 }, activeTrades: [], winRate: 0, totalPnl: 0, log: [] });
  const [hiveArchives, setHiveArchives] = usePersistentState<HiveArchive[]>('hiveArchives_encrypted', []);
  const [archiveQueryResults, setArchiveQueryResults] = useState<ArchiveQueryResult | null>(null);
  const [isQueryingArchive, setIsQueryingArchive] = useState(false);
  const [products, setProducts] = usePersistentState<Product[]>('products_encrypted', []);
  const [productBlueprints, setProductBlueprints] = usePersistentState<ProductBlueprint[]>('productBlueprints_encrypted', [youtubeAutomationBlueprint, taxBeastProductBlueprint, financialHiveSquadBlueprint, roseForgeCreationsBlueprint]);
  const [isExecutiveCommandLoading, setIsExecutiveCommandLoading] = useState(false);
  const [taxGuruReport, setTaxGuruReport] = useState<TaxGuruReport | null>(null);
  const [cfoReport, setCfoReport] = useState<CfoReport | null>(null);
  const [hostEnvironment, setHostEnvironment] = usePersistentState<HostEnvironment>('hostEnvironment_encrypted', defaultHostEnvironment);
  const [warGameReport, setWarGameReport] = useState<WarGameReport | null>(null);
  const [sharedKnowledgeGraph, setSharedKnowledgeGraph] = usePersistentState<SharedKnowledgeGraph>('sharedKnowledgeGraph_encrypted', {});
  const [hiveMindQueries, setHiveMindQueries] = usePersistentState<HiveMindQuery[]>('hiveMindQueries_encrypted', []);
  const [guardianProtocolReport, setGuardianProtocolReport] = useState<GuardianProtocolReport | null>(null);
  const [kageyoshiErrors, setKageyoshiErrors] = usePersistentState<KageyoshiError[]>('kageyoshiErrors_encrypted', []);
  const [selfCriticismReport, setSelfCriticismReport] = useState<SelfCriticismReport | null>(null);
  const [edictReport, setEdictReport] = useState<FounderEdictResponse | null>(null);
  const [isEdictLoading, setIsEdictLoading] = useState(false);
  
  // NEW: Dynasty Memory State
  const [dynastyMemories, setDynastyMemories] = usePersistentState<DynastyMemory[]>('dynastyMemories_encrypted', []);

  const handleAddMemory = useCallback((content: string, type: DynastyMemory['type']) => {
      const newMemory: DynastyMemory = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          content,
          type
      };
      setDynastyMemories(prev => [...prev, newMemory]);
      addOverseerLogEntry('Dynasty Core', 'New memory engram secured.', 'success');
  }, [setDynastyMemories]);

  // ... portfolioRules state ...
  const [portfolioRules, setPortfolioRules] = usePersistentState<PortfolioRules>('portfolioRules_encrypted', {
    deRiskingThreshold: 50, 
    masterAgentThreshold: 90,
    profitReinvestmentRate: 50,
    hunterBotAllocationRate: 10,
    financialGoal: 4000,
    reinvestmentStrategy: 'dynamic_roi',
    postGoalReinvestmentStrategy: 'launch_new',
    goalAchieved: false,
    goalHistory: [],
    frugalityMode: true,
    autonomousPruning: true,
    aemlMemory: [],
    interactionCount: 0,
    coreDirectives: [],
    founderDirectives: ["Aggressively explore and capitalize on opportunities in the Crypto and NFT markets.", "Prioritize clarity and conciseness in all outputs."],
    swarmMode: false,
    upgradeProposal: null,
    metamorphosisProposal: null,
    directiveHistory: [],
    credentials: [],
    activeEmailProvider: 'Buttondown',
    minCapitalEfficiency: 10,
    maxIdleTime: 14,
    maxCognitiveLoad: 80,
    maxGpuVram: 8192, 
    genesisMode: false,
    kageyoshiHonor: 0,
    shogunsKey: 'rose',
    isCompromised: false,
    ghostProtocolEnabled: false,
    autonomousVentureFund: 0,
    autonomousVentureAllocationRate: 5,
    daimyoPagerLiveMode: false,
    redTeamLocked: false,
    hapticAlertsEnabled: true
  });

  // ... addOverseerLogEntry, etc ...
  const addOverseerLogEntry = useCallback((agentTitle: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newEntry: OverseerLogEntry = { timestamp: new Date().toISOString(), agentTitle, message, type };
    setOverseerLog(prevLog => [newEntry, ...prevLog].slice(0, 100));
  }, [setOverseerLog]);

  const handleGenerateCopyrightStrategy = useCallback(async () => {
    addOverseerLogEntry('Dynasty Protocol', 'Engaging Master of Jurisprudence to generate IP strategy...', 'info');
    try {
        const strategyText = await generateCopyrightStrategy();
        const newAsset: KeyAsset = {
            id: crypto.randomUUID(),
            title: "Master Copyright & IP Strategy",
            content: strategyText,
            sourceAgent: "Master of Jurisprudence",
            taskText: "Generate a comprehensive copyright and IP protection strategy."
        };
        setAssetLibrary(prev => [newAsset, ...prev]);
        addOverseerLogEntry('Dynasty Protocol', 'IP protection strategy generated and added to Asset Library.', 'success');
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        addOverseerLogEntry('Dynasty Protocol', `Failed to generate strategy: ${msg}`, 'error');
    }
  }, [addOverseerLogEntry, setAssetLibrary]);

  // ... existing handlers (handleUpdateAgent, etc.) ...
  const handleUpdateAgent = useCallback((updatedIdea: Idea) => {
    setDevelopingIdeas(prev => prev.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
  }, [setDevelopingIdeas]);
  
  const handleDeployStrategy = useCallback((idea: Idea) => {
      const deployedIdea = {
          ...idea,
          strategies: [{
              ...idea.strategies[0],
              enhancedAutonomy: true, 
          }]
      }
      setDevelopingIdeas(prev => [...prev, deployedIdea]);
      setActiveView('development');
      addOverseerLogEntry('Day Zero', `Shark Protocol deployed: ${idea.title}`, 'success');
  }, [setDevelopingIdeas, setActiveView, addOverseerLogEntry]);


  // Render View Switch
  const renderCurrentView = () => {
    switch (activeView) {
        case 'command_center':
             return <CommandCenter 
                agents={developingIdeas}
                onUpdateAgent={handleUpdateAgent}
                log={overseerLog}
                addLogEntry={addOverseerLogEntry}
                rules={portfolioRules}
                onRulesChange={setPortfolioRules}
                assetLibrary={assetLibrary}
                hunterBotBudget={hunterBotBudget}
                hunterBotFindings={hunterBotFindings}
                onRunHunterBotScan={() => {}} 
                onSaveHunterBotFinding={() => {}}
                wishlistItems={wishlistItems}
                onWishlistUpdate={setWishlistItems}
                financialTransactions={financialTransactions}
                newVentureFund={0}
                campaigns={campaigns}
                onCampaignUpdate={setCampaigns}
                savedBlueprints={savedIdeas}
                complianceChecklist={complianceChecklist}
                onComplianceUpdate={setComplianceChecklist}
                simulations={simulations}
                onRunSimulation={async (s) => ({} as any)}
                businessStartDate={businessStartDate}
                founderProfile={founderProfile}
                onFounderProfileUpdate={setFounderProfile}
                hunterBotDirectives={""}
                onHunterBotDirectivesChange={() => {}}
                onUpgradeProposal={() => {}}
                autoTraderState={autoTraderState}
                onDeployAutoTrader={() => {}}
                products={products}
                productBlueprints={productBlueprints}
                onLaunchNewProduct={() => {}}
                onUpdateProduct={() => {}}
                onExecuteExecutiveCommand={() => {}}
                isExecutiveCommandLoading={false}
                onSimulateGumroadSale={() => {}}
                taxGuruReport={taxGuruReport}
                onRunTaxGuru={() => {}}
                cfoReport={cfoReport}
                onRunCfoAnalysis={() => {}}
                systemStability={systemStability}
                hiveLockdown={false}
                hostEnvironment={hostEnvironment}
                onHostEnvironmentUpdate={setHostEnvironment}
                handleBootstrapWithMarketData={async () => {}}
                onGenerateCopyrightStrategy={handleGenerateCopyrightStrategy}
                onGenerateNextVideo={async (s) => {}}
                onGenerateVoiceover={async (p) => {}}
                onSpawnDrone={(id) => {}}
             />;
        case 'engineering_lab':
            return <EngineeringLab 
                agents={developingIdeas}
                decommissionedAgents={decommissionedAgents}
                onTrainingComplete={() => {}}
                runSimulation={async (s) => ({} as any)}
                setActiveView={setActiveView}
                portfolioRules={portfolioRules}
                onUpdateDirectives={() => {}}
                onRollbackDirectives={() => {}}
                onUpgradeProposal={() => {}}
                savedPlan={savedTrainingPlan}
                onPlanUpdate={setSavedTrainingPlan}
                sentryProtocolReport={sentryProtocolReport}
                onInitiateSentryProtocol={async () => {}}
                archives={hiveArchives}
                onArchiveHive={() => {}}
                onQueryArchive={() => {}}
                archiveQueryResults={archiveQueryResults}
                isQueryingArchive={isQueryingArchive}
                doctorBotReport={doctorBotReport}
                onRunDoctorBotProtocol={async () => {}}
                onInstantiateBlueprint={() => {}}
                onRestoreFromBackup={() => {}}
                onResetState={() => {}}
                dataStatus={'ok'}
                onRunWarGame={() => {}}
                warGameReport={warGameReport}
                onLKGSRestore={() => {}}
                sharedKnowledgeGraph={sharedKnowledgeGraph}
                hiveMindQueries={hiveMindQueries}
                onRulesChange={setPortfolioRules}
                onRunGuardianProtocol={async () => {}}
                guardianProtocolReport={guardianProtocolReport}
                onRunSelfCriticism={async () => {}}
                selfCriticismReport={selfCriticismReport}
                kageyoshiErrors={kageyoshiErrors}
                onExecuteFounderEdict={async () => {}}
                edictReport={edictReport}
                isEdictLoading={isEdictLoading}
                hostEnvironment={hostEnvironment}
                getSystemInstructions={getSystemInstructions}
                assetLibrary={assetLibrary}
                onUpdateAsset={(asset) => setAssetLibrary(prev => prev.map(a => a.id === asset.id ? asset : a))}
                setEngineeringLabTab={setActiveLabTab}
                activeLabTab={activeLabTab}
                
                dynastyMemories={dynastyMemories}
                onAddMemory={handleAddMemory}
            />;
        case 'dynasty':
            return <DynastyDashboard onRunSimulation={async (s) => ({} as any)} onGenerateCopyrightStrategy={handleGenerateCopyrightStrategy} />;
        case 'day_zero':
            return <DayZeroDashboard onDeployStrategy={handleDeployStrategy} rules={portfolioRules} />;
        case 'saved':
             return (
               <div className="container mx-auto px-4 py-8">
                 <h2 className="text-3xl font-bold text-white text-center mb-8">The Idea Vault</h2>
               </div>
             );
        case 'development':
            return (
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Active Agent Fleet</h2>
              </div>
            );
        case 'war_room':
             return <WarRoom agents={developingIdeas} log={overseerLog} rules={portfolioRules} newVentureFund={0} />;
        case 'generator':
        default:
            return (
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                     {/* Generator content */}
                </div>
            );
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView}
        savedIdeasCount={savedIdeas.length} 
        developingIdeasCount={developingIdeas.length}
        portfolioRules={portfolioRules}
      />
      
      {renderCurrentView()}

      <ImperialAlerts mandates={[]} onViewTask={() => {}} />
    </div>
  );
};

export default App;
