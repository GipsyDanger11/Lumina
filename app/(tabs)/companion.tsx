import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LuminaOrb } from "../components/companion/LuminaOrb";
import { ChatBubble } from "../components/companion/ChatBubble";
import { ToolToast } from "../components/companion/ToolToast";
import { GuestBanner } from "../components/guest/GuestBanner";
import { useCompanion } from "../hooks/useCompanion";
import { useVoice } from "../hooks/useVoice";
import { useUserStore } from "../store/useUserStore";
import { router } from "expo-router";

const SUGGESTED_PROMPTS = [
  "How am I doing today?",
  "I drank 500ml of water",
  "Log 7 hours of sleep",
  "What should I focus on?",
  "Create a meditation habit",
];

export default function CompanionScreen() {
  const { messages, isLoading, toolStatus, sendMessage, clearMessages, canSend } = useCompanion();
  const { isRecording, isTranscribing, startRecording, stopRecording, speakText, stopSpeaking } =
    useVoice();
  const isGuest = useUserStore((s) => s.isGuest);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const scrollRef = useRef<ScrollView>(null);
  const [orbState, setOrbState] = useState<"idle" | "listening" | "speaking" | "processing">("idle");

  useEffect(() => {
    if (isRecording) setOrbState("listening");
    else if (isLoading) setOrbState("processing");
    else setOrbState("idle");
  }, [isRecording, isLoading]);

  // Auto-speak assistant responses in voice mode
  const prevMsgCount = useRef(messages.length);
  useEffect(() => {
    if (mode === "voice" && messages.length > prevMsgCount.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "assistant") {
        setOrbState("speaking");
        speakText(lastMsg.content).then(() => {
          setOrbState("idle");
        });
      }
    }
    prevMsgCount.current = messages.length;
  }, [messages, mode]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !canSend) return;
    setInputText("");
    await sendMessage(text);
  };

  const handleVoiceSend = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        await handleSend(text);
      }
    } else {
      startRecording();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-lumina-bg-primary"
    >
      {/* Header */}
      <View className="pt-16 px-6 flex-row items-center justify-between">
        <Text className="text-lumina-text-primary text-xl font-bold">LuminaAI</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setMode(mode === "voice" ? "text" : "voice")}
            className="p-2 bg-lumina-bg-card rounded-xl"
          >
            <Ionicons
              name={mode === "voice" ? "text" : "mic"}
              size={18}
              color="#7C6FF7"
            />
          </TouchableOpacity>
          {messages.length > 0 && (
            <TouchableOpacity onPress={clearMessages} className="p-2 bg-lumina-bg-card rounded-xl">
              <Ionicons name="refresh" size={18} color="#A0A0B0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Guest Banner */}
      {isGuest && <GuestBanner onPress={() => router.push("/(auth)/login")} />}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View className="items-center mt-8">
            <Text className="text-lumina-text-muted text-sm text-center mb-6">
              {isGuest
                ? "Try asking LuminaAI something (free session limited)"
                : "Ask me anything about your health"}
            </Text>
            <View className="gap-2 w-full">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  onPress={() => handleSend(prompt)}
                  className="bg-lumina-bg-card border border-lumina-text-muted/10 rounded-xl px-4 py-3"
                  activeOpacity={0.7}
                >
                  <Text className="text-lumina-text-secondary text-sm">{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role as "user" | "assistant"}
            content={msg.content}
          />
        ))}

        {isLoading && (
          <View className="items-start mb-3">
            <View className="bg-lumina-bg-card rounded-2xl rounded-bl-md px-4 py-3">
              <View className="flex-row gap-1">
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    className="w-1.5 h-1.5 bg-lumina-text-muted rounded-full"
                    style={{ opacity: 0.5 + i * 0.15 }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Orb */}
      <View className="items-center py-2">
        <LuminaOrb state={orbState} size={mode === "voice" ? 80 : 50} />
      </View>

      {/* Tool Toast */}
      {toolStatus && <ToolToast text={toolStatus} />}

      {/* Input */}
      <View className="px-6 pb-12 pt-2">
        {mode === "text" ? (
          <View className="flex-row items-center gap-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#5A5A6E"
              className="flex-1 bg-lumina-bg-card rounded-xl px-4 py-3 text-lumina-text-primary text-base"
              onSubmitEditing={() => handleSend(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={() => handleSend(inputText)}
              className={`w-10 h-10 rounded-xl items-center justify-center ${
                inputText.trim() ? "bg-lumina-accent-purple" : "bg-lumina-bg-card"
              }`}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText.trim() ? "white" : "#5A5A6E"}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center">
            <TouchableOpacity
              onPress={handleVoiceSend}
              className={`w-16 h-16 rounded-full items-center justify-center ${
                isRecording ? "bg-lumina-accent-coral" : "bg-lumina-accent-purple"
              }`}
              activeOpacity={0.7}
            >
              <Ionicons name={isRecording ? "stop" : "mic"} size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-lumina-text-muted text-xs mt-2">
              {isRecording ? "Tap to stop" : isTranscribing ? "Transcribing..." : "Tap to speak"}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
