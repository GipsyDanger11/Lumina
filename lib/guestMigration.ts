import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, doc, setDoc, collection, serverTimestamp } from "./firebase";

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
          const ref = doc(db, `users/${userId}/logs/hydration/current`);
          await setDoc(ref, { ...data, migrated: true, migrated_at: serverTimestamp() });
          break;
        }
        case "guest_sleep": {
          const ref = doc(db, `users/${userId}/logs/sleep/current`);
          await setDoc(ref, { ...data, migrated: true, migrated_at: serverTimestamp() });
          break;
        }
        case "guest_habits": {
          if (Array.isArray(data)) {
            for (const habit of data) {
              const habitsRef = collection(db, `users/${userId}/habits`);
              await setDoc(doc(habitsRef), {
                ...habit,
                migrated: true,
                created_at: serverTimestamp(),
              });
            }
          }
          break;
        }
        case "guest_habit_logs": {
          if (typeof data === "object") {
            for (const [date, logs] of Object.entries(data)) {
              if (typeof logs === "object" && logs !== null) {
                for (const [habitId, logData] of Object.entries(logs as Record<string, any>)) {
                  const ref = doc(db, `users/${userId}/habit_logs/${date}/${habitId}`);
                  await setDoc(ref, { ...logData, migrated: true });
                }
              }
            }
          }
          break;
        }
        case "guest_meals": {
          const ref = doc(db, `users/${userId}/logs/meals/current`);
          await setDoc(ref, { ...data, migrated: true, migrated_at: serverTimestamp() });
          break;
        }
      }

      migratedCount++;
      // Clear guest data after migration
      await AsyncStorage.removeItem(key);
    }

    // Clear migration marker
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
