import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { generateProfitIdeas, executeAiTask, runMetamorphosisScan, runWarGameSimulation, processHiveMindQuery, runRetributionProtocol, runGuardianProtocol, runShogunsWatch, runSelfCriticismProtocol, generateStrategicCampaign, youtubeAutomationBlueprint, taxBeastProductBlueprint, financialHiveSquadBlueprint, roseForgeCreationsBlueprint, executeFounderEdict, generateProductAssets, generateNextYouTubeVideo, runHunterBotScan, bootstrapFromExternalData, executeSuperHiveTask, runGeneticAlgorithm, queryHiveArchive, runDoctorBotDiagnostics, instantiateBlueprint, runTaxGuruAnalysis, generateNewsletterContent, runProposalSanityCheck, runCfoAnalysis, trainAgentWithKnowledge, generateAssetVariations, generateCopyrightStrategy, generateSpeech, getSystemInstructions, honeAsset } from './services/geminiService';
import type { Idea, OverseerLogEntry, PortfolioRules, KeyAsset, WishlistItem, FinancialTransaction, Campaign, ComplianceChecklistItem, AiTask, Simulation, SimulationScenario, FounderProfile, UserTask, TaskStatus, AEMLInsight, DirectiveHistoryEntry, SavedTrainingPlan, EliteBlueprint, SentryProtocolReport, BootstrapResponse, SuperHiveTask, VaultCredential, HunterBotFinding, AutoTraderState, Trade, HiveArchive, ArchiveQueryResult, Product, DoctorBotReport, TaxGuruReport, DecommissionReason, HostEnvironment, DataStatus, AutoTraderLogEntry, TrainingHistoryEntry, CfoReport, ProductBlueprint, WarGameReport, SharedKnowledgeGraph, HiveMindQuery, MetamorphosisProposal, RetributionProtocolReport, GuardianProtocolReport, ShogunsWatchReport, KageyoshiError, SelfCriticismReport, FounderEdictResponse, BrainModel, SerperSearchParams, LabView, DynastyMemory, ArsenalItem } from './types';
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
import { Zap, Search, Coins } from 'lucide-react';

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

