import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { T, S } from "../../lib/theme";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <View
      style={{
        marginBottom: 12,
        alignItems: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              backgroundColor: "rgba(124, 111, 247, 0.2)",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: T.accent.purple,
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              L
            </Text>
          </View>
          <Text
            style={{
              color: T.text.muted,
              fontSize: 12,
              fontWeight: "500",
            }}
          >
            LuminaAI
          </Text>
        </View>
      )}
      {isUser ? (
        <LinearGradient
          colors={T.gradient.purple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            maxWidth: "80%",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 16,
            borderBottomRightRadius: 4,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: "#FFFFFF",
            }}
          >
            {content}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={{
            maxWidth: "80%",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 16,
            borderBottomLeftRadius: 4,
            backgroundColor: T.glass.bg,
            borderWidth: 1,
            borderColor: T.glass.border,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: T.text.primary,
            }}
          >
            {content}
          </Text>
        </View>
      )}
      {timestamp && (
        <Text
          style={{
            color: T.text.muted,
            fontSize: 10,
            marginTop: 4,
            paddingHorizontal: 4,
          }}
        >
          {timestamp}
        </Text>
      )}
    </View>
  );
}