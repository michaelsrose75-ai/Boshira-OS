
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import type { ChartDataPoint } from '../types';

interface ProfitChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenue = payload.find(p => p.dataKey === 'revenue')?.value;
    const cost = payload.find(p => p.dataKey === 'cost')?.value;
    const profit = payload.find(p => p.dataKey === 'profit')?.value;
    const profitAfterTax = payload.find(p => p.dataKey === 'profitAfterTax')?.value;

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg text-sm">
        <p className="label font-bold text-white mb-2">{`Phase: ${label}`}</p>
        {revenue !== undefined && <p className="text-green-400">{`Revenue: $${revenue.toLocaleString()}`}</p>}
        {cost !== undefined && <p className="text-red-400">{`Cost: $${cost.toLocaleString()}`}</p>}
        {profit !== undefined && <p className="text-blue-400">{`Profit (Pre-Tax): $${profit.toLocaleString()}`}</p>}
        {profitAfterTax !== undefined && <p className="text-yellow-400 font-semibold">{`Profit (After Tax): $${profitAfterTax.toLocaleString()}`}</p>}
      </div>
    );
  }
  return null;
};

const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" tickFormatter={(value) => `$${value}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
          <Legend wrapperStyle={{ color: '#E2E8F0' }} />
          <Bar dataKey="revenue" barSize={20} fill="#48BB78" name="Revenue" />
          <Bar dataKey="cost" barSize={20} fill="#F56565" name="Cost" />
          <Line type="monotone" dataKey="profit" stroke="#63B3ED" strokeWidth={2} name="Profit (Pre-Tax)" />
          <Line type="monotone" dataKey="profitAfterTax" stroke="#F6E05E" strokeWidth={2} strokeDasharray="5 5" name="Profit (After Tax)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;