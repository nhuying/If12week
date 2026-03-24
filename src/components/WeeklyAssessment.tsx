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

export default function WeeklyAssessment({ 
  weeklyFeelings, 
  updateWeeklyFeelings,
  weeklyMetrics,
  updateWeeklyMetrics
}: WeeklyAssessmentProps) {
  const [currentWeek, setCurrentWeek] = useState(1);

  const handlePrevWeek = () => setCurrentWeek((prev) => Math.max(1, prev - 1));
  const handleNextWeek = () => setCurrentWeek((prev) => prev + 1); // Removed Math.min(12) limit

  const weekData = (weeklyFeelings || {})[currentWeek] || (weeklyFeelings as any)?.[currentWeek.toString()] || {};
  const metricsData = (weeklyMetrics || {})[currentWeek] || (weeklyMetrics as any)?.[currentWeek.toString()] || { weight: '', waist: '', fastingSugar: '' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-orange-400 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">ฉันรู้สึกอย่างไรระหว่างการทำชาเลนจ์ 12 สัปดาห์</h2>
        <div className="flex items-center gap-4 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
          <button
            onClick={handlePrevWeek}
            disabled={currentWeek === 1}
            className="p-1 rounded-full hover:bg-white/30 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-stone-900" />
          </button>
          <span className="font-semibold text-stone-900 min-w-[80px] text-center">
            สัปดาห์ที่ {currentWeek}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-1 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-stone-900" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 border-b border-stone-200 pb-2">บันทึกสัดส่วนประจำสัปดาห์</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                <Scale className="w-4 h-4 text-emerald-600" /> น้ำหนัก (กก.)
              </label>
              <input
                type="number"
                step="0.1"
                value={metricsData.weight || ''}
                onChange={(e) => updateWeeklyMetrics(currentWeek, 'weight', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="เช่น 65.5"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                <Ruler className="w-4 h-4 text-emerald-600" /> รอบเอว (นิ้ว)
              </label>
              <input
                type="number"
                step="0.1"
                value={metricsData.waist || ''}
                onChange={(e) => updateWeeklyMetrics(currentWeek, 'waist', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="เช่น 32"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                <Activity className="w-4 h-4 text-emerald-600" /> ระดับน้ำตาล (mg/dL)
              </label>
              <input
                type="number"
                value={metricsData.fastingSugar || ''}
                onChange={(e) => updateWeeklyMetrics(currentWeek, 'fastingSugar', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="เช่น 95"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-end border-b border-stone-200 pb-4">
          <p className="text-stone-600 font-medium">ให้คะแนนความรู้สึกของคุณจาก 1 ถึง 10</p>
          <div className="flex gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span> แย่มาก (1)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300"></span> ดีมาก (10)</span>
          </div>
        </div>

        <div className="space-y-6">
          {METRICS.map((metric) => {
            const value = weekData[metric.id as keyof typeof weekData] || 0;
            return (
              <div key={metric.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                <div className="md:w-1/2">
                  <label htmlFor={metric.id} className="text-stone-800 font-medium">
                    {metric.label}
                  </label>
                </div>
                <div className="md:w-1/2 flex items-center gap-4">
                  <input
                    type="range"
                    id={metric.id}
                    min="1"
                    max="10"
                    value={value || 5} // Default to 5 if not set, but visually we might want to show it's unset. Let's use 0 for unset and handle it.
                    onChange={(e) => updateWeeklyFeelings(currentWeek, metric.id, parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="w-12 h-10 flex items-center justify-center bg-stone-100 rounded-lg border border-stone-200 font-bold text-orange-600 shadow-inner">
                    {value || '-'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
