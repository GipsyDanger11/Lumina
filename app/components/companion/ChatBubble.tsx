import React from "react";
import { View, Text } from "react-native";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <View style={{ marginBottom: 12, alignItems: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <View style={{ width: 24, height: 24, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#7C6FF7", fontSize: 12, fontWeight: "700" }}>L</Text>
          </View>
          <Text style={{ color: "#5A5A6E", fontSize: 12 }}>LuminaAI</Text>
        </View>
      )}
      <View
        style={{
          maxWidth: "80%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 16,
          backgroundColor: isUser ? "#7C6FF7" : "#1A1A24",
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
        }}
      >
        <Text style={{ fontSize: 14, lineHeight: 20, color: isUser ? "#FFFFFF" : "#FFFFFF" }}>
          {content}
        </Text>
      </View>
      {timestamp && (
        <Text style={{ color: "#5A5A6E", fontSize: 10, marginTop: 4, paddingHorizontal: 4 }}>{timestamp}</Text>
      )}
    </View>
  );
}
