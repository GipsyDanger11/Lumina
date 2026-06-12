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
    <View className="flex-1 bg-lumina-bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-8 pt-16">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          <View className="bg-lumina-bg-secondary rounded-full h-1 mb-8">
            <View className="bg-lumina-accent-purple rounded-full h-full w-full" />
          </View>

          <Text className="text-lumina-text-primary text-3xl font-bold mb-2">
            Stay on track
          </Text>
          <Text className="text-lumina-text-secondary text-base mb-8">
            Step 4 of 4 — Choose your reminders
          </Text>

          <View className="gap-4">
            {/* Hydration */}
            <View className="bg-lumina-bg-card rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-lumina-accent-teal/20 rounded-full items-center justify-center">
                  <Ionicons name="water" size={20} color="#4ECDC4" />
                </View>
                <View>
                  <Text className="text-lumina-text-primary text-sm font-semibold">
                    Hydration Reminders
                  </Text>
                  <Text className="text-lumina-text-muted text-xs">Remind to drink water</Text>
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
            <View className="bg-lumina-bg-card rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-lumina-accent-purple/20 rounded-full items-center justify-center">
                  <Ionicons name="moon" size={20} color="#7C6FF7" />
                </View>
                <View>
                  <Text className="text-lumina-text-primary text-sm font-semibold">
                    Sleep Reminders
                  </Text>
                  <Text className="text-lumina-text-muted text-xs">Remind to log sleep</Text>
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
            <View className="bg-lumina-bg-card rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-lumina-accent-coral/20 rounded-full items-center justify-center">
                  <Ionicons name="checkmark-circle" size={20} color="#FF6B6B" />
                </View>
                <View>
                  <Text className="text-lumina-text-primary text-sm font-semibold">
                    Habit Reminders
                  </Text>
                  <Text className="text-lumina-text-muted text-xs">Remind about daily habits</Text>
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
            <View className="bg-lumina-bg-card rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-lumina-warning/20 rounded-full items-center justify-center">
                  <Ionicons name="sparkles" size={20} color="#FFD93D" />
                </View>
                <View>
                  <Text className="text-lumina-text-primary text-sm font-semibold">
                    Daily Insights
                  </Text>
                  <Text className="text-lumina-text-muted text-xs">Get personalized tips</Text>
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

          <Button title="Complete Setup" onPress={handleComplete} className="mt-8 mb-8" />
        </View>
      </ScrollView>
    </View>
  );
}
