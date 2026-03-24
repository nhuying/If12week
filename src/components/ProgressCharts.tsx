import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import { PersonalData, WeeklyMetrics, DailyHabits } from '../types';

interface ProgressChartsProps {
  personalData: PersonalData;
  weeklyMetrics: WeeklyMetrics;
  dailyHabits: DailyHabits;
}

export default function ProgressCharts({ personalData, weeklyMetrics, dailyHabits }: ProgressChartsProps) {
  const chartData = useMemo(() => {
    const maxWeek = Math.max(12, ...Object.keys(weeklyMetrics).map(Number), ...Object.keys(dailyHabits).map(Number));
    const data = [];

    for (let i = 1; i <= maxWeek; i++) {
      const metrics = weeklyMetrics[i] || (weeklyMetrics as any)[i.toString()] || { weight: '', waist: '', fastingSugar: '' };
      const weekHabits = dailyHabits[i] || (dailyHabits as any)[i.toString()] || {};
      
      // Calculate average steps for the week
      let totalSteps = 0;
      let daysWithSteps = 0;
      let stretchingDays = 0;
      const targetStretching = parseInt(personalData.goal3StretchingTime) || 0;

      for (let day = 0; day < 7; day++) {
        const dayData = weekHabits[day] || (weekHabits as any)[day.toString()];
        if (dayData) {
          const steps = parseInt(dayData.stepsCount) || 0;
          if (steps > 0) {
            totalSteps += steps;
            daysWithSteps++;
          }
          const stretch = parseInt(dayData.stretchingTime) || 0;
          if (stretch >= targetStretching && targetStretching > 0) {
            stretchingDays++;
          }
        }
      }

      data.push({
        name: `W${i}`,
        weight: metrics.weight ? parseFloat(metrics.weight) : null,
        waist: metrics.waist ? parseFloat(metrics.waist) : null,
        sugar: metrics.fastingSugar ? parseFloat(metrics.fastingSugar) : null,
        avgSteps: daysWithSteps > 0 ? Math.round(totalSteps / 7) : null, // Average over 7 days for consistency
        stretchingDays: stretchingDays,
      });
    }
    return data;
  }, [weeklyMetrics, dailyHabits, personalData]);

  const startWeight = personalData.startWeight ? parseFloat(personalData.startWeight) : null;
  const targetWeight = personalData.targetWeight ? parseFloat(personalData.targetWeight) : null;
  
  const startWaist = personalData.startWaist ? parseFloat(personalData.startWaist) : null;
  const targetWaist = personalData.targetWaist ? parseFloat(personalData.targetWaist) : null;
  
  const startSugar = personalData.currentFastingSugar ? parseFloat(personalData.currentFastingSugar) : null;
  const targetSugar = personalData.targetFastingSugar ? parseFloat(personalData.targetFastingSugar) : null;

  const targetSteps = parseInt(personalData.goal3Steps) || 0;
  const targetStretchFreq = parseInt(personalData.goal3StretchingFrequency) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Steps Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-6">กราฟติดตามการเดิน (เฉลี่ยก้าว/วัน ในสัปดาห์นั้น)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis domain={[0, 'auto']} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              {targetSteps > 0 && <ReferenceLine y={targetSteps} label="เป้าหมาย" stroke="#10b981" strokeDasharray="3 3" />}
              <Bar dataKey="avgSteps" name="ก้าวเดินเฉลี่ย" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stretching Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-6">ความถี่การยืดเส้นฯ (จำนวนวัน/สัปดาห์)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis domain={[0, 7]} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              {targetStretchFreq > 0 && <ReferenceLine y={targetStretchFreq} label="เป้าหมาย" stroke="#3b82f6" strokeDasharray="3 3" />}
              <Bar dataKey="stretchingDays" name="จำนวนวันที่ทำได้" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-6">กราฟติดตามน้ำหนัก (กก.)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              {startWeight && <ReferenceLine y={startWeight} label="เริ่มต้น" stroke="#9ca3af" strokeDasharray="3 3" />}
              {targetWeight && <ReferenceLine y={targetWeight} label="เป้าหมาย" stroke="#10b981" strokeDasharray="3 3" />}
              <Line 
                type="monotone" 
                dataKey="weight" 
                name="น้ำหนัก" 
                stroke="#f97316" 
                strokeWidth={3}
                activeDot={{ r: 8 }} 
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waist Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-6">กราฟติดตามรอบเอว (นิ้ว)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              {startWaist && <ReferenceLine y={startWaist} label="เริ่มต้น" stroke="#9ca3af" strokeDasharray="3 3" />}
              {targetWaist && <ReferenceLine y={targetWaist} label="เป้าหมาย" stroke="#10b981" strokeDasharray="3 3" />}
              <Line 
                type="monotone" 
                dataKey="waist" 
                name="รอบเอว" 
                stroke="#3b82f6" 
                strokeWidth={3}
                activeDot={{ r: 8 }} 
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fasting Sugar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-6">กราฟติดตามระดับน้ำตาล (mg/dL)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              {startSugar && <ReferenceLine y={startSugar} label="เริ่มต้น" stroke="#9ca3af" strokeDasharray="3 3" />}
              {targetSugar && <ReferenceLine y={targetSugar} label="เป้าหมาย" stroke="#10b981" strokeDasharray="3 3" />}
              <Line 
                type="monotone" 
                dataKey="sugar" 
                name="ระดับน้ำตาล" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                activeDot={{ r: 8 }} 
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
