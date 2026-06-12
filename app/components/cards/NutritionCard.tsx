import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NutritionCardProps {
  mealsCount: number;
  onPress?: () => void;
}

export function NutritionCard({ mealsCount, onPress }: NutritionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500" }}>Nutrition</Text>
        <View style={{ backgroundColor: "rgba(255, 217, 61, 0.2)", padding: 6, borderRadius: 8 }}>
          <Ionicons name="restaurant" size={14} color="#FFD93D" />
        </View>
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", fontVariant: ["tabular-nums"] }}>
        {mealsCount}
      </Text>
      <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 4 }}>
        {mealsCount === 0 ? "No meals logged" : "meals today"}
      </Text>
    </TouchableOpacity>
  );
}
