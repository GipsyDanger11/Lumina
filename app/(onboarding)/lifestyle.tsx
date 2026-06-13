import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { T } from "../../lib/theme";
import { useUserStore } from "../../store/useUserStore";
import { ActivityLevels } from "../../constants";

const ACTIVITY_ICONS: Record<string, string> = {
  sedentary: "bed-outline",
  light: "walk-outline",
  moderate: "bicycle-outline",
  active: "fitness-outline",
  very_active: "flash-outline",
};

export default function LifestyleScreen() {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("23:00");
  const [activity, setActivity] = useState("");
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const wakeTimes = ["05:00", "06:00", "06:30", "07:00", "07:30", "08:00", "09:00"];
  const bedTimes = ["21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00"];

  const handleNext = () => {
    setProfile({
      ...profile!,
      wake_time: wakeTime,
      bedtime: bedTime,
      activity_level: activity,
    });
    router.push("/(onboarding)/goals");
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg.primary }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 60 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: T.bg.card, borderWidth: 1, borderColor: T.glass.border, alignItems: "center", justifyContent: "center", marginBottom: 24 }}
          >
            <Ionicons name="chevron-back" size={22} color={T.text.secondary} />
          </TouchableOpacity>

          <View style={{ backgroundColor: T.bg.elevated, borderRadius: 999, height: 4, marginBottom: 32, overflow: "hidden" }}>
            <LinearGradient colors={T.gradient.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 999, height: "100%", width: "50%" }} />
          </View>

          <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 }}>
            Your routine
          </Text>
          <Text style={{ color: T.text.muted, fontSize: 15, marginBottom: 32, lineHeight: 22 }}>
            Step 2 of 4 {"\u2014"} Tell us about your daily schedule
          </Text>

          {/* Wake Time */}
          <Text style={{ color: T.text.secondary, fontSize: 14, fontWeight: "600", marginBottom: 10 }}>Wake Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 28 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {wakeTimes.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setWakeTime(t)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: wakeTime === t ? T.accent.purple : T.glass.border,
                    backgroundColor: wakeTime === t ? "rgba(124, 111, 247, 0.15)" : T.glass.bg,
                    minWidth: 64,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="sunny-outline"
                    size={16}
                    color={wakeTime === t ? T.accent.gold : T.text.muted}
                    style={{ marginBottom: 6 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: wakeTime === t ? T.accent.purpleLight : T.text.muted }}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Bedtime */}
          <Text style={{ color: T.text.secondary, fontSize: 14, fontWeight: "600", marginBottom: 10 }}>Bedtime</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {bedTimes.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setBedTime(t)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: bedTime === t ? T.accent.purple : T.glass.border,
                    backgroundColor: bedTime === t ? "rgba(124, 111, 247, 0.15)" : T.glass.bg,
                    minWidth: 64,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="moon-outline"
                    size={16}
                    color={bedTime === t ? T.accent.purpleLight : T.text.muted}
                    style={{ marginBottom: 6 }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: bedTime === t ? T.accent.purpleLight : T.text.muted }}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Activity Level */}
          <Text style={{ color: T.text.secondary, fontSize: 14, fontWeight: "600", marginBottom: 12 }}>Activity Level</Text>
          <View style={{ gap: 10, marginBottom: 36 }}>
            {ActivityLevels.map((level: any) => (
              <TouchableOpacity
                key={level.value}
                onPress={() => setActivity(level.value)}
                activeOpacity={0.7}
                style={{
                  padding: 18,
                  borderRadius: 18,
                  borderWidth: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderColor: activity === level.value ? T.accent.purple : T.glass.border,
                  backgroundColor: activity === level.value ? "rgba(124, 111, 247, 0.15)" : T.glass.bg,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: activity === level.value ? "rgba(124, 111, 247, 0.2)" : T.bg.elevated,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={(ACTIVITY_ICONS[level.value] || "ellipse") as any}
                      size={20}
                      color={activity === level.value ? T.accent.purpleLight : T.text.muted}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: activity === level.value ? T.accent.purpleLight : T.text.primary }}>
                      {level.label}
                    </Text>
                    <Text style={{ color: T.text.muted, fontSize: 12, marginTop: 2 }}>{level.description}</Text>
                  </View>
                </View>
                {activity === level.value && (
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: T.accent.purple, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            disabled={!activity}
            activeOpacity={0.8}
            style={{ marginBottom: 40, opacity: !activity ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={T.gradient.purple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                ...Platform.select({
                  ios: { shadowColor: T.accent.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
                  android: { elevation: 8 },
                }),
              }}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 }}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
