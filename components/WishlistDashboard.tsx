import React, { useState } from 'react';
import type { WishlistItem } from '../types';
import { Trophy, PlusCircle, Trash2, Lock, Unlock, DollarSign, BarChart } from 'lucide-react';

interface WishlistDashboardProps {
  items: WishlistItem[];
  onUpdate: (items: WishlistItem[]) => void;
  weeklyProfit: number;
}

const WishlistDashboard: React.FC<WishlistDashboardProps> = ({ items, onUpdate, weeklyProfit }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName && newItemCost) {
      const newItem: WishlistItem = {
        id: new Date().toISOString(),
        name: newItemName,
        cost: Number(newItemCost),
        unlocked: weeklyProfit >= Number(newItemCost),
      };
      onUpdate([...items, newItem].sort((a, b) => a.cost - b.cost));
      setNewItemName('');
      setNewItemCost('');
    }
  };

  const handleDeleteItem = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const unlockedItems = items.filter(item => item.unlocked);
  const lockedItems = items.filter(item => !item.unlocked);

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Trophy size={22} className="mr-3 text-yellow-400" />
        Wishlist & Rewards
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Set your personal goals. The brain will automatically unlock them as your agent fleet hits the required financial milestones.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wishlist Items */}
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-lg text-green-400 mb-3 flex items-center"><Unlock size={18} className="mr-2"/>Unlocked & Affordable</h4>
                 <div className="space-y-2">
                    {unlockedItems.length > 0 ? (
                        unlockedItems.map(item => (
                            <div key={item.id} className="bg-green-900/30 p-3 rounded-md border border-green-700/50 flex justify-between items-center">
                                <span className="text-green-300 font-medium">{item.name}</span>
                                <span className="font-mono text-sm text-green-200">{formatCurrency(item.cost)}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No unlocked rewards yet. Keep going!</p>
                    )}
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-lg text-gray-300 mb-3 flex items-center"><Lock size={18} className="mr-2"/>Locked Goals</h4>
                <div className="space-y-3">
                    {lockedItems.map(item => {
                        const progress = Math.min(100, (weeklyProfit / item.cost) * 100);
                        return (
                            <div key={item.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-600">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-200 font-medium">{item.name}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-mono text-sm text-gray-400">{formatCurrency(item.cost)}</span>
                                        <button onClick={() => handleDeleteItem(item.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${progress}%`}}></div>
                                </div>
                                <p className="text-xs text-right text-indigo-400 mt-1">{progress.toFixed(0)}% Unlocked</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600 self-start">
            <h4 className="font-semibold text-white mb-4">Add a New Wishlist Goal</h4>
            <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                    <label htmlFor="item-name" className="text-sm font-medium text-gray-300">Goal / Item Name</label>
                    <input 
                        type="text" 
                        id="item-name"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g., Dream Vacation"
                        className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="item-cost" className="text-sm font-medium text-gray-300">Required Weekly Profit</label>
                     <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                        <input 
                            type="number" 
                            id="item-cost"
                            value={newItemCost}
                            onChange={(e) => setNewItemCost(e.target.value)}
                            placeholder="e.g., 4000"
                            className="w-full bg-gray-800 border border-gray-600 rounded-md pl-7 pr-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="1"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">
                    <PlusCircle size={16} className="mr-2"/>
                    Add Goal
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default WishlistDashboard;
