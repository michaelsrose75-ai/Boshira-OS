
import React, { useState } from 'react';
import type { Idea, Simulation, SimulationScenario, PortfolioRules, DirectiveHistoryEntry, SavedTrainingPlan, SentryProtocolReport, HiveArchive, ArchiveQueryResult, DoctorBotReport, EliteBlueprint, DecommissionReason, DataStatus, WarGameReport, SharedKnowledgeGraph, HiveMindQuery, GuardianProtocolReport, SelfCriticismReport, KageyoshiError, HostEnvironment, FounderEdictResponse, KeyAsset, LabView, DynastyMemory, FinancialTransaction } from '../types';
import { FlaskConical, GraduationCap, BrainCircuit, Activity, TestTube, ChevronRight, Bot, Zap, Bookmark, Brain, Repeat, Lightbulb, Check, X, Shield, History, Plus, Trash2, Archive, Download, Upload, Search, HeartPulse, Rocket, ShieldCheck, Axe, AlertTriangle, DatabaseZap, Book, Terminal, Atom, TrendingUp, HardDrive } from 'lucide-react';
import { trainAgentWithKnowledge, generateAssetVariations, getSystemInstructions, honeAsset } from '../services/geminiService';
import Loader from './Loader';
import ErrorMessage from './components/ErrorMessage';
import SimulationReport from './SimulationReport';
import FounderEdictDashboard from './FounderEdictDashboard';
import SystemOperationsConsole from './SystemOperationsConsole';
import ParadigmShiftCouncil from './ParadigmShiftCouncil';
import GuardianProtocolDashboard from './GuardianProtocolDashboard';
import SentryProtocolDashboard from './SentryProtocolDashboard';
import DoctorBotDashboard from './DoctorBotDashboard';
import DynastyMemoryCore from './DynastyMemoryCore';

interface EngineeringLabProps {
  agents: Idea[];
  decommissionedAgents: Idea[];
  onTrainingComplete: (agentId: string, proficiencyGained: number, specialization: string | null, trainingResult: string, moduleName: string) => void;
  runSimulation: (scenario: SimulationScenario) => Promise<Simulation>;
  setActiveView: (view: 'generator' | 'saved' | 'development' | 'command_center' | 'engineering_lab' | 'dynasty') => void;
  portfolioRules: PortfolioRules;
  onUpdateDirectives: (directives: string[]) => void;
  onRollbackDirectives: (historyEntry: DirectiveHistoryEntry) => void;
  onUpgradeProposal: (approved: boolean) => void;
  savedPlan: SavedTrainingPlan | null;
  onPlanUpdate: (plan: SavedTrainingPlan | null) => void;
  sentryProtocolReport: SentryProtocolReport | null;
  onInitiateSentryProtocol: () => Promise<void>;
  archives: HiveArchive[];
  onArchiveHive: () => void;
  onQueryArchive: (query: string) => void;
  archiveQueryResults: ArchiveQueryResult | null;
  isQueryingArchive: boolean;
  doctorBotReport: DoctorBotReport | null;
  onRunDoctorBotProtocol: () => Promise<void>;
  onInstantiateBlueprint: (blueprint: EliteBlueprint) => void;
  onRestoreFromBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetState: () => void;
  dataStatus: DataStatus;
  onRunWarGame: (agentId: string) => void;
  warGameReport: WarGameReport | null;
  onLKGSRestore: () => void;
  sharedKnowledgeGraph: SharedKnowledgeGraph;
  hiveMindQueries: HiveMindQuery[];
  onRulesChange: (rules: PortfolioRules) => void;
  onRunGuardianProtocol: () => Promise<void>;
  guardianProtocolReport: GuardianProtocolReport | null;
  onRunSelfCriticism: () => Promise<void>;
  selfCriticismReport: SelfCriticismReport | null;
  kageyoshiErrors: KageyoshiError[];
  onExecuteFounderEdict: (directive: string) => Promise<void>;
  edictReport: FounderEdictResponse | null;
  isEdictLoading: boolean;
  hostEnvironment: HostEnvironment;
  getSystemInstructions: (objective: string, osInfo: string) => Promise<string>;
  assetLibrary: KeyAsset[];
  onUpdateAsset: (asset: KeyAsset) => void;
  setEngineeringLabTab: (tab: LabView) => void;
  activeLabTab: LabView;
  
  // Memory Props
  dynastyMemories: DynastyMemory[];
  onAddMemory: (content: string, type: DynastyMemory['type']) => void;
  
