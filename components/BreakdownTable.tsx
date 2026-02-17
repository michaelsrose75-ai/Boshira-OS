
import React, { useState } from 'react';
import type { BreakdownStep } from '../types';
import { ChevronDown } from 'lucide-react';

interface BreakdownTableProps {
  data: BreakdownStep[];
}

const BreakdownTable: React.FC<BreakdownTableProps> = ({ data }) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleRowClick = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700 bg-gray-800">
        <thead className="bg-gray-700/50">
          <tr>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-300 w-12"></th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-300">Phase</th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-300">Task</th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-300">Cost</th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-300">Time</th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((item, index) => (
            <React.Fragment key={item.step}>
              <tr 
                className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => handleRowClick(index)}
              >
                <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-400">
                   <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${expandedRow === index ? 'rotate-180' : ''}`}
                    />
                </td>
                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-white">{item.step}</td>
                <td className="py-4 px-4 text-sm text-gray-300 max-w-xs break-words">{item.task}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-red-400">${item.cost.toLocaleString()}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">{item.time}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-green-400">${item.revenue.toLocaleString()}</td>
              </tr>
              {expandedRow === index && (
                <tr className="bg-gray-900/50">
                  <td colSpan={6} className="py-3 px-6">
                    <div className="p-2 bg-gray-800/50 rounded-md">
                      <h4 className="font-semibold text-gray-300 text-xs uppercase tracking-wider mb-2">Cost Breakdown</h4>
                      {item.costDetails && item.costDetails.length > 0 ? (
                        <ul className="space-y-1">
                          {item.costDetails.map((detail, i) => (
                            <li key={i} className="flex justify-between text-sm text-gray-400">
                              <span>- {detail.item}</span>
                              <span className="font-mono text-red-400/80">${detail.cost.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No detailed costs provided.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BreakdownTable;