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
      style={{ flex: 1, backgroundColor: "#0A0A0F" }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C6FF7" />
      }
    >
      {/* Header */}
      <View style={{ paddingTop: 64, paddingHorizontal: 24, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700" }}>
              {getGreeting()}, {profile?.name || "there"}
            </Text>
            <Text style={{ color: "#A0A0B0", fontSize: 14, marginTop: 4 }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity style={{ padding: 8 }}>
            <Ionicons name="notifications-outline" size={24} color="#A0A0B0" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, gap: 16, paddingBottom: 32 }}>
        {/* Insight Card */}
        <InsightCard text={insight} onRefresh={() => setInsight("Analyzing your data...")} />

        {/* Stats Grid */}
        <View style={{ flexDirection: "row", gap: 12 }}>
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

        <View style={{ flexDirection: "row", gap: 12 }}>
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
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16 }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Quick Actions</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {[
              { label: "+Water", icon: "water", color: "#4ECDC4", route: "/(tabs)/hydration" },
              { label: "+Sleep", icon: "moon", color: "#7C6FF7", route: "/(tabs)/sleep" },
              { label: "+Habit", icon: "checkmark-circle", color: "#FF6B6B", route: "/(tabs)/habits" },
              { label: "Ask AI", icon: "sparkles", color: "#FFD93D", route: "/(tabs)/companion" },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => router.push(action.route as any)}
                style={{ alignItems: "center", gap: 6 }}
                activeOpacity={0.7}
              >
                <View
                  style={{ width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: `${action.color}20` }}
                >
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text style={{ color: "#A0A0B0", fontSize: 10, fontWeight: "500" }}>
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
