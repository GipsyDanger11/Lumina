import { Platform } from "react-native";

async function getNotifications() {
  return await import("expo-notifications");
}

export async function requestPermissions(): Promise<boolean> {
  const Notifications = await getNotifications();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

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
  const Notifications = await getNotifications();
  await Notifications.cancelScheduledNotificationAsync("hydration");
  await Notifications.scheduleNotificationAsync({
    identifier: "hydration",
    content: {
      title: "Time to hydrate!",
      body: "You're one glass away from today's goal.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
    },
  });
}

export async function scheduleSleepReminder() {
  const Notifications = await getNotifications();
  await Notifications.cancelScheduledNotificationAsync("sleep");
  await Notifications.scheduleNotificationAsync({
    identifier: "sleep",
    content: {
      title: "Wind down time",
      body: "You usually begin your bedtime routine around this time.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 30,
    },
  });
}

export async function scheduleHabitReminder() {
  const Notifications = await getNotifications();
  await Notifications.cancelScheduledNotificationAsync("habit");
  await Notifications.scheduleNotificationAsync({
    identifier: "habit",
    content: {
      title: "Habit check-in",
      body: "You've completed this habit for five days in a row — keep it going!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

export async function scheduleInsightReminder() {
  const Notifications = await getNotifications();
  await Notifications.cancelScheduledNotificationAsync("insight");
  await Notifications.scheduleNotificationAsync({
    identifier: "insight",
    content: {
      title: "Daily Insight",
      body: "A new health insight is ready for you.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });
}

export async function cancelAllReminders() {
  const Notifications = await getNotifications();
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
