import React, { useMemo } from 'react';
import type { Idea, ChartDataPoint } from '../types';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, DollarSign, TrendingDown } from 'lucide-react';

interface FinancialForecastingProps {
  agents: Idea[];
}

const FinancialForecasting: React.FC<FinancialForecastingProps> = ({ agents }) => {

  const { forecastData, totals } = useMemo(() => {
    if (agents.length === 0) {
      return { forecastData: [], totals: { revenue: 0, cost: 0, profit: 0 } };
    }

    const aggregatedPhases: { [key: string]: { cost: number; revenue: number } } = {
      'P1': { cost: 0, revenue: 0 },
      'P2': { cost: 0, revenue: 0 },
      'P3': { cost: 0, revenue: 0 },
      'P4': { cost: 0, revenue: 0 },
    };

    agents.forEach(agent => {
      const strategy = agent.strategies[0];
      if (strategy && strategy.breakdown) {
        strategy.breakdown.forEach((phase, index) => {
          const phaseKey = `P${index + 1}`;
          if (aggregatedPhases[phaseKey]) {
            aggregatedPhases[phaseKey].cost += phase.cost;
            aggregatedPhases[phaseKey].revenue += phase.revenue;
          }
        });
      }
    });

    let cumulativeCost = 0;
    let cumulativeRevenue = 0;
    const chartData: ChartDataPoint[] = Object.keys(aggregatedPhases).map(phaseKey => {
      cumulativeCost += aggregatedPhases[phaseKey].cost;
      cumulativeRevenue += aggregatedPhases[phaseKey].revenue;
      const profit = cumulativeRevenue - cumulativeCost;
      return {
        name: phaseKey,
        cost: cumulativeCost,
        revenue: cumulativeRevenue,
        profit: profit,
        profitAfterTax: profit * 0.78 // Assume a flat 22% tax for forecast
      };
    });
    
    const totalRevenue = cumulativeRevenue;
    const totalCost = cumulativeCost;
    const totalProfit = totalRevenue - totalCost;

    return { forecastData: chartData, totals: { revenue: totalRevenue, cost: totalCost, profit: totalProfit } };
  }, [agents]);
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2">Fleet Financial Forecast</h3>
      <p className="text-sm text-gray-400 mb-6">
        Aggregated financial projections from all active agents, showing the potential financial trajectory of your entire portfolio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
          <h4 className="text-sm font-medium text-gray-400 flex items-center"><TrendingDown size={14} className="mr-2"/>Total Projected Investment</h4>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totals.cost)}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
          <h4 className="text-sm font-medium text-gray-400 flex items-center"><TrendingUp size={14} className="mr-2"/>Total Projected Revenue</h4>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totals.revenue)}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
          <h4 className="text-sm font-medium text-gray-400 flex items-center"><DollarSign size={14} className="mr-2"/>Total Projected Profit</h4>
          <p className={`text-2xl font-bold ${totals.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(totals.profit)}</p>
        </div>
      </div>

      <div className="h-[400px] w-full bg-gray-900/50 p-4 rounded-md border border-gray-600">
        {agents.length > 0 ? (
          <ResponsiveContainer>
            <ComposedChart data={forecastData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" tickFormatter={(value) => `$${(value / 1000)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', color: '#E2E8F0' }}
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
              />
              <Legend wrapperStyle={{ color: '#E2E8F0' }} />
              <Bar dataKey="revenue" stackId="a" fill="#48BB78" name="Revenue" />
              <Bar dataKey="cost" stackId="a" fill="#F56565" name="Cost" />
              <Line type="monotone" dataKey="profit" stroke="#63B3ED" strokeWidth={2} name="Profit" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No active agents to generate a forecast.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialForecasting;
