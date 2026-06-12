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
    <View style={{ backgroundColor: "rgba(124, 111, 247, 0.1)", borderWidth: 1, borderColor: "rgba(124, 111, 247, 0.2)", borderRadius: 16, padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="sparkles" size={16} color="#7C6FF7" />
          <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "600" }}>Daily Insight</Text>
        </View>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={{ padding: 4 }}>
            <Ionicons name="refresh" size={16} color="#7C6FF7" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 14, lineHeight: 20 }}>{text}</Text>
      {timestamp && (
        <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 8 }}>{timestamp}</Text>
      )}
    </View>
  );
}
