
export type LabView = 'paradigm_shift' | 'the_forge' | 'video_forge' | 'voice_forge' | 'edicts' | 'system_ops' | 'dojo' | 'sentry_protocol' | 'doctor_bot' | 'guardian_protocol' | 'cortex' | 'security' | 'hive_mind' | 'self_criticism' | 'sensory_cortex' | 'pager' | 'local_vision' | 'metamorphosis_bay';

export type DataStatus = 'ok' | 'corrupted' | 'fresh';

export interface DynastyMemory {
  id: string;
  timestamp: string;
  content: string;
  type: 'manual' | 'auto' | 'milestone' | 'medical';
  tags?: string[];
}

export interface ArsenalItem {
  id: string;
  name: string;
  url?: string;
  category: 'Intelligence' | 'Information' | 'Video' | 'Image' | 'Audio' | 'Infrastructure' | 'Other';
  limit: string;
  useCase: string;
  reset: string;
}

export interface BioOptimizationResult {
    focus: string;
    recommendations: {
        category: string;
        action: string;
        science: string;
    }[];
}

export interface MetamorphosisProposal {
  title: string;
  description: string;
  benefits: string[];
  risks: string[];
  implementation_summary: string;
}

export interface BreakdownStep {
  step: string;
  task: string;
  cost: number;
  time: string;
  revenue: number;
  costDetails: { item: string; cost: number }[];
}

export interface ChartDataPoint {
  name: string;
  cost: number;
  revenue: number;
  profit: number;
  profitAfterTax: number;
}

export interface RevenueStream {
  name: string;
  percentage: number;
  amount?: number;
}

export type TaskStatus = 'pending' | 'active' | 'executing' | 'awaiting_review' | 'completed' | 'failed' | 'bypassed' | 'retrying' | 'queued';

export interface AiTask {
  id: string;
  text: string;
  status: TaskStatus;
  taskBudget: number;
  output?: string;
  error?: string;
  retryCount?: number;
  isOutsourced?: boolean;
  executingAgentTitle?: string | null;
  frugalAttempt?: {
    searched: boolean;
    foundAlternative: boolean;
    alternative: string | null;
    savings: number;
  };
  statusDetail?: string;
  isFrugalAlternative?: boolean;
  parentTaskId?: string;
  requiredSpecialization?: string;
}

export interface UserTask {
  id: string;
  text: string;
  status: TaskStatus;
  estimatedTime: number;
  escalatedFrom?: {
    task: AiTask;
    error: string;
  };
  statusDetail?: string;
  isImperialMandate?: boolean;
  smsNotified?: boolean;
}

export interface ActionPlan {
  profitDeepDive: string;
  legalComplianceRoadmap: string;
  aiTasks: AiTask[];
  userTasks: UserTask[];
}

export interface TrainingHistoryEntry {
  date: string;
  module: string;
  result: string;
  proficiencyGained: number;
  specializationGained?: string;
}

export type DecommissionReason = 'UNPROFITABLE' | 'IDLE' | 'OVERLOADED' | 'VRAM_OVERLOAD';

export interface HostEnvironment {
  deviceName: string;
  processor: string;
  installedRam: string;
  systemType: string;
  storage: string;
  gpu: string;
}

export interface TaxAwareProfitModel {
  entityTaxComparison: string;
  optimizationStrategies: {
    strategy: string;
    description: string;
    legalityNote: string;
  }[];
}

export interface Strategy {
  strategyName: 'Bootstrapper' | 'Growth Hacker' | 'Premium Brand';
  totalInvestment: number;
  projectedProfit: number;
  timeToProfit: string;
  breakdown: BreakdownStep[];
  chartData: ChartDataPoint[];
  actionPlan: ActionPlan;
  taxRate: number;
  otherIncome: number;
  additionalDeductions: number;
  actualSpent: number;
  actualRevenue: number;
  proficiencyScore: number;
  isMasterAgent: boolean;
  capitalEfficiency: number;
  specialization: string | null;
  scaleLevel: number;
  campaignId: string | null;
  trainingHistory?: TrainingHistoryEntry[];
  enhancedAutonomy: boolean;
  lastActivityTimestamp: number;
  cognitiveLoad: number;
  decommissionReason?: DecommissionReason;
  gpuVramUsage: number;
  taxAwareProfitModel: TaxAwareProfitModel;
  schemaVersion?: number;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  suggestedRevenueStreams: RevenueStream[];
  strategies: Strategy[];
  businessModelType: string;
}

export interface ApiResponse {
  ideas: Idea[];
}

export interface AdaptationSuggestion {
  technology: string;
  benefit: string;
  aiTaskChanges: string[];
  userTaskChanges: string[];
}

export interface AdaptationResponse {
  suggestions: AdaptationSuggestion[];
}

export interface AiExecutionResponse {
    output: string;
    newSubtask?: {
      text: string;
      taskBudget: number;
      requiredSpecialization: string;
    }
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}

export interface MarketAnalysisResult {
  analysisText: string;
  sources: GroundingChunk[];
}

