import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { T, S } from "../../lib/theme";

interface ToolToastProps {
  text: string;
}

export function ToolToast({ text }: ToolToastProps) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 96,
        left: 16,
        right: 16,
        backgroundColor: T.glass.bg,
        borderWidth: 1,
        borderColor: T.glass.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        ...S.shadow(8, T.accent.purple),
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(124, 111, 247, 0.2)",
          width: 28,
          height: 28,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="checkmark" size={14} color={T.accent.purple} />
      </View>
      <Text
        style={{
          color: T.text.primary,
          fontSize: 14,
          flex: 1,
          fontWeight: "500",
        }}
      >
        {text}
      </Text>
    </View>
  );
}