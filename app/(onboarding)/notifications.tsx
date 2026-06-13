import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { T } from "../../lib/theme";
import { useUserStore } from "../../store/useUserStore";
import { setUserProfile } from "../../lib/firebase";
import { setupReminders } from "../../lib/notifications";

interface ReminderItem {
  key: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  state: boolean;
  setter: (v: boolean) => void;
}

export default function NotificationsScreen() {
  const [hydrationReminder, setHydrationReminder] = useState(true);
  const [sleepReminder, setSleepReminder] = useState(true);
  const [habitReminder, setHabitReminder] = useState(true);
  const [insightNotifications, setInsightNotifications] = useState(true);
  const profile = useUserStore((s) => s.profile);
  const user = useUserStore((s) => s.user);
  const setProfileStore = useUserStore((s) => s.setProfile);

  const handleComplete = async () => {
    const finalProfile = {
      ...profile!,
      notifications: {
        hydration: hydrationReminder,
        sleep: sleepReminder,
        habits: habitReminder,
        insights: insightNotifications,
      },
      onboarding_complete: true,
    };

    setProfileStore(finalProfile);

    if (user?.uid) {
      await setUserProfile(user.uid, finalProfile);
      await setupReminders({
        hydration: hydrationReminder,
        sleep: sleepReminder,
        habits: habitReminder,
        insights: insightNotifications,
      });
    }

    router.replace("/(tabs)");
  };

  const reminders: ReminderItem[] = [
    { key: "hydration", title: "Hydration Reminders", desc: "Remind to drink water", icon: "water", color: T.accent.teal, state: hydrationReminder, setter: setHydrationReminder },
    { key: "sleep", title: "Sleep Reminders", desc: "Remind to log sleep", icon: "moon", color: T.accent.purple, state: sleepReminder, setter: setSleepReminder },
    { key: "habits", title: "Habit Reminders", desc: "Remind about daily habits", icon: "checkmark-circle", color: T.accent.coral, state: habitReminder, setter: setHabitReminder },
    { key: "insights", title: "Daily Insights", desc: "Get personalized tips", icon: "sparkles", color: T.accent.gold, state: insightNotifications, setter: setInsightNotifications },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: T.bg.primary }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 60 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: T.bg.card, borderWidth: 1, borderColor: T.glass.border, alignItems: "center", justifyContent: "center", marginBottom: 24 }}
          >
            <Ionicons name="chevron-back" size={22} color={T.text.secondary} />
          </TouchableOpacity>

          <View style={{ backgroundColor: T.bg.elevated, borderRadius: 999, height: 4, marginBottom: 32, overflow: "hidden" }}>
            <LinearGradient colors={T.gradient.teal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 999, height: "100%", width: "100%" }} />
          </View>

          <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 }}>
            Stay on track
          </Text>
          <Text style={{ color: T.text.muted, fontSize: 15, marginBottom: 32, lineHeight: 22 }}>
            Step 4 of 4 {"\u2014"} Choose your reminders
          </Text>

          <View style={{ gap: 12 }}>
            {reminders.map((item) => (
              <View
                key={item.key}
                style={{
                  backgroundColor: T.glass.bg,
                  borderRadius: 18,
                  padding: 18,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: T.glass.border,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14, flex: 1 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: item.color + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: T.text.primary, fontSize: 15, fontWeight: "600" }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: T.text.muted, fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => item.setter(!item.state)}
                  activeOpacity={0.7}
                >
                  <View style={{ width: 52, height: 30, borderRadius: 15, backgroundColor: item.state ? T.accent.purple : T.bg.elevated, justifyContent: "center", alignItems: item.state ? "flex-end" : "flex-start", paddingHorizontal: 3 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#FFFFFF" }} />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleComplete}
            activeOpacity={0.8}
            style={{ marginTop: 32, marginBottom: 40 }}
          >
            <LinearGradient
              colors={T.gradient.teal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                ...Platform.select({
                  ios: { shadowColor: T.accent.teal, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
                  android: { elevation: 8 },
                }),
              }}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 }}>Complete Setup</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
