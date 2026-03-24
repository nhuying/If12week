import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProgressCharts({ weeklyMetrics, dailyHabits }: any) {
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= 12; i++) {
      const metrics = weeklyMetrics[i] || (weeklyMetrics as any)[i.toString()] || {};
      data.push({
        name: `W${i}`,
        weight: metrics.weight ? parseFloat(metrics.weight) : null,
        waist: metrics.waist ? parseFloat(metrics.waist) : null,
        sugar: metrics.fastingSugar ? parseFloat(metrics.fastingSugar) : null,
      });
    }
    return data;
  }, [weeklyMetrics]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 h-80">
        <h3 className="font-bold mb-4">กราฟน้ำหนัก</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={3} connectNulls /></LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}