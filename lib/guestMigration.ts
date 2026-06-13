import AsyncStorage from "@react-native-async-storage/async-storage";
import { hydrationApi, sleepApi, mealsApi, habitsApi, habitLogsApi } from "./api";

const GUEST_KEYS = [
  "guest_hydration",
  "guest_sleep",
  "guest_habits",
  "guest_habit_logs",
  "guest_meals",
];

export async function migrateGuestData(userId: string): Promise<number> {
  let migratedCount = 0;

  try {
    for (const key of GUEST_KEYS) {
      const rawData = await AsyncStorage.getItem(key);
      if (!rawData) continue;

      const data = JSON.parse(rawData);

      switch (key) {
        case "guest_hydration": {
          if (data.total_ml > 0) {
            const today = new Date().toISOString().split("T")[0];
            await hydrationApi.put(today, data);
          }
          break;
        }
        case "guest_sleep": {
          if (data.hours) {
            const date = data.date || new Date().toISOString().split("T")[0];
            await sleepApi.put(date, data);
          }
          break;
        }
        case "guest_habits": {
          if (Array.isArray(data)) {
            for (const habit of data) {
              await habitsApi.create(habit);
            }
          }
          break;
        }
        case "guest_habit_logs": {
          if (typeof data === "object") {
            for (const [date, logs] of Object.entries(data)) {
              if (typeof logs === "object" && logs !== null) {
                for (const [habitId, logData] of Object.entries(logs as Record<string, any>)) {
                  await habitLogsApi.put(date, habitId, logData.status || "completed");
                }
              }
            }
          }
          break;
        }
        case "guest_meals": {
          if (typeof data === "object") {
            for (const [date, entries] of Object.entries(data)) {
              if (Array.isArray(entries)) {
                for (const entry of entries) {
                  await mealsApi.add(date, entry);
                }
              }
            }
          }
          break;
        }
      }

      migratedCount++;
      await AsyncStorage.removeItem(key);
    }

    await AsyncStorage.removeItem("guest_migrated");
  } catch (error) {
    console.error("Guest migration error:", error);
  }

  return migratedCount;
}

export async function isGuestDataPresent(): Promise<boolean> {
  for (const key of GUEST_KEYS) {
    const data = await AsyncStorage.getItem(key);
    if (data) return true;
  }
  return false;
}
