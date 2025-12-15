import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartPoint } from '../types';

interface Props {
    data: ChartPoint[];
}

const StepResponseChart: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                    dataKey="time" 
                    type="number" 
                    tick={{fontSize: 10, fill: '#9CA3AF'}} 
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    unit="s"
                />
                <YAxis 
                    tick={{fontSize: 10, fill: '#9CA3AF'}} 
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontSize: '12px', padding: 0 }}
                    labelStyle={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="sp" 
                    stroke="#D1D5DB" 
                    strokeWidth={2} 
                    dot={false} 
                    strokeDasharray="5 5" 
                    isAnimationActive={false}
                />
                <Line 
                    type="monotone" 
                    dataKey="pv" 
                    stroke="#006D77" 
                    strokeWidth={3} 
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StepResponseChart;