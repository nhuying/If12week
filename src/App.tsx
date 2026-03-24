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
  lastDailyNotification: '',
  lastWeeklyNotification: '',
};

const TABS = [
  { id: 'profile' as const, label: 'โปรไฟล์', icon: User },
  { id: 'daily' as const, label: 'รายวัน', icon: CheckSquare },
  { id: 'weekly' as const, label: 'รายสัปดาห์', icon: Calendar },
  { id: 'charts' as const, label: 'กราฟ', icon: LineChart },
  { id: 'feedback' as const, label: 'Feedback', icon: MessageSquare },
];

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

  const importAppState = (state: AppState) => {
    setAppState(state);
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
      const adjustedDay = (currentDay + 6) % 7;

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
    checkNotifications();

    return () => clearInterval(interval);
  }, [appState.reminderSettings, appState.lastDailyNotification, appState.lastWeeklyNotification, setAppState]);

  // Update daily habits
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

  // Update weekly feelings (type-safe with full default)
  const updateWeeklyFeelings = (week: number, field: string, value: number) => {
    setAppState((prev) => {
      const weeklyFeelings = prev.weeklyFeelings || {};
      const weekData = weeklyFeelings[week] || {
        morningPain: 0, morningEnergy: 0, mentalClarity: 0,
        energyAfterActivity: 0, achesAndPains: 0, mood: 0,
        hunger: 0, gutHealth: 0, sleepinessAtBedtime: 0, sleepQuality: 0,
      };
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
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-600" />
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold tracking-tight text-stone-800 leading-none">
                  IF 12-Week Tracker
                </h1>
                <span className="text-[10px] text-stone-400 font-medium">Version 1.2.2</span>
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
              Force Update
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 overflow-x-auto pb-0 -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && (
          <Profile
            personalData={appState.personalData}
            checkupData={appState.checkupData}
            reminderSettings={appState.reminderSettings}
            updatePersonalData={updatePersonalData}
            updateCheckupData={updateCheckupData}
            updateReminderSettings={updateReminderSettings}
            appState={appState}
            importAppState={importAppState}
          />
        )}
        {activeTab === 'daily' && (
          <DailyTracker
            dailyHabits={appState.dailyHabits}
            updateDailyHabits={updateDailyHabits}
            personalData={appState.personalData}
          />
        )}
        {activeTab === 'weekly' && (
          <WeeklyAssessment
            weeklyFeelings={appState.weeklyFeelings}
            updateWeeklyFeelings={updateWeeklyFeelings}
            weeklyMetrics={appState.weeklyMetrics}
            updateWeeklyMetrics={updateWeeklyMetrics}
          />
        )}
        {activeTab === 'charts' && (
          <ProgressCharts
            personalData={appState.personalData}
            weeklyMetrics={appState.weeklyMetrics}
            dailyHabits={appState.dailyHabits}
          />
        )}
        {activeTab === 'feedback' && <Feedback />}
      </main>
    </div>
  );
}
