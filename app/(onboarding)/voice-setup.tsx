import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LuminaOrb } from "../components/companion/LuminaOrb";
import { ChatBubble } from "../components/companion/ChatBubble";
import { useVoice } from "../hooks/useVoice";
import { parseVoiceInput } from "../lib/mistral";
import { useUserStore } from "../store/useUserStore";

interface OnboardingStep {
  field: string;
  question: string;
  followUp?: string;
}

const STEPS: OnboardingStep[] = [
  { field: "name", question: "Hi, I'm LuminaAI. I'm going to be your personal health companion. Let's start — what's your name?" },
  { field: "age", question: "Nice to meet you! How old are you?" },
  { field: "gender", question: "And your gender? You can say male, female, or prefer not to say." },
  { field: "height", question: "Got it. What's your height? You can say something like 5 foot 10 or 178 centimeters." },
  { field: "weight", question: "And your weight? Something like 75 kilos or 165 pounds." },
  { field: "wake_time", question: "What time do you usually wake up?" },
  { field: "bedtime", question: "And when do you go to bed?" },
  { field: "activity_level", question: "How would you describe your activity level? Sedentary, light, moderate, active, or very active?" },
  { field: "goals", question: "What are your main health goals? You can mention things like better sleep, more hydration, building habits — whatever matters to you." },
  { field: "notifications", question: "Last thing — would you like reminders for hydration, sleep, or habits?" },
];

export default function VoiceSetupScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [orbState, setOrbState] = useState<"idle" | "listening" | "speaking" | "processing">("idle");
  const [transcript, setTranscript] = useState("");
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { isRecording, isTranscribing, startRecording, stopRecording, speakText } = useVoice();
  const setProfile = useUserStore((s) => s.setProfile);
  const speakTimeout = useRef<NodeJS.Timeout>();
  const step = STEPS[currentStep];

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    setChatMessages((prev) => [...prev, { role, content }]);
  }, []);

  const speakQuestion = useCallback(async (text: string) => {
    setOrbState("speaking");
    await speakText(text);
    setTimeout(() => setOrbState("listening"), 500);
  }, [speakText]);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        speakQuestion(STEPS[currentStep].question);
        addMessage("assistant", STEPS[currentStep].question);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      completeOnboarding();
    }
  }, [currentStep]);

  const handleRecord = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setTranscript(text);
        addMessage("user", text);
        processAnswer(text);
      }
    } else {
      setTranscript("");
      startRecording();
    }
  };

  const processAnswer = async (text: string) => {
    setOrbState("processing");

    // Handle skip
    if (text.toLowerCase().includes("skip") || text.toLowerCase().includes("not sure")) {
      addMessage("assistant", "No problem! Let's move on.");
      setOrbState("idle");
      setTimeout(() => setCurrentStep((prev) => prev + 1), 1500);
      return;
    }

    try {
      const result = await parseVoiceInput(text, step.field);
      if (result.confidence === "high" && result.value !== null) {
        setProfileData((prev) => ({ ...prev, [step.field]: result.value }));
        addMessage("assistant", `Got it — ${result.value}.`);
        setOrbState("idle");
        setTimeout(() => setCurrentStep((prev) => prev + 1), 2000);
        return;
      }
    } catch {}

    addMessage("assistant", "Sorry, I didn't catch that — could you say that again?");
    setOrbState("idle");
  };

  const handleSkip = () => {
    addMessage("user", "Skip");
    addMessage("assistant", "No problem! Let's continue.");
    setTimeout(() => setCurrentStep((prev) => prev + 1), 1000);
  };

  const completeOnboarding = async () => {
    setIsComplete(true);
    setOrbState("speaking");
    addMessage("assistant", `Perfect, ${profileData.name || "friend"}. I've got everything I need. Your profile is ready. Let's get started!`);
    await speakText(`Perfect, ${profileData.name || "friend"}. I've got everything I need. Your profile is ready. Let's get started!`);

    setProfile({
      name: profileData.name || "User",
      age: parseInt(profileData.age) || 25,
      gender: profileData.gender || "not specified",
      height: profileData.height || "not specified",
      weight: profileData.weight || "not specified",
      wake_time: profileData.wake_time || "7:00 AM",
      bedtime: profileData.bedtime || "11:00 PM",
      activity_level: profileData.activity_level || "moderate",
      goals: profileData.goals ? profileData.goals.split(",").map((g: string) => g.trim()) : [],
      water_goal_ml: 2500,
      sleep_goal_hours: 8,
      onboarding_complete: true,
      onboarding_method: "voice",
    });

    setTimeout(() => router.replace("/(tabs)"), 2000);
  };

  return (
    <View className="flex-1 bg-lumina-bg-primary">
      {/* Header */}
      <View className="pt-16 px-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
        </TouchableOpacity>
        <Text className="text-lumina-text-muted text-sm">
          {currentStep + 1} of {STEPS.length}
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(onboarding)/personal")}>
          <Text className="text-lumina-accent-purple text-sm">Text Setup</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View className="px-6 mt-4">
        <View className="bg-lumina-bg-secondary rounded-full h-1">
          <View
            className="bg-lumina-accent-purple rounded-full h-full"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </View>
      </View>

      {/* Chat */}
      <ScrollView
        className="flex-1 px-6 mt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ref={(ref) => ref?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
      </ScrollView>

      {/* Orb */}
      <View className="items-center py-4">
        <LuminaOrb state={orbState} size={100} />
        {isTranscribing && (
          <Text className="text-lumina-text-muted text-sm mt-2">Transcribing...</Text>
        )}
        {isRecording && (
          <Text className="text-lumina-accent-coral text-sm mt-2">Recording...</Text>
        )}
      </View>

      {/* Controls */}
      <View className="px-8 pb-12 items-center">
        {!isComplete && (
          <>
            <TouchableOpacity
              onPress={handleRecord}
              className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                isRecording ? "bg-lumina-accent-coral" : "bg-lumina-accent-purple"
              }`}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={28}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-lumina-text-muted text-sm">Skip this question</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
