import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGuestData } from "../hooks/useGuestData";
import { useUserStore } from "../store/useUserStore";
import { HydrationCard } from "../components/cards/HydrationCard";
import { SleepCard } from "../components/cards/SleepCard";
import { HabitsCard } from "../components/cards/HabitsCard";
import { NutritionCard } from "../components/cards/NutritionCard";
import { GuestBanner } from "../components/guest/GuestBanner";

export default function ExploreScreen() {
  const [showBanner, setShowBanner] = useState(true);
  const { hydrationTotal, habits, habitLogs } = useGuestData();
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = habitLogs[today] || {};
  const completedHabits = Object.values(todayLogs).filter((v) => v === "completed").length;

  const quickAddWater = async (amount: number) => {
    const { useGuestStore } = await import("../store/useGuestStore");
    useGuestStore.getState().addGuestWater({
      amount_ml: amount,
      beverage_type: "water",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <View className="flex-1 bg-lumina-bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-16 px-6 pb-4">
          <Text className="text-lumina-text-primary text-2xl font-bold">Explore Lumina</Text>
          <Text className="text-lumina-text-secondary text-sm mt-1">
            Sample data — sign in for the full experience
          </Text>
        </View>

        {/* Guest Banner */}
        {showBanner && (
          <GuestBanner
            onDismiss={() => setShowBanner(false)}
            onPress={() => router.push("/(auth)/login")}
          />
        )}

        {/* Dashboard Cards */}
        <View className="px-6 gap-4">
          <View className="flex-row gap-3">
            <HydrationCard currentMl={hydrationTotal} goalMl={2500} onPress={() => {}} />
            <SleepCard hours={7.5} quality="good" onPress={() => {}} />
          </View>

          <View className="flex-row gap-3">
            <HabitsCard completed={completedHabits} total={habits.length} onPress={() => {}} />
            <NutritionCard mealsCount={3} onPress={() => {}} />
          </View>

          {/* Quick Water Add */}
          <View className="bg-lumina-bg-card rounded-2xl p-4">
            <Text className="text-lumina-text-secondary text-xs font-medium mb-3">
              Quick Add Water
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {[150, 250, 350, 500].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => quickAddWater(amount)}
                  className="bg-lumina-bg-secondary border border-lumina-accent-teal/20 rounded-xl px-4 py-2.5"
                  activeOpacity={0.7}
                >
                  <Text className="text-lumina-accent-teal text-sm font-medium">{amount}ml</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* AI Companion Preview */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "AI Companion",
                "Sign in to chat with LuminaAI — your personal health companion.",
                [
                  { text: "Not now", style: "cancel" },
                  { text: "Sign In", onPress: () => router.push("/(auth)/login") },
                ]
              );
            }}
            className="bg-lumina-bg-card border border-lumina-accent-purple/20 rounded-2xl p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-lumina-accent-purple/20 rounded-full items-center justify-center">
                <Ionicons name="sparkles" size={20} color="#7C6FF7" />
              </View>
              <View className="flex-1">
                <Text className="text-lumina-text-primary text-sm font-semibold">
                  Chat with LuminaAI
                </Text>
                <Text className="text-lumina-text-muted text-xs">
                  Your AI health companion — sign in required
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#5A5A6E" />
            </View>
          </TouchableOpacity>

          {/* Sign In CTA */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            className="bg-lumina-accent-purple rounded-2xl py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">Sign Up Free</Text>
          </TouchableOpacity>

          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
}
