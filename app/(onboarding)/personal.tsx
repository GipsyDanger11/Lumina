import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useUserStore } from "../store/useUserStore";

export default function PersonalScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const setProfile = useUserStore((s) => s.setProfile);

  const genders = ["Male", "Female", "Prefer not to say"];

  const handleNext = () => {
    setProfile({
      name,
      age: parseInt(age) || 0,
      gender,
      height,
      weight,
      wake_time: "",
      bedtime: "",
      activity_level: "",
      goals: [],
      water_goal_ml: 2500,
      sleep_goal_hours: 8,
      onboarding_complete: false,
      onboarding_method: "text",
    });
    router.push("/(onboarding)/lifestyle");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 32, paddingTop: 64 }}>
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          {/* Progress */}
          <View style={{ backgroundColor: "#12121A", borderRadius: 999, height: 4, marginBottom: 32 }}>
            <View style={{ backgroundColor: "#7C6FF7", borderRadius: 999, height: "100%", width: "25%" }} />
          </View>

          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 8 }}>
            About you
          </Text>
          <Text style={{ color: "#A0A0B0", fontSize: 16, marginBottom: 32 }}>
            Step 1 of 4 — Let's get to know you
          </Text>

          <Input
            label="Full Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Age"
            placeholder="Your age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          {/* Gender */}
          <Text style={{ color: "#A0A0B0", fontSize: 14, marginBottom: 8, fontWeight: "500" }}>Gender</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: gender === g ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                  alignItems: "center",
                  backgroundColor: gender === g ? "rgba(124, 111, 247, 0.2)" : "#1A1A24",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: gender === g ? "#7C6FF7" : "#A0A0B0",
                  }}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Unit toggle */}
          <View style={{ flexDirection: "row", backgroundColor: "#1A1A24", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {(["metric", "imperial"] as const).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: unit === u ? "#7C6FF7" : "transparent",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "500", color: unit === u ? "#FFFFFF" : "#5A5A6E" }}>
                  {u === "metric" ? "Metric (cm/kg)" : "Imperial (ft/lbs)"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label={`Height (${unit === "metric" ? "cm" : "ft/in"})`}
            placeholder={unit === "metric" ? "175" : "5'10\""}
            value={height}
            onChangeText={setHeight}
          />

          <Input
            label={`Weight (${unit === "metric" ? "kg" : "lbs"})`}
            placeholder={unit === "metric" ? "70" : "154"}
            value={weight}
            onChangeText={setWeight}
          />

          <Button
            title="Continue"
            onPress={handleNext}
            disabled={!name || !age}
            style={{ marginTop: 16, marginBottom: 32 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
