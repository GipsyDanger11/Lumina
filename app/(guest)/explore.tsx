import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { T } from "../lib/theme";
import { useGuestStore } from "../store/useGuestStore";

const QUICK_ACTIONS = [
  { icon: "water-outline" as const, label: "Water", color: T.accent.teal, gradient: T.gradient.teal },
  { icon: "moon-outline" as const, label: "Sleep", color: T.accent.purple, gradient: T.gradient.purple },
  { icon: "fitness-outline" as const, label: "Habits", color: T.accent.coral, gradient: T.gradient.coral },
  { icon: "nutrition-outline" as const, label: "Nutrition", color: T.accent.gold, gradient: T.gradient.gold },
];

export default function ExploreScreen() {
  const loadGuestData = useGuestStore((s) => s.loadGuestData);

  React.useEffect(() => {
    loadGuestData();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg.primary }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 8 }}>
        <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 6 }}>
          Welcome to Lumina
        </Text>
        <Text style={{ color: T.text.muted, fontSize: 15, lineHeight: 22 }}>
          Here's a quick look at what you can track
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, gap: 12, marginTop: 24, marginBottom: 28 }}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/signup")}
            style={{
              backgroundColor: T.glass.bg,
              borderRadius: 18,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              borderWidth: 1,
              borderColor: T.glass.border,
              ...Platform.select({
                ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12 },
                android: { elevation: 6 },
              }),
            }}
          >
            <LinearGradient
              colors={[action.color + "30", action.color + "10"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.text.primary, fontSize: 16, fontWeight: "700" }}>{action.label}</Text>
              <Text style={{ color: T.text.muted, fontSize: 13, marginTop: 2 }}>Sign in to start tracking</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={T.text.muted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA Card */}
      <View
        style={{
          marginHorizontal: 24,
          marginBottom: 20,
        }}
      >
        <LinearGradient
          colors={["rgba(124, 111, 247, 0.15)", "rgba(124, 111, 247, 0.05)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 22,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(124, 111, 247, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
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
              <Ionicons name="bulb" size={20} color={T.accent.purpleLight} />
            </View>
            <Text style={{ color: T.text.primary, fontSize: 18, fontWeight: "700" }}>
              Create an account
            </Text>
          </View>
          <Text style={{ color: T.text.muted, fontSize: 14, lineHeight: 22 }}>
            Sign up to track health data, get AI insights, build streaks, and unlock your full health potential.
          </Text>
        </LinearGradient>
      </View>

      {/* Primary CTA */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/signup")}
        activeOpacity={0.8}
        style={{
          marginHorizontal: 24,
          marginBottom: 12,
        }}
      >
        <LinearGradient
          colors={T.gradient.purple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            ...Platform.select({
              ios: { shadowColor: T.accent.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
              android: { elevation: 8 },
            }),
          }}
        >
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 }}>
            Get Started Free
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Back to intro */}
      <TouchableOpacity
        onPress={() => router.push("/" as any)}
        activeOpacity={0.8}
        style={{
          marginHorizontal: 24,
          backgroundColor: T.glass.bg,
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: "center",
          marginBottom: 48,
          borderWidth: 1,
          borderColor: T.glass.border,
        }}
      >
        <Text style={{ color: T.text.muted, fontSize: 14, fontWeight: "500" }}>Back to intro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
