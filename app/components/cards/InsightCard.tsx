import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InsightCardProps {
  text: string;
  timestamp?: string;
  onRefresh?: () => void;
}

export function InsightCard({ text, timestamp, onRefresh }: InsightCardProps) {
  return (
    <View className="bg-lumina-accent-purple/10 border border-lumina-accent-purple/20 rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="sparkles" size={16} color="#7C6FF7" />
          <Text className="text-lumina-accent-purple text-sm font-semibold">Daily Insight</Text>
        </View>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} className="p-1">
            <Ionicons name="refresh" size={16} color="#7C6FF7" />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-lumina-text-primary text-sm leading-5">{text}</Text>
      {timestamp && (
        <Text className="text-lumina-text-muted text-xs mt-2">{timestamp}</Text>
      )}
    </View>
  );
}
