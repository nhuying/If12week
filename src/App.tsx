import { useState, useEffect } from 'react';
import { Activity, User, Calendar, CheckSquare, LineChart, MessageSquare } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppState, PersonalData, CheckupData, DailyHabits, WeeklyFeelings, WeeklyMetrics, ReminderSettings } from './types';
import Profile from './components/Profile';
import DailyTracker from './components/DailyTracker';
import WeeklyAssessment from './components/WeeklyAssessment';
import ProgressCharts from './components/ProgressCharts';
import Feedback from './components/Feedback';

const initialPersonalData: PersonalData = {
  height: '',
  startWeight: '',
  targetWeight: '',
  startWaist: '',
  targetWaist: '',
  currentFastingSugar: '',
  targetFastingSugar: '',
  goal1Start: '7.5',
  goal1Target: '7.0',
  goal2Start: '2',
  goal2Target: '1',
  goal3Steps: '6000',
  goal3StretchingTime: '15',
  goal3StretchingFrequency: '3',
};

const initialCheckupData: CheckupData = {
  currentHbA1c: '',
  currentBP: '',
  currentTriglycerides: '',
  currentHDL: '',
  currentLDL: '',
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
};

export default function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('if-tracker-state', initialAppState);
  
  // Migration for old state
  useEffect(() => {
    if (!appState.reminderSettings) {
      setAppState(prev => ({
        ...prev,
        reminderSettings: initialReminderSettings
      }));
    }
  }, []);

  const [activeTab, setActiveTab] = useState<'profile' | 'daily' | 'weekly' | 'charts' | 'feedback'>('profile');

  const updatePersonalData = (data: Partial<PersonalData>) => {
    setAppState((prev) => ({ ...prev, personalData: { ...prev.personalData, ...data } }));
  };

  const updateCheckupData = (data: Partial<CheckupData>) => {
    setAppState((prev) => ({ ...prev, checkupData: { ...prev.checkupData, ...data } }));
  };

  const updateReminderSettings = (data: Partial<ReminderSettings>) => {
    setAppState((prev) => ({ ...prev, reminderSettings: { ...prev.reminderSettings, ...data } }));
  };

  // Notification Check logic
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const checkNotifications = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Daily Check
      if (appState.reminderSettings.dailyEnabled && 
          currentHourMin >= appState.reminderSettings.dailyTime && 
          appState.lastDailyNotification !== todayStr) {
        
        new Notification('ได้เวลาบันทึกพฤติกรรมแล้ว!', {
          body: 'อย่าลืมบันทึกจำนวนก้าวเดินและการยืดเส้นฯ ของวันนี้ด้วยนะครับ',
          icon: '/mask-icon.svg'
        });
        setAppState(prev => ({ ...prev, lastDailyNotification: todayStr }));
      }

      // Weekly Check
      const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday, ...
      // Adjust to 0: Mon, ..., 6: Sun
      const adjustedDay = (currentDay + 6) % 7;
      
      if (appState.reminderSettings.weeklyEnabled && 
          adjustedDay === appState.reminderSettings.weeklyDay &&
          currentHourMin >= appState.reminderSettings.weeklyTime &&
          appState.lastWeeklyNotification !== todayStr) {
        
        new Notification('สรุปผลรายสัปดาห์!', {
          body: 'ได้เวลาประเมินความรู้สึกและตัวชี้วัดสุขภาพประจำสัปดาห์แล้วครับ',
          icon: '/mask-icon.svg'
        });
        setAppState(prev => ({ ...prev, lastWeeklyNotification: todayStr }));
      }
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    checkNotifications(); // Initial check

    return () => clearInterval(interval);
  }, [appState.reminderSettings, appState.lastDailyNotification, appState.lastWeeklyNotification]);

  const updateDailyHabits = (week: number, day: number, field: string, value: boolean | string) => {
    setAppState((prev) => {
      const dailyHabits = prev.dailyHabits || {};
      const weekData = dailyHabits[week] || {};
      const dayData = weekData[day] || {
        sleep7h: false,
        wait1hBeforeCalories: false,
        eatWithin12h: false,
        outdoors30m: false,
        exercise30m: false,
        stopEatingDimLights2h: false,
        stepsCount: '',
        stretchingTime: '',
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
      const weekData = weeklyFeelings[week] || {
        morningPain: 0,
        morningEnergy: 0,
        mentalClarity: 0,
        energyAfterActivity: 0,
        achesAndPains: 0,
        mood: 0,
        hunger: 0,
        gutHealth: 0,
        sleepinessAtBedtime: 0,
        sleepQuality: 0,
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
              <h1 className="text-xl font-semibold tracking-tight text-stone-800">IF 12-Week Tracker</h1>
            </div>
          </div>
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'profile'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                ข้อมูลส่วนตัว & เป้าหมาย
              </div>
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'daily'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                บันทึกพฤติกรรมรายวัน
              </div>
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'weekly'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                ประเมินความรู้สึกรายสัปดาห์
              </div>
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'charts'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                กราฟติดตามผล
              </div>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'feedback'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                ข้อเสนอแนะ
              </div>
            </button>
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
          />
        )}
        {activeTab === 'daily' && (
          <DailyTracker 
            dailyHabits={appState.dailyHabits || {}} 
            updateDailyHabits={updateDailyHabits} 
            personalData={appState.personalData}
          />
        )}
        {activeTab === 'weekly' && (
          <WeeklyAssessment 
            weeklyFeelings={appState.weeklyFeelings || {}} 
            updateWeeklyFeelings={updateWeeklyFeelings}
            weeklyMetrics={appState.weeklyMetrics || {}}
            updateWeeklyMetrics={updateWeeklyMetrics}
          />
        )}
        {activeTab === 'charts' && (
          <ProgressCharts 
            personalData={appState.personalData || initialPersonalData}
            weeklyMetrics={appState.weeklyMetrics || {}}
            dailyHabits={appState.dailyHabits || {}}
          />
        )}
        {activeTab === 'feedback' && (
          <Feedback />
        )}
      </main>
    </div>
  );
}
