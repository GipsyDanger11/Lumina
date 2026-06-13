import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { T } from "../../lib/theme";

interface LoadingSkeletonProps {
  width?: string | number;
  height?: number;
}

export function LoadingSkeleton({ width = "100%", height = 20 }: LoadingSkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return (
    <View
      style={{
        backgroundColor: T.bg.cardLight,
        width: typeof width === "number" ? width : "100%",
        height,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        }}
      />
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <LoadingSkeleton height={24} width={200} />
      <LoadingSkeleton height={120} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <LoadingSkeleton height={100} width="48%" />
        <LoadingSkeleton height={100} width="48%" />
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <LoadingSkeleton height={100} width="48%" />
        <LoadingSkeleton height={100} width="48%" />
      </View>
    </View>
  );
}