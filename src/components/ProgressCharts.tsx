import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, BarChart, Bar } from 'recharts';
import { PersonalData, WeeklyMetrics, DailyHabits } from '../types';

interface ProgressChartsProps {
  personalData: PersonalData;
  weeklyMetrics: WeeklyMetrics;
  dailyHabits: DailyHabits;
}

export default function ProgressCharts({ personalData, weeklyMetrics, dailyHabits }: ProgressChartsProps) {
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= 12; i++) {
      const metrics = weeklyMetrics[i] || (weeklyMetrics as any)[i.toString()] || { weight: '', waist: '', fastingSugar: '' };
      const weekHabits = dailyHabits[i] || (dailyHabits as any)[i.toString()] || {};
      let totalSteps = 0;
      let daysWithSteps = 0;
      for (let day = 0; day < 7; day++) {
        const dayData = weekHabits[day] || (weekHabits as any)[day.toString()];
        if (dayData) {
          const steps = parseInt(dayData.stepsCount) || 0;
          if (steps > 0) { totalSteps += steps; daysWithSteps++; }
        }
      }
      data.push({
        name: `W${i}`,
        weight: metrics.weight ? parseFloat(metrics.weight) : null,
        waist: metrics.waist ? parseFloat(metrics.waist) : null,
        sugar: metrics.fastingSugar ? parseFloat(metrics.fastingSugar) : null,
        avgSteps: daysWithSteps > 0 ? Math.round(totalSteps / 7) : null,
      });
    }
    return data;
  }, [weeklyMetrics, dailyHabits]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-4">กราฟติดตามน้ำหนัก (กก.)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={['auto', 'auto']} /><Tooltip /><Legend /><Line type="monotone" dataKey="weight" name="น้ำหนัก" stroke="#f97316" strokeWidth={3} connectNulls /></LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-4">กราฟติดตามการเดิน (เฉลี่ยก้าว/วัน)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="avgSteps" name="ก้าวเดินเฉลี่ย" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
