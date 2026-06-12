import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SleepCardProps {
  hours: number | null;
  quality?: string;
  onPress?: () => void;
}

export function SleepCard({ hours, quality, onPress }: SleepCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-lumina-bg-card rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lumina-text-secondary text-xs font-medium">Sleep</Text>
        <View className="bg-lumina-accent-purple/20 p-1.5 rounded-lg">
          <Ionicons name="moon" size={14} color="#7C6FF7" />
        </View>
      </View>
      <Text className="text-lumina-text-primary text-2xl font-bold" style={{ fontVariant: ["tabular-nums"] }}>
        {hours !== null ? `${hours}h` : "--"}
      </Text>
      <Text className="text-lumina-text-muted text-xs mt-1">
        {quality ? `Quality: ${quality}` : "No sleep logged"}
      </Text>
    </TouchableOpacity>
  );
}
