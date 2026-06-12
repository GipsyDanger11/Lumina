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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-lumina-bg-card rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lumina-text-secondary text-xs font-medium">Hydration</Text>
        <View className="bg-lumina-accent-teal/20 p-1.5 rounded-lg">
          <Ionicons name="water" size={14} color="#4ECDC4" />
        </View>
      </View>
      <Text className="text-lumina-text-primary text-2xl font-bold" style={{ fontVariant: ["tabular-nums"] }}>
        {(currentMl / 1000).toFixed(1)}L
      </Text>
      <Text className="text-lumina-text-muted text-xs mt-1">
        of {(goalMl / 1000).toFixed(1)}L goal
      </Text>
      <View className="bg-lumina-bg-secondary rounded-full h-1.5 mt-3">
        <View
          className="bg-lumina-accent-teal rounded-full h-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </TouchableOpacity>
  );
}
