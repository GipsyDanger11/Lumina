import { create } from "zustand";

interface HydrationEntry {
  amount_ml: number;
  beverage_type: string;
  timestamp: string;
}

interface SleepEntry {
  hours: number;
  quality: string;
  bedtime: string | null;
  wake_time: string | null;
  date: string;
}

interface Habit {
  id: string;
  name: string;
  frequency: string;
  time_of_day: string;
  icon: string;
  color: string;
  active: boolean;
}

interface MealEntry {
  meal_type: string;
  description: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  timestamp: string;
}

interface HealthState {
  todayHydration: HydrationEntry[];
  todayTotalMl: number;
  todaySleep: SleepEntry | null;
  habits: Habit[];
  meals: MealEntry[];
  todayHabits: Habit[];
  todayHabitLogs: Record<string, string>;
  todayMeals: MealEntry[];
  todayMood: number | null;
  weeklyHydration: Record<string, number>;
  weeklySleep: Record<string, number>;
  streakDays: number;

  setTodayHydration: (entries: HydrationEntry[], total: number) => void;
  addWater: (entry: HydrationEntry, total: number) => void;
  setTodaySleep: (sleep: SleepEntry | null) => void;
  setTodayHabits: (habits: Habit[]) => void;
  setTodayHabitLogs: (logs: Record<string, string>) => void;
  setTodayMeals: (meals: MealEntry[]) => void;
  setTodayMood: (mood: number | null) => void;
  setWeeklyHydration: (data: Record<string, number>) => void;
  setWeeklySleep: (data: Record<string, number>) => void;
  setStreakDays: (days: number) => void;
  clearAll: () => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  todayHydration: [],
  todayTotalMl: 0,
  todaySleep: null,
  habits: [],
  meals: [],
  todayHabits: [],
  todayHabitLogs: {},
  todayMeals: [],
  todayMood: null,
  weeklyHydration: {},
  weeklySleep: {},
  streakDays: 0,

  setTodayHydration: (entries, total) => set({ todayHydration: entries, todayTotalMl: total }),
  addWater: (entry, total) =>
    set((state) => ({
      todayHydration: [...state.todayHydration, entry],
      todayTotalMl: total,
    })),
  setTodaySleep: (sleep) => set({ todaySleep: sleep }),
  setTodayHabits: (habits) => set({ todayHabits: habits }),
  setTodayHabitLogs: (logs) => set({ todayHabitLogs: logs }),
  setTodayMeals: (meals) => set({ todayMeals: meals }),
  setTodayMood: (mood) => set({ todayMood: mood }),
  setWeeklyHydration: (data) => set({ weeklyHydration: data }),
  setWeeklySleep: (data) => set({ weeklySleep: data }),
  setStreakDays: (days) => set({ streakDays: days }),
  clearAll: () =>
    set({
      todayHydration: [],
      todayTotalMl: 0,
      todaySleep: null,
      habits: [],
      meals: [],
      todayHabits: [],
      todayHabitLogs: {},
      todayMeals: [],
      todayMood: null,
      weeklyHydration: {},
      weeklySleep: {},
      streakDays: 0,
    }),
}));
