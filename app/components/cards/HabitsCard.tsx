import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HabitsCardProps {
  completed: number;
  total: number;
  onPress?: () => void;
}

export function HabitsCard({ completed, total, onPress }: HabitsCardProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500" }}>Habits</Text>
        <View style={{ backgroundColor: "rgba(255, 107, 107, 0.2)", padding: 6, borderRadius: 8 }}>
          <Ionicons name="checkmark-circle" size={14} color="#FF6B6B" />
        </View>
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", fontVariant: ["tabular-nums"] }}>
        {completed}/{total}
      </Text>
      <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 4 }}>
        {total === 0 ? "No habits yet" : `${Math.round(percentage)}% complete`}
      </Text>
      <View style={{ backgroundColor: "#12121A", borderRadius: 999, height: 6, marginTop: 12 }}>
        <View
          style={{ backgroundColor: "#FF6B6B", borderRadius: 999, height: "100%", width: `${percentage}%` }}
        />
      </View>
    </TouchableOpacity>
  );
}
