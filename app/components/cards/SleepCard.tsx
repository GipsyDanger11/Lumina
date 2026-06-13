import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { T, S } from "../../lib/theme";

interface SleepCardProps {
  hours: number | null;
  quality?: string;
  onPress?: () => void;
}

export function SleepCard({ hours, quality, onPress }: SleepCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={T.gradient.purple}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 24,
          overflow: "hidden",
          ...S.shadow(8, T.accent.purple),
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
            SLEEP
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
            <Ionicons name="moon" size={16} color="#FFFFFF" />
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
          {hours !== null ? `${hours}` : "--"}
          <Text style={{ fontSize: 20, fontWeight: "600", opacity: 0.8 }}>
            {hours !== null ? "h" : ""}
          </Text>
        </Text>
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {quality ? `Quality: ${quality}` : "No sleep logged"}
        </Text>
        {quality && (
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: "flex-start",
              marginTop: 12,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {quality}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}