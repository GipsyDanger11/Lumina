import { useEffect, useCallback } from "react";
import { db, doc, onSnapshot, collection, getDocs, Timestamp } from "../lib/firebase";
import { useHealthStore } from "../store/useHealthStore";
import { useUserStore } from "../store/useUserStore";

async function calculateStreak(userId: string): Promise<number> {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split("T")[0];

      // Check habits
      const habitSnap = await getDocs(collection(db, `users/${userId}/habit_logs/${key}`));
      const hasHabit = habitSnap.docs.some((d) => d.data().status === "completed");

      // Check hydration
      const hydSnap = await getDocs(collection(db, `users/${userId}/logs/hydration`));
      // For streaks, check if ANY data was logged on this date
      const hasHydration = hydSnap.docs.some((d) => d.id === key && (d.data().total_ml || 0) > 0);

      if (hasHabit || hasHydration) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  } catch {
    return 0;
  }
}

export function useHealth() {
  const userId = useUserStore((s) => s.user?.uid);
  const store = useHealthStore();

  useEffect(() => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];

    // Listen to hydration
    const unsubHydration = onSnapshot(
      doc(db, `users/${userId}/logs/hydration/${today}`),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          store.setTodayHydration(data.entries || [], data.total_ml || 0);
        } else {
          store.setTodayHydration([], 0);
        }
      }
    );

    // Listen to sleep
    const unsubSleep = onSnapshot(
      doc(db, `users/${userId}/logs/sleep/${today}`),
      (snap) => {
        if (snap.exists()) {
          store.setTodaySleep(snap.data() as any);
        }
      }
    );

    // Listen to habits
    const unsubHabits = onSnapshot(
      collection(db, `users/${userId}/habits`),
      (snap) => {
        const habits = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
        store.setTodayHabits(habits);
      }
    );

    // Listen to habit logs
    const unsubHabitLogs = onSnapshot(
      collection(db, `users/${userId}/habit_logs/${today}`),
      (snap) => {
        const logs: Record<string, string> = {};
        snap.docs.forEach((d) => {
          logs[d.id] = d.data().status;
        });
        store.setTodayHabitLogs(logs);
      }
    );

    // Listen to meals
    const unsubMeals = onSnapshot(
      doc(db, `users/${userId}/logs/meals/${today}`),
      (snap) => {
        if (snap.exists()) {
          store.setTodayMeals(snap.data().entries || []);
        } else {
          store.setTodayMeals([]);
        }
      }
    );

    // Listen to mood
    const unsubMood = onSnapshot(
      doc(db, `users/${userId}/mood_logs/${today}`),
      (snap) => {
        if (snap.exists()) {
          store.setTodayMood(snap.data().mood);
        }
      }
    );

    // Load weekly hydration data for chart
    const loadWeeklyHydration = async () => {
      const weeklyData: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const snap = await getDocs(collection(db, `users/${userId}/logs/hydration/${key}`));
        // Actually the data is in a document with the date as ID
      }
      // Alternative: get all hydration docs
      try {
        const snap = await getDocs(collection(db, `users/${userId}/logs/hydration`));
        snap.docs.forEach((d) => {
          const data = d.data();
          weeklyData[d.id] = data.total_ml || 0;
        });
        store.setWeeklyHydration(weeklyData);
      } catch {}
    };
    loadWeeklyHydration();

    // Calculate streak
    calculateStreak(userId).then(store.setStreakDays);

    return () => {
      unsubHydration();
      unsubSleep();
      unsubHabits();
      unsubHabitLogs();
      unsubMeals();
      unsubMood();
    };
  }, [userId]);

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
