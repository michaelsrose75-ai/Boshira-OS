import React, { useMemo } from 'react';
import type { Idea, UserTask, AiTask } from '../types';
import { ListChecks, User, AlertCircle, UserCheck } from 'lucide-react';

interface PriorityCommandProps {
  agents: Idea[];
}

type PriorityItem = {
    agentTitle: string;
    text: string;
    type: 'User Task' | 'Escalated Task' | 'Awaiting Review';
    priority: number;
}

const PriorityCommand: React.FC<PriorityCommandProps> = ({ agents }) => {
    const priorityItems = useMemo(() => {
        const items: PriorityItem[] = [];
        agents.forEach(agent => {
            const plan = agent.strategies[0].actionPlan;
            
            // Priority 1: Escalated Tasks
            plan.userTasks.forEach(task => {
                if(task.escalatedFrom) {
                    items.push({ agentTitle: agent.title, text: task.text, type: 'Escalated Task', priority: 1 });
                }
            });

            // Priority 2: Tasks Awaiting Review
            plan.aiTasks.forEach(task => {
                if(task.status === 'awaiting_review') {
                    items.push({ agentTitle: agent.title, text: task.text, type: 'Awaiting Review', priority: 2 });
                }
            });
            
            // Priority 3: Active User Tasks
            plan.userTasks.forEach(task => {
                if(task.status === 'active' && !task.escalatedFrom) {
                    items.push({ agentTitle: agent.title, text: task.text, type: 'User Task', priority: 3 });
                }
            });
        });
        
        return items.sort((a,b) => a.priority - b.priority).slice(0, 5); // Show top 5
    }, [agents]);

    const getIcon = (type: PriorityItem['type']) => {
        switch(type) {
            case 'Escalated Task': return <AlertCircle className="text-red-400" size={18} />;
            case 'Awaiting Review': return <UserCheck className="text-yellow-400" size={18} />;
            case 'User Task': return <User className="text-green-400" size={18} />;
            default: return null;
        }
    }

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600 h-full">
      <h4 className="font-semibold text-white mb-4 flex items-center"><ListChecks size={18} className="mr-2"/>Priority Command</h4>
      <p className="text-sm text-gray-400 mb-4">
        A prioritized list of the most critical items that require your human intellect right now.
      </p>
       <div className="space-y-3">
        {priorityItems.length > 0 ? (
            priorityItems.map((item, index) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-indigo-400">{item.agentTitle}</p>
                        <div className="flex items-center text-xs font-medium text-gray-400">
                           {getIcon(item.type)}
                           <span className="ml-1.5">{item.type}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-200">{item.text}</p>
                </div>
            ))
        ) : (
            <div className="text-center py-10 text-gray-500">
                <p>Your command queue is clear.</p>
            </div>
        )}
       </div>
    </div>
  );
};

export default PriorityCommand;