import React from 'react';
import { BrainCircuit, Share2, Workflow, ChevronRight } from 'lucide-react';
import type { SharedKnowledgeGraph, HiveMindQuery } from '../types';

interface HiveMindDashboardProps {
    knowledgeGraph: SharedKnowledgeGraph;
    queries: HiveMindQuery[];
}

const HiveMindDashboard: React.FC<HiveMindDashboardProps> = ({ knowledgeGraph, queries }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white">Hive Mind Protocol</h4>
            </div>
            <p className="text-sm text-gray-400 mb-6">
                The collective consciousness of your agent fleet. When one agent learns, the entire Hive knows. Agents collaborate and delegate tasks to the most qualified specialist.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
                    <h5 className="font-semibold text-white mb-3 flex items-center"><Share2 size={16} className="mr-2 text-indigo-400"/>Shared Knowledge Graph</h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {Object.keys(knowledgeGraph).length > 0 ? Object.keys(knowledgeGraph).map((key) => {
                             const value = knowledgeGraph[key];
                             return (
                                 <details key={key} className="text-xs p-2 bg-gray-800/50 rounded group border border-gray-700">
                                    <summary className="font-bold text-indigo-300 truncate cursor-pointer list-none flex items-center group-open:text-white">
                                        <ChevronRight size={14} className="mr-2 transition-transform group-open:rotate-90 flex-shrink-0" />
                                        {key}
                                    </summary>
                                    <div className="pt-2 pl-6">
                                        <p className="text-gray-300 whitespace-normal">{value.definition}</p>
                                        {value.connections && value.connections.length > 0 && (
                                            <p className="text-gray-400 mt-1">Connections: {value.connections.join(', ')}</p>
                                        )}
                                    </div>
                                </details>
                             );
                        }) : <p className="text-center text-sm text-gray-500 py-8">Knowledge graph is empty.</p>}
                    </div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600">
                    <h5 className="font-semibold text-white mb-3 flex items-center"><Workflow size={16} className="mr-2 text-cyan-400"/>Active Task Queries</h5>
                     <div className="space-y-2 max-h-60 overflow-y-auto">
                         {queries.filter(q => q.status === 'open' || q.status === 'assigned').length > 0 ? queries.map(query => (
                             <div key={query.id} className="text-xs p-2 bg-gray-800/50 rounded">
                                <p className="font-bold text-white truncate">{query.queryText}</p>
                                <p className="text-gray-400">From: {query.requestingAgent} | Status: <span className="font-semibold text-cyan-300">{query.status}</span></p>
                            </div>
                         )) : <p className="text-center text-sm text-gray-500 py-8">No active queries.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HiveMindDashboard;