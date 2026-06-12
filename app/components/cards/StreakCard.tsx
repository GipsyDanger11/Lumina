import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StreakCardProps {
  days: number;
}

export function StreakCard({ days }: StreakCardProps) {
  return (
    <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ backgroundColor: "rgba(124, 111, 247, 0.2)", padding: 10, borderRadius: 12 }}>
          <Ionicons name="flame" size={22} color="#7C6FF7" />
        </View>
        <View>
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", fontVariant: ["tabular-nums"] }}>
            {days} day streak
          </Text>
          <Text style={{ color: "#5A5A6E", fontSize: 12 }}>
            {days === 0 ? "Start tracking to build a streak" : "Keep it going!"}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#5A5A6E" />
    </View>
  );
}
