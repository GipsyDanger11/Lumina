import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/Button";
import { useUserStore } from "../store/useUserStore";
import { setUserProfile } from "../lib/firebase";
import { setupReminders } from "../lib/notifications";

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

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 32, paddingTop: 64 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          <View style={{ backgroundColor: "#12121A", borderRadius: 999, height: 4, marginBottom: 32 }}>
            <View style={{ backgroundColor: "#7C6FF7", borderRadius: 999, height: "100%", width: "100%" }} />
          </View>

          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 8 }}>
            Stay on track
          </Text>
          <Text style={{ color: "#A0A0B0", fontSize: 16, marginBottom: 32 }}>
            Step 4 of 4 — Choose your reminders
          </Text>

          <View style={{ gap: 16 }}>
            {/* Hydration */}
            <View style={{ backgroundColor: "#1A1A24", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, backgroundColor: "rgba(78, 205, 196, 0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="water" size={20} color="#4ECDC4" />
                </View>
                <View>
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
                    Hydration Reminders
                  </Text>
                  <Text style={{ color: "#5A5A6E", fontSize: 12 }}>Remind to drink water</Text>
                </View>
              </View>
              <Switch
                value={hydrationReminder}
                onValueChange={setHydrationReminder}
                trackColor={{ false: "#1A1A24", true: "#7C6FF7" }}
                thumbColor="white"
              />
            </View>

            {/* Sleep */}
            <View style={{ backgroundColor: "#1A1A24", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="moon" size={20} color="#7C6FF7" />
                </View>
                <View>
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
                    Sleep Reminders
                  </Text>
                  <Text style={{ color: "#5A5A6E", fontSize: 12 }}>Remind to log sleep</Text>
                </View>
              </View>
              <Switch
                value={sleepReminder}
                onValueChange={setSleepReminder}
                trackColor={{ false: "#1A1A24", true: "#7C6FF7" }}
                thumbColor="white"
              />
            </View>

            {/* Habits */}
            <View style={{ backgroundColor: "#1A1A24", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, backgroundColor: "rgba(255, 107, 107, 0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="checkmark-circle" size={20} color="#FF6B6B" />
                </View>
                <View>
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
                    Habit Reminders
                  </Text>
                  <Text style={{ color: "#5A5A6E", fontSize: 12 }}>Remind about daily habits</Text>
                </View>
              </View>
              <Switch
                value={habitReminder}
                onValueChange={setHabitReminder}
                trackColor={{ false: "#1A1A24", true: "#7C6FF7" }}
                thumbColor="white"
              />
            </View>

            {/* Insights */}
            <View style={{ backgroundColor: "#1A1A24", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, backgroundColor: "rgba(255, 217, 61, 0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="sparkles" size={20} color="#FFD93D" />
                </View>
                <View>
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
                    Daily Insights
                  </Text>
                  <Text style={{ color: "#5A5A6E", fontSize: 12 }}>Get personalized tips</Text>
                </View>
              </View>
              <Switch
                value={insightNotifications}
                onValueChange={setInsightNotifications}
                trackColor={{ false: "#1A1A24", true: "#7C6FF7" }}
                thumbColor="white"
              />
            </View>
          </View>

          <Button title="Complete Setup" onPress={handleComplete} style={{ marginTop: 32, marginBottom: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
}
