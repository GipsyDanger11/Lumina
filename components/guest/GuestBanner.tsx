import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GuestBannerProps {
  onDismiss?: () => void;
  onPress?: () => void;
}

export function GuestBanner({ onDismiss, onPress }: GuestBannerProps) {
  return (
    <View style={{ backgroundColor: "rgba(124, 111, 247, 0.1)", borderWidth: 1, borderColor: "rgba(124, 111, 247, 0.2)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 16, marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={onPress} style={{ flex: 1, marginRight: 8 }} activeOpacity={0.7}>
          <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "500" }}>
            Sign in to sync data, unlock voice mode & get insights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDismiss} style={{ padding: 4 }}>
          <Ionicons name="close" size={16} color="#7C6FF7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
