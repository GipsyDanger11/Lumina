import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { T } from "../../lib/theme";
import { LuminaOrb } from "../../components/companion/LuminaOrb";

export default function OnboardingMethodScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: T.bg.primary }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 64,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <Text
            style={{
              color: T.text.primary,
              fontSize: 28,
              fontWeight: "800",
              letterSpacing: -0.5,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            How would you like{"\n"}to set up?
          </Text>
          <Text
            style={{
              color: T.text.muted,
              fontSize: 15,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Choose how to tell LuminaAI about yourself
          </Text>
        </View>

        {/* Voice Setup Option */}
        <TouchableOpacity
          onPress={() => router.push("/(onboarding)/voice-setup")}
          activeOpacity={0.7}
          style={{ marginBottom: 16 }}
        >
          <LinearGradient
            colors={["rgba(124, 111, 247, 0.15)", "rgba(124, 111, 247, 0.05)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(124, 111, 247, 0.3)",
              padding: 28,
              ...Platform.select({
                ios: {
                  shadowColor: T.accent.purple,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.25,
                  shadowRadius: 24,
                },
                android: { elevation: 10 },
              }),
            }}
          >
            <View style={{ alignItems: "center" }}>
              <LuminaOrb state="idle" size={64} />
              <Text
                style={{
                  color: T.text.primary,
                  fontSize: 20,
                  fontWeight: "700",
                  marginTop: 18,
                  marginBottom: 8,
                }}
              >
                Set up with LuminaAI
              </Text>
              <Text
                style={{
                  color: T.text.muted,
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 21,
                  marginBottom: 16,
                  paddingHorizontal: 8,
                }}
              >
                Talk to LuminaAI and she'll get to know you. Just speak naturally
                — she'll ask what she needs.
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["Hands-free", "Natural", "Recommended"].map((tag) => (
                  <View
                    key={tag}
                    style={{
                      backgroundColor: "rgba(124, 111, 247, 0.2)",
                      borderRadius: 999,
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderWidth: 1,
                      borderColor: "rgba(124, 111, 247, 0.3)",
                    }}
                  >
                    <Text
                      style={{
                        color: T.accent.purpleLight,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Text Setup Option */}
        <TouchableOpacity
          onPress={() => router.push("/(onboarding)/personal")}
          activeOpacity={0.7}
        >
          <View
            style={{
              backgroundColor: T.glass.bg,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: T.glass.border,
              padding: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                },
                android: { elevation: 6 },
              }),
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: T.bg.elevated,
                borderWidth: 1,
                borderColor: T.glass.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="document-text" size={26} color={T.text.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: T.text.primary,
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 4,
                }}
              >
                Set up manually
              </Text>
              <Text
                style={{
                  color: T.text.muted,
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                Fill in your details step by step
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={T.text.muted}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
