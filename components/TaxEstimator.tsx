import React, { useMemo } from 'react';
import { Percent, MinusCircle, PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Strategy } from '../types';

interface TaxEstimatorProps {
  businessProfit: number;
  taxRate: number;
  otherIncome: number;
  additionalDeductions: number;
  onFinancialsChange: (field: keyof Pick<Strategy, 'taxRate' | 'otherIncome' | 'additionalDeductions'>, value: number) => void;
}

const TaxEstimator: React.FC<TaxEstimatorProps> = ({
  businessProfit,
  taxRate,
  otherIncome,
  additionalDeductions,
  onFinancialsChange,
}) => {
  
  const { taxableIncome, estimatedTax, netProfitAfterTax } = useMemo(() => {
    const calculatedTaxableIncome = businessProfit + otherIncome - additionalDeductions;
    const tax = calculatedTaxableIncome > 0 ? calculatedTaxableIncome * (taxRate / 100) : 0;
    const net = businessProfit - tax;
    return {
      taxableIncome: calculatedTaxableIncome,
      estimatedTax: tax,
      netProfitAfterTax: net,
    };
  }, [businessProfit, otherIncome, additionalDeductions, taxRate]);

  const formatCurrency = (value: number) => {
    const colorClass = value >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <span className={colorClass}>
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    );
  };

  return (
    <div className="mt-4 p-6 bg-gray-900/60 rounded-lg border border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-4">Tax Liability Estimator</h4>
      <p className="text-sm text-gray-400 mb-6">
        Adjust these values to model your potential tax liability. Changes will be saved and will update the 'Profit (After Tax)' line in the chart above.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Controls */}
        <div className="space-y-2">
          <label htmlFor="taxRate" className="flex items-center text-sm font-medium text-gray-300">
            <Percent size={14} className="mr-2 text-indigo-400" />
            Combined Tax Rate
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="taxRate"
              min="0"
              max="50"
              value={taxRate}
              onChange={(e) => onFinancialsChange('taxRate', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="font-mono text-indigo-300 text-sm w-12 text-center">{taxRate}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="otherIncome" className="flex items-center text-sm font-medium text-gray-300">
            <PlusCircle size={14} className="mr-2 text-green-400" />
            Other Annual Income
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
            <input
              type="number"
              id="otherIncome"
              value={otherIncome}
              onChange={(e) => onFinancialsChange('otherIncome', Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded-md pl-7 pr-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 50000"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="additionalDeductions" className="flex items-center text-sm font-medium text-gray-300">
            <MinusCircle size={14} className="mr-2 text-red-400" />
            Additional Deductions
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
            <input
              type="number"
              id="additionalDeductions"
              value={additionalDeductions}
              onChange={(e) => onFinancialsChange('additionalDeductions', Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded-md pl-7 pr-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 12000"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 flex items-center">
            <TrendingUp size={14} className="mr-2" />
            Projected Profit (pre-tax)
          </span>
          <span className="font-mono font-semibold text-gray-200">
            ${businessProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Estimated Taxable Income</span>
          <span className="font-mono font-semibold text-gray-200">
            ${taxableIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 flex items-center">
            <TrendingDown size={14} className="mr-2" />
            Estimated Tax Liability
          </span>
          <span className="font-mono font-semibold text-red-400">
            ${estimatedTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <hr className="border-gray-700 my-1" />
        <div className="flex justify-between items-center text-base">
          <span className="font-bold text-white">Projected Net Profit (after-tax)</span>
          <span className="font-mono font-bold text-lg">{formatCurrency(netProfitAfterTax)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        * Disclaimer: This is a simplified estimation for informational purposes only and does not constitute financial or
        tax advice. Consult with a professional for accurate tax planning.
      </p>
    </div>
  );
};

export default TaxEstimator;