export type OverseerLogEntry = {
  timestamp: string;
  agentTitle: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

export type ReinvestmentStrategy = 'scale_winners' | 'launch_new' | 'balanced' | 'dynamic_roi';

export interface GoalHistoryEntry {
    dateAchieved: string;
    goalAmount: number;
}

export interface AEMLInsight {
    id: string;
    insight: string;
    score: number; // 1-10
    sourceTask: string;
    timestamp: string;
}

export interface DirectiveHistoryEntry {
    timestamp: string;
    directives: string[];
}

export interface VaultCredential {
    service: string;
    apiKey: string;
    availableCredits?: number;
    lowCreditThreshold?: number;
}

export interface PortfolioRules {
    deRiskingThreshold: number;
    masterAgentThreshold: number;
    profitReinvestmentRate: number;
    hunterBotAllocationRate: number;
    financialGoal: number;
    reinvestmentStrategy: ReinvestmentStrategy;
    postGoalReinvestmentStrategy: ReinvestmentStrategy;
    goalAchieved: boolean;
    goalHistory: GoalHistoryEntry[];
    frugalityMode: boolean;
    autonomousPruning: boolean;
    swarmMode: boolean;
    aemlMemory: AEMLInsight[];
    interactionCount: number;
    coreDirectives: string[];
    founderDirectives: string[];
    upgradeProposal: { text: string; justification: string; status: 'pending' } | null;
    metamorphosisProposal: MetamorphosisProposal | null;
    directiveHistory: DirectiveHistoryEntry[];
    credentials: VaultCredential[];
    activeEmailProvider: 'Buttondown' | 'ConvertKit';
    minCapitalEfficiency: number;
    maxIdleTime: number;
    maxCognitiveLoad: number;
    maxGpuVram: number;
    genesisMode: boolean;
    kageyoshiHonor: number;
    shogunsKey: string;
    isCompromised: boolean;
    ghostProtocolEnabled: boolean;
    autonomousVentureFund: number;
    autonomousVentureAllocationRate: number;
    daimyoPagerLiveMode: boolean;
    redTeamLocked: boolean;
    hapticAlertsEnabled: boolean;
}

export interface KeyAsset {
    id: string;
    title: string;
    content: string;
    sourceAgent: string;
    taskText: string;
}

export interface WishlistItem {
    id: string;
    name: string;
    cost: number;
    unlocked: boolean;
}

export interface FinancialTransaction {
    id: string;
    timestamp: string;
    agent: string;
    description: string;
    type: 'revenue' | 'expense';
    amount: number;
    source?: 'SaaS' | 'Reports' | 'Trading' | 'Task';
}

export interface CampaignObjective {
    objective: string;
    agentRole: string;
    isNewAgent: boolean;
}

export interface CampaignPhase {
    phase: string;
    description: string;
    objectives: CampaignObjective[];
}

export interface Campaign {
    id: string;
    mission: string;
    generatedPlan: {
        campaignName: string;
        phases: CampaignPhase[];
    };
    isApproved: boolean;
}

export interface ComplianceChecklistItem {
  id: string;
  text: string;
  description: string;
  link: string;
  completed: boolean;
}

export interface SimulationScenario {
    description: string;
    bootstrapData?: string;
}

export interface SimulationResult {
    hiveConsensusPrediction: string;
    keyDivergences: string;
    hiveNotebookEntry: string;
    recommendations: string[];
    projectedProfitImpact: number;
}

export interface Simulation {
    id: string;
    scenario: SimulationScenario;
    result: SimulationResult | null;
    timestamp: string;
}

export interface FounderProfile {
    skills: FounderSkill[];
    weeklyTimeBudget: number;
}

export interface FounderSkill {
    id: string;
    name: string;
    proficiency: 'Novice' | 'Competent' | 'Expert';
}

export interface TrainingKnowledgeResponse {
    summary: string;
    specialization: string | null;
}

export interface AssetVariationResponse {
    variations: { text: string }[];
    analysis: string;
    recommendationIndex: number;
}

export interface InsightGenerationResponse {
    insight: string;
    score: number; // 1-10
}

export interface UpgradeProposalResponse {
    proposal: string;
    justification: string;
}

export interface SavedTrainingPlan {
    agentId: string;
    module: 'knowledge' | 'simulation' | 'ab_testing';
    details: {
        knowledgeText?: string;
        abTaskIndex?: number;
    }
}

export interface EliteBlueprint {
    title: string;
    description: string;
    specialization: string;
    parentage?: string[];
}

export interface SentryProtocolReport {
    newBlueprints: EliteBlueprint[];
    decommissionCandidates: { title: string, reason: DecommissionReason }[];
}

export interface BootstrapResponse {
    aemlInsights: { insight: string; score: number }[];
    newBlueprints: EliteBlueprint[];
}

export interface SuperHiveTask {
  hiveExecutionLog: string[];
  finalOutput: string;
}

export interface HunterBotFinding {
    researchReport: {
        text: string;
        sources: {
            id: number;
            url: string;
            trust: number;
            date: string;
            bias?: string;
        }[];
    };
    generatedBlueprint: Idea;
}

export interface SerperSearchParams {
    q: string;
    gl?: string;
    hl?: string;
    num?: number;
    tbs?: string;
}

export interface DiagnosticEntry {
    agentTitle: string;
    diagnosis: string;
    recommendedTreatment: string;
    urgency: 'low' | 'medium' | 'high';
}

export interface DoctorBotReport {
    diagnostics: DiagnosticEntry[];
}

export interface Trade {
    id: string;
    token: string;
    entry: number;
    size: number;
    tp: number;
    sl: number;
    entry_time: string;
    time_stop: number;
    status: 'active' | 'closed';
    exit_price?: number;
    pnl?: number;
    reason?: string;
}

export interface AutoTraderLogEntry {
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface AutoTraderState {
    isActive: boolean;
    portfolio: { SOL: number };
    activeTrades: Trade[];
    winRate: number;
    totalPnl: number;
    log: AutoTraderLogEntry[];
}

export interface HiveArchive {
    id: string;
    timestamp: string;
    simulatedArweaveTxId: string;
    simulatedSolanaPda: string;
    archiveContent: string;
    tags: { name: string; value: string }[];
}

export interface ArchiveQueryResult {
    summary: string;
    snippets: string[];
    relevance: number;
    sources: string[];
}

export interface ProductBlueprint {
    id: string;
    name: string;
    description: string;
    coreAsset: {
        type: 'html' | 'text';
        content: string;
    };
}

export interface Product {
    id: string;
    name: string;
    topic: string;
    seriesId?: string;
    storyboard?: { scene: number; narration: string; visualPrompt: string; }[];
    fullScript?: string;
    voiceoverAudio_base64?: string;
    landingPageHtml?: string;
    thumbnailPrompt?: string;
    thumbnailPromptVariations?: string[];
    crossPromotionIdeas?: string[];
    launchChecklist?: { text: string; done: boolean }[];
    generatedNewsletter?: {
        subject: string;
        body: string;
    };
    blogContent?: string;
}

export interface TaxGuruReport {
    disclaimer: string;
    costBasisMethod: string;
    estimatedShortTermGains: number;
    estimatedLongTermGains: number;
    auditRiskScore: number; // 0-100
    strategies: {
        title: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
    }[];
}

export interface CfoReport {
  executiveSummary: string;
  recommendations: {
    title: string;
    rationale: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface WarGameReport {
    simulatedProfit: number;
    potentialFailures: string[];
    recommendations: string[];
}

export interface SharedKnowledgeGraph {
    [key: string]: {
        definition: string;
        connections: string[];
    };
}

export interface HiveMindQuery {
    id: string;
    taskId: string;
    requestingAgent: string;
    queryText: string;
    bids: {
        agent: string;
        confidence: number;
    }[];
    status: 'open' | 'assigned' | 'completed';
}

export interface RetributionProtocolReport {
    summary: string;
}

export interface StrategicForesightEntry {
    title: string;
    type: 'Threat' | 'Opportunity';
    domain: string;
    timeline: string;
    implication: string;
}

export interface LearnedSkill {
  name: string;
  proficiency: number;
  summary: string;
}

export interface GuardianProtocolReport {
  newlyAcquiredSkills?: LearnedSkill[];
  strategicForesight: StrategicForesightEntry[];
}

export interface ShogunsWatchReport {
    criticalEvents: DaimyosAlert[];
}

export interface DaimyosAlert {
    title: string;
    urgency: 'critical' | 'high' | 'medium';
    details: string;
}

export type OfflineBrainStatus = 'uninitialized' | 'downloading' | 'ready' | 'error';

export interface KageyoshiError {
    timestamp: string;
    message: string;
    context: string;
    count: number;
}

export interface SelfCriticismReport {
    analysis: string;
    correctiveAction: string;
}

export interface KnowledgeGraphEntry {
    concept: string;
    definition: string;
    connections: string[];
}

export interface FounderEdictResponse {
  summary: string;
  knowledgeGraphAdditions: KnowledgeGraphEntry[];
}

export interface StrategyRefinement {
  proposedChange: string;
  justification: string;
}

export interface StrategyRefinementResponse {
  refinements: StrategyRefinement[];
}

export interface ButtondownSubscriber {
  id: string;
  email: string;
  creation_date: string;
}

export interface ButtondownSubscribersResponse {
  results: ButtondownSubscriber[];
}

export type BrainModel = string;

export interface LocalAICores {
    text: BrainModel;
    vision: BrainModel;
    audio: BrainModel;
}

export interface RedTeamReport {
  attackVector: string;
  identifiedWeaknesses: string[];
  simulatedOutcome: string;
  recommendations: string[];
}

export interface ShogunsGuardReport {
  isRogue: boolean;
  reasoning: string;
}

export interface DetectedObject {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

export interface TaxDocument {
    id: string;
    name: string;
    uploadDate: string;
    fileType: string;
    size: number;
}

export interface ReceiptAnalysis {
    transaction: Omit<FinancialTransaction, 'id'|'timestamp'|'agent'>;
    question: string | null;
}

export interface Persona {
    name: string;
    backstory: string;
    directives: string[];
    preferredModel: 'local' | 'cloud';
}
