import { useState } from 'react';
import { DailyHabits, PersonalData } from '../types';
import { ChevronLeft, ChevronRight, Check, Target } from 'lucide-react';

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

  const handlePrevWeek = () => setCurrentWeek((prev) => Math.max(1, prev - 1));
  const handleNextWeek = () => setCurrentWeek((prev) => prev + 1);

  const weekData = dailyHabits[currentWeek] || {};

  const calculateDailyTotal = (day: number) => {
    const dayData = weekData[day];
    if (!dayData) return 0;
    // Only count boolean habits for the score
    return HABITS.filter(h => dayData[h.id as keyof typeof dayData] === true).length;
  };

  const calculateWeeklyTotal = () => {
    let total = 0;
    for (let i = 0; i < 7; i++) {
      total += calculateDailyTotal(i);
    }
    return total;
  };

  const targetSteps = parseInt(personalData.goal3Steps) || 0;
  const targetStretching = parseInt(personalData.goal3StretchingTime) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-amber-400 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">ตารางความคืบหน้าสำหรับชาเลนจ์ 12 สัปดาห์</h2>
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-stone-600 uppercase bg-stone-50 border-b border-stone-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold w-1/2">
                พฤติกรรม
              </th>
              {DAYS.map((day, idx) => (
                <th key={idx} scope="col" className="px-2 py-4 text-center font-semibold w-12">
                  {day}
                </th>
              ))}
              <th scope="col" className="px-4 py-4 text-center font-bold bg-stone-100 w-16">
                รวม
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {HABITS.map((habit) => (
              <tr key={habit.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-stone-800">
                  {habit.label}
                </td>
                {DAYS.map((_, dayIdx) => {
                  const isChecked = weekData[dayIdx]?.[habit.id as keyof typeof weekData[0]] === true;
                  return (
                    <td key={dayIdx} className="px-2 py-4 text-center">
                      <button
                        onClick={() => updateDailyHabits(currentWeek, dayIdx, habit.id, !isChecked)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${
                          isChecked
                            ? 'bg-emerald-500 text-white shadow-sm scale-110'
                            : 'bg-stone-100 text-transparent hover:bg-stone-200 border border-stone-200'
                        }`}
                      >
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </button>
                    </td>
                  );
                })}
                <td className="px-4 py-4 text-center font-semibold text-stone-600 bg-stone-50">
                  {DAYS.reduce((sum, _, dayIdx) => {
                    return sum + (weekData[dayIdx]?.[habit.id as keyof typeof weekData[0]] === true ? 1 : 0);
                  }, 0)}
                </td>
              </tr>
            ))}

            {/* Goal 3 Tracking Rows */}
            <tr className="bg-emerald-50/30">
              <td className="px-6 py-4 font-medium text-stone-800">
                <div className="flex items-center gap-2">
                  <span>7. จำนวนก้าวเดิน (ก้าว)</span>
                  <div className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    <Target className="w-3 h-3" />
                    เป้าหมาย: {personalData.goal3Steps}
                  </div>
                </div>
              </td>
              {DAYS.map((_, dayIdx) => {
                const value = (weekData[dayIdx]?.stepsCount as string) || '';
                const isMet = parseInt(value) >= targetSteps && targetSteps > 0;
                return (
                  <td key={dayIdx} className="px-2 py-4 text-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={value}
                      onChange={(e) => updateDailyHabits(currentWeek, dayIdx, 'stepsCount', e.target.value)}
                      className={`w-12 px-1 py-1 text-xs text-center border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isMet ? 'bg-emerald-100 border-emerald-300 text-emerald-700 font-bold' : 'bg-white border-stone-200'
                      }`}
                      placeholder="0"
                    />
                  </td>
                );
              })}
              <td className="px-4 py-4 text-center font-semibold text-stone-600 bg-stone-50">
                -
              </td>
            </tr>

            <tr className="bg-emerald-50/30">
              <td className="px-6 py-4 font-medium text-stone-800">
                <div className="flex items-center gap-2">
                  <span>8. เวลาฝึกยืดเส้นฯ (นาที)</span>
                  <div className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    <Target className="w-3 h-3" />
                    เป้าหมาย: {personalData.goal3StretchingTime}
                  </div>
                </div>
              </td>
              {DAYS.map((_, dayIdx) => {
                const value = (weekData[dayIdx]?.stretchingTime as string) || '';
                const isMet = parseInt(value) >= targetStretching && targetStretching > 0;
                return (
                  <td key={dayIdx} className="px-2 py-4 text-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={value}
                      onChange={(e) => updateDailyHabits(currentWeek, dayIdx, 'stretchingTime', e.target.value)}
                      className={`w-12 px-1 py-1 text-xs text-center border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isMet ? 'bg-emerald-100 border-emerald-300 text-emerald-700 font-bold' : 'bg-white border-stone-200'
                      }`}
                      placeholder="0"
                    />
                  </td>
                );
              })}
              <td className="px-4 py-4 text-center font-semibold text-stone-600 bg-stone-50">
                {DAYS.reduce((sum, _, dayIdx) => {
                  const val = parseInt((weekData[dayIdx]?.stretchingTime as string) || '0');
                  return sum + (val >= targetStretching && targetStretching > 0 ? 1 : 0);
                }, 0)}
              </td>
            </tr>

            <tr className="bg-stone-100 font-bold border-t-2 border-stone-300">
              <td className="px-6 py-4 text-right text-stone-800">
                คะแนนรวมประจำวัน (เต็ม 6 คะแนน)
              </td>
              {DAYS.map((_, dayIdx) => (
                <td key={dayIdx} className="px-2 py-4 text-center text-emerald-700 text-lg">
                  {calculateDailyTotal(dayIdx)}
                </td>
              ))}
              <td className="px-4 py-4 text-center text-emerald-700 text-xl bg-stone-200">
                {calculateWeeklyTotal()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
