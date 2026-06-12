import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHealth } from "../hooks/useHealth";
import { useUserStore } from "../store/useUserStore";
import { HydrationCard } from "../components/cards/HydrationCard";
import { SleepCard } from "../components/cards/SleepCard";
import { HabitsCard } from "../components/cards/HabitsCard";
import { NutritionCard } from "../components/cards/NutritionCard";
import { StreakCard } from "../components/cards/StreakCard";
import { InsightCard } from "../components/cards/InsightCard";
import { DashboardSkeleton } from "../components/ui/LoadingSkeleton";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [insight, setInsight] = useState("Loading your daily insight...");
  const profile = useUserStore((s) => s.profile);
  const { totalWaterMl, sleep, habits, habitLogs, meals, streak } = useHealth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toISOString().split("T")[0];
  const completedHabits = Object.values(habitLogs).filter((v) => v === "completed").length;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      className="flex-1 bg-lumina-bg-primary"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C6FF7" />
      }
    >
      {/* Header */}
      <View className="pt-16 px-6 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lumina-text-primary text-2xl font-bold">
              {getGreeting()}, {profile?.name || "there"}
            </Text>
            <Text className="text-lumina-text-secondary text-sm mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity className="p-2">
            <Ionicons name="notifications-outline" size={24} color="#A0A0B0" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-6 gap-4 pb-8">
        {/* Insight Card */}
        <InsightCard text={insight} onRefresh={() => setInsight("Analyzing your data...")} />

        {/* Stats Grid */}
        <View className="flex-row gap-3">
          <HydrationCard
            currentMl={totalWaterMl}
            goalMl={2500}
            onPress={() => router.push("/(tabs)/hydration")}
          />
          <SleepCard
            hours={sleep?.hours || null}
            quality={sleep?.quality}
            onPress={() => router.push("/(tabs)/sleep")}
          />
        </View>

        <View className="flex-row gap-3">
          <HabitsCard
            completed={completedHabits}
            total={habits.length}
            onPress={() => router.push("/(tabs)/habits")}
          />
          <NutritionCard
            mealsCount={meals.length}
            onPress={() => router.push("/(tabs)/nutrition")}
          />
        </View>

        {/* Streak */}
        <StreakCard days={streak} />

        {/* Quick Actions */}
        <View className="bg-lumina-bg-card rounded-2xl p-4">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Quick Actions</Text>
          <View className="flex-row justify-between">
            {[
              { label: "+Water", icon: "water", color: "#4ECDC4", route: "/(tabs)/hydration" },
              { label: "+Sleep", icon: "moon", color: "#7C6FF7", route: "/(tabs)/sleep" },
              { label: "+Habit", icon: "checkmark-circle", color: "#FF6B6B", route: "/(tabs)/habits" },
              { label: "Ask AI", icon: "sparkles", color: "#FFD93D", route: "/(tabs)/companion" },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => router.push(action.route as any)}
                className="items-center gap-1.5"
                activeOpacity={0.7}
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text className="text-lumina-text-secondary text-[10px] font-medium">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
