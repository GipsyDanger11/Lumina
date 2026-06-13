import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { T, S } from "../../lib/theme";

interface HabitsCardProps {
  completed: number;
  total: number;
  onPress?: () => void;
}

export function HabitsCard({ completed, total, onPress }: HabitsCardProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={T.gradient.coral}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 24,
          overflow: "hidden",
          ...S.shadow(8, T.accent.coral),
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
            backgroundColor: "rgba(255, 255, 255, 0.1)",
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
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 13,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            HABITS
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              width: 32,
              height: 32,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
          </View>
        </View>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 42,
            fontWeight: "800",
            letterSpacing: -1.5,
            fontVariant: ["tabular-nums"],
          }}
        >
          {completed}
          <Text style={{ fontSize: 20, fontWeight: "600", opacity: 0.6 }}>
            /{total}
          </Text>
        </Text>
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {total === 0 ? "No habits yet" : `${Math.round(percentage)}% complete`}
        </Text>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 999,
            height: 8,
            marginTop: 16,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 999,
              height: "100%",
              width: `${percentage}%`,
              opacity: 0.9,
            }}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}