import { useState, useEffect } from 'react';
import { Activity, User, Calendar, CheckSquare, LineChart, MessageSquare } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppState, PersonalData, CheckupData, ReminderSettings } from './types';
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
  currentHbA1c: '', currentBP: '', currentTriglycerides: '', currentHDL: '', currentLDL: '',
};

const initialReminderSettings: ReminderSettings = {
  dailyEnabled: false, dailyTime: '20:00',
  weeklyEnabled: false, weeklyDay: 6, weeklyTime: '10:00',
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
        dailyHabits: { ...dailyHabits, [week]: { ...weekData, [day]: { ...dayData, [field]: value } } },
      };
    });
  };

  const updateWeeklyFeelings = (week: number, field: string, value: number) => {
    setAppState((prev) => {
      const weeklyFeelings = prev.weeklyFeelings || {};
      const weekData = weeklyFeelings[week] || {
        morningPain: 0, morningEnergy: 0, mentalClarity: 0, energyAfterActivity: 0,
        achesAndPains: 0, mood: 0, hunger: 0, gutHealth: 0, sleepinessAtBedtime: 0, sleepQuality: 0,
      };
      return { ...prev, weeklyFeelings: { ...weeklyFeelings, [week]: { ...weekData, [field]: value } } };
    });
  };

  const updateWeeklyMetrics = (week: number, field: string, value: string) => {
    setAppState((prev) => {
      const weeklyMetrics = prev.weeklyMetrics || {};
      const weekData = weeklyMetrics[week] || { weight: '', waist: '', fastingSugar: '' };
      return { ...prev, weeklyMetrics: { ...weeklyMetrics, [week]: { ...weekData, [field]: value } } };
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-semibold text-stone-800">IF 12-Week Tracker</h1>
            </div>
          </div>
          <nav className="flex space-x-8 overflow-x-auto">
            <button onClick={() => setActiveTab('profile')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-stone-500'}`}>ข้อมูลส่วนตัว</button>
            <button onClick={() => setActiveTab('daily')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'daily' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-stone-500'}`}>บันทึกรายวัน</button>
            <button onClick={() => setActiveTab('weekly')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'weekly' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-stone-500'}`}>ประเมินรายสัปดาห์</button>
            <button onClick={() => setActiveTab('charts')} className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'charts' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-stone-500'}`}>กราฟติดตามผล</button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'profile' && <Profile personalData={appState.personalData} checkupData={appState.checkupData} reminderSettings={appState.reminderSettings} updatePersonalData={updatePersonalData} updateCheckupData={updateCheckupData} updateReminderSettings={updateReminderSettings} appState={appState} importAppState={setAppState} />}
        {activeTab === 'daily' && <DailyTracker dailyHabits={appState.dailyHabits || {}} updateDailyHabits={updateDailyHabits} personalData={appState.personalData} />}
        {activeTab === 'weekly' && <WeeklyAssessment weeklyFeelings={appState.weeklyFeelings || {}} updateWeeklyFeelings={updateWeeklyFeelings} weeklyMetrics={appState.weeklyMetrics || {}} updateWeeklyMetrics={updateWeeklyMetrics} />}
        {activeTab === 'charts' && <ProgressCharts personalData={appState.personalData} weeklyMetrics={appState.weeklyMetrics || {}} dailyHabits={appState.dailyHabits || {}} />}
      </main>
    </div>
  );
}