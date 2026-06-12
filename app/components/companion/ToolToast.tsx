import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ToolToastProps {
  text: string;
}

export function ToolToast({ text }: ToolToastProps) {
  return (
    <View style={{ position: "absolute", bottom: 96, left: 16, right: 16, backgroundColor: "#1A1A24", borderWidth: 1, borderColor: "rgba(124, 111, 247, 0.2)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ width: 20, height: 20, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="checkmark" size={12} color="#7C6FF7" />
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 14, flex: 1 }}>{text}</Text>
    </View>
  );
}
