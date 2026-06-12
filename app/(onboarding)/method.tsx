import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LuminaOrb } from "../components/companion/LuminaOrb";

export default function OnboardingMethodScreen() {
  return (
    <View className="flex-1 bg-lumina-bg-primary px-8 pt-16">
      <Text className="text-lumina-text-primary text-3xl font-bold text-center mb-2">
        How would you like to set up?
      </Text>
      <Text className="text-lumina-text-secondary text-center mb-12">
        Choose how to tell LuminaAI about yourself
      </Text>

      {/* Voice Setup Option */}
      <TouchableOpacity
        onPress={() => router.push("/(onboarding)/voice-setup")}
        className="bg-lumina-bg-card border border-lumina-accent-purple/30 rounded-3xl p-6 mb-4"
        activeOpacity={0.7}
      >
        <View className="items-center">
          <LuminaOrb state="idle" size={60} />
          <Text className="text-lumina-text-primary text-xl font-bold mt-4 mb-2">
            Set up with LuminaAI
          </Text>
          <Text className="text-lumina-text-secondary text-sm text-center leading-5 mb-3">
            Talk to LuminaAI and she'll get to know you. Just speak naturally — she'll ask what she needs.
          </Text>
          <View className="flex-row gap-2">
            {["Hands-free", "Natural", "Recommended"].map((tag) => (
              <View key={tag} className="bg-lumina-accent-purple/20 rounded-full px-3 py-1">
                <Text className="text-lumina-accent-purple text-xs font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>

      {/* Text Setup Option */}
      <TouchableOpacity
        onPress={() => router.push("/(onboarding)/personal")}
        className="bg-lumina-bg-card border border-lumina-text-muted/20 rounded-3xl p-6"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-4">
          <View className="w-14 h-14 bg-lumina-bg-secondary rounded-2xl items-center justify-center">
            <Ionicons name="document-text" size={28} color="#A0A0B0" />
          </View>
          <View className="flex-1">
            <Text className="text-lumina-text-primary text-lg font-bold mb-1">
              Set up manually
            </Text>
            <Text className="text-lumina-text-secondary text-sm">
              Fill in your details step by step.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
