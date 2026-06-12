import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HydrationCardProps {
  currentMl: number;
  goalMl: number;
  onPress?: () => void;
}

export function HydrationCard({ currentMl, goalMl, onPress }: HydrationCardProps) {
  const percentage = goalMl > 0 ? Math.min((currentMl / goalMl) * 100, 100) : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500" }}>Hydration</Text>
        <View style={{ backgroundColor: "rgba(78, 205, 196, 0.2)", padding: 6, borderRadius: 8 }}>
          <Ionicons name="water" size={14} color="#4ECDC4" />
        </View>
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", fontVariant: ["tabular-nums"] }}>
        {(currentMl / 1000).toFixed(1)}L
      </Text>
      <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 4 }}>
        of {(goalMl / 1000).toFixed(1)}L goal
      </Text>
      <View style={{ backgroundColor: "#12121A", borderRadius: 999, height: 6, marginTop: 12 }}>
        <View
          style={{ backgroundColor: "#4ECDC4", borderRadius: 999, height: "100%", width: `${percentage}%` }}
        />
      </View>
    </TouchableOpacity>
  );
}
