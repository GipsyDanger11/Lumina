import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/Button";
import { useUserStore } from "../store/useUserStore";
import { ActivityLevels } from "../../constants";

export default function LifestyleScreen() {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("23:00");
  const [activity, setActivity] = useState("");
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const times = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, "0");
    return [`${h}:00`, `${h}:30`];
  }).flat();

  const handleNext = () => {
    setProfile({
      ...profile!,
      wake_time: wakeTime,
      bedtime: bedTime,
      activity_level: activity,
    });
    router.push("/(onboarding)/goals");
  };

  return (
    <View className="flex-1 bg-lumina-bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-8 pt-16">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          <View className="bg-lumina-bg-secondary rounded-full h-1 mb-8">
            <View className="bg-lumina-accent-purple rounded-full h-full w-2/4" />
          </View>

          <Text className="text-lumina-text-primary text-3xl font-bold mb-2">Your routine</Text>
          <Text className="text-lumina-text-secondary text-base mb-8">
            Step 2 of 4 — Tell us about your daily schedule
          </Text>

          {/* Wake Time */}
          <Text className="text-lumina-text-secondary text-sm mb-2 font-medium">Wake Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <View className="flex-row gap-2">
              {["05:00", "06:00", "06:30", "07:00", "07:30", "08:00", "09:00"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setWakeTime(t)}
                  className={`px-4 py-3 rounded-xl border ${
                    wakeTime === t
                      ? "bg-lumina-accent-purple/20 border-lumina-accent-purple"
                      : "bg-lumina-bg-card border-lumina-text-muted/20"
                  }`}
                >
                  <Text className={`text-sm font-medium ${wakeTime === t ? "text-lumina-accent-purple" : "text-lumina-text-secondary"}`}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Bedtime */}
          <Text className="text-lumina-text-secondary text-sm mb-2 font-medium">Bedtime</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <View className="flex-row gap-2">
              {["21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setBedTime(t)}
                  className={`px-4 py-3 rounded-xl border ${
                    bedTime === t
                      ? "bg-lumina-accent-purple/20 border-lumina-accent-purple"
                      : "bg-lumina-bg-card border-lumina-text-muted/20"
                  }`}
                >
                  <Text className={`text-sm font-medium ${bedTime === t ? "text-lumina-accent-purple" : "text-lumina-text-secondary"}`}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Activity Level */}
          <Text className="text-lumina-text-secondary text-sm mb-3 font-medium">Activity Level</Text>
          <View className="gap-2 mb-8">
            {ActivityLevels.map((level: any) => (
              <TouchableOpacity
                key={level.value}
                onPress={() => setActivity(level.value)}
                className={`p-4 rounded-xl border flex-row items-center justify-between ${
                  activity === level.value
                    ? "bg-lumina-accent-purple/20 border-lumina-accent-purple"
                    : "bg-lumina-bg-card border-lumina-text-muted/20"
                }`}
              >
                <View>
                  <Text className={`text-sm font-semibold ${activity === level.value ? "text-lumina-accent-purple" : "text-lumina-text-primary"}`}>
                    {level.label}
                  </Text>
                  <Text className="text-lumina-text-muted text-xs mt-0.5">{level.description}</Text>
                </View>
                {activity === level.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#7C6FF7" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button title="Continue" onPress={handleNext} disabled={!activity} className="mb-8" />
        </View>
      </ScrollView>
    </View>
  );
}
