import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useHealth } from "../../hooks/useHealth";
import { DonutChart } from "../../components/charts/DonutChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, doc, setDoc, arrayUnion, serverTimestamp } from "../../lib/firebase";
import { useUserStore } from "../../store/useUserStore";
import { T, S } from "../../lib/theme";

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", icon: "sunny" as const, time: "7-9 AM", color: T.accent.gold },
  { key: "lunch", label: "Lunch", icon: "restaurant" as const, time: "12-2 PM", color: T.accent.teal },
  { key: "dinner", label: "Dinner", icon: "moon" as const, time: "6-8 PM", color: T.accent.purple },
  { key: "snack", label: "Snack", icon: "cafe" as const, time: "Anytime", color: T.accent.coral },
];

const MACRO_GOALS = { calories: 2000, protein: 150, carbs: 250, fat: 70 };

export default function NutritionScreen() {
  const { meals } = useHealth();
  const user = useUserStore((s) => s.user);
  const isGuest = useUserStore((s) => s.isGuest);
  const [showAddMeal, setShowAddMeal] = useState(false);
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

  const calorieProgress = Math.min(
    (totalCalories / MACRO_GOALS.calories) * 100,
    100
  );
  const proteinProgress = Math.min(
    (totalProtein / MACRO_GOALS.protein) * 100,
    100
  );
  const carbsProgress = Math.min(
    (totalCarbs / MACRO_GOALS.carbs) * 100,
    100
  );

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
      const mealsData = JSON.parse(
        (await AsyncStorage.getItem("guest_meals")) || "{}"
      );
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
    setShowAddMeal(false);
  };

  const mealCounts = MEAL_TYPES.map((m) => ({
    label: m.label,
    value: meals.filter((meal) => meal.meal_type === m.key).length,
    color: m.color,
  }));

  const renderMacroCard = (
    label: string,
    value: number,
    goal: number,
    unit: string,
    gradient: readonly string[],
    accentColor: string,
    icon: string
  ) => {
    const progress = Math.min((value / goal) * 100, 100);
    return (
      <View style={{ flex: 1, marginHorizontal: 4 }}>
        <LinearGradient
          colors={gradient as unknown as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 18,
            padding: 16,
            ...Platform.select({
              ios: {
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 14,
              },
              android: { elevation: 8 },
            }),
          }}
        >
          <Ionicons
            name={icon as any}
            size={18}
            color="rgba(255,255,255,0.8)"
            style={{ marginBottom: 10 }}
          />
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>
            {label}
          </Text>
          <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "800", letterSpacing: -1, marginTop: 4 }}>
            {value}
            <Text style={{ fontSize: 14, fontWeight: "500", opacity: 0.7 }}>
              {unit}
            </Text>
          </Text>
          <View style={{ height: 5, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
            <View style={{ height: 5, width: `${progress}%`, backgroundColor: "#FFF", borderRadius: 3 }} />
          </View>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 6 }}>
            {Math.round(progress)}% of {goal}
            {unit}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <ScrollView
      style={S.screen}
      contentContainerStyle={S.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: T.text.primary, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, paddingTop: 56, marginBottom: 24 }}>
        Nutrition
      </Text>

      {/* Macro Summary Cards */}
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {renderMacroCard(
          "Calories",
          totalCalories,
          MACRO_GOALS.calories,
          "",
          T.gradient.gold,
          T.accent.gold,
          "flame"
        )}
        {renderMacroCard(
          "Protein",
          totalProtein,
          MACRO_GOALS.protein,
          "g",
          T.gradient.coral,
          T.accent.coral,
          "barbell"
        )}
        {renderMacroCard(
          "Carbs",
          totalCarbs,
          MACRO_GOALS.carbs,
          "g",
          T.gradient.teal,
          T.accent.teal,
          "leaf"
        )}
      </View>

      {/* Donut Chart & Summary */}
      <View style={S.glassCard({ padding: 24, alignItems: "center" })}>
        <DonutChart segments={mealCounts} size={160} strokeWidth={14} />
        <Text style={{ color: T.text.secondary, fontSize: 15, marginTop: 16, fontWeight: "500" }}>
          {meals.length} meals logged today
        </Text>
        {meals.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: T.glass.border,
              width: "100%",
            }}
          >
            {[
              { label: "cal", value: totalCalories, color: T.accent.gold },
              { label: "protein", value: `${totalProtein}g`, color: T.accent.coral },
              { label: "carbs", value: `${totalCarbs}g`, color: T.accent.teal },
              { label: "fat", value: `${totalFat}g`, color: T.accent.purple },
            ].map((stat) => (
              <View key={stat.label} style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: stat.color, fontSize: 16, fontWeight: "800" }}>
                  {stat.value}
                </Text>
                <Text style={{ color: T.text.muted, fontSize: 10, marginTop: 2 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Quick Meal Select */}
      <Text style={S.sectionTitle}>Log a Meal</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        {MEAL_TYPES.map((meal) => {
          const isActive = selectedMeal === meal.key;
          return (
            <TouchableOpacity
              key={meal.key}
              onPress={() => {
                setSelectedMeal(isActive ? null : meal.key);
                if (!isActive) setShowAddMeal(true);
              }}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: isActive ? meal.color : T.glass.border,
                backgroundColor: isActive ? `${meal.color}20` : T.glass.bg,
              }}
            >
              <Ionicons
                name={meal.icon}
                size={20}
                color={isActive ? meal.color : T.text.muted}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  marginTop: 6,
                  color: isActive ? meal.color : T.text.muted,
                }}
              >
                {meal.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Today's Meals */}
      <Text style={S.sectionTitle}>Today&apos;s Meals</Text>
      {meals.length === 0 ? (
        <View style={S.glassCard({ alignItems: "center", paddingVertical: 40 })}>
          <Ionicons name="restaurant-outline" size={48} color={T.text.muted} />
          <Text style={{ color: T.text.muted, fontSize: 15, marginTop: 14, fontWeight: "500" }}>
            No meals logged yet
          </Text>
        </View>
      ) : (
        <View style={{ gap: 10, marginBottom: 24 }}>
          {meals.map((meal, i) => {
            const mealType = MEAL_TYPES.find((m) => m.key === meal.meal_type);
            return (
              <View
                key={i}
                style={{
                  ...S.glassCard({
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    marginBottom: 0,
                  }),
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${mealType?.color || T.accent.gold}18`,
                    borderWidth: 1,
                    borderColor: `${mealType?.color || T.accent.gold}25`,
                  }}
                >
                  <Ionicons
                    name={mealType?.icon || "restaurant"}
                    size={18}
                    color={mealType?.color || T.accent.gold}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      color: T.text.primary,
                      fontSize: 15,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {meal.meal_type}
                  </Text>
                  <Text style={{ color: T.text.muted, fontSize: 13, marginTop: 2 }}>
                    {meal.description}
                  </Text>
                  {(meal.calories ||
                    meal.protein_g ||
                    meal.carbs_g ||
                    meal.fat_g) && (
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                      {meal.calories ? (
                        <Text style={{ color: T.accent.gold, fontSize: 11, fontWeight: "600" }}>
                          {meal.calories}cal
                        </Text>
                      ) : null}
                      {meal.protein_g ? (
                        <Text style={{ color: T.accent.coral, fontSize: 11, fontWeight: "600" }}>
                          {meal.protein_g}g P
                        </Text>
                      ) : null}
                      {meal.carbs_g ? (
                        <Text style={{ color: T.accent.teal, fontSize: 11, fontWeight: "600" }}>
                          {meal.carbs_g}g C
                        </Text>
                      ) : null}
                      {meal.fat_g ? (
                        <Text style={{ color: T.accent.purple, fontSize: 11, fontWeight: "600" }}>
                          {meal.fat_g}g F
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Add Meal Modal */}
      <Modal visible={showAddMeal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 28,
          }}
        >
          <View style={S.glassCard({ width: "100%", padding: 28 })}>
            <Text style={{ color: T.text.primary, fontSize: 20, fontWeight: "800", marginBottom: 24 }}>
              Log Meal
            </Text>

            {/* Meal Type Chips */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
              {MEAL_TYPES.map((meal) => {
                const isActive = selectedMeal === meal.key;
                return (
                  <TouchableOpacity
                    key={meal.key}
                    onPress={() => setSelectedMeal(meal.key)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: "center",
                      backgroundColor: isActive ? `${meal.color}25` : T.bg.elevated,
                      borderWidth: isActive ? 1.5 : 0,
                      borderColor: isActive ? meal.color : "transparent",
                    }}
                  >
                    <Ionicons
                      name={meal.icon}
                      size={16}
                      color={isActive ? meal.color : T.text.muted}
                    />
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "600",
                        marginTop: 4,
                        color: isActive ? meal.color : T.text.muted,
                      }}
                    >
                      {meal.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What did you eat?"
              placeholderTextColor={T.text.muted}
              style={{
                backgroundColor: T.bg.elevated,
                borderRadius: 14,
                paddingHorizontal: 18,
                paddingVertical: 14,
                color: T.text.primary,
                fontSize: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: T.glass.border,
              }}
              multiline
            />

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
              {[
                { label: "Cal", value: calories, setter: setCalories, color: T.accent.gold },
                { label: "Protein", value: protein, setter: setProtein, color: T.accent.coral },
              ].map((field) => (
                <View key={field.label} style={{ flex: 1 }}>
                  <Text style={{ color: field.color, fontSize: 10, marginBottom: 6, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {field.label}
                  </Text>
                  <TextInput
                    value={field.value}
                    onChangeText={field.setter}
                    placeholder="0"
                    placeholderTextColor={T.text.muted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: T.bg.elevated,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      color: T.text.primary,
                      fontSize: 16,
                      fontWeight: "600",
                      borderWidth: 1,
                      borderColor: T.glass.border,
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Carbs", value: carbs, setter: setCarbs, color: T.accent.teal },
                { label: "Fat", value: fat, setter: setFat, color: T.accent.purple },
              ].map((field) => (
                <View key={field.label} style={{ flex: 1 }}>
                  <Text style={{ color: field.color, fontSize: 10, marginBottom: 6, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {field.label}
                  </Text>
                  <TextInput
                    value={field.value}
                    onChangeText={field.setter}
                    placeholder="0"
                    placeholderTextColor={T.text.muted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: T.bg.elevated,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      color: T.text.primary,
                      fontSize: 16,
                      fontWeight: "600",
                      borderWidth: 1,
                      borderColor: T.glass.border,
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowAddMeal(false);
                  setSelectedMeal(null);
                  setDescription("");
                  setCalories("");
                  setProtein("");
                  setCarbs("");
                  setFat("");
                }}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: T.bg.elevated,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: T.text.muted, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={logMeal}
                style={{
                  flex: 1,
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    description.trim() && selectedMeal
                      ? [...T.gradient.purple]
                      : [T.bg.elevated, T.bg.elevated]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    ...Platform.select({
                      ios: {
                        shadowColor: description.trim() && selectedMeal ? T.accent.purple : "transparent",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                      },
                      android: { elevation: description.trim() && selectedMeal ? 6 : 0 },
                    }),
                  }}
                >
                  <Text
                    style={{
                      color: description.trim() && selectedMeal ? "#FFF" : T.text.muted,
                      fontWeight: "700",
                    }}
                  >
                    Log Meal
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
