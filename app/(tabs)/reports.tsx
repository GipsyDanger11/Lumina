import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHealth } from "../hooks/useHealth";
import { WeeklyBarChart } from "../components/charts/WeeklyBarChart";
import { useUserStore } from "../store/useUserStore";

export default function ReportsScreen() {
  const { totalWaterMl, sleep, habits, habitLogs, meals, streak, weeklyHydration } = useHealth();
  const profile = useUserStore((s) => s.profile);
  const isGuest = useUserStore((s) => s.isGuest);
  const goal = profile?.water_goal_ml || 2500;

  const completedHabits = Object.values(habitLogs).filter((v) => v === "completed").length;
  const habitRate = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein_g || 0), 0);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const avgWater = Object.values(weeklyHydration).length > 0
    ? Math.round(Object.values(weeklyHydration).reduce((a, b) => a + b, 0) / Math.max(Object.values(weeklyHydration).length, 1))
    : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", marginBottom: 24 }}>Reports</Text>

        {/* Consistency Score */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 16, alignItems: "center" }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Consistency Score</Text>
          <View style={{ width: 80, height: 80, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <Text style={{ color: "#7C6FF7", fontSize: 30, fontWeight: "700" }}>{habitRate}</Text>
          </View>
          <Text style={{ color: "#5A5A6E", fontSize: 12 }}>habit completion rate</Text>
        </View>

        {/* Weekly Hydration */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>This Week's Hydration</Text>
          {!isGuest && Object.keys(weeklyHydration).length > 0 ? (
            <WeeklyBarChart data={weeklyHydration} goal={goal} height={120} />
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 24 }}>
              <Ionicons name="water-outline" size={32} color="#5A5A6E" />
              <Text style={{ color: "#5A5A6E", fontSize: 12, marginTop: 8 }}>No hydration data yet</Text>
            </View>
          )}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#12121A" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#4ECDC4", fontSize: 14, fontWeight: "700" }}>{(totalWaterMl / 1000).toFixed(1)}L</Text>
              <Text style={{ color: "#5A5A6E", fontSize: 10 }}>today</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#4ECDC4", fontSize: 14, fontWeight: "700" }}>{(avgWater / 1000).toFixed(1)}L</Text>
              <Text style={{ color: "#5A5A6E", fontSize: 10 }}>daily avg</Text>
            </View>
          </View>
        </View>

        {/* Sleep Summary */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Sleep Summary</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={{ width: 56, height: 56, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 28, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="moon" size={24} color="#7C6FF7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>{sleep?.hours || 0}h</Text>
              <Text style={{ color: "#5A5A6E", fontSize: 12 }}>last night</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>{streak}</Text>
              <Text style={{ color: "#5A5A6E", fontSize: 12 }}>day streak</Text>
            </View>
          </View>
        </View>

        {/* Habit Completion */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Habits</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <View style={{ flex: 1, backgroundColor: "#12121A", borderRadius: 999, height: 10 }}>
              <View style={{ backgroundColor: "#4ECDC4", borderRadius: 999, height: 10, width: `${habitRate}%` }} />
            </View>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>{completedHabits}/{habits.length}</Text>
          </View>
          <Text style={{ color: "#5A5A6E", fontSize: 12 }}>{habits.length > 0 ? `${habitRate}% completion rate` : "No habits created yet"}</Text>
        </View>

        {/* Nutrition Summary */}
        {meals.length > 0 && (
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Nutrition Summary</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#FF6B6B", fontSize: 18, fontWeight: "700" }}>{totalCalories}</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>calories</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#4ECDC4", fontSize: 18, fontWeight: "700" }}>{totalProtein}g</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>protein</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>{meals.length}</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>meals</Text>
              </View>
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 32 }}>
          <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Achievements</Text>
          {streak >= 7 ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 40, height: 40, backgroundColor: "rgba(124, 111, 247, 0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="trophy" size={20} color="#FFD93D" />
              </View>
              <View>
                <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>Week Warrior</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 12 }}>7+ day streak</Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: "#5A5A6E", fontSize: 12, textAlign: "center", paddingVertical: 16 }}>
              Start tracking to unlock achievements
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
