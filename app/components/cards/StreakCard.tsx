import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StreakCardProps {
  days: number;
}

export function StreakCard({ days }: StreakCardProps) {
  return (
    <View className="bg-lumina-bg-card rounded-2xl p-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <View className="bg-lumina-accent-purple/20 p-2.5 rounded-xl">
          <Ionicons name="flame" size={22} color="#7C6FF7" />
        </View>
        <View>
          <Text className="text-lumina-text-primary text-lg font-bold" style={{ fontVariant: ["tabular-nums"] }}>
            {days} day streak
          </Text>
          <Text className="text-lumina-text-muted text-xs">
            {days === 0 ? "Start tracking to build a streak" : "Keep it going!"}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#5A5A6E" />
    </View>
  );
}
