import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GuestBannerProps {
  onDismiss?: () => void;
  onPress?: () => void;
}

export function GuestBanner({ onDismiss, onPress }: GuestBannerProps) {
  return (
    <View className="bg-lumina-accent-purple/10 border border-lumina-accent-purple/20 rounded-xl px-4 py-3 mx-4 mb-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={onPress} className="flex-1 mr-2" activeOpacity={0.7}>
          <Text className="text-lumina-accent-purple text-sm font-medium">
            Sign in to sync data, unlock voice mode & get insights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDismiss} className="p-1">
          <Ionicons name="close" size={16} color="#7C6FF7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
