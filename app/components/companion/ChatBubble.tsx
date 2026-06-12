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
    <View className={`mb-3 ${isUser ? "items-end" : "items-start"}`}>
      {!isUser && (
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-6 h-6 bg-lumina-accent-purple/20 rounded-full items-center justify-center">
            <Text className="text-lumina-accent-purple text-xs font-bold">L</Text>
          </View>
          <Text className="text-lumina-text-muted text-xs">LuminaAI</Text>
        </View>
      )}
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-lumina-accent-purple rounded-br-md"
            : "bg-lumina-bg-card rounded-bl-md"
        }`}
      >
        <Text className={`text-sm leading-5 ${isUser ? "text-white" : "text-lumina-text-primary"}`}>
          {content}
        </Text>
      </View>
      {timestamp && (
        <Text className="text-lumina-text-muted text-[10px] mt-1 px-1">{timestamp}</Text>
      )}
    </View>
  );
}
