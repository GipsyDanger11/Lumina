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
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 32, paddingTop: 64 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          <View style={{ backgroundColor: "#12121A", borderRadius: 999, height: 4, marginBottom: 32 }}>
            <View style={{ backgroundColor: "#7C6FF7", borderRadius: 999, height: "100%", width: "75%" }} />
          </View>

          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 8 }}>
            Your goals
          </Text>
          <Text style={{ color: "#A0A0B0", fontSize: 16, marginBottom: 32 }}>
            Step 3 of 4 — What do you want to improve?
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {HealthGoals.map((goal: string) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <TouchableOpacity
                  key={goal}
                  onPress={() => toggleGoal(goal)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isSelected ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                    backgroundColor: isSelected ? "rgba(124, 111, 247, 0.2)" : "#1A1A24",
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: isSelected ? "#7C6FF7" : "#A0A0B0",
                    }}
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
            style={{ marginBottom: 32 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