  onGrantHonor: () => void;
  financialTransactions: FinancialTransaction[]; // NEW
}

type TrainingModule = 'knowledge' | 'simulation' | 'ab_testing';

export const EngineeringLab: React.FC<EngineeringLabProps> = (props) => {
  
  // Simulated Drive Usage based on memory count (arbitrary multiplier for effect)
  const driveUsage = props.dynastyMemories.length * 0.05; // 0.05 GB per memory (text + metadata overhead simulation)

  const TabButton: React.FC<{ view: LabView, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => {
    const isActive = props.activeLabTab === view;
    return (
      <button 
        onClick={() => props.setEngineeringLabTab(view)}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${isActive ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
      >
        {icon}
        {label}
      </button>
    )
  };
  
  const renderLabContent = () => {
    switch (props.activeLabTab) {
        case 'paradigm_shift':
            return <ParadigmShiftCouncil onGrantHonor={props.onGrantHonor} />;
        case 'the_forge':
            return (
                <div>
                     <h4 className="text-lg font-bold text-white mb-4">The Forge: Reforging & Ingestion</h4>
                     <p className="text-sm text-gray-400 mb-6">Ingest external concepts and reforge them into protected Hive assets.</p>
                     <div className="text-center text-gray-500 py-10">Forge functionality ready for deployment.</div>
                </div>
            );
        case 'system_ops':
            return <SystemOperationsConsole hostEnvironment={props.hostEnvironment} getInstructions={props.getSystemInstructions} />;
        case 'cortex':
            return <DynastyMemoryCore 
                memories={props.dynastyMemories} 
                onAddMemory={props.onAddMemory} 
                driveStatus={{ total: 480, used: driveUsage, label: 'D: Drive' }}
                
                // Full Export State Props
                financialTransactions={props.financialTransactions}
                portfolioRules={props.portfolioRules}
                agents={props.agents}
                assetLibrary={props.assetLibrary}
            />;
        case 'guardian_protocol':
            return <GuardianProtocolDashboard onRunGuardianProtocol={props.onRunGuardianProtocol} guardianProtocolReport={props.guardianProtocolReport} />;
        case 'sentry_protocol':
            return <SentryProtocolDashboard onInitiateSentryProtocol={props.onInitiateSentryProtocol} sentryProtocolReport={props.sentryProtocolReport} onInstantiateBlueprint={props.onInstantiateBlueprint} />;
        case 'doctor_bot':
            return <DoctorBotDashboard 
                onRunDoctorBotProtocol={props.onRunDoctorBotProtocol} 
                doctorBotReport={props.doctorBotReport} 
                agents={props.agents}
                onRunWarGame={props.onRunWarGame}
                warGameReport={props.warGameReport}
            />;
        case 'edicts':
            return <FounderEdictDashboard onExecute={props.onExecuteFounderEdict} isLoading={props.isEdictLoading} report={props.edictReport} agents={props.agents} onInfuse={async () => {}} />;
        default:
            return <div className="text-center text-gray-500 py-20">Select a module to begin operations.</div>;
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center"><FlaskConical size={32} className="mr-4 text-indigo-400"/>Engineering Lab</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">The R&D core of your operation. Train, upgrade, and stress-test your agents to forge an elite fleet.</p>
      </div>

       <div className="overflow-x-auto pb-2">
        <div className="flex items-center space-x-2 bg-gray-900/50 p-1 rounded-lg border border-gray-700 max-w-max mx-auto">
            <TabButton view="paradigm_shift" label="Paradigm Shift" icon={<TrendingUp size={16} className="mr-2"/>} />
            <TabButton view="cortex" label="Cortex & Archives" icon={<HardDrive size={16} className="mr-2"/>} />
            <TabButton view="guardian_protocol" label="Guardian" icon={<ShieldCheck size={16} className="mr-2"/>} />
            <TabButton view="the_forge" label="The Forge" icon={<Atom size={16} className="mr-2"/>} />
            <TabButton view="system_ops" label="System Ops" icon={<Terminal size={16} className="mr-2"/>} />
            <TabButton view="sentry_protocol" label="Sentry" icon={<Rocket size={16} className="mr-2"/>} />
            <TabButton view="doctor_bot" label="Doctor Bot" icon={<HeartPulse size={16} className="mr-2"/>} />
            <TabButton view="edicts" label="Edicts" icon={<Book size={16} className="mr-2"/>} />
        </div>
      </div>

       <div className="card-base p-6 md:p-8">
        {renderLabContent()}
      </div>
    </div>
  );
};
