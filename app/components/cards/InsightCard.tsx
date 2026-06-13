import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { T, S } from "../../lib/theme";

interface InsightCardProps {
  text: string;
  timestamp?: string;
  onRefresh?: () => void;
}

export function InsightCard({ text, timestamp, onRefresh }: InsightCardProps) {
  return (
    <View
      style={{
        backgroundColor: T.glass.bg,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: T.glass.border,
        ...S.shadow(8, T.accent.purple),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
            <Ionicons name="bulb" size={14} color={T.accent.purple} />
          </View>
          <Text
            style={{
              color: T.accent.purple,
              fontSize: 14,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            DAILY INSIGHT
          </Text>
        </View>
        {onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            style={{
              backgroundColor: "rgba(124, 111, 247, 0.15)",
              width: 32,
              height: 32,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="refresh" size={16} color={T.accent.purple} />
          </TouchableOpacity>
        )}
      </View>
      <Text
        style={{
          color: T.text.primary,
          fontSize: 15,
          lineHeight: 22,
        }}
      >
        {text}
      </Text>
      {timestamp && (
        <Text
          style={{
            color: T.text.muted,
            fontSize: 12,
            marginTop: 12,
          }}
        >
          {timestamp}
        </Text>
      )}
    </View>
  );
}