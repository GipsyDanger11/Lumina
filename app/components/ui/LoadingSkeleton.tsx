import React from "react";
import { View, Text } from "react-native";

interface LoadingSkeletonProps {
  className?: string;
  width?: string | number;
  height?: number;
  rounded?: string;
}

export function LoadingSkeleton({
  className = "",
  width = "100%",
  height = 20,
  rounded = "rounded-lg",
}: LoadingSkeletonProps) {
  return (
    <View
      className={`bg-lumina-bg-card animate-pulse ${rounded} ${className}`}
      style={{ width: typeof width === "number" ? width : "100%", height }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View className="p-4 gap-4">
      <LoadingSkeleton height={24} width="60%" />
      <LoadingSkeleton height={120} />
      <View className="flex-row gap-3">
        <LoadingSkeleton height={100} width="48%" />
        <LoadingSkeleton height={100} width="48%" />
      </View>
      <View className="flex-row gap-3">
        <LoadingSkeleton height={100} width="48%" />
        <LoadingSkeleton height={100} width="48%" />
      </View>
    </View>
  );
}
