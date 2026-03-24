import { useState } from 'react';
import { WeeklyFeelings, WeeklyMetrics } from '../types';
import { ChevronLeft, ChevronRight, Scale, Activity, Ruler } from 'lucide-react';

interface WeeklyAssessmentProps {
  weeklyFeelings: WeeklyFeelings;
  updateWeeklyFeelings: (week: number, field: string, value: number) => void;
  weeklyMetrics: WeeklyMetrics;
  updateWeeklyMetrics: (week: number, field: string, value: string) => void;
}

const METRICS = [
  { id: 'morningPain', label: '1. อาการเจ็บปวดและปวดตึง ยามเช้า' },
  { id: 'morningEnergy', label: '2. เรี่ยวแรง ยามเช้า' },
  { id: 'mentalClarity', label: '3. ความชัดเจนทางความคิดจิตใจระหว่างวัน' },
  { id: 'energyAfterActivity', label: '4. เรี่ยวแรงหลังการทำกิจกรรมทางกาย' },
  { id: 'achesAndPains', label: '5. อาการปวดเมื่อยต่างๆ ปวดหัว หลัง ข้อ และอื่นๆ' },
  { id: 'mood', label: '6. อารมณ์' },
  { id: 'hunger', label: '7. ความหิว' },
  { id: 'gutHealth', label: '8. สุขภาพลำไส้' },
  { id: 'sleepinessAtBedtime', label: '9. ความง่วงเมื่อถึงเวลาเข้านอน' },
  { id: 'sleepQuality', label: '10. การนอน' },
];

export default function WeeklyAssessment({ weeklyFeelings, updateWeeklyFeelings, weeklyMetrics, updateWeeklyMetrics }: WeeklyAssessmentProps) {
  const [currentWeek, setCurrentWeek] = useState(1);
  const weekData = weeklyFeelings[currentWeek] || (weeklyFeelings as any)?.[currentWeek.toString()] || {};
  const metricsData = weeklyMetrics[currentWeek] || (weeklyMetrics as any)?.[currentWeek.toString()] || { weight: '', waist: '', fastingSugar: '' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="bg-orange-400 px-6 py-4 flex items-center justify-between text-white">
        <h2 className="text-xl font-bold">ประเมินความรู้สึกสัปดาห์ที่ {currentWeek}</h2>
        <div className="flex items-center gap-4 bg-white/20 px-4 py-2 rounded-full">
          <button onClick={() => setCurrentWeek(w => Math.max(1, w - 1))} disabled={currentWeek === 1} className="p-1 disabled:opacity-50"><ChevronLeft /></button>
          <span className="font-semibold min-w-[80px] text-center">สัปดาห์ที่ {currentWeek}</span>
          <button onClick={() => setCurrentWeek(w => w + 1)} className="p-1"><ChevronRight /></button>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-8 p-6 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2"><Scale className="w-4 h-4 text-emerald-600" /> น้ำหนัก (กก.)</label><input type="number" step="0.1" value={metricsData.weight || ''} onChange={(e) => updateWeeklyMetrics(currentWeek, 'weight', e.target.value)} className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg outline-none" placeholder="0.0" /></div>
          <div><label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2"><Ruler className="w-4 h-4 text-emerald-600" /> รอบเอว (นิ้ว)</label><input type="number" step="0.1" value={metricsData.waist || ''} onChange={(e) => updateWeeklyMetrics(currentWeek, 'waist', e.target.value)} className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg outline-none" placeholder="0.0" /></div>
          <div><label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2"><Activity className="w-4 h-4 text-emerald-600" /> น้ำตาล (mg/dL)</label><input type="number" value={metricsData.fastingSugar || ''} onChange={(e) => updateWeeklyMetrics(currentWeek, 'fastingSugar', e.target.value)} className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg outline-none" placeholder="0" /></div>
        </div>
        <div className="space-y-6">
          {METRICS.map((metric) => {
            const value = weekData[metric.id as keyof typeof weekData] || 0;
            return (
              <div key={metric.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                <div className="md:w-1/2"><label className="text-stone-800 font-medium">{metric.label}</label></div>
                <div className="md:w-1/2 flex items-center gap-4">
                  <input type="range" min="1" max="10" value={value || 5} onChange={(e) => updateWeeklyFeelings(currentWeek, metric.id, parseInt(e.target.value, 10))} className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                  <div className="w-12 h-10 flex items-center justify-center bg-stone-100 rounded-lg border border-stone-200 font-bold text-orange-600">{value || '-'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
