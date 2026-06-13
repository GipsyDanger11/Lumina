import { useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { healthApi, hydrationApi, sleepApi, mealsApi, habitsApi, habitLogsApi } from "../lib/api";
import { useHealthStore } from "../store/useHealthStore";
import { useUserStore } from "../store/useUserStore";

export function useHealth() {
  const userId = useUserStore((s) => s.user?.id);
  const isGuest = useUserStore((s) => s.isGuest);
  const store = useHealthStore();
  const fetchedRef = useRef(false);

  const fetchAll = useCallback(async () => {
    if (!userId || isGuest) return;
    const today = new Date().toISOString().split("T")[0];

    try {
      const [summary, weeklyData, streakResult] = await Promise.all([
        healthApi.summary(),
        healthApi.weeklyHydration(),
        healthApi.streak(),
      ]);

      store.setTodayHydration(summary.hydration.entries || [], summary.hydration.total_ml || 0);
      store.setTodaySleep(summary.sleep || null);
      store.setTodayHabits(summary.habits || []);
      store.setTodayHabitLogs(summary.todayHabitLogs || {});
      store.setTodayMeals(summary.meals || []);
      store.setWeeklyHydration(weeklyData.data || {});
      store.setStreakDays(streakResult.streak || 0);
    } catch {}
  }, [userId, isGuest]);

  // Fetch on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Re-fetch when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  return {
    hydration: store.todayHydration,
    totalWaterMl: store.todayTotalMl,
    sleep: store.todaySleep,
    habits: store.todayHabits,
    habitLogs: store.todayHabitLogs,
    meals: store.todayMeals,
    mood: store.todayMood,
    streak: store.streakDays,
    weeklyHydration: store.weeklyHydration,
    weeklySleep: store.weeklySleep,
  };
}
