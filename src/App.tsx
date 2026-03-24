import { useState, useEffect } from 'react';
import { Activity, User, Calendar, CheckSquare, LineChart, MessageSquare } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { 
  AppState, 
  PersonalData, 
  CheckupData, 
  ReminderSettings 
} from './types';

import Profile from './components/Profile';
import DailyTracker from './components/DailyTracker';
import WeeklyAssessment from './components/WeeklyAssessment';
import ProgressCharts from './components/ProgressCharts';
import Feedback from './components/Feedback';

const initialPersonalData: PersonalData = {
  height: '', startWeight: '', targetWeight: '', startWaist: '', targetWaist: '',
  currentFastingSugar: '', targetFastingSugar: '',
  goal1Start: '7.5', goal1Target: '7.0',
  goal2Start: '2', goal2Target: '1',
  goal3Steps: '6000', goal3StretchingTime: '15', goal3StretchingFrequency: '3',
};

const initialCheckupData: CheckupData = {
  currentHbA1c: '', currentBP: '', currentTriglycerides: '', 
  currentHDL: '', currentLDL: '',
};

const initialReminderSettings: ReminderSettings = {
  dailyEnabled: false,
  dailyTime: '20:00',
  weeklyEnabled: false,
  weeklyDay: 6, // Sunday
  weeklyTime: '10:00',
};

const initialAppState: AppState = {
  personalData: initialPersonalData,
  checkupData: initialCheckupData,
  dailyHabits: {},
  weeklyFeelings: {},
  weeklyMetrics: {},
  reminderSettings: initialReminderSettings,
  lastDailyNotification: '',   // ← เพิ่มเพื่อให้ type ครบ
  lastWeeklyNotification: '',  // ← เพิ่มเพื่อให้ type ครบ
};

export default function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('if-tracker-state', initialAppState);

  // Migration สำหรับ state เก่า
  useEffect(() => {
    if (!appState.reminderSettings) {
      setAppState(prev => ({
        ...prev,
        reminderSettings: initialReminderSettings,
      }));
    }
  }, [appState.reminderSettings, setAppState]);

  const [activeTab, setActiveTab] = useState<'profile' | 'daily' | 'weekly' | 'charts' | 'feedback'>('profile');

  // Update functions
  const updatePersonalData = (data: Partial<PersonalData>) => {
    setAppState(prev => ({ ...prev, personalData: { ...prev.personalData, ...data } }));
  };

  const updateCheckupData = (data: Partial<CheckupData>) => {
    setAppState(prev => ({ ...prev, checkupData: { ...prev.checkupData, ...data } }));
  };

  const updateReminderSettings = (data: Partial<ReminderSettings>) => {
    setAppState(prev => ({ ...prev, reminderSettings: { ...prev.reminderSettings, ...data } }));
  };

  // Notification System
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const checkNotifications = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Daily Notification
      if (appState.reminderSettings.dailyEnabled &&
          currentHourMin >= appState.reminderSettings.dailyTime &&
          appState.lastDailyNotification !== todayStr) {
        
        new Notification('ได้เวลาบันทึกพฤติกรรมแล้ว!', {
          body: 'อย่าลืมบันทึกจำนวนก้าวเดินและการยืดเส้นฯ ของวันนี้ด้วยนะครับ',
          icon: 'mask-icon.svg'
        });
        setAppState(prev => ({ ...prev, lastDailyNotification: todayStr }));
      }

      // Weekly Notification
      const currentDay = now.getDay();
      const adjustedDay = (currentDay + 6) % 7; // ทำให้ 0 = Monday, 6 = Sunday

      if (appState.reminderSettings.weeklyEnabled &&
          adjustedDay === appState.reminderSettings.weeklyDay &&
          currentHourMin >= appState.reminderSettings.weeklyTime &&
          appState.lastWeeklyNotification !== todayStr) {
        
        new Notification('สรุปผลรายสัปดาห์!', {
          body: 'ได้เวลาประเมินความรู้สึกและตัวชี้วัดสุขภาพประจำสัปดาห์แล้วครับ',
          icon: 'mask-icon.svg'
        });
        setAppState(prev => ({ ...prev, lastWeeklyNotification: todayStr }));
      }
    };

    const interval = setInterval(checkNotifications, 60000);
    checkNotifications(); // ตรวจครั้งแรก

    return () => clearInterval(interval);
  }, [appState.reminderSettings, appState.lastDailyNotification, appState.lastWeeklyNotification, setAppState]);

  // Update functions อื่น ๆ (เวอร์ชันใหม่ที่สะอาดกว่า)
  const updateDailyHabits = (week: number, day: number, field: string, value: boolean | string) => {
    setAppState((prev) => {
      const dailyHabits = prev.dailyHabits || {};
      const weekData = dailyHabits[week] || {};
      const dayData = weekData[day] || {
        sleep7h: false, wait1hBeforeCalories: false, eatWithin12h: false,
        outdoors30m: false, exercise30m: false, stopEatingDimLights2h: false,
        stepsCount: '', stretchingTime: '',
      };

      return {
        ...prev,
        dailyHabits: {
          ...dailyHabits,
          [week]: {
            ...weekData,
            [day]: { ...dayData, [field]: value },
          },
        },
      };
    });
  };

  const updateWeeklyFeelings = (week: number, field: string, value: number) => {
    setAppState((prev) => {
      const weeklyFeelings = prev.weeklyFeelings || {};
      const weekData = weeklyFeelings[week] || {};
      return {
        ...prev,
        weeklyFeelings: {
          ...weeklyFeelings,
          [week]: { ...weekData, [field]: value },
        },
      };
    });
  };

  const updateWeeklyMetrics = (week: number, field: string, value: string) => {
    setAppState((prev) => {
      const weeklyMetrics = prev.weeklyMetrics || {};
      const weekData = weeklyMetrics[week] || { weight: '', waist: '', fastingSugar: '' };
      return {
        ...prev,
        weeklyMetrics: {
          ...weeklyMetrics,
          [week]: { ...weekData, [field]: value },
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* ลบ banner นี้เมื่อขึ้น production จริงแล้ว */}
      <div className="bg-red-600 text-white text-center py-1 text-[10px] font-bold uppercase tracking-widest">
        --- New Version 1.2.1 ---
      </div>

      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-600" />
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold tracking-tight text-stone-800 leading-none">
                  IF 12-Week Tracker
                </h1>
                <span className="text-[10px] text-stone-400 font-medium">Version 1.2.1 (Final)</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('ระบบจะล้างแคชและรีโหลดเพื่ออัปเดต คุณต้องการดำเนินการต่อหรือไม่?')) {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(regs => {
                      regs.forEach(reg => reg.unregister());
                    });
                  }
                  window.location.reload();
                }
              }}
              className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded border border-red-200 font-bold transition-colors"
            >
              Force Update (ล้างแคช)
            </button>
          </div>

          <nav className="flex space-x-8 overflow-x-auto">
            {/* Tabs ทั้ง 5 ตัว (เหมือนโค้ดใหม่) */}
            {/* ... (code tab เหมือนเดิม แต่เพิ่ม Feedback tab) ... */}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <Profile /* props เหมือนเดิม */ />}
        {activeTab === 'daily' && <DailyTracker /* props */ />}
        {activeTab === 'weekly' && <WeeklyAssessment /* props */ />}
        {activeTab === 'charts' && <ProgressCharts /* props */ />}
        {activeTab === 'feedback' && <Feedback />}
      </main>
    </div>
  );
}
