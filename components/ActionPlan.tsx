
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ActionPlan as ActionPlanType, TaskStatus, KeyAsset, AiTask, UserTask, FounderProfile } from '../types';
import { DollarSign, Bot, User, Check, Play, Loader as LoaderIcon, Lock, Scale, Eye, ThumbsUp, ThumbsDown, Send, MessageSquarePlus, X, Activity, Power, AlertCircle, RefreshCw, Briefcase, Sparkles, Edit, UserCheck, Shuffle, ArrowRight, ArrowLeftRight, Save, Library, GripVertical, BrainCircuit, CornerDownRight, Clock, ShieldAlert, Wrench, FastForward, RotateCcw, ListOrdered, Layers } from 'lucide-react';
import Loader from './Loader';

interface ActionPlanProps {
  plan: ActionPlanType;
  onPlanChange: (newPlan: ActionPlanType, newFinancials?: any) => void;
  onExecuteAiTask: (taskIndex: number, userInstructions?: string) => void;
  onRefineAiTask?: (taskIndex: number) => void;
  onApproveAiTask: (taskIndex: number, finalOutput: string, edited: boolean) => void;
  onEscalateAiTask: (taskIndex: number) => void;
  isAutonomous: boolean;
  setIsAutonomous: (value: boolean) => void;
  isAutoApprove: boolean;
  setIsAutoApprove: (value: boolean) => void;
  isMasterAgent: boolean;
  onAddAsset?: (asset: Omit<KeyAsset, 'id' | 'sourceAgent'>) => void;
  assetLibrary?: KeyAsset[];
  founderProfile?: FounderProfile;
  onOutsourceUserTask?: (taskIndex: number) => void;
  onExecuteWithSuperHive?: (taskIndex: number) => Promise<void>;
}

type AiTaskNode = AiTask & { children: AiTaskNode[] };

type PriorityItem = {
    type: 'ai' | 'user';
    data: AiTask | UserTask;
    priorityScore: number;
    originalIndex: number; // Index in original arrays
};

