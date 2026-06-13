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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { LuminaOrb } from "../../components/companion/LuminaOrb";
import { ChatBubble } from "../../components/companion/ChatBubble";
import { ToolToast } from "../../components/companion/ToolToast";
import { GuestBanner } from "../../components/guest/GuestBanner";
import { useCompanion } from "../../hooks/useCompanion";
import { useVoice } from "../../hooks/useVoice";
import { useUserStore } from "../../store/useUserStore";
import { router } from "expo-router";
import { T, S } from "../../lib/theme";

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
      style={S.screen}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: 64,
          paddingHorizontal: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <LinearGradient
            colors={[...T.gradient.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="sparkles" size={18} color="#FFF" />
          </LinearGradient>
          <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "700" }}>
            LuminaAI
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => setMode(mode === "voice" ? "text" : "voice")}
            style={{
              padding: 8,
              backgroundColor: mode === "voice" ? "rgba(255, 107, 107, 0.15)" : T.bg.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: mode === "voice" ? "rgba(255, 107, 107, 0.3)" : T.glass.border,
            }}
          >
            <Ionicons
              name={mode === "voice" ? "text" : "mic"}
              size={18}
              color={mode === "voice" ? T.accent.coral : T.accent.purple}
            />
          </TouchableOpacity>
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clearMessages}
              style={{
                padding: 8,
                backgroundColor: T.bg.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
            >
              <Ionicons name="refresh" size={18} color={T.text.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Guest Banner */}
      {isGuest && <GuestBanner onPress={() => router.push("/(auth)/login")} />}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, paddingHorizontal: 24 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <LuminaOrb state="idle" size={100} />
            <Text
              style={{
                color: T.text.muted,
                fontSize: 14,
                textAlign: "center",
                marginTop: 20,
                marginBottom: 24,
                lineHeight: 20,
              }}
            >
              {isGuest
                ? "Try asking LuminaAI something\n(free session limited)"
                : "Ask me anything about\nyour health & wellness"}
            </Text>
            <View style={{ gap: 8, width: "100%" }}>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  onPress={() => handleSend(prompt)}
                  style={{
                    backgroundColor: T.glass.bg,
                    borderWidth: 1,
                    borderColor: T.glass.border,
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    ...Platform.select({
                      ios: {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                      },
                      android: { elevation: 3 },
                    }),
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color={T.accent.purpleLight} />
                    <Text style={{ color: T.text.secondary, fontSize: 14 }}>{prompt}</Text>
                  </View>
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
          <View style={{ alignItems: "flex-start", marginBottom: 12 }}>
            <View
              style={{
                backgroundColor: T.glass.bg,
                borderRadius: 18,
                borderBottomLeftRadius: 6,
                paddingHorizontal: 18,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
            >
              <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      backgroundColor: T.accent.purple,
                      borderRadius: 3.5,
                      opacity: 0.4 + i * 0.2,
                    }}
                  />
                ))}
                <Text style={{ color: T.text.muted, fontSize: 12, marginLeft: 6 }}>
                  Thinking...
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Orb */}
      <View style={{ alignItems: "center", paddingVertical: 8 }}>
        <LuminaOrb state={orbState} size={mode === "voice" ? 80 : 50} />
      </View>

      {/* Tool Toast */}
      {toolStatus && <ToolToast text={toolStatus} />}

      {/* Input */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 8 }}>
        {mode === "text" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: T.glass.bg,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: T.glass.border,
              paddingHorizontal: 4,
              paddingVertical: 4,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                },
                android: { elevation: 6 },
              }),
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={T.text.muted}
              style={{
                flex: 1,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: T.text.primary,
                fontSize: 16,
              }}
              onSubmitEditing={() => handleSend(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={() => handleSend(inputText)}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: inputText.trim() ? T.accent.purple : "transparent",
              }}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText.trim() ? "#FFF" : T.text.muted}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleVoiceSend}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isRecording ? T.accent.coral : T.accent.purple,
                ...Platform.select({
                  ios: {
                    shadowColor: isRecording ? T.accent.coral : T.accent.purple,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                  },
                  android: { elevation: 10 },
                }),
              }}
              activeOpacity={0.7}
            >
              <Ionicons name={isRecording ? "stop" : "mic"} size={28} color="white" />
            </TouchableOpacity>
            <Text style={{ color: T.text.muted, fontSize: 12, marginTop: 10 }}>
              {isRecording ? "Tap to stop" : isTranscribing ? "Transcribing..." : "Tap to speak"}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
