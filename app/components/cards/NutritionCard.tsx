import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { T, S } from "../../lib/theme";

interface NutritionCardProps {
  mealsCount: number;
  onPress?: () => void;
}

export function NutritionCard({ mealsCount, onPress }: NutritionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={T.gradient.gold}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 24,
          overflow: "hidden",
          ...S.shadow(8, T.accent.gold),
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: 13,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            NUTRITION
          </Text>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              width: 32,
              height: 32,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="restaurant" size={16} color="rgba(0, 0, 0, 0.6)" />
          </View>
        </View>
        <Text
          style={{
            color: "#000000",
            fontSize: 42,
            fontWeight: "800",
            letterSpacing: -1.5,
            fontVariant: ["tabular-nums"],
          }}
        >
          {mealsCount}
          <Text style={{ fontSize: 16, fontWeight: "600", opacity: 0.6 }}>
            {" "}
            meals
          </Text>
        </Text>
        <Text
          style={{
            color: "rgba(0, 0, 0, 0.5)",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {mealsCount === 0 ? "No meals logged" : "logged today"}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}