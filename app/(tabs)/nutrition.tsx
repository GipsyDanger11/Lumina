import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHealth } from "../hooks/useHealth";
import { DonutChart } from "../components/charts/DonutChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, doc, setDoc, arrayUnion, serverTimestamp } from "../lib/firebase";
import { useUserStore } from "../store/useUserStore";

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", icon: "sunny" as const, time: "7-9 AM" },
  { key: "lunch", label: "Lunch", icon: "restaurant" as const, time: "12-2 PM" },
  { key: "dinner", label: "Dinner", icon: "moon" as const, time: "6-8 PM" },
  { key: "snack", label: "Snack", icon: "cafe" as const, time: "Anytime" },
];

export default function NutritionScreen() {
  const { meals } = useHealth();
  const user = useUserStore((s) => s.user);
  const isGuest = useUserStore((s) => s.isGuest);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein_g || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs_g || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.fat_g || 0), 0);

  const logMeal = async () => {
    if (!selectedMeal || !description.trim()) return;

    const entry = {
      meal_type: selectedMeal,
      description: description.trim(),
      calories: parseInt(calories) || null,
      protein_g: parseInt(protein) || null,
      carbs_g: parseInt(carbs) || null,
      fat_g: parseInt(fat) || null,
      timestamp: new Date().toISOString(),
    };

    if (isGuest) {
      const today = new Date().toISOString().split("T")[0];
      const mealsData = JSON.parse((await AsyncStorage.getItem("guest_meals")) || "{}");
      if (!mealsData[today]) mealsData[today] = [];
      mealsData[today].push(entry);
      await AsyncStorage.setItem("guest_meals", JSON.stringify(mealsData));
    } else if (user?.uid) {
      const today = new Date().toISOString().split("T")[0];
      const ref = doc(db, `users/${user.uid}/logs/meals/${today}`);
      await setDoc(
        ref,
        { entries: arrayUnion(entry), last_updated: serverTimestamp() },
        { merge: true }
      );
    }

    setDescription("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setSelectedMeal(null);
  };

  const mealCounts = MEAL_TYPES.map((m) => ({
    label: m.label,
    value: meals.filter((meal) => meal.meal_type === m.key).length,
    color: m.key === "breakfast" ? "#FFD93D" : m.key === "lunch" ? "#4ECDC4" : m.key === "dinner" ? "#7C6FF7" : "#FF6B6B",
  }));

  return (
    <ScrollView className="flex-1 bg-lumina-bg-primary" showsVerticalScrollIndicator={false}>
      <View className="pt-16 px-6">
        <Text className="text-lumina-text-primary text-2xl font-bold mb-6">Nutrition</Text>

        {/* Macro Overview */}
        <View className="bg-lumina-bg-card rounded-2xl p-4 mb-6">
          <DonutChart segments={mealCounts} size={140} />
          <Text className="text-lumina-text-secondary text-sm mt-3 text-center">
            {meals.length} meals logged today
          </Text>
          {meals.length > 0 && (
            <View className="flex-row justify-between mt-4 pt-3 border-t border-lumina-bg-secondary">
              <View className="items-center flex-1">
                <Text className="text-lumina-accent-coral text-sm font-bold">{totalCalories}</Text>
                <Text className="text-lumina-text-muted text-[10px]">cal</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-lumina-accent-teal text-sm font-bold">{totalProtein}g</Text>
                <Text className="text-lumina-text-muted text-[10px]">protein</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-lumina-warning text-sm font-bold">{totalCarbs}g</Text>
                <Text className="text-lumina-text-muted text-[10px]">carbs</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-lumina-accent-purple text-sm font-bold">{totalFat}g</Text>
                <Text className="text-lumina-text-muted text-[10px]">fat</Text>
              </View>
            </View>
          )}
        </View>

        {/* Log Meal */}
        <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Log a Meal</Text>
        <View className="flex-row gap-2 mb-4">
          {MEAL_TYPES.map((meal) => (
            <TouchableOpacity
              key={meal.key}
              onPress={() => setSelectedMeal(selectedMeal === meal.key ? null : meal.key)}
              className={`flex-1 py-3 rounded-xl border items-center ${
                selectedMeal === meal.key
                  ? "bg-lumina-accent-purple/20 border-lumina-accent-purple"
                  : "bg-lumina-bg-card border-lumina-text-muted/20"
              }`}
              activeOpacity={0.7}
            >
              <Ionicons
                name={meal.icon}
                size={18}
                color={selectedMeal === meal.key ? "#7C6FF7" : "#5A5A6E"}
              />
              <Text
                className={`text-[10px] font-medium mt-1 ${
                  selectedMeal === meal.key ? "text-lumina-accent-purple" : "text-lumina-text-muted"
                }`}
              >
                {meal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMeal && (
          <View className="bg-lumina-bg-card rounded-xl p-4 mb-6">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={`What did you have for ${selectedMeal}?`}
              placeholderTextColor="#5A5A6E"
              className="bg-lumina-bg-secondary rounded-xl px-4 py-3 text-lumina-text-primary text-base mb-3"
              multiline
            />
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-lumina-text-muted text-[10px] mb-1">Calories</Text>
                <TextInput
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  className="bg-lumina-bg-secondary rounded-xl px-3 py-2 text-lumina-text-primary text-sm"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lumina-text-muted text-[10px] mb-1">Protein (g)</Text>
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  className="bg-lumina-bg-secondary rounded-xl px-3 py-2 text-lumina-text-primary text-sm"
                />
              </View>
            </View>
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-lumina-text-muted text-[10px] mb-1">Carbs (g)</Text>
                <TextInput
                  value={carbs}
                  onChangeText={setCarbs}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  className="bg-lumina-bg-secondary rounded-xl px-3 py-2 text-lumina-text-primary text-sm"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lumina-text-muted text-[10px] mb-1">Fat (g)</Text>
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  className="bg-lumina-bg-secondary rounded-xl px-3 py-2 text-lumina-text-primary text-sm"
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={logMeal}
              className={`py-3 rounded-xl items-center ${
                description.trim() ? "bg-lumina-accent-purple" : "bg-lumina-bg-secondary"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  description.trim() ? "text-white" : "text-lumina-text-muted"
                }`}
              >
                Log Meal
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Meals */}
        <Text className="text-lumina-text-secondary text-xs font-medium mb-3">Today's Meals</Text>
        {meals.length === 0 ? (
          <View className="bg-lumina-bg-card rounded-2xl p-6 items-center mb-6">
            <Ionicons name="restaurant-outline" size={40} color="#5A5A6E" />
            <Text className="text-lumina-text-muted text-sm mt-3">No meals logged yet</Text>
          </View>
        ) : (
          <View className="gap-2 mb-6">
            {meals.map((meal, i) => (
              <View key={i} className="bg-lumina-bg-card rounded-xl p-4 flex-row items-center gap-3">
                <View className="w-8 h-8 bg-lumina-warning/20 rounded-lg items-center justify-center">
                  <Ionicons name="restaurant" size={14} color="#FFD93D" />
                </View>
                <View className="flex-1">
                  <Text className="text-lumina-text-primary text-sm font-medium capitalize">{meal.meal_type}</Text>
                  <Text className="text-lumina-text-muted text-xs">{meal.description}</Text>
                  {(meal.calories || meal.protein_g || meal.carbs_g || meal.fat_g) && (
                    <Text className="text-lumina-text-muted text-[10px] mt-0.5">
                      {meal.calories ? `${meal.calories}cal` : ""}
                      {meal.protein_g ? ` · ${meal.protein_g}g protein` : ""}
                      {meal.carbs_g ? ` · ${meal.carbs_g}g carbs` : ""}
                      {meal.fat_g ? ` · ${meal.fat_g}g fat` : ""}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}