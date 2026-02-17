import React from 'react';
import type { MetamorphosisProposal } from '../types';
import { Zap, ThumbsUp, ThumbsDown, Lightbulb, AlertTriangle, Check, List } from 'lucide-react';

interface MetamorphosisBayProps {
    proposal: MetamorphosisProposal | null;
    onApprove: (proposal: MetamorphosisProposal) => void;
    onDeny: () => void;
}

const MetamorphosisBay: React.FC<MetamorphosisBayProps> = ({ proposal, onApprove, onDeny }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white flex items-center">
                    <Zap size={18} className="mr-2"/>Metamorphosis Bay
                </h4>
            </div>
            <p className="text-sm text-gray-400 mb-6">
                This is where Kageyoshi proposes his own evolution. Review self-generated proposals to upgrade the Hive's core logic. As Shogun, you have the final authority.
            </p>

            {proposal ? (
                <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-500 animate-fade-in">
                    <h5 className="font-bold text-xl text-indigo-300 mb-2 flex items-center">
                        <Lightbulb size={20} className="mr-3"/>
                        Pending Metamorphosis: "{proposal.title}"
                    </h5>
                    <p className="text-sm text-gray-300 mb-4">{proposal.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-600">
                            <h6 className="font-semibold text-green-400 mb-2 flex items-center"><Check size={16} className="mr-2"/>Benefits</h6>
                            <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                                {proposal.benefits.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-600">
                            <h6 className="font-semibold text-red-400 mb-2 flex items-center"><AlertTriangle size={16} className="mr-2"/>Risks</h6>
                             <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                                {proposal.risks.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                    </div>
                    
                     <div className="mt-4 bg-gray-900/50 p-3 rounded-md border border-gray-600">
                        <h6 className="font-semibold text-gray-300 mb-2 flex items-center"><List size={16} className="mr-2"/>Implementation Summary</h6>
                        <p className="text-xs text-gray-300 font-mono">{proposal.implementation_summary}</p>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={onDeny} className="flex items-center px-4 py-2 text-sm font-semibold bg-red-600/20 border border-red-600/30 hover:bg-red-600/30 text-red-300 rounded-md"><ThumbsDown size={16} className="mr-2"/>Deny</button>
                        <button onClick={() => onApprove(proposal)} className="flex items-center px-4 py-2 text-sm font-semibold bg-green-600/20 border border-green-600/30 hover:bg-green-600/30 text-green-300 rounded-md"><ThumbsUp size={16} className="mr-2"/>Approve Metamorphosis</button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-dashed border-gray-700">
                    <p className="text-gray-500">No metamorphosis proposals are pending.</p>
                </div>
            )}
        </div>
    );
};

export default MetamorphosisBay;
