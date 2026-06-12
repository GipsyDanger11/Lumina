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
  }), [scale, opacity]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      <Animated.View style={[{ alignItems: "center" }, animatedStyle]}>
        <View style={{ width: 96, height: 96, backgroundColor: "rgba(78, 205, 196, 0.2)", borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <Ionicons name="checkmark" size={48} color="#4ECDC4" />
        </View>

        <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
          You're all set!
        </Text>
        <Text style={{ color: "#A0A0B0", fontSize: 16, textAlign: "center", lineHeight: 24 }}>
          Your profile is ready. Let LuminaAI help you build healthier routines, one day at a time.
        </Text>
      </Animated.View>
    </View>
  );
}