const ActionPlan: React.FC<ActionPlanProps> = ({ plan, onPlanChange, onExecuteAiTask, onRefineAiTask, onApproveAiTask, onEscalateAiTask, isAutonomous, setIsAutonomous, isAutoApprove, setIsAutoApprove, isMasterAgent, onAddAsset, assetLibrary, founderProfile, onOutsourceUserTask, onExecuteWithSuperHive }) => {
  const [editedOutputs, setEditedOutputs] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const initialOutputs: { [key: number]: string } = {};
    plan.aiTasks.forEach((task, index) => {
      if (task.status === 'awaiting_review' && task.output && editedOutputs[index] === undefined) {
        initialOutputs[index] = task.output;
      }
    });
    if (Object.keys(initialOutputs).length > 0) {
      setEditedOutputs(prev => ({...prev, ...initialOutputs}));
    }
  }, [plan.aiTasks, editedOutputs]);

  const taskTree = useMemo(() => {
    const taskMap = new Map<string, AiTaskNode>();
    const rootTasks: AiTaskNode[] = [];

    plan.aiTasks.forEach(task => {
        taskMap.set(task.id, { ...task, children: [] });
    });

    plan.aiTasks.forEach(task => {
        const taskNode = taskMap.get(task.id);
        if (task.parentTaskId && taskMap.has(task.parentTaskId)) {
            taskMap.get(task.parentTaskId)?.children.push(taskNode!);
        } else {
            rootTasks.push(taskNode!);
        }
    });

    return rootTasks;
  }, [plan.aiTasks]);

  // --- PRIORITY SORTING LOGIC ---
  const priorityQueue = useMemo(() => {
      const items: PriorityItem[] = [];

      // 1. User Tasks
      plan.userTasks.forEach((task, index) => {
          let score = 10; // Default low priority
          if (task.escalatedFrom) score = 1; // Highest Priority (Escalated)
          else if (task.status === 'active') score = 3; // Active User Task

          if (score < 10) {
              items.push({ type: 'user', data: task, priorityScore: score, originalIndex: index });
          }
      });

      // 2. AI Tasks
      plan.aiTasks.forEach((task, index) => {
          let score = 10;
          if (task.status === 'failed') score = 0; // Critical Failure
          else if (task.status === 'awaiting_review') score = 2; // Needs Review
          else if (task.status === 'active' || task.status === 'executing' || task.status === 'retrying') score = 4; // Active AI

          if (score < 10) {
              items.push({ type: 'ai', data: task, priorityScore: score, originalIndex: index });
          }
      });

      // Sort ascending (lower score = higher priority)
      return items.sort((a, b) => a.priorityScore - b.priorityScore);
  }, [plan.userTasks, plan.aiTasks]);


  const handleTaskAction = (taskId: string, action: 'retry' | 'bypass' | 'reset') => {
      const newPlan = JSON.parse(JSON.stringify(plan)); // Deep copy
      const taskIndex = newPlan.aiTasks.findIndex((t: AiTask) => t.id === taskId);
      
      if (taskIndex === -1) return;
      
      const task = newPlan.aiTasks[taskIndex];
      
      if (action === 'retry') {
          task.status = 'active';
          task.error = undefined;
          task.retryCount = (task.retryCount || 0) + 1;
      } else if (action === 'bypass') {
          task.status = 'completed';
          task.output = '[IMPERIAL OVERRIDE] Task forced to complete by Operator.';
          // Activate next pending task
          const nextIndex = newPlan.aiTasks.findIndex((t: AiTask) => t.status === 'pending');
          if(nextIndex !== -1) newPlan.aiTasks[nextIndex].status = 'active';
      } else if (action === 'reset') {
          task.status = 'pending';
          task.error = undefined;
          task.output = undefined;
      }
      
      onPlanChange(newPlan);
  };

  const handleAddViralTask = () => {
      const newTask: AiTask = {
          id: crypto.randomUUID(),
          text: 'Scan for viral audio trends on TikTok and generate 3 content ideas',
          status: 'pending',
          taskBudget: 5
      };
      const newPlan = { ...plan, aiTasks: [...plan.aiTasks, newTask] };
      onPlanChange(newPlan);
  };

  const getStatusIcon = (status: TaskStatus, isFrugal: boolean = false, isOutsourced: boolean = false) => {
    if (isFrugal) return <Sparkles className="text-green-400" size={18} />;
    if (isOutsourced) return <ArrowLeftRight className="text-cyan-400" size={18} />;
    
    switch (status) {
      case 'completed': return <Check className="text-green-400" size={18} />;
      case 'active': return <Play className="text-blue-400 animate-pulse" size={18} />;
      case 'executing': return <LoaderIcon className="text-indigo-400 animate-spin" size={18} />;
      case 'awaiting_review': return <Eye className="text-yellow-400" size={18} />;
      case 'failed': return <AlertCircle className="text-red-400" size={18} />;
      case 'bypassed': return <ArrowRight className="text-gray-500" size={18} />;
      case 'retrying': return <RefreshCw className="text-orange-400 animate-spin" size={18} />;
      case 'queued': return <Clock className="text-gray-400" size={18} />;
      default: return <Lock className="text-gray-500" size={18} />;
    }
  };

  const renderPriorityItem = (item: PriorityItem) => {
      if (item.type === 'ai') {
          const task = item.data as AiTask;
          const node: AiTaskNode = { ...task, children: [] }; // Flat rendering for priority queue
          return renderAiTaskNode(node, false, true);
      } else {
          const task = item.data as UserTask;
          return renderUserTaskCard(task, item.originalIndex, true);
      }
  }

  const renderAiTaskNode = (task: AiTaskNode, isSubtask = false, isPriorityView = false) => {
    const taskIndex = plan.aiTasks.findIndex(t => t.id === task.id);
    const isActive = task.status === 'active';
    const isFailed = task.status === 'failed';
    const isStuck = task.status === 'executing';
    const isReview = task.status === 'awaiting_review';
    
    let borderClass = '';
    if (isPriorityView) {
        if (isFailed) borderClass = 'border-l-4 border-red-500 bg-red-900/20';
        else if (isReview) borderClass = 'border-l-4 border-yellow-500 bg-yellow-900/20';
        else if (isActive || isStuck) borderClass = 'border-l-4 border-blue-500 bg-blue-900/20';
    } else {
         borderClass = isActive ? 'timeline-item-active' : '';
         if (isFailed) borderClass = 'border-l-2 border-red-500 bg-red-900/10';
    }

    return (
        <div key={task.id} className={`timeline-item ${borderClass}`}>
             <div className="timeline-icon-container">
                {isFailed ? <AlertCircle size={18} className="text-red-400"/> : <Bot size={18} className={isActive ? "text-accent-primary" : "text-text-secondary"}/>}
            </div>
            <div className={`timeline-content w-full`}>
                <div className="flex items-start justify-between">
                    <div className="flex-grow pr-4">
                         <div className="flex items-center mb-1">
                             {isPriorityView && (
                                 <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mr-2 ${isFailed ? 'bg-red-500 text-white' : isReview ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'}`}>
                                     {isFailed ? 'CRITICAL' : isReview ? 'REVIEW' : 'IN PROGRESS'}
                                 </span>
                             )}
                             <p className={`font-semibold ${task.status === 'completed' || task.status === 'bypassed' ? 'text-text-secondary line-through' : isFailed ? 'text-red-300' : 'text-text-primary'}`}>{task.text}</p>
                         </div>

                        {task.statusDetail && (task.status === 'executing' || task.status === 'awaiting_review' || task.status === 'bypassed' || task.status === 'retrying') && (
                          <p className={`text-xs mt-1 ${task.status === 'bypassed' ? 'text-text-secondary' : 'text-accent-primary'}`}>{task.statusDetail}</p>
                        )}
                        {isFailed && task.error && (
                             <div className="mt-2 bg-red-900/40 p-2 rounded border border-red-700/50 text-xs text-red-200">
                                 <p className="font-bold flex items-center"><AlertCircle size={12} className="mr-1"/> Failure Diagnostic:</p>
                                 <p>{task.error}</p>
                             </div>
                        )}
                    </div>
                    <div className="flex-shrink-0 ml-4">{getStatusIcon(task.status, task.isFrugalAlternative, task.isOutsourced)}</div>
                </div>
                
                {/* Action Controls */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {isActive && (
                         <button 
                            onClick={() => onExecuteAiTask(taskIndex, '')} 
                            disabled={isAutonomous} 
                            className="btn-primary flex-grow inline-flex items-center justify-center text-xs py-1.5"
                        >
                            <Play size={12} className="mr-2"/> Execute
                        </button>
                    )}
                    
                    {isFailed && (
                        <>
                            <button onClick={() => handleTaskAction(task.id, 'retry')} className="flex items-center px-3 py-1.5 text-xs font-bold bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors">
                                <RefreshCw size={12} className="mr-1"/> Retry Protocol
                            </button>
                            <button onClick={() => handleTaskAction(task.id, 'bypass')} className="flex items-center px-3 py-1.5 text-xs font-bold bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                                <FastForward size={12} className="mr-1"/> Force Complete
                            </button>
                        </>
                    )}

                    {isStuck && (
                         <button onClick={() => handleTaskAction(task.id, 'reset')} className="flex items-center px-3 py-1.5 text-xs font-bold bg-red-900/50 hover:bg-red-800/50 border border-red-500 text-red-300 rounded-md transition-colors">
                            <RotateCcw size={12} className="mr-1"/> Halt & Reset
                        </button>
                    )}
                </div>

                {task.status === 'awaiting_review' && (
                    <div className="mt-4 border-t border-border-primary pt-4">
                       <h5 className="text-sm font-semibold text-accent-yellow mb-2">Review AI Output</h5>
                       <textarea
                            value={editedOutputs[taskIndex] ?? task.output}
                            onChange={(e) => setEditedOutputs(prev => ({...prev, [taskIndex]: e.target.value}))}
                            className="w-full h-32 bg-bg-primary border border-border-primary rounded-md p-2 text-text-primary text-sm font-mono"
                        />
                        <div className="flex items-center justify-end space-x-2 mt-2">
                             <button onClick={() => onEscalateAiTask(taskIndex)} className="flex items-center px-3 py-1.5 text-xs font-semibold bg-red-600/20 border border-red-600/30 hover:bg-red-600/30 text-red-300 rounded-md"><ShieldAlert size={14} className="mr-2"/>Escalate</button>
                            <button onClick={() => onApproveAiTask(taskIndex, editedOutputs[taskIndex], (editedOutputs[taskIndex] !== task.output))} className="flex items-center px-3 py-1.5 text-xs font-semibold bg-green-600/20 border border-green-600/30 hover:bg-green-600/30 text-green-300 rounded-md"><ThumbsUp size={14} className="mr-2"/>Approve</button>
                        </div>
                    </div>
                )}
            </div>
            {/* Recursively render children ONLY if not in priority view (flattened view) */}
            {!isPriorityView && task.children && task.children.length > 0 && (
                <div className="pl-6 border-l-2 border-dashed border-gray-700 ml-[-20px]">
                    {task.children.map(child => renderAiTaskNode(child, true))}
                </div>
            )}
        </div>
    );
  };
  
  const renderUserTaskCard = (task: UserTask, index: number, isPriorityView = false) => {
    const isActive = task.status === 'active';
    const isDaimyoAlert = task.text.startsWith("DAIMYO'S ALERT:");
    const isEscalated = !!task.escalatedFrom;

    let borderClass = '';
    if (isPriorityView) {
        if (isEscalated || isDaimyoAlert) borderClass = 'border-l-4 border-red-500 bg-red-900/20 animate-pulse';
        else if (isActive) borderClass = 'border-l-4 border-green-500 bg-green-900/20';
    } else {
        borderClass = isActive ? 'timeline-item-active' : '';
        if (isDaimyoAlert) borderClass += ' border-red-500/50 bg-red-900/20';
    }

    return (
        <div key={`user-${index}`} className={`timeline-item ${borderClass}`}>
            <div className={`timeline-icon-container ${isDaimyoAlert || isEscalated ? 'border-red-500' : ''}`}>
                 {isDaimyoAlert || isEscalated ? <ShieldAlert size={18} className="text-red-400" /> : <User size={18} className={isActive ? "text-accent-primary" : "text-text-secondary"}/>}
            </div>
            <div className={`timeline-content w-full`}>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center mb-1">
                             {isPriorityView && (
                                 <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mr-2 ${isEscalated ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                     {isEscalated ? 'ESCALATED' : 'MANDATE'}
                                 </span>
                             )}
                             <p className={`font-semibold ${task.status === 'completed' ? 'text-text-secondary line-through' : (isDaimyoAlert ? 'text-red-300' : 'text-text-primary')}`}>{task.text}</p>
                        </div>
                        {task.statusDetail && <p className="text-xs mt-1 text-yellow-300">{task.statusDetail}</p>}
                        <div className="text-xs font-medium text-text-secondary mt-1">Estimated Time: {task.estimatedTime} hr(s)</div>
                    </div>
                    <div className="flex-shrink-0 ml-4">{getStatusIcon(task.status)}</div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Legal & Compliance Roadmap</h3>
        <p className="text-sm text-text-secondary mb-4">{plan.legalComplianceRoadmap}</p>
      </div>
      <div>
        {priorityQueue.length > 0 && (
             <div className="mb-8 border-b border-gray-700 pb-6">
                 <h4 className="font-bold text-white flex items-center mb-4">
                     <ListOrdered size={20} className="mr-2 text-yellow-400"/> 
                     Priority Action Queue 
                     <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{priorityQueue.length} Items</span>
                 </h4>
                 <div className="space-y-3">
                     {priorityQueue.map(item => renderPriorityItem(item))}
                 </div>
             </div>
        )}

        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center"><Layers size={20} className="mr-2"/>Full Execution Blueprint</h3>
        </div>
        <div className="timeline-container">
            <div className="timeline-line"></div>
            <div className="space-y-2">
                <div className="flex items-center justify-between mb-2 pr-2">
                    <h4 className="font-bold text-accent-cyan pl-10">AI Tasks Tree</h4>
                    <button 
                        onClick={handleAddViralTask}
                        className="flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/30 rounded transition-colors"
                    >
                        <Sparkles size={12} className="mr-1.5"/>
                        Add Viral Scan
                    </button>
                </div>
                {taskTree.map((taskNode) => renderAiTaskNode(taskNode))}
                
                <h4 className="font-bold text-accent-green pl-10 pt-6">User Tasks Queue</h4>
                {plan.userTasks.map((task, index) => renderUserTaskCard(task, index))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;
