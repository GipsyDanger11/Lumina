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
import { T } from "../lib/theme";
import { useUserStore } from "../store/useUserStore";
import { HealthGoals } from "../../constants";

const GOAL_ICONS: Record<string, string> = {
  "Better sleep": "moon-outline",
  "More hydration": "water-outline",
  "Build habits": "checkmark-circle-outline",
  "Weight management": "scale-outline",
  "More energy": "flash-outline",
  "Reduce stress": "leaf-outline",
  "Better nutrition": "nutrition-outline",
  "Morning routine": "sunny-outline",
  Mindfulness: "flower-outline",
  Fitness: "fitness-outline",
};

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
            <LinearGradient colors={T.gradient.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 999, height: "100%", width: "75%" }} />
          </View>

          <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 }}>
            Your goals
          </Text>
          <Text style={{ color: T.text.muted, fontSize: 15, marginBottom: 32, lineHeight: 22 }}>
            Step 3 of 4 {"\u2014"} What do you want to improve?
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
            {HealthGoals.map((goal: string) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <TouchableOpacity
                  key={goal}
                  onPress={() => toggleGoal(goal)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isSelected ? T.accent.purple : T.glass.border,
                    backgroundColor: isSelected ? "rgba(124, 111, 247, 0.15)" : T.glass.bg,
                  }}
                >
                  <Ionicons
                    name={(GOAL_ICONS[goal] || "ellipse-outline") as any}
                    size={18}
                    color={isSelected ? T.accent.purpleLight : T.text.muted}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: isSelected ? T.accent.purpleLight : T.text.muted,
                    }}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedGoals.length > 0 && (
            <View style={{ backgroundColor: "rgba(124, 111, 247, 0.1)", borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: "rgba(124, 111, 247, 0.2)" }}>
              <Text style={{ color: T.accent.purpleLight, fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                {selectedGoals.length} goal{selectedGoals.length > 1 ? "s" : ""} selected
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleNext}
            disabled={selectedGoals.length === 0}
            activeOpacity={0.8}
            style={{ marginBottom: 40, opacity: selectedGoals.length === 0 ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={T.gradient.purple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                ...Platform.select({
                  ios: { shadowColor: T.accent.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
                  android: { elevation: 8 },
                }),
              }}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 }}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
