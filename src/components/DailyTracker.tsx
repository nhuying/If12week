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
  const weekData = dailyHabits[currentWeek] || (dailyHabits as any)[currentWeek.toString()] || {};

  const getDayData = (dayIdx: number) => weekData[dayIdx] || (weekData as any)[dayIdx.toString()];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="bg-amber-400 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">ตารางความคืบหน้าสัปดาห์ที่ {currentWeek}</h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentWeek(w => Math.max(1, w - 1))} className="p-2 bg-white/20 rounded-full"><ChevronLeft /></button>
          <button onClick={() => setCurrentWeek(w => w + 1)} className="p-2 bg-white/20 rounded-full"><ChevronRight /></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">พฤติกรรม</th>
              {DAYS.map(d => <th key={d} className="px-2 py-4 text-center">{d}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y">
            {HABITS.map(habit => (
              <tr key={habit.id}>
                <td className="px-6 py-4 font-medium">{habit.label}</td>
                {DAYS.map((_, dayIdx) => {
                  const dayData = getDayData(dayIdx);
                  const isChecked = dayData?.[habit.id] === true;
                  return (
                    <td key={dayIdx} className="px-2 py-4 text-center">
                      <button 
                        onClick={() => updateDailyHabits(currentWeek, dayIdx, habit.id, !isChecked)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto border cursor-pointer ${isChecked ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-stone-100 border-stone-200'}`}
                      >
                        <Check className={`w-5 h-5 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}