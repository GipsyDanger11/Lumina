import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGuestStore } from "../store/useGuestStore";

const QUICK_ACTIONS = [
  { icon: "water-outline" as const, label: "Water", color: "#4ECDC4" },
  { icon: "moon-outline" as const, label: "Sleep", color: "#7C6FF7" },
  { icon: "fitness-outline" as const, label: "Habits", color: "#FF6B6B" },
  { icon: "nutrition-outline" as const, label: "Nutrition", color: "#FFD93D" },
];

export default function ExploreScreen() {
  const loadGuestData = useGuestStore((s) => s.loadGuestData);

  React.useEffect(() => {
    loadGuestData();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "700", marginBottom: 4 }}>
          Welcome to Lumina
        </Text>
        <Text style={{ color: "#A0A0B0", fontSize: 15 }}>
          Here's a quick look at what you can track
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, gap: 12, marginBottom: 32 }}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={{
              backgroundColor: "#1A1A24",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/signup")}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: `${action.color}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>{action.label}</Text>
              <Text style={{ color: "#5A5A6E", fontSize: 13, marginTop: 2 }}>
                Sign in to start tracking
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#5A5A6E" />
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{
          backgroundColor: "#1A1A24",
          marginHorizontal: 24,
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "rgba(124, 111, 247, 0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="bulb" size={22} color="#7C6FF7" />
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>
            Create an account
          </Text>
        </View>
        <Text style={{ color: "#A0A0B0", fontSize: 14, lineHeight: 22 }}>
          Sign up to track health data, get AI insights, build streaks, and unlock your full health potential.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signup")}
        style={{
          backgroundColor: "#7C6FF7",
          marginHorizontal: 24,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          marginBottom: 12,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
          Get Started Free
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
          onPress={() => router.push("/" as any)}
        style={{
          backgroundColor: "#1A1A24",
          marginHorizontal: 24,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          marginBottom: 48,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "#5A5A6E", fontSize: 14 }}>Back to intro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
