import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LuminaOrb } from "../components/companion/LuminaOrb";

export default function OnboardingMethodScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F", paddingHorizontal: 32, paddingTop: 64 }}>
      <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", textAlign: "center", marginBottom: 8 }}>
        How would you like to set up?
      </Text>
      <Text style={{ color: "#A0A0B0", textAlign: "center", marginBottom: 48 }}>
        Choose how to tell LuminaAI about yourself
      </Text>

      {/* Voice Setup Option */}
      <TouchableOpacity
        onPress={() => router.push("/(onboarding)/voice-setup")}
        style={{ backgroundColor: "#1A1A24", borderWidth: 1, borderColor: "rgba(124, 111, 247, 0.3)", borderRadius: 24, padding: 24, marginBottom: 16 }}
        activeOpacity={0.7}
      >
        <View style={{ alignItems: "center" }}>
          <LuminaOrb state="idle" size={60} />
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginTop: 16, marginBottom: 8 }}>
            Set up with LuminaAI
          </Text>
          <Text style={{ color: "#A0A0B0", fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 12 }}>
            Talk to LuminaAI and she'll get to know you. Just speak naturally — she'll ask what she needs.
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["Hands-free", "Natural", "Recommended"].map((tag) => (
              <View key={tag} style={{ backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ color: "#7C6FF7", fontSize: 12, fontWeight: "500" }}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>

      {/* Text Setup Option */}
      <TouchableOpacity
        onPress={() => router.push("/(onboarding)/personal")}
        style={{ backgroundColor: "#1A1A24", borderWidth: 1, borderColor: "rgba(90, 90, 110, 0.2)", borderRadius: 24, padding: 24 }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ width: 56, height: 56, backgroundColor: "#12121A", borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="document-text" size={28} color="#A0A0B0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 4 }}>
              Set up manually
            </Text>
            <Text style={{ color: "#A0A0B0", fontSize: 14 }}>
              Fill in your details step by step.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