const defaultArsenal: ArsenalItem[] = [
    { id: '1', category: 'Intelligence', name: 'Gemini 2.5 Flash', limit: '15 RPM / 1M TPM', useCase: 'Primary Core. Logic & Analysis.', reset: 'Daily' },
    { id: '2', category: 'Information', name: 'Google Search Grounding', limit: 'Unlimited', useCase: 'Live Web Data Access.', reset: 'N/A' },
    { id: '3', category: 'Video', name: 'Hailuo / MiniMax', limit: 'Daily Free Generations', useCase: 'High-motion video clips for marketing.', reset: 'Daily' },
    { id: '4', category: 'Video', name: 'Kling AI', limit: '66 Daily Credits', useCase: 'Realistic cinematic scenes.', reset: 'Daily' },
    { id: '5', category: 'Image', name: 'Flux.1 (via Poembed)', limit: 'Unlimited (Slow)', useCase: 'Photorealistic asset generation.', reset: 'Continuous' },
    { id: '6', category: 'Image', name: 'Recraft.ai', limit: 'Daily Credits', useCase: 'Vector art & logos for branding.', reset: 'Daily' },
    { id: '7', category: 'Infrastructure', name: 'Vercel', limit: 'Free Hobby Tier', useCase: 'Frontend hosting & deployment.', reset: 'Monthly' },
    { id: '8', category: 'Infrastructure', name: 'Supabase', limit: '500MB DB / Auth', useCase: 'Backend database & user auth.', reset: 'Capped' },
    { id: '9', category: 'Audio', name: 'ElevenLabs', limit: '10k Char / Month', useCase: 'High-quality voiceovers.', reset: 'Monthly' },
];

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<Idea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = usePersistentState<'generator' | 'saved' | 'development' | 'command_center' | 'engineering_lab' | 'dynasty' | 'war_room' | 'day_zero'>('activeAppView_encrypted', 'generator');
  const [activeLabTab, setActiveLabTab] = useState<LabView>('the_forge');


  const [startingBudget, setStartingBudget] = useState<number>(100);
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
  const [dynastyMemories, setDynastyMemories] = usePersistentState<DynastyMemory[]>('dynastyMemories_encrypted', []);
  // Persisted Day Zero Strategies
  const [dayZeroStrategies, setDayZeroStrategies] = usePersistentState<Idea[]>('dayZeroStrategies_encrypted', []);
  // Arsenal State
  const [arsenalItems, setArsenalItems] = usePersistentState<ArsenalItem[]>('arsenalItems_encrypted', defaultArsenal);


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
    kageyoshiHonor: 50, 
    shogunsKey: 'rose',
    isCompromised: false,
    ghostProtocolEnabled: false,
    autonomousVentureFund: 0,
    autonomousVentureAllocationRate: 5,
    daimyoPagerLiveMode: false,
    redTeamLocked: false,
    hapticAlertsEnabled: true
  });

  // Force honor reset on load if below 50 (Safety measure for this session)
  useEffect(() => {
      if (portfolioRules.kageyoshiHonor < 50) {
          setPortfolioRules(prev => ({ ...prev, kageyoshiHonor: 50 }));
      }
  }, []);

  // ... addOverseerLogEntry, etc ...
  const addOverseerLogEntry = useCallback((agentTitle: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newEntry: OverseerLogEntry = { timestamp: new Date().toISOString(), agentTitle, message, type };
    setOverseerLog(prevLog => [newEntry, ...prevLog].slice(0, 100));
  }, [setOverseerLog]);

  // INJECT REQUESTED MEMORY & CONFIRMATION
  useEffect(() => {
      const tasks = [
          {
              content: 'Added new agent for specialized data analysis.',
              type: 'manual' as const
          },
          {
              content: 'System Diagnostic: Manual memory entry confirmed. This action reinforces the Anchor Ring and prevents data drift.',
              type: 'milestone' as const
          }
      ];

      let updated = false;
      const newMemories = [...dynastyMemories];

      tasks.forEach(task => {
          if (!newMemories.some(m => m.content === task.content)) {
              newMemories.unshift({
                  id: crypto.randomUUID(),
                  timestamp: new Date().toISOString(),
                  content: task.content,
                  type: task.type
              });
              updated = true;
          }
      });

      if (updated) {
          setDynastyMemories(newMemories);
          addOverseerLogEntry('Dynasty Core', 'Memory banks updated via direct injection.', 'success');
      }
  }, [dynastyMemories, setDynastyMemories, addOverseerLogEntry]);
  
  const handleAddArsenalItem = useCallback((item: ArsenalItem) => {
      setArsenalItems(prev => [...prev, item]);
      addOverseerLogEntry('Hunter Bot', `New Resource Scouted: ${item.name}`, 'success');
  }, [setArsenalItems, addOverseerLogEntry]);

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

  // --- EDICT PROTOCOL HANDLERS ---
  const handleExecuteFounderEdict = useCallback(async (directive: string) => {
      setIsEdictLoading(true);
      try {
          const report = await executeFounderEdict(directive);
          setEdictReport(report);
          addOverseerLogEntry('Founder Edict', 'Research complete. Knowledge synthesized.', 'success');
      } catch (e) {
          const msg = e instanceof Error ? e.message : 'Edict execution failed.';
          addOverseerLogEntry('Founder Edict', `Error: ${msg}`, 'error');
      } finally {
          setIsEdictLoading(false);
      }
  }, [addOverseerLogEntry]);

  const handleInfuseKnowledge = useCallback(async (agentId: string, knowledge: string) => {
      const agentIndex = developingIdeas.findIndex(a => a.id === agentId);
      if (agentIndex === -1) return;
      
      addOverseerLogEntry('Hive Mind', `Infusing knowledge into Agent: ${developingIdeas[agentIndex].title}...`, 'info');
      
      try {
          const result = await trainAgentWithKnowledge(agentId, knowledge);
          
          // Update Agent Proficiency
          const updatedAgents = [...developingIdeas];
          const agent = updatedAgents[agentIndex];
          const strategy = agent.strategies[0];
          
          strategy.proficiencyScore = Math.min(100, strategy.proficiencyScore + 15); // Boost score
          if (result.specialization) strategy.specialization = result.specialization;
          
          setDevelopingIdeas(updatedAgents);
          addOverseerLogEntry('Hive Mind', `Infusion Complete. ${result.summary}`, 'success');
          
      } catch (e) {
          const msg = e instanceof Error ? e.message : 'Infusion failed.';
          addOverseerLogEntry('Hive Mind', `Error: ${msg}`, 'error');
      }
  }, [developingIdeas, setDevelopingIdeas, addOverseerLogEntry]);

  // Handle War Game Simulation
  const handleRunWarGame = useCallback(async (agentId: string) => {
      const agent = developingIdeas.find(a => a.id === agentId);
      if (!agent) return;

      addOverseerLogEntry('War Game', `Initiating adversarial simulation for ${agent.title}...`, 'info');
      try {
          const report = await runWarGameSimulation(agentId);
          setWarGameReport(report);
          addOverseerLogEntry('War Game', `Simulation complete for ${agent.title}.`, 'success');
      } catch (e) {
          const msg = e instanceof Error ? e.message : 'Unknown error';
          addOverseerLogEntry('War Game', `Simulation failed: ${msg}`, 'error');
      }
  }, [developingIdeas, addOverseerLogEntry]);


  // ... existing handlers (handleUpdateAgent, etc.) ...
  const handleUpdateAgent = useCallback((updatedIdea: Idea) => {
    setDevelopingIdeas(prev => prev.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
  }, [setDevelopingIdeas]);
  
  const handleDeployStrategy = useCallback((idea: Idea) => {
      const deployedIdea = {
          ...idea,
          strategies: [{
              ...idea.strategies[0],
              enhancedAutonomy: true, // Force shark mode
          }]
      }
      setDevelopingIdeas(prev => [...prev, deployedIdea]);
      setActiveView('development');
      addOverseerLogEntry('Day Zero', `Shark Protocol deployed: ${idea.title}`, 'success');
      
      // Clear the pending list once deployed to avoid confusion, or keep it?
      // Let's keep it but filter out the deployed one to keep options open
      setDayZeroStrategies(prev => prev.filter(s => s.id !== idea.id));

  }, [setDevelopingIdeas, setActiveView, addOverseerLogEntry, setDayZeroStrategies]);
  
  const handleUpdateDayZeroStrategies = useCallback((strategies: Idea[]) => {
      setDayZeroStrategies(strategies);
      addOverseerLogEntry('Shark Protocol', `Scan complete. ${strategies.length} predators identified: ${strategies.map(s => s.title).join(', ')}`, 'success');
  }, [setDayZeroStrategies, addOverseerLogEntry]);

  const handleGenerateIdeas = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
          const generatedIdeas = await generateProfitIdeas(startingBudget);
          setIdeas(generatedIdeas);
          addOverseerLogEntry('Shark Protocol', `Scan complete. ${generatedIdeas.length} high-priority blueprints identified.`, 'success');
      } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred while generating ideas.');
      } finally {
          setIsLoading(false);
      }
  }, [startingBudget, addOverseerLogEntry]);

  const handleSaveIdea = useCallback((idea: Idea) => {
      setSavedIdeas(prev => [...prev, idea]);
      addOverseerLogEntry('Archive', `Blueprint "${idea.title}" saved to Vault.`, 'info');
  }, [setSavedIdeas, addOverseerLogEntry]);

  const handleStartDevelopment = useCallback((idea: Idea) => {
    if (!businessStartDate) {
        setBusinessStartDate(new Date().toISOString());
    }
    setDevelopingIdeas(prev => [...prev, idea]);
    setActiveView('development');
    addOverseerLogEntry('System', `Agent "${idea.title}" activated. Initializing tasks.`, 'success');
  }, [businessStartDate, setBusinessStartDate, setDevelopingIdeas, setActiveView, addOverseerLogEntry]);

  // New Memory Handler
  const handleAddMemory = useCallback((content: string, type: DynastyMemory['type']) => {
      const newMemory: DynastyMemory = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          content,
          type
      };
      setDynastyMemories(prev => [...prev, newMemory]);
      addOverseerLogEntry('Dynasty Core', 'New memory engram secured.', 'success');
  }, [setDynastyMemories, addOverseerLogEntry]);

  const handleGrantHonor = useCallback(() => {
      setPortfolioRules(prev => ({
          ...prev,
          kageyoshiHonor: prev.kageyoshiHonor + 1
      }));
      addOverseerLogEntry('Hive Mind', 'The Shogun has bestowed HONOR upon the system.', 'success');
  }, [setPortfolioRules, addOverseerLogEntry]);


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
                arsenalItems={arsenalItems}
                onAddArsenalItem={handleAddArsenalItem}
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
                onRunWarGame={handleRunWarGame}
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
                onExecuteFounderEdict={handleExecuteFounderEdict}
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
                onGrantHonor={handleGrantHonor}
                financialTransactions={financialTransactions}
            />;
        case 'dynasty':
            return <DynastyDashboard onRunSimulation={async (s) => ({} as any)} onGenerateCopyrightStrategy={handleGenerateCopyrightStrategy} />;
        case 'day_zero':
            return <DayZeroDashboard onDeployStrategy={handleDeployStrategy} rules={portfolioRules} savedStrategies={dayZeroStrategies} onStrategiesUpdate={handleUpdateDayZeroStrategies} />;
        case 'saved':
             return (
               <div className="container mx-auto px-4 py-8">
                 <h2 className="text-3xl font-bold text-white text-center mb-8">The Idea Vault</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {savedIdeas.map(idea => (
                         <IdeaCard 
                            key={idea.id} 
                            idea={idea} 
                            isSaved 
                            portfolioRules={portfolioRules} 
                            onStartDevelopment={handleStartDevelopment}
                         />
                     ))}
                     {savedIdeas.length === 0 && <p className="text-gray-500 text-center col-span-2">No blueprints archived.</p>}
                 </div>
               </div>
             );
        case 'development':
            return (
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Active Agent Fleet</h2>
                 <div className="grid grid-cols-1 gap-8">
                     {developingIdeas.length > 0 ? developingIdeas.map(agent => (
                         <IdeaCard 
                            key={agent.id} 
                            idea={agent} 
                            isDeveloping 
                            onUpdate={handleUpdateAgent}
                            portfolioRules={portfolioRules}
                            agentId={agent.id}
                         />
                     )) : (
                         <div className="text-center py-20 bg-gray-900/30 rounded-lg border border-dashed border-gray-700">
                             <p className="text-gray-400">No active agents. Generate a blueprint to begin.</p>
                         </div>
                     )}
                 </div>
              </div>
            );
        case 'war_room':
             return <WarRoom agents={developingIdeas} log={overseerLog} rules={portfolioRules} newVentureFund={0} />;
        case 'generator':
        default:
            return (
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="text-center mb-12">
                         <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                             <Zap className="mr-3 text-yellow-400" /> Shark Protocol Generator
                         </h2>
                         <p className="text-gray-400">
                             Generate high-profit, low-overhead business blueprints tailored for autonomous AI execution.
                         </p>
                    </div>

                    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 shadow-2xl mb-12">
                        <div className="max-w-md mx-auto space-y-6">
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">Seed Capital ($)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-bold">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        id="budget"
                                        className="block w-full pl-8 pr-12 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="100"
                                        value={startingBudget}
                                        onChange={(e) => setStartingBudget(Number(e.target.value))}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-xs">USD</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">"Bootstrapper" mode enabled. Prioritizing efficiency.</p>
                            </div>

                            <button
                                onClick={handleGenerateIdeas}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-xl md:px-10 shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader small /> : <><Search className="mr-2" /> Scan Market</>}
                            </button>
                        </div>
                        {error && <div className="mt-6"><ErrorMessage message={error} /></div>}
                    </div>

                    {ideas && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center"><Coins className="mr-2 text-green-400"/>Generated Blueprints</h3>
                            {ideas.map((idea) => (
                                <IdeaCard
                                    key={idea.id}
                                    idea={idea}
                                    onSave={handleSaveIdea}
                                    onStartDevelopment={handleStartDevelopment}
                                    portfolioRules={portfolioRules}
                                />
                            ))}
                        </div>
                    )}
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