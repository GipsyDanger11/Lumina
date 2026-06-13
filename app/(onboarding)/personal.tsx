import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { T } from "../../lib/theme";
import { useUserStore } from "../../store/useUserStore";

export default function PersonalScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  const renderInput = (
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (v: string) => void,
    fieldKey: string,
    opts?: { keyboardType?: any; icon?: string }
  ) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: T.text.secondary, fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: T.glass.bg,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: focusedField === fieldKey ? T.accent.purple : T.glass.border,
          paddingHorizontal: 16,
          height: 52,
        }}
      >
        {opts?.icon && (
          <Ionicons
            name={opts.icon as any}
            size={18}
            color={focusedField === fieldKey ? T.accent.purpleLight : T.text.muted}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          style={{ flex: 1, color: T.text.primary, fontSize: 16 }}
          placeholder={placeholder}
          placeholderTextColor={T.text.muted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={opts?.keyboardType}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: T.bg.primary }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 60 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: T.bg.card,
              borderWidth: 1,
              borderColor: T.glass.border,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Ionicons name="chevron-back" size={22} color={T.text.secondary} />
          </TouchableOpacity>

          {/* Progress */}
          <View style={{ backgroundColor: T.bg.elevated, borderRadius: 999, height: 4, marginBottom: 32, overflow: "hidden" }}>
            <LinearGradient colors={T.gradient.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 999, height: "100%", width: "25%" }} />
          </View>

          <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 }}>
            About you
          </Text>
          <Text style={{ color: T.text.muted, fontSize: 15, marginBottom: 32, lineHeight: 22 }}>
            Step 1 of 4 {"\u2014"} Let's get to know you
          </Text>

          {renderInput("Full Name", "Your name", name, setName, "name", { icon: "person-outline" })}
          {renderInput("Age", "Your age", age, setAge, "age", { keyboardType: "numeric", icon: "calendar-outline" })}

          {/* Gender */}
          <Text style={{ color: T.text.secondary, fontSize: 14, fontWeight: "600", marginBottom: 10 }}>Gender</Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: gender === g ? T.accent.purple : T.glass.border,
                  alignItems: "center",
                  backgroundColor: gender === g ? "rgba(124, 111, 247, 0.15)" : T.glass.bg,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: gender === g ? T.accent.purpleLight : T.text.muted }}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Unit toggle */}
          <View style={{ flexDirection: "row", backgroundColor: T.bg.elevated, borderRadius: 14, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: T.glass.border }}>
            {(["metric", "imperial"] as const).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", backgroundColor: unit === u ? T.accent.purple : "transparent" }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: unit === u ? "#FFFFFF" : T.text.muted }}>
                  {u === "metric" ? "Metric (cm/kg)" : "Imperial (ft/lbs)"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderInput(
            "Height (" + (unit === "metric" ? "cm" : "ft/in") + ")",
            unit === "metric" ? "175" : "5'10\"",
            height,
            setHeight,
            "height",
            { icon: "resize-outline" }
          )}
          {renderInput(
            "Weight (" + (unit === "metric" ? "kg" : "lbs") + ")",
            unit === "metric" ? "70" : "154",
            weight,
            setWeight,
            "weight",
            { icon: "barbell-outline" }
          )}

          <TouchableOpacity
            onPress={handleNext}
            disabled={!name || !age}
            activeOpacity={0.8}
            style={{ marginTop: 8, marginBottom: 40, opacity: !name || !age ? 0.5 : 1 }}
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
