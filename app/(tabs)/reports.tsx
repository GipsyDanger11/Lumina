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
    <ScrollView className="flex-1 bg-lumina-bg-primary" showsVerticalScrollIndicator={false}>
      <View className="pt-16 px-6">
        <Text className="text-lumina-text-primary text-2xl font-bold mb-6">Reports</Text>

        {/* Consistency Score */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-4 items-center">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Consistency Score</Text>
          <View className="w-20 h-20 bg-lumina-accent-purple/20 rounded-full items-center justify-center mb-2">
            <Text className="text-lumina-accent-purple text-3xl font-bold">{habitRate}</Text>
          </View>
          <Text className="text-lumina-text-muted text-xs">habit completion rate</Text>
        </View>

        {/* Weekly Hydration */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-4">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">This Week's Hydration</Text>
          {!isGuest && Object.keys(weeklyHydration).length > 0 ? (
            <WeeklyBarChart data={weeklyHydration} goal={goal} height={120} />
          ) : (
            <View className="items-center py-6">
              <Ionicons name="water-outline" size={32} color="#5A5A6E" />
              <Text className="text-lumina-text-muted text-xs mt-2">No hydration data yet</Text>
            </View>
          )}
          <View className="flex-row justify-between mt-3 pt-3 border-t border-lumina-bg-secondary">
            <View className="items-center">
              <Text className="text-lumina-accent-teal text-sm font-bold">{(totalWaterMl / 1000).toFixed(1)}L</Text>
              <Text className="text-lumina-text-muted text-[10px]">today</Text>
            </View>
            <View className="items-center">
              <Text className="text-lumina-accent-teal text-sm font-bold">{(avgWater / 1000).toFixed(1)}L</Text>
              <Text className="text-lumina-text-muted text-[10px]">daily avg</Text>
            </View>
          </View>
        </View>

        {/* Sleep Summary */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-4">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Sleep Summary</Text>
          <View className="flex-row items-center gap-4">
            <View className="w-14 h-14 bg-lumina-accent-purple/20 rounded-full items-center justify-center">
              <Ionicons name="moon" size={24} color="#7C6FF7" />
            </View>
            <View className="flex-1">
              <Text className="text-lumina-text-primary text-lg font-bold">{sleep?.hours || 0}h</Text>
              <Text className="text-lumina-text-muted text-xs">last night</Text>
            </View>
            <View className="items-center">
              <Text className="text-lumina-text-primary text-lg font-bold">{streak}</Text>
              <Text className="text-lumina-text-muted text-xs">day streak</Text>
            </View>
          </View>
        </View>

        {/* Habit Completion */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-4">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Habits</Text>
          <View className="flex-row items-center gap-3 mb-2">
            <View className="flex-1 bg-lumina-bg-secondary rounded-full h-2.5">
              <View className="bg-lumina-accent-teal rounded-full h-2.5" style={{ width: `${habitRate}%` }} />
            </View>
            <Text className="text-lumina-text-primary text-sm font-bold">{completedHabits}/{habits.length}</Text>
          </View>
          <Text className="text-lumina-text-muted text-xs">{habits.length > 0 ? `${habitRate}% completion rate` : "No habits created yet"}</Text>
        </View>

        {/* Nutrition Summary */}
        {meals.length > 0 && (
          <View className="bg-lumina-bg-card rounded-2xl p-4 mb-4">
            <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Nutrition Summary</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-lumina-accent-coral text-lg font-bold">{totalCalories}</Text>
                <Text className="text-lumina-text-muted text-[10px]">calories</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-lumina-accent-teal text-lg font-bold">{totalProtein}g</Text>
                <Text className="text-lumina-text-muted text-[10px]">protein</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-lumina-text-primary text-lg font-bold">{meals.length}</Text>
                <Text className="text-lumina-text-muted text-[10px]">meals</Text>
              </View>
            </View>
          </View>
        )}

        {/* Achievements */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-8">
          <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Achievements</Text>
          {streak >= 7 ? (
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-lumina-accent-purple/20 rounded-full items-center justify-center">
                <Ionicons name="trophy" size={20} color="#FFD93D" />
              </View>
              <View>
                <Text className="text-lumina-text-primary text-sm font-semibold">Week Warrior</Text>
                <Text className="text-lumina-text-muted text-xs">7+ day streak</Text>
              </View>
            </View>
          ) : (
            <Text className="text-lumina-text-muted text-xs text-center py-4">
              Start tracking to unlock achievements
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}