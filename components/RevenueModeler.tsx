
import React, { useMemo } from 'react';
import type { RevenueStream } from '../types';
import { Plus, Trash2, DollarSign } from 'lucide-react';

interface RevenueModelerProps {
  streams: RevenueStream[];
  onStreamsChange: (streams: RevenueStream[]) => void;
}

const RevenueModeler: React.FC<RevenueModelerProps> = ({ streams, onStreamsChange }) => {
  const totalRevenue = useMemo(() => streams.reduce((acc, s) => acc + (s.amount || 0), 0), [streams]);

  const handleUpdateStream = (index: number, field: 'name' | 'amount', value: string | number) => {
    let newStreams = [...streams];
    const updatedStream = { ...newStreams[index] };

    if (field === 'name') {
      updatedStream.name = value as string;
    } else {
      updatedStream.amount = Number(value) >= 0 ? Number(value) : 0;
    }
    newStreams[index] = updatedStream;
    
    // Recalculate percentages for all streams
    const newTotalRevenue = newStreams.reduce((acc, s) => acc + (s.amount || 0), 0);
    if (newTotalRevenue > 0) {
      newStreams = newStreams.map(s => ({
        ...s,
        percentage: ((s.amount || 0) / newTotalRevenue) * 100,
      }));
    } else {
      newStreams = newStreams.map(s => ({ ...s, percentage: 0 }));
    }
    
    onStreamsChange(newStreams);
  };
  
  const handleAddStream = () => {
    onStreamsChange([...streams, { name: 'New Stream', percentage: 0, amount: 0 }]);
  };
  
  const handleDeleteStream = (index: number) => {
    const newStreams = streams.filter((_, i) => i !== index);
     // Recalculate percentages after deleting
     const newTotalRevenue = newStreams.reduce((acc, s) => acc + (s.amount || 0), 0);
     if (newTotalRevenue > 0) {
      const finalStreams = newStreams.map(s => ({
         ...s,
         percentage: ((s.amount || 0) / newTotalRevenue) * 100,
       }));
       onStreamsChange(finalStreams);
     } else {
      onStreamsChange(newStreams.map(s => ({ ...s, percentage: 0 })));
     }
  };

  return (
    <div className="mt-4 p-6 bg-gray-900/60 rounded-lg border border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-2">Revenue Streams</h4>
      <p className="text-sm text-gray-400 mb-4">
        Model your revenue streams. Changes will update financial projections and tax estimates.
      </p>

      <div className="space-y-3 mb-4">
        {streams.map((stream, index) => (
          <div key={index} className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center bg-gray-800/50 p-2 rounded-md">
            <input
              type="text"
              value={stream.name}
              onChange={(e) => handleUpdateStream(index, 'name', e.target.value)}
              placeholder="Stream Name (e.g., E-book Sales)"
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="relative w-32">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
              <input
                type="number"
                value={stream.amount || 0}
                onChange={(e) => handleUpdateStream(index, 'amount', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md pl-7 pr-3 py-1.5 text-white text-right focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                step="100"
              />
            </div>
            <p className="w-20 text-center font-mono text-indigo-300">
              ({(stream.percentage || 0).toFixed(1)}%)
            </p>
            <button
              onClick={() => handleDeleteStream(index)}
              className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-900/50"
              aria-label="Delete stream"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddStream}
        className="flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
      >
        <Plus size={16} className="mr-1" />
        Add Revenue Stream
      </button>
      
      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300 flex items-center">
            <DollarSign size={16} className="mr-2" />
            New Total Projected Revenue
            </span>
          <span className="font-mono font-bold text-lg text-green-400">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
      </div>
    </div>
  );
};

export default RevenueModeler;