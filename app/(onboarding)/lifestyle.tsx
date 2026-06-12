import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/Button";
import { useUserStore } from "../store/useUserStore";
import { ActivityLevels } from "../../constants";

export default function LifestyleScreen() {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("23:00");
  const [activity, setActivity] = useState("");
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const times = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, "0");
    return [`${h}:00`, `${h}:30`];
  }).flat();

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
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 32, paddingTop: 64 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          <View style={{ backgroundColor: "#12121A", borderRadius: 999, height: 4, marginBottom: 32 }}>
            <View style={{ backgroundColor: "#7C6FF7", borderRadius: 999, height: "100%", width: "50%" }} />
          </View>

          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 8 }}>Your routine</Text>
          <Text style={{ color: "#A0A0B0", fontSize: 16, marginBottom: 32 }}>
            Step 2 of 4 — Tell us about your daily schedule
          </Text>

          {/* Wake Time */}
          <Text style={{ color: "#A0A0B0", fontSize: 14, marginBottom: 8, fontWeight: "500" }}>Wake Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["05:00", "06:00", "06:30", "07:00", "07:30", "08:00", "09:00"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setWakeTime(t)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: wakeTime === t ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                    backgroundColor: wakeTime === t ? "rgba(124, 111, 247, 0.2)" : "#1A1A24",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "500", color: wakeTime === t ? "#7C6FF7" : "#A0A0B0" }}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Bedtime */}
          <Text style={{ color: "#A0A0B0", fontSize: 14, marginBottom: 8, fontWeight: "500" }}>Bedtime</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setBedTime(t)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: bedTime === t ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                    backgroundColor: bedTime === t ? "rgba(124, 111, 247, 0.2)" : "#1A1A24",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "500", color: bedTime === t ? "#7C6FF7" : "#A0A0B0" }}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Activity Level */}
          <Text style={{ color: "#A0A0B0", fontSize: 14, marginBottom: 12, fontWeight: "500" }}>Activity Level</Text>
          <View style={{ gap: 8, marginBottom: 32 }}>
            {ActivityLevels.map((level: any) => (
              <TouchableOpacity
                key={level.value}
                onPress={() => setActivity(level.value)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderColor: activity === level.value ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                  backgroundColor: activity === level.value ? "rgba(124, 111, 247, 0.2)" : "#1A1A24",
                }}
              >
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: activity === level.value ? "#7C6FF7" : "#FFFFFF" }}>
                    {level.label}
                  </Text>
                  <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 2 }}>{level.description}</Text>
                </View>
                {activity === level.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#7C6FF7" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button title="Continue" onPress={handleNext} disabled={!activity} style={{ marginBottom: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
}
