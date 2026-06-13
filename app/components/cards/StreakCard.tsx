import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { T, S } from "../../lib/theme";

interface StreakCardProps {
  days: number;
}

export function StreakCard({ days }: StreakCardProps) {
  const motivationalText =
    days === 0
      ? "Start tracking to build a streak"
      : days < 7
      ? "Keep it going!"
      : days < 30
      ? "You're on fire!"
      : "Unstoppable!";

  return (
    <LinearGradient
      colors={days >= 7 ? T.gradient.pink : T.gradient.purple}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 24,
        padding: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...S.shadow(8, days >= 7 ? T.accent.pink : T.accent.purple),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            width: 48,
            height: 48,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="flame" size={24} color="#FFFFFF" />
        </View>
        <View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: "800",
              letterSpacing: -0.5,
              fontVariant: ["tabular-nums"],
            }}
          >
            {days} day streak
          </Text>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {motivationalText}
          </Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color="rgba(255, 255, 255, 0.5)"
      />
    </LinearGradient>
  );
}