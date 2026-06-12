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
    <View className="flex-1 bg-lumina-bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-8 pt-16">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Ionicons name="chevron-back" size={24} color="#A0A0B0" />
          </TouchableOpacity>

          {/* Progress */}
          <View className="bg-lumina-bg-secondary rounded-full h-1 mb-8">
            <View className="bg-lumina-accent-purple rounded-full h-full w-1/4" />
          </View>

          <Text className="text-lumina-text-primary text-3xl font-bold mb-2">
            About you
          </Text>
          <Text className="text-lumina-text-secondary text-base mb-8">
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
          <Text className="text-lumina-text-secondary text-sm mb-2 font-medium">Gender</Text>
          <View className="flex-row gap-2 mb-6">
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  gender === g
                    ? "bg-lumina-accent-purple/20 border-lumina-accent-purple"
                    : "bg-lumina-bg-card border-lumina-text-muted/20"
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-medium ${
                    gender === g ? "text-lumina-accent-purple" : "text-lumina-text-secondary"
                  }`}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Unit toggle */}
          <View className="flex-row bg-lumina-bg-card rounded-xl p-1 mb-6">
            {(["metric", "imperial"] as const).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                className={`flex-1 py-2.5 rounded-lg items-center ${
                  unit === u ? "bg-lumina-accent-purple" : ""
                }`}
              >
                <Text className={`text-sm font-medium ${unit === u ? "text-white" : "text-lumina-text-muted"}`}>
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
            className="mt-4 mb-8"
          />
        </View>
      </ScrollView>
    </View>
  );
}
