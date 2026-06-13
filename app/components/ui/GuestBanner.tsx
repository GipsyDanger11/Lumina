import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { T, S } from "../../lib/theme";

interface GuestBannerProps {
  onSignIn?: () => void;
}

export function GuestBanner({ onSignIn }: GuestBannerProps) {
  return (
    <View
      style={{
        backgroundColor: T.glass.bg,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: T.glass.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...S.shadow(6),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            backgroundColor: "rgba(124, 111, 247, 0.2)",
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="person-outline" size={20} color={T.accent.purple} />
        </View>
        <View>
          <Text
            style={{
              color: T.text.primary,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Sign in to sync data
          </Text>
          <Text
            style={{
              color: T.text.muted,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            Track your progress across devices
          </Text>
        </View>
      </View>
      {onSignIn && (
        <TouchableOpacity
          onPress={onSignIn}
          style={{
            backgroundColor: "rgba(124, 111, 247, 0.2)",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: T.accent.purple,
              fontSize: 13,
              fontWeight: "700",
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}