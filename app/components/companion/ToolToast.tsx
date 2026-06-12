import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ToolToastProps {
  text: string;
}

export function ToolToast({ text }: ToolToastProps) {
  return (
    <View className="absolute bottom-24 left-4 right-4 bg-lumina-bg-card border border-lumina-accent-purple/20 rounded-xl px-4 py-3 flex-row items-center gap-3">
      <View className="w-5 h-5 bg-lumina-accent-purple/20 rounded-full items-center justify-center">
        <Ionicons name="checkmark" size={12} color="#7C6FF7" />
      </View>
      <Text className="text-lumina-text-primary text-sm flex-1">{text}</Text>
    </View>
  );
}
