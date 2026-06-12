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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-lumina-bg-card rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lumina-text-secondary text-xs font-medium">Habits</Text>
        <View className="bg-lumina-accent-coral/20 p-1.5 rounded-lg">
          <Ionicons name="checkmark-circle" size={14} color="#FF6B6B" />
        </View>
      </View>
      <Text className="text-lumina-text-primary text-2xl font-bold" style={{ fontVariant: ["tabular-nums"] }}>
        {completed}/{total}
      </Text>
      <Text className="text-lumina-text-muted text-xs mt-1">
        {total === 0 ? "No habits yet" : `${Math.round(percentage)}% complete`}
      </Text>
      <View className="bg-lumina-bg-secondary rounded-full h-1.5 mt-3">
        <View
          className="bg-lumina-accent-coral rounded-full h-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </TouchableOpacity>
  );
}
