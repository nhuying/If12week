export interface PersonalData {
  height: string;
  startWeight: string;
  targetWeight: string;
  startWaist: string;
  targetWaist: string;
  currentFastingSugar: string;
  targetFastingSugar: string;
  goal1Start: string;
  goal1Target: string;
  goal2Start: string;
  goal2Target: string;
  goal3Steps: string;
  goal3StretchingTime: string;
  goal3StretchingFrequency: string;
}

export interface CheckupData {
  currentHbA1c: string;
  currentBP: string;
  currentTriglycerides: string;
  currentHDL: string;
  currentLDL: string;
}

export interface DailyHabitDay {
  sleep7h: boolean;
  wait1hBeforeCalories: boolean;
  eatWithin12h: boolean;
  outdoors30m: boolean;
  exercise30m: boolean;
  stopEatingDimLights2h: boolean;
  stepsCount: string;
  stretchingTime: string;
}

export interface DailyHabits {
  [week: number]: {
    [day: number]: DailyHabitDay; // 0: Mon, 1: Tue, ..., 6: Sun
  };
}

export interface WeeklyFeelingData {
  morningPain: number;
  morningEnergy: number;
  mentalClarity: number;
  energyAfterActivity: number;
  achesAndPains: number;
  mood: number;
  hunger: number;
  gutHealth: number;
  sleepinessAtBedtime: number;
  sleepQuality: number;
}

export interface WeeklyFeelings {
  [week: number]: WeeklyFeelingData;
}

export interface WeeklyMetric {
  weight: string;
  waist: string;
  fastingSugar: string;
}

export interface WeeklyMetrics {
  [week: number]: WeeklyMetric;
}

export interface ReminderSettings {
  dailyEnabled: boolean;
  dailyTime: string; // HH:MM
  weeklyEnabled: boolean;
  weeklyDay: number; // 0: Mon, ..., 6: Sun
  weeklyTime: string; // HH:MM
}

export interface AppState {
  personalData: PersonalData;
  checkupData: CheckupData;
  dailyHabits: DailyHabits;
  weeklyFeelings: WeeklyFeelings;
  weeklyMetrics: WeeklyMetrics;
  reminderSettings: ReminderSettings;
  lastDailyNotification?: string; // ISO date
  lastWeeklyNotification?: string; // ISO date
}
