import React, { useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { T } from "../../lib/theme";

export default function CompleteScreen() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    opacity.value = withDelay(600, withTiming(1, { duration: 500 }));

    ringScale.value = withDelay(800, withTiming(2.5, { duration: 1000, easing: Easing.out(Easing.ease) }));
    ringOpacity.value = withDelay(800, withSequence(
      withTiming(0.5, { duration: 200 }),
      withTiming(0, { duration: 800 })
    ));

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }),
    [scale, opacity]
  );

  const ringStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: ringScale.value }],
      opacity: ringOpacity.value,
    }),
    [ringScale, ringOpacity]
  );

  return (
    <View style={{ flex: 1, backgroundColor: T.bg.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      <View style={{ alignItems: "center" }}>
        {/* Animated ring */}
        <View style={{ width: 120, height: 120, alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: T.accent.teal,
              },
              ringStyle,
            ]}
          />
          <Animated.View style={[animatedStyle, { alignItems: "center", justifyContent: "center" }]}>
            <LinearGradient
              colors={T.gradient.teal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                ...Platform.select({
                  ios: { shadowColor: T.accent.teal, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 24 },
                  android: { elevation: 12 },
                }),
              }}
            >
              <Ionicons name="checkmark" size={48} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.View style={[animatedStyle, { alignItems: "center" }]}>
          <Text style={{ color: T.text.primary, fontSize: 30, fontWeight: "800", letterSpacing: -0.5, marginBottom: 12, textAlign: "center" }}>
            You're all set!
          </Text>
          <Text style={{ color: T.text.muted, fontSize: 16, textAlign: "center", lineHeight: 26, paddingHorizontal: 16 }}>
            Your profile is ready. Let LuminaAI help you build healthier routines, one day at a time.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
