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
    <ScrollView style={{ flex: 1, backgroundColor: "#0A0A0F" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700", marginBottom: 24 }}>Nutrition</Text>

        {/* Macro Overview */}
        <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <DonutChart segments={mealCounts} size={140} />
          <Text style={{ color: "#A0A0B0", fontSize: 14, marginTop: 12, textAlign: "center" }}>
            {meals.length} meals logged today
          </Text>
          {meals.length > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#12121A" }}>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#FF6B6B", fontSize: 14, fontWeight: "700" }}>{totalCalories}</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>cal</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#4ECDC4", fontSize: 14, fontWeight: "700" }}>{totalProtein}g</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>protein</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#FFD93D", fontSize: 14, fontWeight: "700" }}>{totalCarbs}g</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>carbs</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#7C6FF7", fontSize: 14, fontWeight: "700" }}>{totalFat}g</Text>
                <Text style={{ color: "#5A5A6E", fontSize: 10 }}>fat</Text>
              </View>
            </View>
          )}
        </View>

        {/* Log Meal */}
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Log a Meal</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          {MEAL_TYPES.map((meal) => (
            <TouchableOpacity
              key={meal.key}
              onPress={() => setSelectedMeal(selectedMeal === meal.key ? null : meal.key)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedMeal === meal.key ? "#7C6FF7" : "rgba(90, 90, 110, 0.2)",
                alignItems: "center",
                backgroundColor: selectedMeal === meal.key ? "rgba(124, 111, 247, 0.2)" : "#1A1A24",
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={meal.icon}
                size={18}
                color={selectedMeal === meal.key ? "#7C6FF7" : "#5A5A6E"}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "500",
                  marginTop: 4,
                  color: selectedMeal === meal.key ? "#7C6FF7" : "#5A5A6E",
                }}
              >
                {meal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMeal && (
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={`What did you have for ${selectedMeal}?`}
              placeholderTextColor="#5A5A6E"
              style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#FFFFFF", fontSize: 16, marginBottom: 12 }}
              multiline
            />
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#5A5A6E", fontSize: 10, marginBottom: 4 }}>Calories</Text>
                <TextInput
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, color: "#FFFFFF", fontSize: 14 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#5A5A6E", fontSize: 10, marginBottom: 4 }}>Protein (g)</Text>
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, color: "#FFFFFF", fontSize: 14 }}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#5A5A6E", fontSize: 10, marginBottom: 4 }}>Carbs (g)</Text>
                <TextInput
                  value={carbs}
                  onChangeText={setCarbs}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, color: "#FFFFFF", fontSize: 14 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#5A5A6E", fontSize: 10, marginBottom: 4 }}>Fat (g)</Text>
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  placeholder="0"
                  placeholderTextColor="#5A5A6E"
                  keyboardType="numeric"
                  style={{ backgroundColor: "#12121A", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, color: "#FFFFFF", fontSize: 14 }}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={logMeal}
              style={{
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: description.trim() ? "#7C6FF7" : "#12121A",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: description.trim() ? "#FFFFFF" : "#5A5A6E",
                }}
              >
                Log Meal
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Meals */}
        <Text style={{ color: "#A0A0B0", fontSize: 12, fontWeight: "500", marginBottom: 12 }}>Today's Meals</Text>
        {meals.length === 0 ? (
          <View style={{ backgroundColor: "#1A1A24", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 24 }}>
            <Ionicons name="restaurant-outline" size={40} color="#5A5A6E" />
            <Text style={{ color: "#5A5A6E", fontSize: 14, marginTop: 12 }}>No meals logged yet</Text>
          </View>
        ) : (
          <View style={{ gap: 8, marginBottom: 24 }}>
            {meals.map((meal, i) => (
              <View key={i} style={{ backgroundColor: "#1A1A24", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 32, height: 32, backgroundColor: "rgba(255, 217, 61, 0.2)", borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="restaurant" size={14} color="#FFD93D" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "500", textTransform: "capitalize" }}>{meal.meal_type}</Text>
                  <Text style={{ color: "#5A5A6E", fontSize: 12 }}>{meal.description}</Text>
                  {(meal.calories || meal.protein_g || meal.carbs_g || meal.fat_g) && (
                    <Text style={{ color: "#5A5A6E", fontSize: 10, marginTop: 2 }}>
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
