import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Idea, RevenueStream, ActionPlan as ActionPlanType, AdaptationSuggestion, Strategy, OverseerLogEntry, PortfolioRules, KeyAsset, FinancialTransaction, AiTask, UserTask, FounderProfile, TrainingHistoryEntry } from '../types';
import BreakdownTable from './BreakdownTable';
import ProfitChart from './ProfitChart';
import TaxEstimator from './TaxEstimator';
import RevenueModeler from './RevenueModeler';
import ActionPlan from './ActionPlan';
import StrategySelector from './StrategySelector';
import { Bookmark, BookmarkCheck, Calculator, ChevronDown, Layers, Edit, Save, X, BrainCircuit, ChevronsRight, Globe, Share2, Terminal, AlertTriangle, Activity, RefreshCw, ShieldAlert, RotateCcw } from 'lucide-react';
import { rescanMarketForAgent } from '../services/geminiService';
import AdaptationModal from './AdaptationModal';
import Loader from './Loader';
import MarketAnalysis from './MarketAnalysis';
import ShareModal from './ShareModal';

interface IdeaCardProps {
  idea: Idea;
  onSave?: (idea: Idea) => void;
  isSaved?: boolean;
  onUpdate?: (idea: Idea) => void;
  onStartDevelopment?: (idea: Idea) => void;
  isDeveloping?: boolean;
  initialStrategyIndex?: number;
  addOverseerLogEntry?: (message: string, type: OverseerLogEntry['type']) => void;
  portfolioRules: PortfolioRules;
  onAddAsset?: (asset: Omit<KeyAsset, 'id'>) => void;
  addTransaction?: (agent: string, description: string, type: 'revenue' | 'expense', amount: number) => void;
  handleExecutionDispatch?: (agentId: string, taskIndex: number, userInstructions?: string) => Promise<void>;
  handleRefineTask?: (agentId: string, taskIndex: number) => Promise<void>;
  agentId?: string;
  assetLibrary?: KeyAsset[];
  founderProfile?: FounderProfile;
  handleOutsourceUserTask?: (taskIndex: number) => void;
  handleExecuteWithSuperHive?: (agentId: string, taskIndex: number) => Promise<void>;
  agentLog?: OverseerLogEntry[]; // NEW PROP
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
    idea, onSave, isSaved, onUpdate, onStartDevelopment, isDeveloping = false, initialStrategyIndex, 
    addOverseerLogEntry, portfolioRules, onAddAsset, addTransaction, handleExecutionDispatch, handleRefineTask, agentId, assetLibrary,
    founderProfile, handleOutsourceUserTask, handleExecuteWithSuperHive, agentLog = []
}) => {
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(initialStrategyIndex ?? 0);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [isAutoApprove, setIsAutoApprove] = useState(false);

  useEffect(() => {
    if (!isDeveloping && idea && idea.strategies) {
        const growthHackerIndex = idea.strategies.findIndex(s => s.strategyName === 'Growth Hacker');
        setSelectedStrategyIndex(growthHackerIndex !== -1 ? growthHackerIndex : 0);
    }
  }, [idea, isDeveloping]);

  const selectedStrategy = useMemo(() => idea.strategies?.[selectedStrategyIndex], [idea, selectedStrategyIndex]);

  const [isFinancialModelerOpen, setIsFinancialModelerOpen] = useState(false);
  const [isRevenueModelerOpen, setIsRevenueModelerOpen] = useState(false);
  const [isMarketAnalysisOpen, setIsMarketAnalysisOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(isDeveloping);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(idea.title);
  const [editableDescription, setEditableDescription] = useState(idea.description);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptationSuggestions, setAdaptationSuggestions] = useState<AdaptationSuggestion[] | null>(null);
  const [adaptationError, setAdaptationError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false); // New state for log accordion

  const proficiencyScore = selectedStrategy?.proficiencyScore ?? 0;
  const isMasterAgent = selectedStrategy?.isMasterAgent ?? false;
  const isEligibleForMaster = proficiencyScore >= portfolioRules.masterAgentThreshold;
  
  // --- DIAGNOSTIC LOGIC ---
  const diagnostics = useMemo(() => {
      if (!selectedStrategy) return [];
      const issues = [];
      
      // Check 1: Stuck Tasks
      const stuckTasks = selectedStrategy.actionPlan.aiTasks.filter(t => t.status === 'executing');
      if (stuckTasks.length > 0) {
          issues.push({ type: 'warning', msg: `${stuckTasks.length} task(s) appear stuck in 'executing'.`, action: 'Use "Halt & Reset" in Action Plan.' });
      }

      // Check 2: Failed Tasks
      const failedTasks = selectedStrategy.actionPlan.aiTasks.filter(t => t.status === 'failed');
      if (failedTasks.length > 0) {
          issues.push({ type: 'error', msg: `${failedTasks.length} task(s) failed.`, action: 'Check API Key or use "Retry Protocol".' });
      }

      // Check 3: VRAM Overload
      if (selectedStrategy.gpuVramUsage > portfolioRules.maxGpuVram) {
           issues.push({ type: 'error', msg: `VRAM Overload (${selectedStrategy.gpuVramUsage}MB > ${portfolioRules.maxGpuVram}MB).`, action: 'Reduce Load or Spawn Drone.' });
      }

      // Check 4: Low Efficiency Burn
      if (selectedStrategy.capitalEfficiency < 10 && selectedStrategy.actualSpent > 200) {
          issues.push({ type: 'warning', msg: 'Capital Efficiency Critical (<10%).', action: 'Initiate Strategy Refinement in The Forge.' });
      }

      return issues;
  }, [selectedStrategy, portfolioRules]);


  const handleActionPlanChange = useCallback((newPlan: ActionPlanType, newFinancials?: Partial<Pick<Strategy, 'actualSpent' | 'actualRevenue' | 'capitalEfficiency'>>) => {
    if (onUpdate) {
        const newStrategies = [...idea.strategies];
        const oldStrategy = newStrategies[selectedStrategyIndex];

        const updatedStrategy = {
            ...oldStrategy,
            actionPlan: newPlan,
            ...newFinancials,
        };
        
        if (newFinancials?.actualSpent !== undefined || newFinancials?.actualRevenue !== undefined) {
            const spent = newFinancials.actualSpent ?? oldStrategy.actualSpent;
            const revenue = newFinancials.actualRevenue ?? oldStrategy.actualRevenue;
            updatedStrategy.capitalEfficiency = spent > 0 ? (revenue / spent) * 100 : 0;
        }

        newStrategies[selectedStrategyIndex] = updatedStrategy;
        const updatedIdea: Idea = { ...idea, strategies: newStrategies };
        onUpdate(updatedIdea);
    }
  }, [idea, onUpdate, selectedStrategyIndex]);

  const handleFinancialsChange = (field: keyof Pick<Strategy, 'taxRate' | 'otherIncome' | 'additionalDeductions'>, value: number) => {
    if (onUpdate) {
        const newStrategies = [...idea.strategies];
        newStrategies[selectedStrategyIndex] = {
            ...newStrategies[selectedStrategyIndex],
            [field]: value
        };
        onUpdate({ ...idea, strategies: newStrategies });
    }
  };

  const handleRevenueStreamsChange = (newStreams: RevenueStream[]) => {
      if (onUpdate) {
          onUpdate({ ...idea, suggestedRevenueStreams: newStreams });
      }
  };

  const handleSaveEdit = () => {
    if (onUpdate) {
        onUpdate({ ...idea, title: editableTitle, description: editableDescription });
        setIsEditing(false);
    }
  };

  const handleAdaptation = async () => {
      if(!selectedStrategy) return;
      setIsAdapting(true);
      setAdaptationError(null);
      setAdaptationSuggestions(null);
      try {
          const response = await rescanMarketForAgent(idea, selectedStrategyIndex);
          setAdaptationSuggestions(response.suggestions);
      } catch (e) {
          setAdaptationError(e instanceof Error ? e.message : "Unknown error");
      } finally {
          setIsAdapting(false);
      }
  };

  const handleExecuteAiTask = useCallback(async (taskIndex: number, userInstructions?: string) => {
    if (handleExecutionDispatch && agentId) {
      await handleExecutionDispatch(agentId, taskIndex, userInstructions);
    }
  }, [handleExecutionDispatch, agentId]);

  const handleRefineTaskCallback = useCallback(async (taskIndex: number) => {
    if (handleRefineTask && agentId) {
        await handleRefineTask(agentId, taskIndex);
    }
  }, [handleRefineTask, agentId]);

  const handleApproveAiTask = (taskIndex: number, finalOutput: string, edited: boolean) => {
    if (!addOverseerLogEntry) return;

    const newPlan: ActionPlanType = JSON.parse(JSON.stringify(selectedStrategy.actionPlan));
    const task = newPlan.aiTasks[taskIndex];
    if (task.status !== 'awaiting_review') return;

    task.status = 'completed';
    task.output = finalOutput;
    if (onAddAsset) {
        onAddAsset({
            title: `Output for: ${task.text.substring(0, 30)}...`,
            content: finalOutput,
            sourceAgent: idea.title,
            taskText: task.text,
        });
        addOverseerLogEntry('AI output approved and saved to Asset Library.', 'success');
    }

    const nextTaskIndex = newPlan.aiTasks.findIndex(t => t.status === 'pending');
    if (nextTaskIndex !== -1) {
        newPlan.aiTasks[nextTaskIndex].status = 'active';
    }

    handleActionPlanChange(newPlan);
  };

  const handleEscalateAiTask = (taskIndex: number) => {
     if (!onUpdate) return;
     const newPlan = JSON.parse(JSON.stringify(selectedStrategy.actionPlan));
     const aiTask = newPlan.aiTasks[taskIndex];
     aiTask.status = 'failed';
     aiTask.error = "Escalated by user.";
     
     const newUserTask: UserTask = {
         id: crypto.randomUUID(),
         text: `Escalated: ${aiTask.text}`,
         status: 'active',
         estimatedTime: 1,
         escalatedFrom: { task: aiTask, error: "Manual Escalation" }
     };
     
     newPlan.userTasks = [newUserTask, ...newPlan.userTasks];
     handleActionPlanChange(newPlan);
     if(addOverseerLogEntry) addOverseerLogEntry(`Task escalated to human operator: ${aiTask.text}`, 'warning');
  };

  if (!selectedStrategy) {
    return <div className="bg-red-900/50 p-4 rounded-lg text-red-200 border border-red-700">Error: The selected strategy could not be loaded. The data might be corrupted.</div>;
  }

  return (
    <div className="card-base shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10 relative overflow-hidden group">
      
      {/* Header Section */}
      <div className="p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow pr-4">
             <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-mono text-accent-cyan px-2 py-0.5 rounded bg-cyan-900/30 border border-cyan-700/50">{idea.businessModelType}</span>
                {isDeveloping && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${isMasterAgent ? 'text-yellow-400 bg-yellow-900/30 border-yellow-600' : 'text-green-400 bg-green-900/30 border-green-600'}`}>
                        {isMasterAgent ? 'MASTER AGENT' : 'ACTIVE AGENT'}
                    </span>
                )}
             </div>
            {isEditing ? (
                <input 
                    type="text" 
                    value={editableTitle} 
                    onChange={(e) => setEditableTitle(e.target.value)} 
                    className="text-2xl font-bold text-white bg-bg-primary border border-border-primary rounded p-1 w-full font-heading"
                />
            ) : (
                <h3 className="text-2xl font-bold text-white leading-tight font-heading">{idea.title}</h3>
            )}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            {isDeveloping && (
                 <button onClick={() => setIsShareModalOpen(true)} className="text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" title="Share Blueprint">
                    <Share2 size={20} />
                 </button>
            )}
            {onSave && !isSaved && (
              <button
                onClick={() => onSave(idea)}
                className="text-text-secondary hover:text-accent-cyan transition-colors p-2 rounded-full hover:bg-white/10"
                title="Save Blueprint"
              >
                <Bookmark size={20} />
              </button>
            )}
            {isSaved && (
               <div className="text-accent-cyan p-2" title="Saved">
                   <BookmarkCheck size={20} />
               </div>
            )}
             <button onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)} className="text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                {isEditing ? <Save size={20}/> : <Edit size={20}/>}
            </button>
          </div>
        </div>

        {isEditing ? (
            <textarea 
                value={editableDescription} 
                onChange={(e) => setEditableDescription(e.target.value)} 
                className="text-sm text-gray-300 bg-bg-primary border border-border-primary rounded p-2 w-full h-20"
            />
        ) : (
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{idea.description}</p>
        )}
        
        {!isDeveloping && (
             <div className="flex justify-between items-center pt-2">
                <button onClick={handleAdaptation} disabled={isAdapting} className="text-xs flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
                    {isAdapting ? <Loader small/> : <><BrainCircuit size={14} className="mr-1"/>Check for Adaptations</>}
                </button>
                <button onClick={() => setIsMarketAnalysisOpen(true)} className="text-xs flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
                    <Globe size={14} className="mr-1"/>Market Intel
                </button>
            </div>
        )}
      </div>

      {/* Blueprint Content */}
      {isBlueprintOpen ? (
          <div className="p-6 space-y-8 bg-bg-secondary/30">
            
            {/* Strategy Selector (Only visible in Generator/Saved view or if multiple strategies exist) */}
            {!isDeveloping && (
                <StrategySelector 
                    strategies={idea.strategies} 
                    selectedIndex={selectedStrategyIndex} 
                    onSelect={setSelectedStrategyIndex} 
                />
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-bg-tertiary rounded-lg border border-border-primary">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Investment</p>
                    <p className="text-lg font-bold text-white">${selectedStrategy.totalInvestment.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-bg-tertiary rounded-lg border border-border-primary">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Est. Profit</p>
                    <p className="text-lg font-bold text-accent-green">${selectedStrategy.projectedProfit.toLocaleString()}</p>
                </div>
                 <div className="p-3 bg-bg-tertiary rounded-lg border border-border-primary">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">ROI Time</p>
                    <p className="text-lg font-bold text-accent-yellow">{selectedStrategy.timeToProfit}</p>
                </div>
                 <div className="p-3 bg-bg-tertiary rounded-lg border border-border-primary">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Break-even</p>
                    <p className="text-lg font-bold text-white">Phase 2</p>
                </div>
            </div>

            {/* Execution Modules */}
            <div className="space-y-6">
                <div className="bg-bg-primary/50 rounded-lg border border-border-primary overflow-hidden">
                    <button 
                        onClick={() => setIsFinancialModelerOpen(!isFinancialModelerOpen)}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition-colors"
                    >
                        <h4 className="font-bold text-white flex items-center"><Calculator className="mr-2 text-indigo-400" size={18}/>Financial Deep Dive</h4>
                        <ChevronDown size={20} className={`text-text-secondary transition-transform ${isFinancialModelerOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    {isFinancialModelerOpen && (
                        <div className="p-4 border-t border-border-primary space-y-6 animate-fade-in">
                             <RevenueModeler streams={idea.suggestedRevenueStreams} onStreamsChange={handleRevenueStreamsChange} />
                             <TaxEstimator 
                                businessProfit={selectedStrategy.projectedProfit} 
                                taxRate={selectedStrategy.taxRate}
                                otherIncome={selectedStrategy.otherIncome}
                                additionalDeductions={selectedStrategy.additionalDeductions}
                                onFinancialsChange={handleFinancialsChange}
                             />
                             <div className="mt-4">
                                <h5 className="font-semibold text-white mb-3">Phase Breakdown</h5>
                                <BreakdownTable data={selectedStrategy.breakdown} />
                             </div>
                             <div className="mt-4">
                                <h5 className="font-semibold text-white mb-3">Profit Trajectory</h5>
                                <ProfitChart data={selectedStrategy.chartData} />
                             </div>
                        </div>
                    )}
                </div>
                
                <div className="bg-bg-primary/50 rounded-lg border border-border-primary overflow-hidden">
                    <div className="p-4 border-b border-border-primary">
                         <h4 className="font-bold text-white flex items-center"><Layers className="mr-2 text-accent-cyan" size={18}/>Action Plan & Execution</h4>
                    </div>
                    <div className="p-4">
                         <ActionPlan 
                            plan={selectedStrategy.actionPlan} 
                            onPlanChange={handleActionPlanChange}
                            onExecuteAiTask={handleExecuteAiTask}
                            onRefineAiTask={handleRefineTaskCallback}
                            onApproveAiTask={handleApproveAiTask}
                            onEscalateAiTask={handleEscalateAiTask}
                            isAutonomous={isAutonomous}
                            setIsAutonomous={setIsAutonomous}
                            isAutoApprove={isAutoApprove}
                            setIsAutoApprove={setIsAutoApprove}
                            isMasterAgent={isMasterAgent}
                            onAddAsset={onAddAsset}
                            assetLibrary={assetLibrary}
                            founderProfile={founderProfile}
                            onOutsourceUserTask={handleOutsourceUserTask}
                            onExecuteWithSuperHive={handleExecuteWithSuperHive}
                         />
                    </div>
                </div>

                {/* NEURAL LOG & DIAGNOSTICS MODULE */}
                {isDeveloping && (
                    <div className="bg-bg-primary/50 rounded-lg border border-border-primary overflow-hidden">
                        <button 
                            onClick={() => setIsLogOpen(!isLogOpen)}
                            className={`w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition-colors ${diagnostics.length > 0 ? 'bg-red-900/10' : ''}`}
                        >
                            <div className="flex items-center">
                                <Terminal className={`mr-2 ${diagnostics.length > 0 ? 'text-red-400' : 'text-gray-400'}`} size={18}/>
                                <h4 className={`font-bold ${diagnostics.length > 0 ? 'text-red-300' : 'text-gray-300'}`}>
                                    System Logs & Diagnostics
                                </h4>
                                {diagnostics.length > 0 && (
                                    <span className="ml-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                                        {diagnostics.length} Alert{diagnostics.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <ChevronDown size={20} className={`text-text-secondary transition-transform ${isLogOpen ? 'rotate-180' : ''}`}/>
                        </button>

                        {isLogOpen && (
                            <div className="p-4 border-t border-border-primary animate-fade-in">
                                {/* Diagnostic Report */}
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        <span>Diagnostic Report</span>
                                        <span className={diagnostics.length === 0 ? 'text-green-400' : 'text-red-400'}>
                                            Status: {diagnostics.length === 0 ? 'NOMINAL' : 'ATTENTION REQUIRED'}
                                        </span>
                                    </div>
                                    {diagnostics.length > 0 ? (
                                        diagnostics.map((diag, i) => (
                                            <div key={i} className={`flex items-start p-2 rounded-md border ${diag.type === 'error' ? 'bg-red-900/20 border-red-500/50 text-red-300' : 'bg-yellow-900/20 border-yellow-500/50 text-yellow-300'}`}>
                                                {diag.type === 'error' ? <ShieldAlert size={16} className="mr-2 mt-0.5"/> : <AlertTriangle size={16} className="mr-2 mt-0.5"/>}
                                                <div className="text-sm">
                                                    <span className="font-bold">{diag.msg}</span>
                                                    <span className="block text-xs opacity-80 mt-1">Suggestion: {diag.action}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-green-900/10 border border-green-500/30 rounded-md p-2 text-green-400 text-xs flex items-center">
                                            <Activity size={14} className="mr-2"/> All systems functioning within normal parameters.
                                        </div>
                                    )}
                                </div>

                                {/* Console View */}
                                <div className="bg-black/60 rounded-md p-3 border border-gray-700 h-48 overflow-y-auto font-mono text-xs custom-scrollbar">
                                    {agentLog.length > 0 ? (
                                        agentLog.map((entry, idx) => (
                                            <div key={idx} className="mb-1.5 flex">
                                                <span className="text-gray-600 mr-2 flex-shrink-0">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                                                <span className={`${
                                                    entry.type === 'error' ? 'text-red-400' :
                                                    entry.type === 'warning' ? 'text-yellow-400' :
                                                    entry.type === 'success' ? 'text-green-400' : 'text-blue-300'
                                                }`}>
                                                    {entry.type.toUpperCase()}: {entry.message}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-600 italic text-center mt-10">-- No log activity recorded --</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
            
            {onStartDevelopment && !isDeveloping && (
                <button
                    onClick={() => onStartDevelopment(idea)}
                    className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-indigo-500/20 flex justify-center items-center group"
                >
                    <ChevronsRight className="mr-2 group-hover:translate-x-1 transition-transform"/>
                    Activate Agent & Begin
                </button>
            )}
          </div>
      ) : (
          <div className="p-4 bg-bg-secondary/30 border-t border-border-primary text-center">
              <button onClick={() => setIsBlueprintOpen(true)} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                  View Blueprint Details
              </button>
          </div>
      )}
      
      {/* Modals */}
      {isMarketAnalysisOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsMarketAnalysisOpen(false)}>
            <div className="bg-bg-secondary border border-border-primary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                 <div className="p-4 border-b border-border-primary flex justify-between items-center sticky top-0 bg-bg-secondary z-10">
                    <h3 className="text-xl font-bold text-white">Live Market Intelligence</h3>
                    <button onClick={() => setIsMarketAnalysisOpen(false)}><X className="text-text-secondary hover:text-white"/></button>
                 </div>
                 <div className="p-6">
                    <MarketAnalysis ideaTitle={idea.title} ideaDescription={idea.description} />
                 </div>
            </div>
        </div>
      )}
      {(adaptationSuggestions || adaptationError) && (
          <AdaptationModal suggestions={adaptationSuggestions} error={adaptationError} onClose={() => { setAdaptationSuggestions(null); setAdaptationError(null); }} />
      )}
      {isShareModalOpen && selectedStrategy && (
          <ShareModal idea={idea} strategy={selectedStrategy} selectedStrategyIndex={selectedStrategyIndex} onClose={() => setIsShareModalOpen(false)} />
      )}

    </div>
  );
};

export default IdeaCard;