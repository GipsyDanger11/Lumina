import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

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
    <View className="flex-1 bg-lumina-bg-primary">
      {/* Animated gradient background */}
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "#0A0A0F",
        }}
      />

      {/* Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-16 h-16 bg-lumina-accent-purple/20 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="sparkles" size={32} color="#7C6FF7" />
          </View>
          <Text className="text-lumina-text-primary text-3xl font-bold">Lumina</Text>
        </View>

        {/* Carousel */}
        <View className="h-48">
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
              const opacity = interpolate(
                currentIndex * width,
                inputRange,
                [0, 1, 0],
                Extrapolate.CLAMP
              );
              const scale = interpolate(
                currentIndex * width,
                inputRange,
                [0.8, 1, 0.8],
                Extrapolate.CLAMP
              );

              return (
                <Animated.View
                  style={{
                    width: width - 64,
                    opacity,
                    transform: [{ scale }],
                    alignItems: "center",
                  }}
                >
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Ionicons name={item.icon} size={36} color={item.color} />
                  </View>
                  <Text className="text-lumina-text-primary text-xl font-semibold text-center leading-7">
                    {item.title}
                  </Text>
                </Animated.View>
              );
            }}
          />
        </View>

        {/* Dots */}
        <View className="flex-row gap-2 mt-8">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`rounded-full ${
                index === currentIndex
                  ? "w-6 h-2 bg-lumina-accent-purple"
                  : "w-2 h-2 bg-lumina-text-muted"
              }`}
            />
          ))}
        </View>
      </View>

      {/* Tagline */}
      <Text className="text-lumina-text-secondary text-center text-sm px-8 mb-2">
        Understand yourself better, every day.
      </Text>

      {/* Buttons */}
      <View className="px-8 pb-12 gap-3">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          className="bg-lumina-accent-purple rounded-2xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(guest)/explore")}
          className="bg-lumina-bg-card border border-lumina-text-muted/20 rounded-2xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-lumina-text-secondary text-base font-medium">
            Explore without account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
