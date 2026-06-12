import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGuestStore } from "../store/useGuestStore";

const SAMPLE_HABITS = [
  { id: "h1", name: "Morning Meditation", frequency: "daily", time_of_day: "morning", icon: "meditation", color: "#7C6FF7" },
  { id: "h2", name: "Read 20 Pages", frequency: "daily", time_of_day: "evening", icon: "read", color: "#4ECDC4" },
  { id: "h3", name: "Evening Walk", frequency: "daily", time_of_day: "evening", icon: "walk", color: "#FF6B6B" },
];

const SAMPLE_HYDRATION = {
  entries: [
    { amount_ml: 250, beverage_type: "water", timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
    { amount_ml: 150, beverage_type: "coffee", timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
    { amount_ml: 500, beverage_type: "water", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
    { amount_ml: 250, beverage_type: "water", timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  total_ml: 1150,
};

export function useGuestData() {
  const store = useGuestStore();

  useEffect(() => {
    initSampleData().catch(() => {});
    store.loadGuestData().catch(() => {});
  }, []);

  const initSampleData = async () => {
    const hasData = await AsyncStorage.getItem("guest_hydration");
    if (!hasData) {
      await AsyncStorage.setItem("guest_hydration", JSON.stringify(SAMPLE_HYDRATION));
      await AsyncStorage.setItem("guest_habits", JSON.stringify(SAMPLE_HABITS));
    }
  };

  return {
    hydrationEntries: store.hydrationEntries,
    hydrationTotal: store.hydrationTotal,
    habits: store.habits,
    habitLogs: store.habitLogs,
    addWater: store.addGuestWater,
    addHabit: store.addGuestHabit,
    completeHabit: store.completeGuestHabit,
  };
}
