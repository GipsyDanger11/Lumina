import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Lumina Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
}

export async function scheduleHydrationReminder() {
  await Notifications.cancelScheduledNotificationAsync("hydration");
  await Notifications.scheduleNotificationAsync({
    identifier: "hydration",
    content: {
      title: "Time to hydrate! 💧",
      body: "You're one glass away from today's goal.",
    },
    trigger: {
      hour: 10,
      minute: 0,
      repeats: true,
    },
  });
}

export async function scheduleSleepReminder() {
  await Notifications.cancelScheduledNotificationAsync("sleep");
  await Notifications.scheduleNotificationAsync({
    identifier: "sleep",
    content: {
      title: "Wind down time 🌙",
      body: "You usually begin your bedtime routine around this time.",
    },
    trigger: {
      hour: 21,
      minute: 30,
      repeats: true,
    },
  });
}

export async function scheduleHabitReminder() {
  await Notifications.cancelScheduledNotificationAsync("habit");
  await Notifications.scheduleNotificationAsync({
    identifier: "habit",
    content: {
      title: "Habit check-in ✅",
      body: "You've completed this habit for five days in a row — keep it going!",
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
}

export async function scheduleInsightReminder() {
  await Notifications.cancelScheduledNotificationAsync("insight");
  await Notifications.scheduleNotificationAsync({
    identifier: "insight",
    content: {
      title: "Daily Insight ✨",
      body: "A new health insight is ready for you.",
    },
    trigger: {
      hour: 12,
      minute: 0,
      repeats: true,
    },
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function setupReminders(prefs: {
  hydration?: boolean;
  sleep?: boolean;
  habits?: boolean;
  insights?: boolean;
}) {
  const granted = await requestPermissions();
  if (!granted) return;

  await cancelAllReminders();

  if (prefs.hydration) await scheduleHydrationReminder();
  if (prefs.sleep) await scheduleSleepReminder();
  if (prefs.habits) await scheduleHabitReminder();
  if (prefs.insights) await scheduleInsightReminder();
}