import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NutritionCardProps {
  mealsCount: number;
  onPress?: () => void;
}

export function NutritionCard({ mealsCount, onPress }: NutritionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-lumina-bg-card rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lumina-text-secondary text-xs font-medium">Nutrition</Text>
        <View className="bg-lumina-warning/20 p-1.5 rounded-lg">
          <Ionicons name="restaurant" size={14} color="#FFD93D" />
        </View>
      </View>
      <Text className="text-lumina-text-primary text-2xl font-bold" style={{ fontVariant: ["tabular-nums"] }}>
        {mealsCount}
      </Text>
      <Text className="text-lumina-text-muted text-xs mt-1">
        {mealsCount === 0 ? "No meals logged" : "meals today"}
      </Text>
    </TouchableOpacity>
  );
}
