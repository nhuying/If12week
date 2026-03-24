import { useState } from 'react';
import { WeeklyFeelings, WeeklyMetrics } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WeeklyAssessment({ weeklyFeelings, updateWeeklyFeelings, weeklyMetrics, updateWeeklyMetrics }: any) {
  const [currentWeek, setCurrentWeek] = useState(1);
  const weekData = (weeklyFeelings || {})[currentWeek] || (weeklyFeelings as any)?.[currentWeek.toString()] || {};
  const metricsData = (weeklyMetrics || {})[currentWeek] || (weeklyMetrics as any)?.[currentWeek.toString()] || { weight: '', waist: '', fastingSugar: '' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="bg-orange-400 px-6 py-4 flex items-center justify-between text-white">
        <h2 className="text-xl font-bold">ประเมินรายสัปดาห์ที่ {currentWeek}</h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentWeek(w => Math.max(1, w - 1))} className="p-2 bg-white/20 rounded-full"><ChevronLeft /></button>
          <button onClick={() => setCurrentWeek(w => w + 1)} className="p-2 bg-white/20 rounded-full"><ChevronRight /></button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-xs mb-1">น้ำหนัก (กก.)</label><input type="number" value={metricsData.weight} onChange={(e) => updateWeeklyMetrics(currentWeek, 'weight', e.target.value)} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-xs mb-1">รอบเอว (นิ้ว)</label><input type="number" value={metricsData.waist} onChange={(e) => updateWeeklyMetrics(currentWeek, 'waist', e.target.value)} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-xs mb-1">น้ำตาล (mg/dL)</label><input type="number" value={metricsData.fastingSugar} onChange={(e) => updateWeeklyMetrics(currentWeek, 'fastingSugar', e.target.value)} className="w-full p-2 border rounded" /></div>
        </div>
      </div>
    </div>
  );
}