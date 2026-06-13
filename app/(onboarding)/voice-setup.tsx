import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { T } from "../../lib/theme";
import { LuminaOrb } from "../../components/companion/LuminaOrb";
import { ChatBubble } from "../../components/companion/ChatBubble";
import { useVoice } from "../../hooks/useVoice";
import { parseVoiceInput } from "../../lib/mistral";
import { useUserStore } from "../../store/useUserStore";

interface OnboardingStep {
  field: string;
  question: string;
}

const STEPS: OnboardingStep[] = [
  { field: "name", question: "Hi, I'm LuminaAI. I'm going to be your personal health companion. Let's start \u2014 what's your name?" },
  { field: "age", question: "Nice to meet you! How old are you?" },
  { field: "gender", question: "And your gender? You can say male, female, or prefer not to say." },
  { field: "height", question: "Got it. What's your height? You can say something like 5 foot 10 or 178 centimeters." },
  { field: "weight", question: "And your weight? Something like 75 kilos or 165 pounds." },
  { field: "wake_time", question: "What time do you usually wake up?" },
  { field: "bedtime", question: "And when do you go to bed?" },
  { field: "activity_level", question: "How would you describe your activity level? Sedentary, light, moderate, active, or very active?" },
  { field: "goals", question: "What are your main health goals? You can mention things like better sleep, more hydration, building habits \u2014 whatever matters to you." },
  { field: "notifications", question: "Last thing \u2014 would you like reminders for hydration, sleep, or habits?" },
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
  const step = STEPS[currentStep];

  const pulseAnim = useSharedValue(1);
  const recordPulse = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    if (isRecording) {
      recordPulse.value = withRepeat(
        withTiming(1.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      recordPulse.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(
    () => ({ transform: [{ scale: pulseAnim.value }] }),
    [pulseAnim]
  );

  const recordPulseStyle = useAnimatedStyle(
    () => ({ transform: [{ scale: recordPulse.value }] }),
    [recordPulse]
  );

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
        addMessage("assistant", "Got it \u2014 " + result.value + ".");
        setOrbState("idle");
        setTimeout(() => setCurrentStep((prev) => prev + 1), 2000);
        return;
      }
    } catch {}
    addMessage("assistant", "Sorry, I didn't catch that \u2014 could you say that again?");
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
    const name = profileData.name || "friend";
    addMessage("assistant", "Perfect, " + name + ". I've got everything I need. Your profile is ready. Let's get started!");
    await speakText("Perfect, " + name + ". I've got everything I need. Your profile is ready. Let's get started!");

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
    <View style={{ flex: 1, backgroundColor: T.bg.primary }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: T.bg.card, borderWidth: 1, borderColor: T.glass.border, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="chevron-back" size={20} color={T.text.secondary} />
        </TouchableOpacity>
        <Text style={{ color: T.text.muted, fontSize: 13, fontWeight: "600", letterSpacing: 0.5 }}>
          {currentStep + 1} / {STEPS.length}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(onboarding)/personal")}
          style={{ backgroundColor: "rgba(124, 111, 247, 0.15)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(124, 111, 247, 0.3)" }}
        >
          <Text style={{ color: T.accent.purpleLight, fontSize: 13, fontWeight: "600" }}>Text Setup</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
        <View style={{ backgroundColor: T.bg.elevated, borderRadius: 999, height: 4, overflow: "hidden" }}>
          <LinearGradient
            colors={T.gradient.purple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 999, height: "100%", width: (((currentStep + 1) / STEPS.length) * 100) as any }}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24, marginTop: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ref={(ref) => ref?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
      </ScrollView>

      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <Animated.View style={pulseStyle}>
          <LuminaOrb state={orbState} size={90} />
        </Animated.View>
        {isTranscribing && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: T.accent.teal }} />
            <Text style={{ color: T.text.muted, fontSize: 13, fontWeight: "500" }}>Transcribing...</Text>
          </View>
        )}
        {isRecording && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: T.accent.coral }} />
            <Text style={{ color: T.accent.coral, fontSize: 13, fontWeight: "500" }}>Recording...</Text>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 32, paddingBottom: 48, alignItems: "center" }}>
        {!isComplete && (
          <>
            <Animated.View style={recordPulseStyle}>
              <TouchableOpacity
                onPress={handleRecord}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  backgroundColor: isRecording ? T.accent.coral : "transparent",
                  borderWidth: isRecording ? 0 : 2,
                  borderColor: T.accent.purple,
                }}
                activeOpacity={0.7}
              >
                {isRecording ? (
                  <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: "#fff" }} />
                ) : (
                  <Ionicons name="mic" size={28} color={T.accent.purpleLight} />
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
              <Text style={{ color: T.text.muted, fontSize: 14, fontWeight: "500" }}>Skip this question</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
