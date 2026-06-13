import React from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHealth } from "../../hooks/useHealth";
import { WeeklyBarChart } from "../../components/charts/WeeklyBarChart";
import { useUserStore } from "../../store/useUserStore";
import { T, S } from "../../lib/theme";

export default function ReportsScreen() {
  const { totalWaterMl, sleep, habits, habitLogs, meals, streak, weeklyHydration } = useHealth();
  const profile = useUserStore((s) => s.profile);
  const isGuest = useUserStore((s) => s.isGuest);
  const goal = profile?.water_goal_ml || 2500;

  const completedHabits = Object.values(habitLogs).filter((v) => v === "completed").length;
  const habitRate = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein_g || 0), 0);

  const avgWater = Object.values(weeklyHydration).length > 0
    ? Math.round(Object.values(weeklyHydration).reduce((a, b) => a + b, 0) / Math.max(Object.values(weeklyHydration).length, 1))
    : 0;

  return (
    <ScrollView style={S.screen} showsVerticalScrollIndicator={false}>
      <View style={S.scrollContent}>
        <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", marginBottom: 24, letterSpacing: -0.5 }}>
          Reports
        </Text>

        {/* Consistency Score */}
        <View style={{
          ...S.gradientCard([...T.gradient.purple]),
          backgroundColor: T.bg.card,
          alignItems: "center",
          paddingVertical: 28,
        }}>
          <Text style={{ color: T.text.muted, fontSize: 12, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
            Consistency Score
          </Text>
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: "rgba(124, 111, 247, 0.15)",
            alignItems: "center", justifyContent: "center",
            borderWidth: 3, borderColor: T.accent.purple,
            ...Platform.select({
              ios: { shadowColor: T.accent.purple, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20 },
              android: { elevation: 8 },
            }),
          }}>
            <Text style={{ color: T.accent.purple, fontSize: 36, fontWeight: "800" }}>{habitRate}</Text>
          </View>
          <Text style={{ color: T.text.muted, fontSize: 13, marginTop: 8 }}>habit completion rate</Text>
        </View>

        {/* Weekly Hydration */}
        <View style={S.glassCard()}>
          <Text style={S.sectionTitle}>This Week's Hydration</Text>
          {!isGuest && Object.keys(weeklyHydration).length > 0 ? (
            <WeeklyBarChart data={weeklyHydration} goal={goal} height={120} />
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(78, 205, 196, 0.12)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Ionicons name="water-outline" size={28} color={T.accent.teal} />
              </View>
              <Text style={{ color: T.text.muted, fontSize: 13 }}>No hydration data yet</Text>
            </View>
          )}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: T.glass.border }}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ color: T.accent.teal, fontSize: 20, fontWeight: "800" }}>{(totalWaterMl / 1000).toFixed(1)}L</Text>
              <Text style={{ color: T.text.muted, fontSize: 11, marginTop: 2 }}>today</Text>
            </View>
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ color: T.accent.teal, fontSize: 20, fontWeight: "800" }}>{(avgWater / 1000).toFixed(1)}L</Text>
              <Text style={{ color: T.text.muted, fontSize: 11, marginTop: 2 }}>daily avg</Text>
            </View>
          </View>
        </View>

        {/* Sleep Summary */}
        <View style={S.glassCard()}>
          <Text style={S.sectionTitle}>Sleep Summary</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: "rgba(124, 111, 247, 0.15)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: "rgba(124, 111, 247, 0.3)",
            }}>
              <Ionicons name="moon" size={28} color={T.accent.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800" }}>{sleep?.hours || 0}h</Text>
              <Text style={{ color: T.text.muted, fontSize: 12, marginTop: 2 }}>last night</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: T.accent.coral, fontSize: 28, fontWeight: "800" }}>{streak}</Text>
              <Text style={{ color: T.text.muted, fontSize: 12, marginTop: 2 }}>day streak</Text>
            </View>
          </View>
        </View>

        {/* Habit Completion */}
        <View style={S.glassCard()}>
          <Text style={S.sectionTitle}>Habits</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <View style={{ flex: 1, backgroundColor: T.bg.primary, borderRadius: 999, height: 12, overflow: "hidden" }}>
              <View style={{ backgroundColor: T.accent.teal, borderRadius: 999, height: 12, width: `${habitRate}%` }} />
            </View>
            <Text style={{ color: T.text.primary, fontSize: 16, fontWeight: "800" }}>{completedHabits}/{habits.length}</Text>
          </View>
          <Text style={{ color: T.text.muted, fontSize: 13 }}>
            {habits.length > 0 ? `${habitRate}% completion rate` : "No habits created yet"}
          </Text>
        </View>

        {/* Nutrition Summary */}
        {meals.length > 0 && (
          <View style={S.glassCard()}>
            <Text style={S.sectionTitle}>Nutrition Summary</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: T.accent.coral, fontSize: 22, fontWeight: "800" }}>{totalCalories}</Text>
                <Text style={{ color: T.text.muted, fontSize: 11, marginTop: 2 }}>calories</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: T.accent.teal, fontSize: 22, fontWeight: "800" }}>{totalProtein}g</Text>
                <Text style={{ color: T.text.muted, fontSize: 11, marginTop: 2 }}>protein</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: T.accent.gold, fontSize: 22, fontWeight: "800" }}>{meals.length}</Text>
                <Text style={{ color: T.text.muted, fontSize: 11, marginTop: 2 }}>meals</Text>
              </View>
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={S.glassCard()}>
          <Text style={S.sectionTitle}>Achievements</Text>
          {streak >= 7 ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <View style={{
                width: 52, height: 52, borderRadius: 26,
                backgroundColor: "rgba(255, 217, 61, 0.15)",
                alignItems: "center", justifyContent: "center",
                borderWidth: 1, borderColor: "rgba(255, 217, 61, 0.3)",
              }}>
                <Ionicons name="trophy" size={24} color={T.accent.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.text.primary, fontSize: 16, fontWeight: "700" }}>Week Warrior</Text>
                <Text style={{ color: T.text.muted, fontSize: 13, marginTop: 2 }}>7+ day streak</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255, 217, 61, 0.12)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: T.accent.gold, fontSize: 12, fontWeight: "700" }}>Earned</Text>
              </View>
            </View>
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 24 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(107, 107, 138, 0.15)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Ionicons name="trophy-outline" size={24} color={T.text.muted} />
              </View>
              <Text style={{ color: T.text.muted, fontSize: 13 }}>Start tracking to unlock achievements</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
