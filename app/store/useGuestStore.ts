import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GuestHydrationEntry {
  amount_ml: number;
  beverage_type: string;
  timestamp: string;
}

interface GuestHabit {
  id: string;
  name: string;
  frequency: string;
  time_of_day: string;
  icon: string;
  color: string;
}

interface GuestState {
  hydrationEntries: GuestHydrationEntry[];
  hydrationTotal: number;
  habits: GuestHabit[];
  habitLogs: Record<string, Record<string, string>>;
  sleepHours: number | null;
  sleepQuality: string | null;
  companionMessages: Array<{ role: string; content: string }>;
  companionSessionCount: number;

  addGuestWater: (entry: GuestHydrationEntry) => Promise<void>;
  loadGuestData: () => Promise<void>;
  addGuestHabit: (habit: GuestHabit) => Promise<void>;
  completeGuestHabit: (habitId: string, status: string) => Promise<void>;
  addCompanionMessage: (role: string, content: string) => void;
  incrementSession: () => void;
  clearGuest: () => Promise<void>;
}

const MAX_GUEST_MESSAGES = 50;
const MAX_GUEST_HABITS = 3;
const MAX_GUEST_SESSIONS = 5;

export const useGuestStore = create<GuestState>((set, get) => ({
  hydrationEntries: [],
  hydrationTotal: 0,
  habits: [],
  habitLogs: {},
  sleepHours: null,
  sleepQuality: null,
  companionMessages: [],
  companionSessionCount: 0,

  addGuestWater: async (entry) => {
    const entries = [...get().hydrationEntries, entry];
    const total = entries.reduce((sum, e) => sum + e.amount_ml, 0);
    set({ hydrationEntries: entries, hydrationTotal: total });
    await AsyncStorage.setItem(
      "guest_hydration",
      JSON.stringify({ entries, total_ml: total })
    );
  },

  loadGuestData: async () => {
    try {
      const hydrationRaw = await AsyncStorage.getItem("guest_hydration");
      if (hydrationRaw) {
        const data = JSON.parse(hydrationRaw);
        set({
          hydrationEntries: data.entries || [],
          hydrationTotal: data.total_ml || 0,
        });
      }

      const habitsRaw = await AsyncStorage.getItem("guest_habits");
      if (habitsRaw) {
        set({ habits: JSON.parse(habitsRaw) });
      }

      const logsRaw = await AsyncStorage.getItem("guest_habit_logs");
      if (logsRaw) {
        set({ habitLogs: JSON.parse(logsRaw) });
      }

      const sessionsRaw = await AsyncStorage.getItem("guest_sessions");
      if (sessionsRaw) {
        set({ companionSessionCount: parseInt(sessionsRaw, 10) });
      }
    } catch {}
  },

  addGuestHabit: async (habit) => {
    if (get().habits.length >= MAX_GUEST_HABITS) return;
    const habits = [...get().habits, habit];
    set({ habits });
    await AsyncStorage.setItem("guest_habits", JSON.stringify(habits));
  },

  completeGuestHabit: async (habitId, status) => {
    const today = new Date().toISOString().split("T")[0];
    const logs = { ...get().habitLogs };
    if (!logs[today]) logs[today] = {};
    logs[today][habitId] = status;
    set({ habitLogs: logs });
    await AsyncStorage.setItem("guest_habit_logs", JSON.stringify(logs));
  },

  addCompanionMessage: (role, content) => {
    const messages = [...get().companionMessages, { role, content }];
    if (messages.length > MAX_GUEST_MESSAGES) {
      messages.splice(0, messages.length - MAX_GUEST_MESSAGES);
    }
    set({ companionMessages: messages });
  },

  incrementSession: () => {
    const count = get().companionSessionCount + 1;
    set({ companionSessionCount: count });
    AsyncStorage.setItem("guest_sessions", count.toString());
  },

  clearGuest: async () => {
    const keys = [
      "guest_hydration",
      "guest_habits",
      "guest_habit_logs",
      "guest_sleep",
      "guest_meals",
      "guest_sessions",
    ];
    for (const key of keys) {
      await AsyncStorage.removeItem(key);
    }
    set({
      hydrationEntries: [],
      hydrationTotal: 0,
      habits: [],
      habitLogs: {},
      sleepHours: null,
      sleepQuality: null,
      companionMessages: [],
      companionSessionCount: 0,
    });
  },
}));

export const GUEST_MAX_HABITS = MAX_GUEST_HABITS;
export const GUEST_MAX_SESSIONS = MAX_GUEST_SESSIONS;
