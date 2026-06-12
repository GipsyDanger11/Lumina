import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function CompleteScreen() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      300,
      withTiming(1, { duration: 500 })
    );
    opacity.value = withDelay(600, withTiming(1, { duration: 500 }));

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 bg-lumina-bg-primary items-center justify-center px-8">
      <Animated.View style={animatedStyle} className="items-center">
        <View className="w-24 h-24 bg-lumina-accent-teal/20 rounded-full items-center justify-center mb-8">
          <Ionicons name="checkmark" size={48} color="#4ECDC4" />
        </View>

        <Text className="text-lumina-text-primary text-3xl font-bold mb-3 text-center">
          You're all set!
        </Text>
        <Text className="text-lumina-text-secondary text-base text-center leading-6">
          Your profile is ready. Let LuminaAI help you build healthier routines, one day at a time.
        </Text>
      </Animated.View>
    </View>
  );
}
