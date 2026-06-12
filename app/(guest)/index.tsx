import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Meet your personal health companion.",
    icon: "sparkles" as const,
    color: "#7C6FF7",
  },
  {
    id: "2",
    title: "Track hydration, sleep, habits, and nutrition.",
    icon: "stats-chart" as const,
    color: "#4ECDC4",
  },
  {
    id: "3",
    title: "Receive personalized daily insights.",
    icon: "bulb" as const,
    color: "#FFD93D",
  },
  {
    id: "4",
    title: "Build healthier routines through consistency.",
    icon: "flame" as const,
    color: "#FF6B6B",
  },
  {
    id: "5",
    title: "Learn more about yourself every day.",
    icon: "heart" as const,
    color: "#7C6FF7",
  },
];

export default function LandingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: "rgba(124, 111, 247, 0.2)",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="sparkles" size={32} color="#7C6FF7" />
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700" }}>Lumina</Text>
        </View>

        <View style={{ height: 192 }}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width: width - 64, alignItems: "center" }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    backgroundColor: `${item.color}20`,
                  }}
                >
                  <Ionicons name={item.icon} size={36} color={item.color} />
                </View>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center",
                    lineHeight: 28,
                  }}
                >
                  {item.title}
                </Text>
              </View>
            )}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 32 }}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={{
                borderRadius: index === currentIndex ? 4 : 8,
                width: index === currentIndex ? 24 : 8,
                height: 8,
                backgroundColor: index === currentIndex ? "#7C6FF7" : "#5A5A6E",
              }}
            />
          ))}
        </View>
      </View>

      <Text
        style={{
          color: "#A0A0B0",
          textAlign: "center",
          fontSize: 14,
          paddingHorizontal: 32,
          marginBottom: 8,
        }}
      >
        Understand yourself better, every day.
      </Text>

      <View style={{ paddingHorizontal: 32, paddingBottom: 48, gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          style={{
            backgroundColor: "#7C6FF7",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(guest)/explore")}
          style={{
            backgroundColor: "#1A1A24",
            borderWidth: 1,
            borderColor: "rgba(90, 90, 110, 0.2)",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#A0A0B0", fontSize: 16, fontWeight: "500" }}>
            Explore without account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
