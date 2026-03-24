import { useState } from 'react';
import { DailyHabits, PersonalData } from '../types';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface DailyTrackerProps {
  dailyHabits: DailyHabits;
  updateDailyHabits: (week: number, day: number, field: string, value: boolean | string) => void;
  personalData: PersonalData;
}

const HABITS = [
  { id: 'sleep7h', label: '1. คุณนอนอย่างน้อยถึง 7 ชม. หรือไม่' },
  { id: 'wait1hBeforeCalories', label: '2. หลังจากที่ตื่นนอนคุณรอ 1 ชม. ก่อนกินหรือดื่มอะไรที่มีแคลอรี่หรือไม่' },
  { id: 'eatWithin12h', label: '3. คุณกินอาหารหรือดื่มเครื่องดื่มทั้งหมด (ยกเว้นน้ำเปล่า) ภายใน 12 ชม. หรือไม่' },
  { id: 'outdoors30m', label: '4. คุณออกไปกลางแจ้งอย่างน้อย 30 นาที ในช่วงระหว่างวันหรือไม่' },
  { id: 'exercise30m', label: '5. คุณออกกำลังกายหรือเดินเร็วอย่างน้อย 30 นาที หรือไม่' },
  { id: 'stopEatingDimLights2h', label: '6. คุณหยุดการกินและหรี่แสงไฟลงอย่างน้อย 2 ชม. ขึ้นไป ก่อนเวลาเข้านอนหรือไม่' },
];

const DAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

export default function DailyTracker({ dailyHabits, updateDailyHabits, personalData }: DailyTrackerProps) {
  const [currentWeek, setCurrentWeek] = useState(1);
  const weekData = dailyHabits[currentWeek] || (dailyHabits as any)[currentWeek.toString()] || {};

  const getDayData = (dayIdx: number) => {
    return weekData[dayIdx] || (weekData as any)[dayIdx.toString()];
  };

  const targetSteps = parseInt(personalData.goal3Steps) || 0;
  const targetStretching = parseInt(personalData.goal3StretchingTime) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="bg-amber-400 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">บันทึกพฤติกรรมสัปดาห์ที่ {currentWeek}</h2>
        <div className="flex items-center gap-4 bg-white/20 px-4 py-2 rounded-full">
          <button onClick={() => setCurrentWeek(w => Math.max(1, w - 1))} disabled={currentWeek === 1} className="p-1 disabled:opacity-50"><ChevronLeft /></button>
          <span className="font-semibold min-w-[80px] text-center">สัปดาห์ที่ {currentWeek}</span>
          <button onClick={() => setCurrentWeek(w => w + 1)} className="p-1"><ChevronRight /></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-stone-600 uppercase bg-stone-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold w-1/2">พฤติกรรม</th>
              {DAYS.map(d => <th key={d} className="px-2 py-4 text-center font-semibold w-12">{d}</th>)}
              <th className="px-4 py-4 text-center font-bold bg-stone-100 w-16">รวม</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {HABITS.map((habit) => (
              <tr key={habit.id} className="hover:bg-stone-50/50">
                <td className="px-6 py-4 font-medium text-stone-800">{habit.label}</td>
                {DAYS.map((_, dayIdx) => {
                  const dayData = getDayData(dayIdx);
                  const isChecked = dayData?.[habit.id] === true;
                  return (
                    <td key={dayIdx} className="px-2 py-4 text-center">
                      <button 
                        onClick={() => updateDailyHabits(currentWeek, dayIdx, habit.id, !isChecked)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all cursor-pointer ${isChecked ? 'bg-emerald-500 text-white shadow-sm scale-110' : 'bg-stone-100 text-transparent hover:bg-stone-200 border border-stone-200'}`}
                      >
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </button>
                    </td>
                  );
                })}
                <td className="px-4 py-4 text-center font-bold bg-stone-50 text-emerald-600">
                  {DAYS.reduce((sum, _, dayIdx) => sum + (getDayData(dayIdx)?.[habit.id] === true ? 1 : 0), 0)}
                </td>
              </tr>
            ))}
            {/* Row 7: Steps */}
            <tr className="bg-stone-50/30">
              <td className="px-6 py-4 font-medium text-stone-800">7. จำนวนก้าวเดิน (ก้าว) <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-2">เป้าหมาย: {targetSteps}</span></td>
              {DAYS.map((_, dayIdx) => (
                <td key={dayIdx} className="px-1 py-4">
                  <input type="number" value={getDayData(dayIdx)?.stepsCount || ''} onChange={(e) => updateDailyHabits(currentWeek, dayIdx, 'stepsCount', e.target.value)} className={`w-14 px-1 py-1 text-center text-xs border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${parseInt(getDayData(dayIdx)?.stepsCount || '0') >= targetSteps && targetSteps > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-stone-200'}`} placeholder="0" />
                </td>
              ))}
              <td className="px-4 py-4 text-center font-semibold text-stone-600 bg-stone-50">
                {DAYS.reduce((sum, _, dayIdx) => {
                  const val = parseInt(getDayData(dayIdx)?.stepsCount || '0');
                  return sum + (val >= targetSteps && targetSteps > 0 ? 1 : 0);
                }, 0)}
              </td>
            </tr>
            {/* Row 8: Stretching */}
            <tr className="bg-stone-50/30">
              <td className="px-6 py-4 font-medium text-stone-800">8. เวลาฝึกยืดเส้นฯ (นาที) <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-2">เป้าหมาย: {targetStretching}</span></td>
              {DAYS.map((_, dayIdx) => (
                <td key={dayIdx} className="px-1 py-4">
                  <input type="number" value={getDayData(dayIdx)?.stretchingTime || ''} onChange={(e) => updateDailyHabits(currentWeek, dayIdx, 'stretchingTime', e.target.value)} className={`w-14 px-1 py-1 text-center text-xs border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${parseInt(getDayData(dayIdx)?.stretchingTime || '0') >= targetStretching && targetStretching > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-stone-200'}`} placeholder="0" />
                </td>
              ))}
              <td className="px-4 py-4 text-center font-semibold text-stone-600 bg-stone-50">
                {DAYS.reduce((sum, _, dayIdx) => {
                  const val = parseInt(getDayData(dayIdx)?.stretchingTime || '0');
                  return sum + (val >= targetStretching && targetStretching > 0 ? 1 : 0);
                }, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
