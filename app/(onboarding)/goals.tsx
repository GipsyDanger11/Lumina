import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/Button";
import { useUserStore } from "../store/useUserStore";
import { HealthGoals } from "../../constants";

export default function GoalsScreen() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    setProfile({
      ...profile!,
      goals: selectedGoals,
    });
    router.push("/(onboarding)/notifications");
  };

  return (
    <View className="flex-1 bg-lumina-bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-8 pt-16">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          <View className="bg-lumina-bg-secondary rounded-full h-1 mb-8">
            <View className="bg-lumina-accent-purple rounded-full h-full w-3/4" />
          </View>

          <Text className="text-lumina-text-primary text-3xl font-bold mb-2">
            Your goals
          </Text>
          <Text className="text-lumina-text-secondary text-base mb-8">
            Step 3 of 4 — What do you want to improve?
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-8">
            {HealthGoals.map((goal: string) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <TouchableOpacity
                  key={goal}
                  onPress={() => toggleGoal(goal)}
                  className={`px-4 py-3 rounded-xl border ${
                    isSelected
                      ? "bg-lumina-accent-purple/20 border-lumina-accent-purple"
                      : "bg-lumina-bg-card border-lumina-text-muted/20"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected ? "text-lumina-accent-purple" : "text-lumina-text-secondary"
                    }`}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            title="Continue"
            onPress={handleNext}
            disabled={selectedGoals.length === 0}
            className="mb-8"
          />
        </View>
      </ScrollView>
    </View>
  );
}
