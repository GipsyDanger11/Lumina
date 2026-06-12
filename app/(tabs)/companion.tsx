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
      style={{ flex: 1, backgroundColor: "#0A0A0F" }}
    >
      {/* Header */}
      <View style={{ paddingTop: 64, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700" }}>LuminaAI</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => setMode(mode === "voice" ? "text" : "voice")}
            style={{ padding: 8, backgroundColor: "#1A1A24", borderRadius: 12 }}
          >
            <Ionicons
              name={mode === "voice" ? "text" : "mic"}
              size={18}
              color="#7C6FF7"
            />
          </TouchableOpacity>
          {messages.length > 0 && (
            <TouchableOpacity onPress={clearMessages} style={{ padding: 8, backgroundColor: "#1A1A24", borderRadius: 12 }}>
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
        style={{ flex: 1, paddingHorizontal: 24 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Text style={{ color: "#5A5A6E", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
              {isGuest
                ? "Try asking LuminaAI something (free session limited)"
                : "Ask me anything about your health"}
            </Text>
            <View style={{ gap: 8, width: "100%" }}>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  onPress={() => handleSend(prompt)}
                  style={{ backgroundColor: "#1A1A24", borderWidth: 1, borderColor: "rgba(90, 90, 110, 0.1)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: "#A0A0B0", fontSize: 14 }}>{prompt}</Text>
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
            <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={{ width: 6, height: 6, backgroundColor: "#5A5A6E", borderRadius: 3, opacity: 0.5 + i * 0.15 }}
                  />
                ))}
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#5A5A6E"
              style={{ flex: 1, backgroundColor: "#1A1A24", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#FFFFFF", fontSize: 16 }}
              onSubmitEditing={() => handleSend(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={() => handleSend(inputText)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: inputText.trim() ? "#7C6FF7" : "#1A1A24",
              }}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText.trim() ? "white" : "#5A5A6E"}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleVoiceSend}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isRecording ? "#FF6B6B" : "#7C6FF7",
              }}
              activeOpacity={0.7}
            >
              <Ionicons name={isRecording ? "stop" : "mic"} size={28} color="white" />
            </TouchableOpacity>
            <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 8 }}>
              {isRecording ? "Tap to stop" : isTranscribing ? "Transcribing..." : "Tap to speak"}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
