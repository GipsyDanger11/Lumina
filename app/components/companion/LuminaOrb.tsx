import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";

interface LuminaOrbProps {
  state?: "idle" | "listening" | "speaking" | "processing";
  size?: number;
}

export function LuminaOrb({ state = "idle", size = 120 }: LuminaOrbProps) {
  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const waveform = useSharedValue(0);

  useEffect(() => {
    if (state === "idle") {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else if (state === "listening") {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
      ripple1.value = withRepeat(
        withTiming(1, { duration: 1200 }),
        -1,
        false
      );
      ripple2.value = withRepeat(
        withTiming(1, { duration: 1200 }),
        -1,
        false
      );
    } else if (state === "speaking") {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 200 }),
          withTiming(1, { duration: 200 })
        ),
        -1,
        false
      );
      waveform.value = withRepeat(
        withTiming(1, { duration: 150 }),
        -1,
        false
      );
    } else if (state === "processing") {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [state]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const ripple1Style = useAnimatedStyle(() => ({
    opacity: interpolate(ripple1.value, [0, 1], [0.6, 0]),
    transform: [{ scale: interpolate(ripple1.value, [0, 1], [1, 2.5]) }],
  }));

  const ripple2Style = useAnimatedStyle(() => ({
    opacity: interpolate(ripple2.value, [0, 1], [0.4, 0]),
    transform: [{ scale: interpolate(ripple2.value, [0, 1], [1, 2]) }],
  }));

  const processingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: size * 2.5, height: size * 2.5, alignItems: "center", justifyContent: "center" }}>
      {/* Ripple rings for listening */}
      {(state === "listening" || state === "idle") && (
        <>
          <Animated.View
            style={[
              {
                position: "absolute",
                width: size * 1.8,
                height: size * 1.8,
                borderRadius: size * 0.9,
                borderWidth: 2,
                borderColor: "#4ECDC4",
              },
              ripple1Style,
            ]}
          />
          <Animated.View
            style={[
              {
                position: "absolute",
                width: size * 1.4,
                height: size * 1.4,
                borderRadius: size * 0.7,
                borderWidth: 1.5,
                borderColor: "#4ECDC4",
              },
              ripple2Style,
            ]}
          />
        </>
      )}

      {/* Processing arc */}
      {state === "processing" && (
        <Animated.View
          style={[
            {
              position: "absolute",
              width: size * 1.6,
              height: size * 1.6,
              borderRadius: size * 0.8,
              borderWidth: 3,
              borderColor: "transparent",
              borderTopColor: "#7C6FF7",
              borderRightColor: "#4ECDC4",
            },
            processingStyle,
          ]}
        />
      )}

      {/* Main orb */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#7C6FF7",
            shadowColor: "#7C6FF7",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 30,
            elevation: 15,
          },
          pulseStyle,
        ]}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: size / 2,
            backgroundColor: "rgba(78, 205, 196, 0.15)",
          }}
        />
      </Animated.View>

      {/* Waveform bars for speaking */}
      {state === "speaking" && (
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            gap: 3,
            bottom: -20,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Animated.View
              key={i}
              style={{
                width: 3,
                height: 8 + (i % 2) * 8,
                backgroundColor: "#4ECDC4",
                borderRadius: 2,
                transform: [
                  {
                    scaleY: interpolate(
                      waveform.value,
                      [0, 1],
                      [0.5 + (i % 3) * 0.3, 1.5 - (i % 2) * 0.5]
                    ),
                  },
                ],
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
