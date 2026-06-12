import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface WaterBottleProps {
  percentage: number;
  size?: number;
}

export function WaterBottle({ percentage, size = 200 }: WaterBottleProps) {
  const wave = useSharedValue(0);

  React.useEffect(() => {
    wave.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      false
    );
    return () => cancelAnimation(wave);
  }, []);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wave.value * 20 - 10 }],
  }));

  const fillHeight = (percentage / 100) * (size * 0.65);
  const bottleWidth = size * 0.5;
  const bottleHeight = size * 0.8;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: bottleWidth,
          height: bottleHeight,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "#4ECDC4",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Fill */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: fillHeight,
            backgroundColor: "rgba(78, 205, 196, 0.3)",
          }}
        />
        {/* Animated wave */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: fillHeight - 10,
              left: -20,
              right: -20,
              height: 20,
            },
            waveStyle,
          ]}
        >
          <Svg width={bottleWidth + 40} height={20}>
            <Path
              d={`M0,10 Q${(bottleWidth + 40) / 4},0 ${(bottleWidth + 40) / 2},10 Q${(bottleWidth + 40) * 3 / 4},20 ${bottleWidth + 40},10 V20 H0 Z`}
              fill="rgba(78, 205, 196, 0.4)"
            />
          </Svg>
        </Animated.View>
      </View>
      {/* Cap */}
      <View
        style={{
          width: bottleWidth * 0.4,
          height: 8,
          backgroundColor: "#4ECDC4",
          borderRadius: 4,
          marginBottom: 2,
        }}
      />
    </View>
  );
}
