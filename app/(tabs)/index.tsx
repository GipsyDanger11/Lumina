import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useHealth } from "../../hooks/useHealth";
import { useUserStore } from "../../store/useUserStore";
import { HydrationCard } from "../../components/cards/HydrationCard";
import { SleepCard } from "../../components/cards/SleepCard";
import { HabitsCard } from "../../components/cards/HabitsCard";
import { NutritionCard } from "../../components/cards/NutritionCard";
import { StreakCard } from "../../components/cards/StreakCard";
import { InsightCard } from "../../components/cards/InsightCard";
import { T } from "../../lib/theme";

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

  const completedHabits = Object.values(habitLogs).filter((v) => v === "completed").length;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const quickActions = [
    { label: "+Water", icon: "water" as const, color: T.accent.teal, route: "/(tabs)/hydration" },
    { label: "+Sleep", icon: "moon" as const, color: T.accent.purple, route: "/(tabs)/sleep" },
    { label: "+Habit", icon: "checkmark-circle" as const, color: T.accent.coral, route: "/(tabs)/habits" },
    { label: "Ask AI", icon: "sparkles" as const, color: T.accent.gold, route: "/(tabs)/companion" },
  ];

  return (
    <View style={S_screen}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={T.accent.purple} />
        }
        contentContainerStyle={S_scrollContent}
      >
        {/* Header */}
        <View style={S_header}>
          <View>
            <Text style={S_greeting}>{getGreeting()}</Text>
            <Text style={S_name}>{profile?.name || "there"}</Text>
          </View>
          <TouchableOpacity
            style={S_bellContainer}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <View style={S_bellGlow} />
            <Ionicons name="notifications-outline" size={22} color={T.text.secondary} />
            <View style={S_bellDot} />
          </TouchableOpacity>
        </View>

        <Text style={S_dateLine}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {/* Stats Grid - 2x2 */}
        <View style={S_grid}>
          <View style={S_gridRow}>
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
          <View style={S_gridRow}>
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
        </View>

        {/* Streak */}
        <StreakCard days={streak} />

        {/* Today's Insights */}
        <InsightCard
          text={insight}
          onRefresh={() => setInsight("Analyzing your data...")}
        />

        {/* Quick Actions */}
        <View style={S_quickActions}>
          <View style={S_quickActionsInner}>
            <View style={S_quickActionsHeader}>
              <Ionicons name="flash" size={14} color={T.accent.gold} />
              <Text style={S_quickActionsTitle}>Quick Actions</Text>
            </View>
            <View style={S_actionsRow}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  onPress={() => router.push(action.route as any)}
                  style={S_actionItem}
                  activeOpacity={0.7}
                >
                  <View style={S_actionCircleOuter}>
                    <View style={[S_actionCircleGlow, { backgroundColor: `${action.color}25` }]} />
                    <View style={[S_actionCircle, { backgroundColor: `${action.color}18` }]}>
                      <Ionicons name={action.icon} size={22} color={action.color} />
                    </View>
                  </View>
                  <Text style={S_actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const S_screen = {
  flex: 1,
  backgroundColor: T.bg.primary,
};

const S_scrollContent = {
  paddingHorizontal: 20,
  paddingBottom: 120,
};

const S_header = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
  paddingTop: Platform.OS === "ios" ? 60 : 44,
  paddingBottom: 4,
};

const S_greeting = {
  color: T.text.muted,
  fontSize: 14,
  fontWeight: "500" as const,
};

const S_name = {
  color: T.text.primary,
  fontSize: 28,
  fontWeight: "800" as const,
  letterSpacing: -0.5,
  marginTop: 2,
};

const S_bellContainer = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: T.bg.card,
  borderWidth: 1,
  borderColor: T.glass.border,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  overflow: "hidden" as const,
};

const S_bellGlow = {
  ...Platform.select({
    ios: {
      shadowColor: T.accent.purple,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
  }),
};

const S_bellDot = {
  position: "absolute" as const,
  top: 10,
  right: 12,
  width: 7,
  height: 7,
  borderRadius: 3.5,
  backgroundColor: T.accent.coral,
  borderWidth: 1.5,
  borderColor: T.bg.card,
};

const S_dateLine = {
  color: T.text.muted,
  fontSize: 13,
  fontWeight: "500" as const,
  marginBottom: 24,
  marginLeft: 4,
};

const S_grid = {
  gap: 12,
  marginBottom: 12,
};

const S_gridRow = {
  flexDirection: "row" as const,
  gap: 12,
};



const S_quickActions = {
  borderRadius: 20,
  overflow: "hidden" as const,
  borderWidth: 1,
  borderColor: T.glass.border,
  backgroundColor: T.glass.bg,
  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),
};

const S_quickActionsInner = {
  padding: 16,
};

const S_quickActionsHeader = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 6,
  marginBottom: 16,
};

const S_quickActionsTitle = {
  color: T.text.secondary,
  fontSize: 12,
  fontWeight: "600" as const,
  letterSpacing: 0.5,
  textTransform: "uppercase" as const,
};

const S_actionsRow = {
  flexDirection: "row" as const,
  justifyContent: "space-between" as const,
};

const S_actionItem = {
  alignItems: "center" as const,
  gap: 8,
};

const S_actionCircleOuter = {
  position: "relative" as const,
};

const S_actionCircleGlow = {
  position: "absolute" as const,
  inset: -6,
  borderRadius: 30,
};

const S_actionCircle = {
  width: 52,
  height: 52,
  borderRadius: 26,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderWidth: 1,
  borderColor: T.glass.border,
};

const S_actionLabel = {
  color: T.text.muted,
  fontSize: 11,
  fontWeight: "500" as const,
};
